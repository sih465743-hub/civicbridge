import { supabaseAdmin } from './supabase';
import { getEmbedding } from './ai';

export async function findBestMatches(challengeId: string, limit = 5) {
  // 1. Get challenge embedding + location + tags
  const { data: challenge } = await supabaseAdmin
    .from('challenges')
    .select('id, embedding, location, tags, category, severity')
    .eq('id', challengeId)
    .single();

  if (!challenge || !challenge.embedding) return [];

  // 2. Vector search (pgvector cosine)
  const { data: vectorMatches } = await supabaseAdmin.rpc('match_partners_by_embedding', {
    query_embedding: challenge.embedding,
    match_threshold: 0.55,
    match_count: 20,
  }).catch(() => ({ data: null }));

  // Fallback pure SQL if RPC not yet created
  let candidates = vectorMatches || [];

  if (!candidates.length) {
    const { data } = await supabaseAdmin
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .limit(30);
    candidates = data || [];
  }

  // 3. Score = 0.6 * cosine + 0.25 * expertise overlap + 0.15 * capacity/reputation
  const scored = candidates.map((p: any) => {
    const expertiseOverlap = (p.expertise_tags || []).filter((t: string) =>
      (challenge.tags || []).includes(t) || t === challenge.category
    ).length;
    const score =
      0.6 * (p.similarity || 0.5) +
      0.25 * Math.min(expertiseOverlap / 3, 1) +
      0.15 * (p.reputation_score || 0.5);

    return { ...p, score };
  });

  scored.sort((a: any, b: any) => b.score - a.score);

  // 4. Insert top matches
  const top = scored.slice(0, limit);
  for (const m of top) {
    await supabaseAdmin.from('matches').upsert({
      challenge_id: challengeId,
      partner_id: m.id,
      score: m.score,
      status: 'proposed',
      incentive_points: Math.round(m.score * 100),
    }, { onConflict: 'challenge_id,partner_id' });
  }

  return top;
}

// Helper SQL function to be added in schema (for later cycles)
export const MATCH_RPC_SQL = `
CREATE OR REPLACE FUNCTION match_partners_by_embedding(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (id uuid, name text, type text, expertise_tags text[], reputation_score float, similarity float)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.type,
    p.expertise_tags,
    p.reputation_score,
    1 - (p.embedding <=> query_embedding) as similarity
  FROM partners p
  WHERE p.is_active = true
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;

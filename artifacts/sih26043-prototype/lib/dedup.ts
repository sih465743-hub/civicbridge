import { supabaseAdmin } from './supabase';
import { getEmbedding } from './ai';

/**
 * Near-duplicate detection using cosine similarity on embeddings.
 * If a very similar open challenge exists, we attach to its dedup_group
 * instead of creating a brand-new primary challenge.
 */
export async function findOrCreateDedupGroup(
  newEmbedding: number[],
  category: string,
  threshold = 0.88
): Promise<{ dedupGroup: string; isPrimary: boolean; existingId?: string }> {
  // Search recent open challenges in same category
  const { data: candidates } = await supabaseAdmin
    .from('challenges')
    .select('id, embedding, dedup_group, report_count')
    .eq('status', 'open')
    .eq('is_primary', true)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(30);

  if (!candidates || candidates.length === 0) {
    return { dedupGroup: crypto.randomUUID(), isPrimary: true };
  }

  // Simple cosine in JS (for prototype; move to pgvector later)
  function cosine(a: number[], b: number[]) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
  }

  let best = { id: '', score: 0, group: '', count: 1 };
  for (const c of candidates) {
    if (!c.embedding) continue;
    const score = cosine(newEmbedding, c.embedding as number[]);
    if (score > best.score) {
      best = { id: c.id, score, group: c.dedup_group, count: c.report_count || 1 };
    }
  }

  if (best.score >= threshold) {
    // Attach to existing
    await supabaseAdmin
      .from('challenges')
      .update({ report_count: best.count + 1 })
      .eq('id', best.id);

    return {
      dedupGroup: best.group,
      isPrimary: false,
      existingId: best.id,
    };
  }

  return { dedupGroup: crypto.randomUUID(), isPrimary: true };
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { processSubmission, classifySpam, getEmbedding } from '@/lib/ai';
import { findBestMatches } from '@/lib/matching';
import { findOrCreateDedupGroup } from '@/lib/dedup';


export async function POST(req: NextRequest) {
  try {
    const { text, channel = 'web', phone } = await req.json();
    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'Report too short' }, { status: 400 });
    }

    // Citizen
    let citizenId = null;
    if (phone) {
      const { data } = await supabaseAdmin
        .from('citizens')
        .upsert({ phone }, { onConflict: 'phone' })
        .select()
        .single();
      citizenId = data?.id;
    }

    // Submission
    const { data: submission } = await supabaseAdmin
      .from('submissions')
      .insert({
        citizen_id: citizenId,
        channel,
        raw_text: text,
        status: 'processing',
      })
      .select()
      .single();

    // Spam
    const spam = await classifySpam(text);
    if (spam.isSpam || spam.score > 0.8) {
      await supabaseAdmin
        .from('submissions')
        .update({ status: 'spam', spam_score: spam.score })
        .eq('id', submission.id);
      return NextResponse.json({ error: 'Flagged as spam', spam_score: spam.score }, { status: 400 });
    }

    // AI
    const processed = await processSubmission(text);
    const embedding = await getEmbedding(`${processed.title}. ${processed.description}`);

    // Deduplication (Loop 1/2 fix)
    const dedup = await findOrCreateDedupGroup(embedding, processed.category || 'other');

    // Challenge
    const { data: challenge } = await supabaseAdmin
      .from('challenges')
      .insert({
        submission_id: submission.id,
        title: processed.title,
        description: processed.description,
        category: processed.category,
        severity: processed.severity,
        tags: processed.tags,
        embedding,
        dedup_group: dedup.dedupGroup,
        is_primary: dedup.isPrimary,
        status: 'open',
      })
      .select()
      .single();


    await supabaseAdmin
      .from('submissions')
      .update({ status: 'processed', language_detected: processed.language_detected })
      .eq('id', submission.id);

    // Matching
    if (challenge) {
      findBestMatches(challenge.id).catch(console.error);
    }

    return NextResponse.json({
      id: challenge?.id,
      title: processed.title,
      description: processed.description,
      category: processed.category,
      severity: processed.severity,
      tags: processed.tags,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase';
import { processSubmission, classifySpam, getEmbedding } from '@/lib/ai';
import { findBestMatches } from '@/lib/matching';
import { validateTwilioRequest } from '@/lib/twilio';

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // needed for signature validation

  // === SECURITY: Twilio signature check (Loop 1 fix) ===
  if (!validateTwilioRequest(req, rawBody)) {
    console.warn('Invalid Twilio signature – rejecting');
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const formData = new URLSearchParams(rawBody);
    const from = formData.get('From') || '';
    const body = formData.get('Body') || '';
    const numMedia = parseInt(formData.get('NumMedia') || '0');
    const mediaUrls: string[] = [];
    for (let i = 0; i < numMedia; i++) {
      const url = formData.get(`MediaUrl${i}`);
      if (url) mediaUrls.push(url);
    }

    const phone = from.replace('whatsapp:', '');

    // === Rate limiting by phone (simple DB check) ===
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('channel', 'whatsapp')
      .gte('created_at', oneHourAgo)
      .filter('citizen_id', 'eq', (
        await supabaseAdmin.from('citizens').select('id').eq('phone', phone).maybeSingle()
      ).data?.id || '00000000-0000-0000-0000-000000000000');

    if ((count || 0) > 8) {
      const twiml = new MessagingResponse();
      twiml.message('आपने बहुत सारे रिपोर्ट भेजे हैं। कृपया 1 घंटे बाद फिर से प्रयास करें। / Too many reports. Please try again after 1 hour.');
      return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }

    // Upsert citizen + trust score decay on spam history would go here
    const { data: citizen } = await supabaseAdmin
      .from('citizens')
      .upsert({ phone }, { onConflict: 'phone' })
      .select()
      .single();

    const { data: submission } = await supabaseAdmin
      .from('submissions')
      .insert({
        citizen_id: citizen?.id,
        channel: 'whatsapp',
        raw_text: body,
        media_urls: mediaUrls,
        status: 'processing',
      })
      .select()
      .single();

    // Spam
    const spam = await classifySpam(body);
    if (spam.isSpam || spam.score > 0.72) {
      await supabaseAdmin
        .from('submissions')
        .update({ status: 'spam', spam_score: spam.score })
        .eq('id', submission!.id);

      // Lower trust
      if (citizen) {
        await supabaseAdmin
          .from('citizens')
          .update({ trust_score: Math.max(0, (citizen.trust_score || 0.5) - 0.15) })
          .eq('id', citizen.id);
      }

      const twiml = new MessagingResponse();
      twiml.message('रिपोर्ट को स्पैम के रूप में चिह्नित किया गया। / Report flagged as spam.');
      return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }

    // AI process
    const processed = await processSubmission(body, mediaUrls);

    const embedding = await getEmbedding(
      `${processed.title}. ${processed.description}. ${(processed.tags || []).join(' ')}`
    );

    const { data: challenge } = await supabaseAdmin
      .from('challenges')
      .insert({
        submission_id: submission!.id,
        title: processed.title,
        description: processed.description,
        category: processed.category,
        severity: processed.severity,
        tags: processed.tags,
        embedding,
        status: 'open',
      })
      .select()
      .single();

    await supabaseAdmin
      .from('submissions')
      .update({
        status: 'processed',
        language_detected: processed.language_detected,
      })
      .eq('id', submission!.id);

    if (challenge) {
      // Fire-and-forget matching
      findBestMatches(challenge.id).catch(console.error);
    }

    // Multilingual reply (basic)
    const isHindi = (processed.language_detected || '').startsWith('hi') || /[\u0900-\u097F]/.test(body);
    const reply = isHindi
      ? `✅ धन्यवाद! आपकी रिपोर्ट "${processed.title}" दर्ज हो गई है।\nश्रेणी: ${processed.category} | गंभीरता: ${processed.severity}/5\nहम इसे विश्वविद्यालयों से मिला रहे हैं।`
      : `✅ Thank you! Your report "${processed.title}" is registered.\nCategory: ${processed.category} | Severity: ${processed.severity}/5\nMatching with universities & partners.`;

    const twiml = new MessagingResponse();
    twiml.message(reply);
    return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' } });
  } catch (err) {
    console.error('WhatsApp webhook error', err);
    const twiml = new MessagingResponse();
    twiml.message('क्षमा करें, अभी प्रोसेस नहीं हो पाया। बाद में कोशिश करें। / Sorry, processing failed. Try later.');
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}

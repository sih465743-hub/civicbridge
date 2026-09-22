# SIH26043 – CivicMatch (Ready-to-Deploy Prototype)

**Multi-modal crowdsourcing platform** connecting citizen reports (WhatsApp • Web • IVR-ready) to universities & industry partners via AI pre-processing + vector matching.

Built entirely with free-tier services for Smart India Hackathon.

---

## Quick Deploy (≈ 15–20 min)

1. **Supabase**
   - Create free project
   - SQL Editor → run `supabase/schema.sql`
   - Then run `supabase/seed.sql` (demo partners)

2. **Google AI Studio**
   - Create free API key (Gemini 1.5 Flash)

3. **Twilio**
   - Free account → WhatsApp Sandbox
   - Note the sandbox number

4. **Vercel**
   - Import this repo
   - Add environment variables from `.env.example`
   - Deploy

5. **Twilio Webhook**
   - Set to `https://YOUR-APP.vercel.app/api/webhook/whatsapp`

Citizens can now message the Twilio sandbox number or use the web form.

---

## Architecture (Post 6 Red-Team Cycles)

| Layer            | Technology                          | Notes |
|------------------|-------------------------------------|-------|
| Frontend         | Next.js 14 App Router + Tailwind    | Dark UI, mobile friendly |
| Intake           | WhatsApp (Twilio) + Web form        | IVR stub ready |
| AI Pipeline      | Gemini 1.5 Flash (Google AI Studio) | Classification, spam, language, embedding |
| Database         | Supabase (Postgres + PostGIS + pgvector) | Free tier |
| Matching         | Vector cosine + expertise rules     | Deduplication included |
| Auth / Security  | Twilio signature validation + basic rate limit | Service role protected |
| Deploy           | Vercel one-click                    | |

---

## What Survived 6 Red-Team Cycles

**Fixed / Hardened**
- Twilio request signature validation
- Per-phone rate limiting
- Near-duplicate detection (embedding cosine)
- Primary vs secondary challenge flagging + report_count
- Bilingual (Hindi/English) auto-replies
- Spam → trust score reduction
- Dashboard shows only de-duplicated primary challenges
- Seed data for 8 realistic partners
- Graceful AI fallbacks

**Still Limited (Honest for Judges)**
- Full Graph Neural Network is future work (current matching is transparent vector + rules)
- Image/audio vision analysis is collected but not yet sent to Gemini multimodal
- IVR path is architected but not wired (Twilio Voice can be added in < 1 day)
- Partner acceptance UI and full incentive claims are minimal
- Free-tier Gemini will need caching / queue under heavy load
- Location extraction exists in AI prompt but PostGIS write is not yet forced

These limitations are deliberate scope control for a 36-hour hackathon prototype that actually deploys and works.

---

## Local Development

```bash
npm install
cp .env.example .env.local   # fill real keys
npm run dev
```

---

## File Structure

```
app/
  api/webhook/whatsapp/   ← Twilio entry point
  api/process/            ← Web form + shared pipeline
  dashboard/              ← Live board (primary only)
  submit/                 ← Citizen web form
lib/
  ai.ts                   ← Gemini calls
  dedup.ts                ← Near-duplicate logic
  matching.ts             ← Partner scoring
  supabase.ts
  twilio.ts               ← Signature validation
supabase/
  schema.sql
  seed.sql
```

---

## License

MIT – built for SIH 2026

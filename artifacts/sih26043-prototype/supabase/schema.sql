-- SIH26043 Crowdsource Platform Schema
-- Requires: PostGIS + pgvector extensions (enabled on Supabase free tier)

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Citizens / Reporters (anonymous friendly)
CREATE TABLE citizens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE,                    -- WhatsApp / IVR identifier
  preferred_lang TEXT DEFAULT 'hi',
  trust_score FLOAT DEFAULT 0.5 CHECK (trust_score BETWEEN 0 AND 1),
  report_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw multi-modal submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES citizens(id),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'ivr', 'web', 'app')),
  raw_text TEXT,
  media_urls TEXT[],                    -- images / audio
  location GEOGRAPHY(POINT, 4326),
  language_detected TEXT,
  status TEXT DEFAULT 'raw' CHECK (status IN ('raw', 'processing', 'processed', 'rejected', 'spam')),
  spam_score FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processed Challenges (after AI pipeline)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,                        -- water, education, health, infra, agriculture, other
  severity INT CHECK (severity BETWEEN 1 AND 5),
  location GEOGRAPHY(POINT, 4326),
  location_name TEXT,
  embedding VECTOR(768),                -- Gemini embedding dimension
  tags TEXT[],
  dedup_group UUID DEFAULT uuid_generate_v4(),  -- same group = near-duplicates
  is_primary BOOLEAN DEFAULT true,              -- only primary of a dedup group is shown
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'in_progress', 'resolved', 'archived')),
  upvote_count INT DEFAULT 0,
  report_count INT DEFAULT 1,                   -- how many citizens reported the same issue
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Universities & Industry Partners
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('university', 'industry', 'ngo', 'govt')),
  expertise_tags TEXT[],
  location GEOGRAPHY(POINT, 4326),
  capacity INT DEFAULT 5,               -- max concurrent challenges
  reputation_score FLOAT DEFAULT 0.5,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matching Graph (simple adjacency for prototype)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,                 -- cosine + rule boost
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'rejected', 'completed')),
  incentive_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, partner_id)
);

-- Incentive ledger (very lightweight)
CREATE TABLE incentives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id),
  challenge_id UUID REFERENCES challenges(id),
  points INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_embedding ON challenges USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_challenges_location ON challenges USING GIST (location);
CREATE INDEX idx_partners_location ON partners USING GIST (location);
CREATE INDEX idx_matches_score ON matches(score DESC);

-- Simple RLS (open for prototype; tighten later)
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "Public insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access" ON challenges FOR ALL USING (auth.role() = 'service_role');

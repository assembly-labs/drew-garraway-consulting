-- ===========================================
-- TOMO Insights — Database Migration
--
-- Three new tables for the tiered AI insights system:
-- 1. insights — Generated insights (weekly/monthly/quarterly)
-- 2. insight_conversations — 5-exchange chat follow-ups
-- 3. user_context — User Context Document (personalization)
--
-- See docs/insights/SCHEMA.md for full documentation.
-- ===========================================

-- 1. INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  tier TEXT NOT NULL CHECK (tier IN ('weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  insight_data JSONB NOT NULL,
  context_for_lower_tiers JSONB,

  model TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful')),

  -- Tracks whether the user has viewed this insight (typewriter plays once, then static)
  has_been_viewed BOOLEAN DEFAULT false,
  first_viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, tier, period_start)
);

-- RLS
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own insights"
  ON insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own feedback"
  ON insights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages insights"
  ON insights FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- Indexes
CREATE INDEX idx_insights_user_tier ON insights(user_id, tier, period_start DESC);
CREATE INDEX idx_insights_user_latest ON insights(user_id, generated_at DESC);

-- 2. INSIGHT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS insight_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,

  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  exchange_count INTEGER DEFAULT 0 CHECK (exchange_count >= 0 AND exchange_count <= 5),
  complete BOOLEAN DEFAULT false,

  model TEXT NOT NULL,
  total_input_tokens INTEGER DEFAULT 0,
  total_output_tokens INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, insight_id)
);

ALTER TABLE insight_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own conversations"
  ON insight_conversations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages conversations"
  ON insight_conversations FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE INDEX idx_conversations_insight ON insight_conversations(insight_id);
CREATE INDEX idx_conversations_user ON insight_conversations(user_id, created_at DESC);

-- 3. USER CONTEXT TABLE
CREATE TABLE IF NOT EXISTS user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  context_document JSONB NOT NULL DEFAULT '{}'::jsonb,
  serialized_text TEXT,

  version INTEGER DEFAULT 1,
  sessions_analyzed INTEGER DEFAULT 0,
  last_rebuilt TIMESTAMPTZ DEFAULT NOW(),

  changelog JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own context"
  ON user_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages context"
  ON user_context FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE INDEX idx_user_context_user ON user_context(user_id);

-- 4. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create triggers if they don't already exist (check first)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_insights_updated_at') THEN
    CREATE TRIGGER set_insights_updated_at
      BEFORE UPDATE ON insights
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_conversations_updated_at') THEN
    CREATE TRIGGER set_conversations_updated_at
      BEFORE UPDATE ON insight_conversations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_context_updated_at') THEN
    CREATE TRIGGER set_user_context_updated_at
      BEFORE UPDATE ON user_context
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

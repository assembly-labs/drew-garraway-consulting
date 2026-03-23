# Insights Database Schema

## Overview

Three new tables for the insights feature. All follow existing TOMO patterns: RLS enforced, soft delete where appropriate, UUID primary keys.

## Tables

### `insights`

```sql
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  tier TEXT NOT NULL CHECK (tier IN ('weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  insight_data JSONB NOT NULL, -- model output (structured per tier)
  context_for_lower_tiers JSONB, -- { focusArea, priorities, watchItems, gameIdentity }

  model TEXT NOT NULL, -- e.g. 'claude-haiku-4-5-20251001'
  input_tokens INTEGER,
  output_tokens INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful')),

  -- Typewriter animation plays once per insight, then static on re-visits
  has_been_viewed BOOLEAN DEFAULT false,
  first_viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, tier, period_start)
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own insights" ON insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own feedback" ON insights FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role manages insights" ON insights FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_insights_user_tier ON insights(user_id, tier, period_start DESC);
CREATE INDEX idx_insights_user_latest ON insights(user_id, generated_at DESC);
```

### `insight_conversations`

```sql
CREATE TABLE insight_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,

  messages JSONB NOT NULL DEFAULT '[]',
  exchange_count INTEGER DEFAULT 0 CHECK (exchange_count <= 5),
  complete BOOLEAN DEFAULT false,

  model TEXT NOT NULL,
  total_input_tokens INTEGER DEFAULT 0,
  total_output_tokens INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, insight_id)
);

ALTER TABLE insight_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own conversations" ON insight_conversations FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_conversations_insight ON insight_conversations(insight_id);
```

### `user_context`

```sql
CREATE TABLE user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  context_document JSONB NOT NULL DEFAULT '{}',
  serialized_text TEXT, -- pre-rendered natural language version for prompt injection

  version INTEGER DEFAULT 1,
  sessions_analyzed INTEGER DEFAULT 0,
  last_rebuilt TIMESTAMPTZ DEFAULT NOW(),

  changelog JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own context" ON user_context FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages context" ON user_context FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

## Migration File

The actual migration SQL will be created at `tomo/supabase/migrations/YYYYMMDD_insights_tables.sql` during development.

## RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| insights | Own rows | Service role | Own feedback only | Service role |
| insight_conversations | Own rows | Own rows | Own rows | Cascade from insight |
| user_context | Own rows | Service role | Service role | Cascade from profile |

## Query Patterns

- **Get latest insight per tier:** `WHERE user_id = $1 AND tier = $2 ORDER BY period_start DESC LIMIT 1`
- **Get context for lower tiers:** `WHERE user_id = $1 AND tier IN ('monthly', 'quarterly') ORDER BY generated_at DESC LIMIT 2`
- **Get conversation for insight:** `WHERE insight_id = $1 AND user_id = $2`
- **Check generation eligibility:** `WHERE user_id = $1 AND tier = $2 AND period_start >= $3`

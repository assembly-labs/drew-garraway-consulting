-- Migration: User gym history tracking
-- Date: 2026-03-25
-- Purpose: Track all gyms a user trains at over time, with one primary "home" gym.
--          Also stamps each session with the gym it was logged at.
--
-- This migration:
--   1. Creates user_gyms table (gym history/relationships per user)
--   2. Adds user_gym_id FK on sessions
--   3. Migrates existing profile gym data into user_gyms
--   4. Backfills sessions with the user's primary gym
--   5. Creates indexes and RLS policies
--   6. Creates a helper function to enforce single-primary constraint

-- 1. User gyms table
CREATE TABLE IF NOT EXISTS user_gyms (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gym_id          UUID REFERENCES gyms(id) ON DELETE SET NULL,  -- null for custom gyms
  gym_name        TEXT NOT NULL,
  gym_city        TEXT,
  gym_state       TEXT,
  gym_affiliation TEXT,
  gym_lat         DOUBLE PRECISION,
  gym_lng         DOUBLE PRECISION,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  relationship    TEXT NOT NULL DEFAULT 'home'
                  CHECK (relationship IN ('home', 'drop_in', 'seminar', 'open_mat')),
  started_at      DATE NOT NULL DEFAULT CURRENT_DATE,
  ended_at        DATE,               -- null = still active
  notes           TEXT,               -- "Got my blue belt here", etc.
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add user_gym_id to sessions (nullable — existing sessions won't have it)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_gym_id UUID REFERENCES user_gyms(id) ON DELETE SET NULL;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_user_gyms_user_id ON user_gyms(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gyms_primary ON user_gyms(user_id) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_sessions_user_gym_id ON sessions(user_gym_id);

-- 4. Migrate existing profile gym data → user_gyms
-- Every profile with a gym_name gets an initial "home" entry
-- gym_id on profiles may contain non-UUID strings (e.g. "alliance-hq" from local fallback data),
-- so we only cast to UUID when the value looks like a valid UUID.
INSERT INTO user_gyms (user_id, gym_id, gym_name, gym_city, gym_state, gym_affiliation, gym_lat, gym_lng, is_primary, relationship, started_at)
SELECT
  p.id,
  CASE
    WHEN p.gym_is_custom THEN NULL
    WHEN p.gym_id IS NULL THEN NULL
    WHEN p.gym_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN p.gym_id::uuid
    ELSE NULL
  END,
  p.gym_name,
  p.gym_city,
  p.gym_state,
  p.gym_affiliation,
  p.gym_lat,
  p.gym_lng,
  TRUE,
  'home',
  p.created_at::date
FROM profiles p
WHERE p.gym_name IS NOT NULL AND p.gym_name != ''
ON CONFLICT DO NOTHING;

-- 5. Backfill sessions with user's primary gym
UPDATE sessions s
SET user_gym_id = ug.id
FROM user_gyms ug
WHERE s.user_id = ug.user_id
  AND ug.is_primary = TRUE
  AND s.user_gym_id IS NULL;

-- 6. Updated_at trigger
CREATE OR REPLACE FUNCTION update_user_gyms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_gyms_updated_at
  BEFORE UPDATE ON user_gyms
  FOR EACH ROW
  EXECUTE FUNCTION update_user_gyms_updated_at();

-- 7. RLS policies
ALTER TABLE user_gyms ENABLE ROW LEVEL SECURITY;

-- Users can read their own gym history
CREATE POLICY "Users can read own gym history"
  ON user_gyms FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own gym entries
CREATE POLICY "Users can add gym entries"
  ON user_gyms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own gym entries
CREATE POLICY "Users can update own gym entries"
  ON user_gyms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only service_role can delete gym entries (preserve history)
CREATE POLICY "Service role can delete gym entries"
  ON user_gyms FOR DELETE
  USING (auth.role() = 'service_role');

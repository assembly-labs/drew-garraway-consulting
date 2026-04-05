-- =============================================================
-- TOMO MVP 1.0 — Full Supabase Migration
-- =============================================================
-- Paste this into Supabase SQL Editor after creating your project.
-- Creates: profiles table, sessions table, storage bucket policies,
--          updated_at trigger, and all RLS policies.
--
-- Prerequisites: Supabase project created, auth enabled.
-- =============================================================

-- -----------------------------------------
-- 1. Auto-update trigger for updated_at
-- -----------------------------------------
-- This automatically sets updated_at whenever a row is modified,
-- so you don't have to remember to set it in every UPDATE call.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------
-- 2. Profiles table
-- -----------------------------------------
-- Stores user profile data collected during onboarding.
-- One row per user, linked to Supabase Auth.

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  belt TEXT NOT NULL CHECK (belt IN ('white','blue','purple','brown','black')),
  stripes INTEGER NOT NULL DEFAULT 0 CHECK (stripes BETWEEN 0 AND 4),
  gym_id TEXT,
  gym_name TEXT NOT NULL,
  gym_is_custom BOOLEAN DEFAULT false,
  gym_city TEXT,
  gym_state TEXT,
  gym_affiliation TEXT,
  target_frequency INTEGER NOT NULL DEFAULT 4,
  logging_preference TEXT NOT NULL DEFAULT 'voice' CHECK (logging_preference IN ('voice','text')),
  onboarding_complete BOOLEAN DEFAULT false,
  session_count INTEGER DEFAULT 0,
  training_goals TEXT[],
  experience_level TEXT CHECK (experience_level IN ('new','beginner','intermediate','experienced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: users can only read/write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------
-- 3. Sessions table
-- -----------------------------------------
-- Stores training sessions logged via voice or text.
-- Includes pipeline metadata for debugging AI quality.

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME,
  training_mode TEXT NOT NULL DEFAULT 'unknown'
    CHECK (training_mode IN ('gi','nogi','mixed','unknown')),
  session_kind TEXT NOT NULL DEFAULT 'class'
    CHECK (session_kind IN ('class','open_mat','drilling','competition','other')),
  duration_minutes INTEGER NOT NULL,
  did_spar BOOLEAN DEFAULT false,
  sparring_rounds INTEGER,
  techniques_drilled TEXT[] DEFAULT '{}',
  submissions_given JSONB DEFAULT '[]',
  submissions_received JSONB DEFAULT '[]',
  worked_well TEXT[] DEFAULT '{}',
  struggles TEXT[] DEFAULT '{}',
  injuries TEXT[] DEFAULT '{}',
  lesson_topic TEXT,
  notes TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  transcript TEXT,
  audio_path TEXT, -- private storage path (e.g. userId/sessionId.aac), NOT a URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- soft delete (NULL = active)

  -- Pipeline metadata (internal, not shown in UI)
  input_method TEXT NOT NULL DEFAULT 'text'
    CHECK (input_method IN ('voice','text')),
  transcription_status TEXT
    CHECK (transcription_status IN ('pending','completed','failed','skipped')),
  extraction_status TEXT
    CHECK (extraction_status IN ('pending','completed','failed','skipped')),
  edited_after_ai BOOLEAN DEFAULT false,
  schema_version INTEGER NOT NULL DEFAULT 1,
  extraction_model TEXT,
  transcription_error TEXT,
  extraction_error TEXT
);

-- Auto-update updated_at on sessions
CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: users can only access their own active sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast journal queries (sorted by date, most recent first)
CREATE INDEX idx_sessions_user_date ON sessions(user_id, date DESC);

-- -----------------------------------------
-- 4. Storage: Private audio bucket
-- -----------------------------------------
-- Audio recordings are stored in a PRIVATE bucket.
-- Access is via short-lived signed URLs only.
-- The bucket itself must be created in the Supabase dashboard
-- or via CLI: supabase storage create audio-recordings --public=false
--
-- These policies ensure users can only access their own recordings.

CREATE POLICY "Users upload own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users read own audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'audio-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------
-- 5. Done!
-- -----------------------------------------
-- After running this:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called "audio-recordings"
-- 3. Set it to PRIVATE (not public)
-- 4. Enable Auth providers (Email + Apple Sign-In) in Auth settings

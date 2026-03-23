-- Migration: Ensure comprehensive RLS policies for profiles, sessions, and storage
-- Date: 2026-03-17
-- Context: Audit found RLS policies applied manually but missing from migrations.
-- Uses DROP IF EXISTS + CREATE to be idempotent (safe to run on existing DB).

-- ===========================================
-- PROFILES TABLE RLS
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ===========================================
-- SESSIONS TABLE RLS
-- ===========================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own sessions" ON sessions;
CREATE POLICY "Users read own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users insert own sessions" ON sessions;
CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own sessions" ON sessions;
CREATE POLICY "Users update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ===========================================
-- STORAGE RLS (audio-recordings bucket)
-- ===========================================
-- Path format: {userId}/{sessionId}.m4a
-- Ownership enforced by first folder segment matching auth.uid()

DROP POLICY IF EXISTS "Users upload own audio" ON storage.objects;
CREATE POLICY "Users upload own audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio-recordings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users read own audio" ON storage.objects;
CREATE POLICY "Users read own audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audio-recordings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

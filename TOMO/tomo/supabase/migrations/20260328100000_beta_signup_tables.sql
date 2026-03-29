-- Beta signup tables for Alliance Paoli onboarding flow
-- Two tables: beta_signups (interest) and nda_agreements (legal log)

-- 1. Beta signups (collected from the one-pager form)
CREATE TABLE IF NOT EXISTS beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  belt TEXT NOT NULL,
  iphone_model TEXT,
  source TEXT DEFAULT 'alliance_paoli',
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'nda_sent', 'agreed', 'testflight_sent', 'active', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. NDA agreements (legal log, immutable)
CREATE TABLE IF NOT EXISTS nda_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  agreed_at TIMESTAMPTZ DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  agreement_version TEXT DEFAULT '2026-03-28'
);

-- Unique constraint on email for beta_signups (one signup per email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_beta_signups_email ON beta_signups (LOWER(email));

-- Index on email for nda_agreements lookups
CREATE INDEX IF NOT EXISTS idx_nda_agreements_email ON nda_agreements (LOWER(email));

-- RLS: Enable on both tables
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_agreements ENABLE ROW LEVEL SECURITY;

-- RLS: Anon can INSERT into beta_signups (signup form)
CREATE POLICY "anon_insert_beta_signups" ON beta_signups
  FOR INSERT TO anon
  WITH CHECK (true);

-- RLS: Anon can INSERT into nda_agreements (I Agree button)
CREATE POLICY "anon_insert_nda_agreements" ON nda_agreements
  FOR INSERT TO anon
  WITH CHECK (true);

-- RLS: Service role can do everything (for edge functions + admin)
CREATE POLICY "service_role_all_beta_signups" ON beta_signups
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_nda_agreements" ON nda_agreements
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at on beta_signups
CREATE OR REPLACE FUNCTION update_beta_signups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER beta_signups_updated_at
  BEFORE UPDATE ON beta_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_signups_updated_at();

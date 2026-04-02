-- Migration: Profile Expansion — birthday, gender, body weight
-- Date: 2026-03-30
-- Feature: FEAT-008 User Profile Expansion
--
-- Adds: birth_date (mandatory, 18+), gender (optional), body_weight_kg, weight_unit_preference
-- Training goals values expanded (self_defense, community) but stored as TEXT[] so no schema change needed

-- Add new columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS body_weight_kg NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_unit_preference TEXT DEFAULT 'lb' CHECK (weight_unit_preference IN ('lb', 'kg'));

-- For existing rows (Drew's wiped account + Alexa), set a placeholder birth_date
-- so NOT NULL can be enforced. These accounts were wiped on Mar 28, so no real data to preserve.
-- If any rows exist without birth_date, set a placeholder that will be overwritten on next onboarding.
UPDATE profiles SET birth_date = '1990-01-01' WHERE birth_date IS NULL;

-- Now enforce NOT NULL on birth_date (mandatory for all new accounts)
ALTER TABLE profiles ALTER COLUMN birth_date SET NOT NULL;

-- Add check constraint: must be 18+ (birth_date <= today - 18 years)
-- Using a function-based check since CHECK constraints can't reference CURRENT_DATE directly in all contexts
-- Instead, we enforce this in the application layer and via a trigger
CREATE OR REPLACE FUNCTION check_minimum_age()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.birth_date > (CURRENT_DATE - INTERVAL '18 years')::DATE THEN
    RAISE EXCEPTION 'User must be at least 18 years old';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_minimum_age ON profiles;
CREATE TRIGGER enforce_minimum_age
  BEFORE INSERT OR UPDATE OF birth_date ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_minimum_age();

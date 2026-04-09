-- Migration: Relax birth_date NOT NULL constraint on profiles
-- Date: 2026-04-08
-- Feature: Hotfix for stuck onboarding on older TestFlight builds
--
-- Context:
-- The 2026-03-30 migration (FEAT-008) added `birth_date NOT NULL` to the
-- profiles table. TestFlight builds from before that date don't send a
-- birth_date in their profile insert, so those clients hit a NOT NULL
-- violation. The error was swallowed by the app (profileService.create
-- returned null silently) and users were stranded on the onboarding payoff
-- screen with no profile row. At least one external tester (Rachel) was
-- orphaned this way because Apple's external review lag keeps her on an
-- older build than the one with FEAT-008.
--
-- Fix:
-- Drop NOT NULL on birth_date so older clients can still save profiles.
-- Keep the 18+ enforcement trigger so any row that DOES include birth_date
-- still has to pass the age check. New clients continue to send birth_date
-- as before; the insights engine treats null age as "unknown" and falls
-- back gracefully.

ALTER TABLE profiles ALTER COLUMN birth_date DROP NOT NULL;

-- Trigger check_minimum_age() already handles null-safe semantics:
--   IF NEW.birth_date > (CURRENT_DATE - INTERVAL '18 years')::DATE
-- Returns false for NULL, so NULL birth_dates pass through unchecked.
-- No trigger change needed.

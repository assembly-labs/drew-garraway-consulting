-- ===========================================
-- Security Hardening Migration
-- Date: 2026-03-25
-- Context: Supabase advisory flagged "rls_disabled_in_public" for PostGIS
-- system tables exposed via PostgREST. Also hardens anon role access.
-- ===========================================

-- 1. RESTRICT ACCESS TO POSTGIS SYSTEM TABLES/VIEWS
-- spatial_ref_sys is owned by the system — can't enable RLS on it.
-- Instead, revoke SELECT from anon/authenticated roles so PostgREST
-- no longer exposes it. Only service_role (admin) can query it.
-- The gyms table RPC functions use PostGIS internally (server-side),
-- so this doesn't break gym search.

REVOKE ALL ON spatial_ref_sys FROM anon, authenticated;
REVOKE ALL ON geometry_columns FROM anon, authenticated;
REVOKE ALL ON geography_columns FROM anon, authenticated;

-- 2. ADD DELETE POLICY TO SESSIONS (missing — prevent client-side hard delete)
-- Sessions use soft delete (deleted_at) via UPDATE, but there's no DELETE policy.
-- Restrict hard DELETE to service_role only.
DROP POLICY IF EXISTS "Service role can hard delete sessions" ON sessions;
CREATE POLICY "Service role can hard delete sessions"
  ON sessions FOR DELETE
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- 3. ADD DELETE POLICY TO PROFILES (prevent accidental client-side deletion)
DROP POLICY IF EXISTS "Service role can delete profiles" ON profiles;
CREATE POLICY "Service role can delete profiles"
  ON profiles FOR DELETE
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

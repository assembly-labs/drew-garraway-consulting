-- Migration: Create gyms table with PostGIS spatial support
-- Date: 2026-03-22
-- Purpose: Comprehensive BJJ gym database for onboarding gym picker
--
-- This migration:
--   1. Enables PostGIS extension (no-op if already enabled)
--   2. Creates the gyms table with spatial column
--   3. Creates indexes for proximity queries and filtering
--   4. Creates a trigger to auto-populate the location column from lat/lng
--   5. Creates an RPC function for the app to find nearby gyms
--   6. Enables RLS with read-only public access

-- 1. Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Gyms table
CREATE TABLE IF NOT EXISTS gyms (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  address         TEXT,
  city            TEXT,
  state           TEXT,              -- 2-letter US state code
  zip             TEXT,
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  location        GEOGRAPHY(POINT, 4326),
  affiliation     TEXT,              -- e.g. 'Gracie Barra', '10th Planet', 'Alliance'
  is_headquarters BOOLEAN DEFAULT FALSE,
  website         TEXT,
  phone           TEXT,
  instagram       TEXT,
  rating          NUMERIC(3,1),
  review_count    INTEGER,
  styles          TEXT[],            -- ['bjj', 'nogi', 'mma', 'wrestling']
  head_instructor TEXT,
  google_place_id TEXT UNIQUE,
  sources         TEXT[],            -- ['bjjmetrics', 'google_places', '10thplanet']
  source_ids      JSONB DEFAULT '{}',
  verified        BOOLEAN DEFAULT FALSE,
  last_verified   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_gyms_location ON gyms USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_gyms_state ON gyms(state);
CREATE INDEX IF NOT EXISTS idx_gyms_affiliation ON gyms(affiliation);
CREATE INDEX IF NOT EXISTS idx_gyms_city_state ON gyms(city, state);
CREATE INDEX IF NOT EXISTS idx_gyms_slug ON gyms(slug);

-- 4. Trigger: auto-populate location from lat/lng
CREATE OR REPLACE FUNCTION update_gym_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gym_location
  BEFORE INSERT OR UPDATE ON gyms
  FOR EACH ROW
  EXECUTE FUNCTION update_gym_location();

-- 5. RPC: find nearby gyms (called from app onboarding)
CREATE OR REPLACE FUNCTION find_nearby_gyms(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_miles INTEGER DEFAULT 25,
  max_results INTEGER DEFAULT 20
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  city TEXT,
  state TEXT,
  affiliation TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_miles DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    g.city,
    g.state,
    g.affiliation,
    g.lat,
    g.lng,
    ROUND((ST_Distance(
      g.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1609.344)::numeric, 1)::double precision AS distance_miles
  FROM gyms g
  WHERE g.location IS NOT NULL
    AND ST_DWithin(
      g.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_miles * 1609.344  -- convert miles to meters
    )
  ORDER BY ST_Distance(
    g.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
  )
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. RLS: anyone can read gyms, only service_role can write
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gyms are publicly readable"
  ON gyms FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage gyms"
  ON gyms FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

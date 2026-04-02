-- Migration: Add search_gyms RPC for text search in onboarding
-- Date: 2026-03-22
-- Purpose: Support gym name/city/affiliation autocomplete search

CREATE OR REPLACE FUNCTION search_gyms(
  search_query TEXT,
  user_lat DOUBLE PRECISION DEFAULT NULL,
  user_lng DOUBLE PRECISION DEFAULT NULL,
  max_results INTEGER DEFAULT 10
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
    CASE
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND g.location IS NOT NULL THEN
        ROUND((ST_Distance(
          g.location,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) / 1609.344)::numeric, 1)::double precision
      ELSE NULL
    END AS distance_miles
  FROM gyms g
  WHERE
    g.name ILIKE '%' || search_query || '%'
    OR g.city ILIKE '%' || search_query || '%'
    OR g.affiliation ILIKE '%' || search_query || '%'
  ORDER BY
    -- Exact name prefix match first
    CASE WHEN g.name ILIKE search_query || '%' THEN 0 ELSE 1 END,
    -- Then by distance if coordinates provided
    CASE
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND g.location IS NOT NULL THEN
        ST_Distance(g.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography)
      ELSE 999999999
    END
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

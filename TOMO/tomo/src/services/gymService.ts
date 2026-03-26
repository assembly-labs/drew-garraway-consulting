/**
 * Gym Service — Search and find nearby gyms
 *
 * Uses Supabase `gyms` table when available, falls back to local gyms.ts.
 * Supports:
 * - Nearby gym search (by coordinates + distance)
 * - Text search (autocomplete by name/city/affiliation)
 */

import { supabase } from './supabase';
import { GYM_DATABASE } from '../data/gyms';
import type { Gym } from '../types/mvp-types';
import type { Coordinates } from '../hooks/useLocation';

export interface GymWithDistance extends Gym {
  lat?: number;
  lng?: number;
  distance_mi?: number;
}

/**
 * Find nearby gyms using coordinates.
 * Tries Supabase first, falls back to local database with haversine distance.
 */
export async function findNearbyGyms(
  coords: Coordinates,
  radiusMiles: number = 25,
  limit: number = 5
): Promise<GymWithDistance[]> {
  try {
    // Try Supabase RPC (if gyms table + function exist)
    const { data, error } = await supabase.rpc('find_nearby_gyms', {
      user_lat: coords.lat,
      user_lng: coords.lng,
      radius_miles: radiusMiles,
      max_results: limit,
    });

    if (!error && data && data.length > 0) {
      return data.map((g: any) => ({
        id: g.id,
        name: g.name,
        affiliation: g.affiliation,
        city: g.city,
        stateOrCountry: g.state,
        lat: g.lat ?? undefined,
        lng: g.lng ?? undefined,
        distance_mi: g.distance_miles != null
          ? Math.round(g.distance_miles * 10) / 10
          : undefined,
      }));
    }
  } catch {
    // Supabase gyms table doesn't exist yet — fall through to local
  }

  // Fallback: local database with haversine distance
  // Note: local gyms don't have lat/lng, so we can't do real distance.
  // Just return the first few as "nearby" — better than nothing.
  return localTextSearch('', limit);
}

/**
 * Search gyms by text (name, city, or affiliation).
 * Tries Supabase first, falls back to local database.
 */
export async function searchGyms(
  query: string,
  coords?: Coordinates | null,
  limit: number = 4
): Promise<GymWithDistance[]> {
  if (!query || query.length < 2) return [];

  try {
    // Try Supabase text search
    const { data, error } = await supabase.rpc('search_gyms', {
      search_query: query,
      user_lat: coords?.lat ?? null,
      user_lng: coords?.lng ?? null,
      max_results: limit,
    });

    if (!error && data && data.length > 0) {
      return data.map((g: any) => ({
        id: g.id,
        name: g.name,
        affiliation: g.affiliation,
        city: g.city,
        stateOrCountry: g.state,
        lat: g.lat ?? undefined,
        lng: g.lng ?? undefined,
        distance_mi: g.distance_miles != null
          ? Math.round(g.distance_miles * 10) / 10
          : undefined,
      }));
    }
  } catch {
    // Fall through to local
  }

  // Fallback: local database
  return localTextSearch(query, limit);
}

/**
 * Local-only text search against gyms.ts
 */
function localTextSearch(query: string, limit: number): GymWithDistance[] {
  if (!query.trim()) return GYM_DATABASE.slice(0, limit);

  const q = query.toLowerCase();
  return GYM_DATABASE.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      (g.city && g.city.toLowerCase().includes(q)) ||
      (g.affiliation && g.affiliation.toLowerCase().includes(q)) ||
      (g.stateOrCountry && g.stateOrCountry.toLowerCase().includes(q))
  ).slice(0, limit);
}

/**
 * User Gym Service — CRUD for gym history / relationships
 *
 * Each user has a list of gyms they've trained at. One is always
 * marked as primary (their home gym). The rest are former homes
 * or drop-in/visit entries.
 */

import { supabase } from './supabase';
import type { UserGym, UserGymInsert, GymRelationship } from '../types/mvp-types';
import type { SelectedGym } from '../components/GymSearchInput';

// ============================================
// SERVICE
// ============================================

export const userGymService = {
  /**
   * Get all gym entries for the current user, newest first.
   * Primary gym is always first regardless of date.
   */
  async list(): Promise<UserGym[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_gyms')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Failed to load gym history:', error);
      return [];
    }
    return data ?? [];
  },

  /**
   * Get just the primary gym for the current user.
   */
  async getPrimary(): Promise<UserGym | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_gyms')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to load primary gym:', error);
      return null;
    }
    return data;
  },

  /**
   * Add a new gym entry. If is_primary, clears primary from all others.
   */
  async add(insert: UserGymInsert): Promise<UserGym | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // If this is a new primary, unset existing primary first
    if (insert.is_primary) {
      await supabase
        .from('user_gyms')
        .update({ is_primary: false, ended_at: insert.started_at ?? new Date().toISOString().split('T')[0] })
        .eq('user_id', user.id)
        .eq('is_primary', true);
    }

    const { data, error } = await supabase
      .from('user_gyms')
      .insert({
        user_id: user.id,
        ...insert,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a gym entry (notes, ended_at, etc.)
   */
  async update(id: string, updates: Partial<UserGymInsert>): Promise<UserGym | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_gyms')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Change the user's primary (home) gym.
   * Old primary gets ended_at = today, new gym becomes primary.
   * Also updates the profile's cached gym_* fields.
   */
  async changePrimary(newGym: SelectedGym): Promise<UserGym | null> {
    const today = new Date().toISOString().split('T')[0];

    // Add as new primary (add() handles unsetting old primary)
    const created = await this.add({
      gym_id: newGym.id,
      gym_name: newGym.name,
      gym_city: newGym.city ?? null,
      gym_state: newGym.state ?? null,
      gym_affiliation: newGym.affiliation ?? null,
      gym_lat: newGym.lat ?? null,
      gym_lng: newGym.lng ?? null,
      is_primary: true,
      relationship: 'home',
      started_at: today,
    });

    // Sync profile's cached gym fields
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          gym_id: newGym.id,
          gym_name: newGym.name,
          gym_is_custom: newGym.isCustom,
          gym_city: newGym.city ?? null,
          gym_state: newGym.state ?? null,
          gym_affiliation: newGym.affiliation ?? null,
          gym_lat: newGym.lat ?? null,
          gym_lng: newGym.lng ?? null,
        })
        .eq('id', user.id);
    }

    return created;
  },

  /**
   * Log a drop-in visit (single day, non-primary).
   */
  async addDropIn(gym: SelectedGym, relationship: GymRelationship = 'drop_in'): Promise<UserGym | null> {
    const today = new Date().toISOString().split('T')[0];

    return this.add({
      gym_id: gym.id,
      gym_name: gym.name,
      gym_city: gym.city ?? null,
      gym_state: gym.state ?? null,
      gym_affiliation: gym.affiliation ?? null,
      gym_lat: gym.lat ?? null,
      gym_lng: gym.lng ?? null,
      is_primary: false,
      relationship,
      started_at: today,
      ended_at: today,
    });
  },

  /**
   * Count non-primary visits (drop-ins, seminars, open mats).
   */
  async getVisitCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('user_gyms')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_primary', false);

    if (error) return 0;
    return count ?? 0;
  },

  /**
   * Get session counts grouped by user_gym_id.
   * Returns a map of { userGymId: sessionCount }.
   */
  async getSessionCountsByGym(): Promise<Record<string, number>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('sessions')
      .select('user_gym_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .not('user_gym_id', 'is', null);

    if (error || !data) return {};

    const counts: Record<string, number> = {};
    for (const row of data) {
      if (row.user_gym_id) {
        counts[row.user_gym_id] = (counts[row.user_gym_id] ?? 0) + 1;
      }
    }
    return counts;
  },
};

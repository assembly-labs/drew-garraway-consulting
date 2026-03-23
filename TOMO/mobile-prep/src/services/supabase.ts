/**
 * TOMO — Supabase Client Service
 *
 * Initializes the Supabase client and exports typed helpers for
 * profiles, sessions, and audio storage.
 *
 * USAGE:
 *   import { supabase, profileService, sessionService } from '@/services/supabase';
 *
 *   // Get current user's profile
 *   const profile = await profileService.get();
 *
 *   // Save a new session
 *   const session = await sessionService.create({ ... });
 *
 * NOTE: Replace the placeholder URL and key with your actual Supabase values
 * from app.config.ts extras or .env file.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Session,
  SessionInsert,
  SessionUpdate,
  TrainingMode,
} from '../types/mvp-types';

// ===========================================
// CLIENT INITIALIZATION
// ===========================================

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed in React Native
  },
});

// ===========================================
// PROFILE SERVICE
// ===========================================

export const profileService = {
  /** Get the current user's profile */
  async get(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Failed to get profile:', error.message);
      return null;
    }
    return data as Profile;
  },

  /** Create a new profile (during onboarding) */
  async create(profile: ProfileInsert): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        ...profile,
        onboarding_complete: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create profile:', error.message);
      return null;
    }
    return data as Profile;
  },

  /** Update profile fields */
  async update(updates: ProfileUpdate): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update profile:', error.message);
      return null;
    }
    return data as Profile;
  },
};

// ===========================================
// SESSION SERVICE
// ===========================================

export const sessionService = {
  /** List all active sessions, newest first */
  async list(filters?: { trainingMode?: TrainingMode }): Promise<Session[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (filters?.trainingMode) {
      query = query.eq('training_mode', filters.trainingMode);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to list sessions:', error.message);
      return [];
    }
    return (data ?? []) as Session[];
  },

  /** Get a single session by ID */
  async get(id: string): Promise<Session | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Failed to get session:', error.message);
      return null;
    }
    return data as Session;
  },

  /** Create a new session */
  async create(session: SessionInsert): Promise<Session | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        ...session,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create session:', error.message);
      return null;
    }
    return data as Session;
  },

  /** Update a session */
  async update(id: string, updates: SessionUpdate): Promise<Session | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        edited_after_ai: true,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update session:', error.message);
      return null;
    }
    return data as Session;
  },

  /** Soft-delete a session (sets deleted_at, keeps data in DB) */
  async softDelete(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('sessions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete session:', error.message);
      return false;
    }
    return true;
  },

  /** Get total active session count (used instead of stored session_count) */
  async getCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (error) {
      console.error('Failed to count sessions:', error.message);
      return 0;
    }
    return count ?? 0;
  },
};

// ===========================================
// AUDIO STORAGE SERVICE
// ===========================================

export const audioService = {
  /** Upload an audio recording to the private bucket */
  async upload(sessionId: string, fileUri: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const storagePath = `${user.id}/${sessionId}.aac`;

    // Read the file as a blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('audio-recordings')
      .upload(storagePath, blob, {
        contentType: 'audio/aac',
        upsert: false,
      });

    if (error) {
      console.error('Failed to upload audio:', error.message);
      return null;
    }
    return storagePath;
  },

  /** Get a short-lived signed URL for an audio file (for playback) */
  async getSignedUrl(audioPath: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('audio-recordings')
      .createSignedUrl(audioPath, 300); // 5 minute expiry for playback

    if (error) {
      console.error('Failed to get signed URL:', error.message);
      return null;
    }
    return data.signedUrl;
  },
};

// ===========================================
// EDGE FUNCTION CALLERS
// ===========================================

export const edgeFunctions = {
  /** Call the transcription Edge Function */
  async transcribe(audioPath: string) {
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { audioPath },
    });

    if (error) {
      console.error('Transcription failed:', error.message);
      return { success: false, error: error.message };
    }
    return data;
  },

  /** Call the extraction Edge Function */
  async extract(
    transcript: string,
    preSelected?: {
      mode?: string;
      kind?: string;
      duration?: number;
      spar?: boolean;
    }
  ) {
    const { data, error } = await supabase.functions.invoke('extract-session', {
      body: {
        transcript,
        preSelectedMode: preSelected?.mode,
        preSelectedKind: preSelected?.kind,
        preSelectedDuration: preSelected?.duration,
        preSelectedSpar: preSelected?.spar,
      },
    });

    if (error) {
      console.error('Extraction failed:', error.message);
      return { success: false, error: error.message, data: null, metadata: {} };
    }
    return data;
  },
};

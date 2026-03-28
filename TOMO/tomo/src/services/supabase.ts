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
import * as FileSystem from 'expo-file-system/legacy';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Session,
  SessionInsert,
  SessionUpdate,
  TrainingMode,
  TranscriptionResponse,
  ExtractionResponse,
} from '../types/mvp-types';
import { logger } from '../utils/logger';

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
// SHARED HELPERS
// ===========================================

/** Decode a base64 string to Uint8Array. Uses atob when available, manual decode for older Hermes. */
function decodeBase64ToBytes(base64Data: string): Uint8Array {
  let binaryString: string;
  if (typeof atob === 'function') {
    binaryString = atob(base64Data);
  } else {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    const padded = base64Data + '='.repeat((4 - (base64Data.length % 4)) % 4);
    const str = padded.replace(/=+$/, '');
    while (i < str.length) {
      const a = chars.indexOf(str.charAt(i++));
      const b = chars.indexOf(str.charAt(i++));
      const c = chars.indexOf(str.charAt(i++));
      const d = chars.indexOf(str.charAt(i++));
      const n = (a << 18) | (b << 12) | (c << 6) | d;
      result += String.fromCharCode((n >> 16) & 0xff);
      if (c !== -1) result += String.fromCharCode((n >> 8) & 0xff);
      if (d !== -1) result += String.fromCharCode(n & 0xff);
    }
    binaryString = result;
  }
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

  /** Create a new session. Throws on failure. */
  async create(session: SessionInsert): Promise<Session> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

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
      throw new Error(`Failed to create session: ${error.message}`);
    }
    return data as Session;
  },

  /** Update a session. Throws on failure. */
  async update(id: string, updates: SessionUpdate): Promise<Session> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        edited_after_ai: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update session:', error.message);
      throw new Error(`Failed to update session: ${error.message}`);
    }
    return data as Session;
  },

  /** Soft-delete a session (sets deleted_at, keeps data in DB). Throws on failure. */
  async softDelete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('sessions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete session:', error.message);
      throw new Error(`Failed to delete session: ${error.message}`);
    }
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

  /** Fetch unique past techniques and submissions for autocomplete suggestions */
  async getAutocompleteHistory(): Promise<{
    techniques: string[];
    submissions: string[];
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { techniques: [], submissions: [] };

    const { data, error } = await supabase
      .from('sessions')
      .select('techniques_drilled, submissions_given, submissions_received')
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (error || !data) return { techniques: [], submissions: [] };

    const techniqueSet = new Set<string>();
    const submissionSet = new Set<string>();

    for (const session of data) {
      if (Array.isArray(session.techniques_drilled)) {
        for (const t of session.techniques_drilled) {
          if (t) techniqueSet.add(t);
        }
      }
      if (Array.isArray(session.submissions_given)) {
        for (const s of session.submissions_given) {
          if (s?.type) submissionSet.add(s.type);
        }
      }
      if (Array.isArray(session.submissions_received)) {
        for (const s of session.submissions_received) {
          if (s?.type) submissionSet.add(s.type);
        }
      }
    }

    return {
      techniques: Array.from(techniqueSet),
      submissions: Array.from(submissionSet),
    };
  },
};

// ===========================================
// AUDIO STORAGE SERVICE
// ===========================================

export const audioService = {
  /** Upload an audio recording to the private bucket */
  async upload(sessionId: string, fileUri: string): Promise<string | null> {
    await ensureFreshToken();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const storagePath = `${user.id}/${sessionId}.m4a`;
    logger.log('[Audio] Uploading from:', fileUri, 'to:', storagePath);

    // expo-av writes recordings to a persistent cache URI that's reliably accessible
    let base64Data: string;
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      logger.log('[Audio] File info:', JSON.stringify(fileInfo));
      if (!fileInfo.exists) {
        console.error('[Audio] File does not exist at:', fileUri);
        return null;
      }
      logger.log('[Audio] File size:', fileInfo.size, 'bytes');
      base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      logger.log('[Audio] Read base64, length:', base64Data.length);
      // NOTE: Do NOT delete the local file here. It must survive until the full
      // pipeline succeeds and the session is saved, so the offline queue can
      // retry if upload fails. Cleanup happens in useVoiceRecorder.cleanupFile().
    } catch (readErr: any) {
      console.error('[Audio] Failed to read file:', readErr?.message);
      return null;
    }

    const bytes = decodeBase64ToBytes(base64Data);
    logger.log('[Audio] Decoded to', bytes.length, 'bytes');

    const { error } = await supabase.storage
      .from('audio-recordings')
      .upload(storagePath, bytes, {
        contentType: 'audio/mp4',
        upsert: true,
      });

    if (error) {
      console.error('[Audio] Upload failed:', error.message);
      return null;
    }
    logger.log('[Audio] Upload succeeded');
    return storagePath;
  },

  /** Delete an audio recording from storage */
  async delete(audioPath: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from('audio-recordings')
      .remove([audioPath]);

    if (error) {
      console.error('Failed to delete audio:', error.message);
      return false;
    }
    return true;
  },

};

// ===========================================
// AVATAR STORAGE SERVICE
// ===========================================

export const avatarService = {
  /** Upload avatar image from a local file URI, returns the storage path */
  async upload(fileUri: string): Promise<string | null> {
    await ensureFreshToken();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const storagePath = `${user.id}/avatar.jpg`;

    let base64Data: string;
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) return null;
      base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch {
      console.error('[Avatar] Failed to read file');
      return null;
    }

    const bytes = decodeBase64ToBytes(base64Data);

    const { error } = await supabase.storage
      .from('profile-avatars')
      .upload(storagePath, bytes, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('[Avatar] Upload failed:', error.message);
      return null;
    }
    return storagePath;
  },

  /** Get a signed URL for an avatar (valid 1 hour) */
  async getSignedUrl(storagePath: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('profile-avatars')
      .createSignedUrl(storagePath, 3600);

    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  },

  /** Delete avatar from storage */
  async delete(storagePath: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from('profile-avatars')
      .remove([storagePath]);
    if (error) {
      console.error('[Avatar] Delete failed:', error.message);
      return false;
    }
    return true;
  },
};

// ===========================================
// EDGE FUNCTION CALLERS
// ===========================================

/** Ensure the Supabase session token is fresh before calling edge functions */
/**
 * Refresh the token once, then reuse for the rest of the pipeline.
 *
 * Why we DON'T refresh before every call: Supabase rotates the refresh token
 * on each refreshSession() call. Rapid back-to-back rotations (upload → transcribe
 * → extract) can cause the server to invalidate the token before the next call
 * processes, resulting in "Invalid JWT" on the 3rd call.
 *
 * Instead: refresh once if the token expires within 5 minutes. A fresh token
 * lasts 1 hour — more than enough for the full pipeline (~30-60s).
 */
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL_MS = 30_000; // Don't refresh more than once per 30s

async function ensureFreshToken(): Promise<void> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    logger.log('[EdgeFn] No active session, attempting refresh...');
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('[EdgeFn] Token refresh failed:', refreshError.message);
    }
    return;
  }

  const now = Date.now();
  const expiresAt = (session.expires_at ?? 0) * 1000; // convert to ms
  const timeUntilExpiry = expiresAt - now;

  // Only refresh if token expires within 5 minutes AND we haven't refreshed recently
  if (timeUntilExpiry < 300_000 && (now - lastRefreshTime) > MIN_REFRESH_INTERVAL_MS) {
    logger.log('[EdgeFn] Token expires in', Math.round(timeUntilExpiry / 1000), 's — refreshing...');
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('[EdgeFn] Token refresh failed:', refreshError.message);
    } else {
      lastRefreshTime = now;
      logger.log('[EdgeFn] Token refreshed successfully');
    }
  } else {
    logger.log('[EdgeFn] Token valid for', Math.round(timeUntilExpiry / 1000), 's — no refresh needed');
  }
}

/**
 * Parse edge function error details from supabase-js v2 error object.
 * Non-2xx responses put the response body in error.context.
 */
async function parseEdgeFnError(error: Error): Promise<{ detail: string; status?: number }> {
  const ctx = (error as any).context;
  let detail = error.message;
  let status: number | undefined;

  if (ctx && typeof ctx === 'object') {
    status = typeof ctx.status === 'number' ? ctx.status : undefined;
    try {
      const body = await ctx.json?.();
      detail = body?.error || body?.message || JSON.stringify(body) || detail;
      console.error('[EdgeFn] Edge function error body:', JSON.stringify(body));
    } catch {
      console.error('[EdgeFn] Could not parse error context');
    }
  }
  return { detail, status };
}

export const edgeFunctions = {
  /** Call the transcription Edge Function (with retry on 401) */
  async transcribe(audioPath: string): Promise<TranscriptionResponse> {
    logger.log('[EdgeFn] Calling transcribe-audio with path:', audioPath);
    await ensureFreshToken();
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { audioPath },
    });

    logger.log('[EdgeFn] transcribe response - data:', JSON.stringify(data)?.slice(0, 500));
    logger.log('[EdgeFn] transcribe response - error:', error ? JSON.stringify({ message: error.message, name: error.name }) : 'none');

    if (error) {
      const { detail, status } = await parseEdgeFnError(error);

      // Retry once on 401 — token may have expired mid-pipeline
      if (status === 401) {
        logger.log('[EdgeFn] Got 401 on transcribe — refreshing token and retrying...');
        const { error: refreshErr } = await supabase.auth.refreshSession();
        if (!refreshErr) {
          lastRefreshTime = Date.now();
          const { data: retryData, error: retryError } = await supabase.functions.invoke('transcribe-audio', {
            body: { audioPath },
          });
          if (!retryError) return retryData as TranscriptionResponse;
          const retryParsed = await parseEdgeFnError(retryError);
          console.error('[EdgeFn] Transcription retry also failed:', retryParsed.detail);
          return { success: false, error: retryParsed.detail };
        }
      }

      console.error('[EdgeFn] Transcription failed:', detail);
      return { success: false, error: detail };
    }
    return data as TranscriptionResponse;
  },

  /** Call the extraction Edge Function (with retry on 401) */
  async extract(
    transcript: string,
    preSelected?: {
      mode?: string;
      kind?: string;
      duration?: number;
      spar?: boolean;
    }
  ): Promise<ExtractionResponse> {
    await ensureFreshToken();
    const body = {
      transcript,
      preSelectedMode: preSelected?.mode,
      preSelectedKind: preSelected?.kind,
      preSelectedDuration: preSelected?.duration,
      preSelectedSpar: preSelected?.spar,
    };
    const { data, error } = await supabase.functions.invoke('extract-session', { body });

    if (error) {
      const { detail, status } = await parseEdgeFnError(error);

      // Retry once on 401 — token may have expired mid-pipeline
      if (status === 401) {
        logger.log('[EdgeFn] Got 401 on extract — refreshing token and retrying...');
        const { error: refreshErr } = await supabase.auth.refreshSession();
        if (!refreshErr) {
          lastRefreshTime = Date.now();
          const { data: retryData, error: retryError } = await supabase.functions.invoke('extract-session', { body });
          if (!retryError) return retryData as ExtractionResponse;
          const retryParsed = await parseEdgeFnError(retryError);
          console.error('[EdgeFn] Extraction retry also failed:', retryParsed.detail);
          return { success: false, error: retryParsed.detail, data: null, metadata: { model: '', schema_version: 1 } };
        }
      }

      console.error('[EdgeFn] Extraction failed:', detail);
      return { success: false, error: detail, data: null, metadata: { model: '', schema_version: 1 } };
    }
    return data as ExtractionResponse;
  },
};

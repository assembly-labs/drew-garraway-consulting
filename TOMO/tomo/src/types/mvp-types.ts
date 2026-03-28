/**
 * TOMO MVP 1.0 — TypeScript Types
 *
 * These are the canonical types for the iOS app. They match the SQL schema
 * in supabase-migration.sql and the data models in FEATURE_SPEC.md.
 *
 * KEY DIFFERENCE FROM PROTOTYPE:
 * - Prototype uses `training_type` (combined: gi/nogi/openmat/drilling/etc.)
 * - MVP splits into `training_mode` (what you wore) + `session_kind` (what you did)
 * - Prototype `Profile` is simpler — MVP adds full gym fields, training_goals, experience_level
 * - MVP adds pipeline metadata fields on Session for tracking AI quality
 */

// ===========================================
// ENUMS
// ===========================================

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

/** What you wore — gi, no-gi, or other */
export type TrainingMode = 'gi' | 'nogi' | 'other';

/** What you did — regular class, open mat, competition training, or other */
export type SessionKind = 'class' | 'open_mat' | 'competition_training' | 'other';

export type LoggingPreference = 'voice' | 'text';

export type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'experienced';

export type TranscriptionStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export type ExtractionStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export type InputMethod = 'voice' | 'text';

export type LocationPermission = 'granted' | 'denied' | 'skipped';

// ===========================================
// PROFILE
// ===========================================

export interface Profile {
  id: string; // UUID, matches auth.users.id
  name: string;
  belt: BeltLevel;
  stripes: number; // 0-4
  gym_id: string | null;
  gym_name: string;
  gym_is_custom: boolean;
  gym_city: string | null;
  gym_state: string | null;
  gym_affiliation: string | null;
  gym_lat: number | null;
  gym_lng: number | null;
  location_permission: LocationPermission;
  target_frequency: number; // sessions per week (2, 4, or 5)
  logging_preference: LoggingPreference;
  onboarding_complete: boolean;
  session_count: number;
  training_goals: string[] | null; // e.g. ['competition', 'fitness']
  experience_level: ExperienceLevel | null;
  avatar_url: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/** Fields required to create a new profile (during onboarding) */
export interface ProfileInsert {
  name: string;
  belt: BeltLevel;
  stripes: number;
  gym_id?: string | null;
  gym_name: string;
  gym_is_custom?: boolean;
  gym_city?: string | null;
  gym_state?: string | null;
  gym_affiliation?: string | null;
  gym_lat?: number | null;
  gym_lng?: number | null;
  location_permission?: LocationPermission;
  target_frequency: number;
  logging_preference: LoggingPreference;
  training_goals?: string[] | null;
  experience_level?: ExperienceLevel | null;
  onboarding_complete?: boolean;
}

/** Fields that can be updated on a profile */
export interface ProfileUpdate {
  name?: string;
  belt?: BeltLevel;
  stripes?: number;
  gym_id?: string | null;
  gym_name?: string;
  gym_is_custom?: boolean;
  gym_city?: string | null;
  gym_state?: string | null;
  gym_affiliation?: string | null;
  gym_lat?: number | null;
  gym_lng?: number | null;
  location_permission?: LocationPermission;
  target_frequency?: number;
  logging_preference?: LoggingPreference;
  training_goals?: string[] | null;
  experience_level?: ExperienceLevel | null;
  session_count?: number; // managed by app after session create; not shown in UI
  avatar_url?: string | null;
}

// ===========================================
// SESSION
// ===========================================

export interface Session {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM
  training_mode: TrainingMode;
  session_kind: SessionKind;
  duration_minutes: number;
  warmed_up: boolean | null;
  did_spar: boolean;
  sparring_rounds: number | null;
  techniques_drilled: string[];
  submissions_given: Submission[];
  submissions_received: Submission[];
  injuries: string[];
  instructor: string | null;
  lesson_topic: string | null;
  notes: string | null;
  transcript: string | null;
  audio_path: string | null; // private storage path, NOT a URL
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null; // soft delete — null means active

  // Gym reference (which gym this session was logged at)
  user_gym_id: string | null;

  // Pipeline metadata (internal, not shown in UI)
  input_method: InputMethod;
  transcription_status: TranscriptionStatus | null;
  extraction_status: ExtractionStatus | null;
  edited_after_ai: boolean;
  schema_version: number;
  extraction_model: string | null;
  transcription_error: string | null;
  extraction_error: string | null;
}

export interface Submission {
  type: string; // e.g. "armbar", "triangle choke"
  count: number;
}

/** Fields for creating a new session */
export interface SessionInsert {
  date: string;
  time?: string | null;
  training_mode: TrainingMode;
  session_kind: SessionKind;
  duration_minutes: number;
  warmed_up?: boolean | null;
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques_drilled?: string[];
  submissions_given?: Submission[];
  submissions_received?: Submission[];
  injuries?: string[];
  instructor?: string | null;
  lesson_topic?: string | null;
  notes?: string | null;
  transcript?: string | null;
  audio_path?: string | null;
  user_gym_id?: string | null;
  input_method: InputMethod;
  transcription_status?: TranscriptionStatus;
  extraction_status?: ExtractionStatus;
  extraction_model?: string | null;
  transcription_error?: string | null;
  extraction_error?: string | null;
  schema_version?: number;
  edited_after_ai?: boolean;
}

/** Fields that can be updated on a session */
export interface SessionUpdate {
  date?: string;
  time?: string | null;
  training_mode?: TrainingMode;
  session_kind?: SessionKind;
  duration_minutes?: number;
  warmed_up?: boolean | null;
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques_drilled?: string[];
  submissions_given?: Submission[];
  submissions_received?: Submission[];
  injuries?: string[];
  instructor?: string | null;
  lesson_topic?: string | null;
  notes?: string | null;
  edited_after_ai?: boolean;
  // Pipeline metadata (also updatable for offline queue retries)
  transcript?: string | null;
  audio_path?: string | null;
  transcription_status?: TranscriptionStatus;
  extraction_status?: ExtractionStatus;
  transcription_error?: string | null;
  extraction_error?: string | null;
  extraction_model?: string | null;
  schema_version?: number;
}

// ===========================================
// GYM (reused from prototype — direct copy)
// ===========================================

export interface Gym {
  id: string;
  name: string;
  affiliation: string | null;
  city: string;
  stateOrCountry: string;
  isHeadquarters?: boolean;
  aliases?: string[];
}

// ===========================================
// USER GYM (gym history / relationships)
// ===========================================

export type GymRelationship = 'home' | 'drop_in' | 'seminar' | 'open_mat';

export interface UserGym {
  id: string;           // UUID
  user_id: string;      // UUID, references profiles.id
  gym_id: string | null; // UUID, references gyms.id (null for custom)
  gym_name: string;
  gym_city: string | null;
  gym_state: string | null;
  gym_affiliation: string | null;
  gym_lat: number | null;
  gym_lng: number | null;
  is_primary: boolean;
  relationship: GymRelationship;
  started_at: string;   // YYYY-MM-DD
  ended_at: string | null; // YYYY-MM-DD, null = still active
  notes: string | null;
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp
}

export interface UserGymInsert {
  gym_id?: string | null;
  gym_name: string;
  gym_city?: string | null;
  gym_state?: string | null;
  gym_affiliation?: string | null;
  gym_lat?: number | null;
  gym_lng?: number | null;
  is_primary?: boolean;
  relationship?: GymRelationship;
  started_at?: string;
  ended_at?: string | null;
  notes?: string | null;
}

// ===========================================
// EXTRACTION (AI pipeline)
// ===========================================

/** What Claude Haiku returns after parsing a transcript */
export interface ExtractionResult {
  durationMinutes: number | null;
  trainingMode: TrainingMode | null;
  warmedUp: boolean | null;
  sessionKind: SessionKind | null;
  techniquesDrilled: string[];
  didSpar: boolean | null;
  sparringRounds: number | null;
  submissionsGiven: Submission[];
  submissionsReceived: Submission[];
  injuries: string[];
  instructor: string | null;
  lessonTopic: string | null;
  rawNotes: string | null;
}

/** Full response from the extract-session Edge Function */
export interface ExtractionResponse {
  success: boolean;
  data: ExtractionResult | null;
  error: string | null;
  metadata: {
    model: string;
    schema_version: number;
  };
}

/** Response from the transcribe-audio Edge Function */
export interface TranscriptionResponse {
  success: boolean;
  transcript?: string;
  confidence?: number;
  words?: number;
  error?: string;
}


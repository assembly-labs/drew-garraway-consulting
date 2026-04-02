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

/** What you wore — gi, no-gi, or mixed */
export type TrainingMode = 'gi' | 'nogi' | 'mixed' | 'unknown';

/** What you did — class, open mat, drilling, competition, or other */
export type SessionKind = 'class' | 'open_mat' | 'drilling' | 'competition' | 'other';

export type LoggingPreference = 'voice' | 'text';

export type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'experienced';

export type TranscriptionStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export type ExtractionStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export type InputMethod = 'voice' | 'text';

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
  target_frequency: number; // sessions per week (2, 4, or 5)
  logging_preference: LoggingPreference;
  onboarding_complete: boolean;
  session_count: number;
  training_goals: string[] | null; // e.g. ['competition', 'fitness']
  experience_level: ExperienceLevel | null;
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
  target_frequency?: number;
  logging_preference?: LoggingPreference;
  training_goals?: string[] | null;
  experience_level?: ExperienceLevel | null;
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
  did_spar: boolean;
  sparring_rounds: number | null;
  techniques_drilled: string[];
  submissions_given: Submission[];
  submissions_received: Submission[];
  worked_well: string[];
  struggles: string[];
  injuries: string[];
  lesson_topic: string | null;
  notes: string | null;
  energy_level: 1 | 2 | 3 | 4 | 5 | null;
  mood: 1 | 2 | 3 | 4 | 5 | null;
  transcript: string | null;
  audio_path: string | null; // private storage path, NOT a URL
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null; // soft delete — null means active

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
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques_drilled?: string[];
  submissions_given?: Submission[];
  submissions_received?: Submission[];
  worked_well?: string[];
  struggles?: string[];
  injuries?: string[];
  lesson_topic?: string | null;
  notes?: string | null;
  energy_level?: 1 | 2 | 3 | 4 | 5 | null;
  mood?: 1 | 2 | 3 | 4 | 5 | null;
  transcript?: string | null;
  audio_path?: string | null;
  input_method: InputMethod;
  transcription_status?: TranscriptionStatus;
  extraction_status?: ExtractionStatus;
  extraction_model?: string | null;
}

/** Fields that can be updated on a session */
export interface SessionUpdate {
  date?: string;
  time?: string | null;
  training_mode?: TrainingMode;
  session_kind?: SessionKind;
  duration_minutes?: number;
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques_drilled?: string[];
  submissions_given?: Submission[];
  submissions_received?: Submission[];
  worked_well?: string[];
  struggles?: string[];
  injuries?: string[];
  lesson_topic?: string | null;
  notes?: string | null;
  energy_level?: 1 | 2 | 3 | 4 | 5 | null;
  mood?: 1 | 2 | 3 | 4 | 5 | null;
  edited_after_ai?: boolean;
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

export interface GymSelection {
  gymId: string;
  gymName: string;
  isCustom: boolean;
  city?: string;
  stateOrCountry?: string;
  affiliation?: string;
}

// ===========================================
// EXTRACTION (AI pipeline)
// ===========================================

/** What Claude Haiku returns after parsing a transcript */
export interface ExtractionResult {
  durationMinutes: number | null;
  trainingMode: TrainingMode | null;
  sessionKind: SessionKind | null;
  techniquesDrilled: string[];
  didSpar: boolean | null;
  sparringRounds: number | null;
  submissionsGiven: Submission[];
  submissionsReceived: Submission[];
  workedWell: string[];
  struggles: string[];
  injuries: string[];
  energyLevel: 1 | 2 | 3 | 4 | 5 | null;
  mood: 1 | 2 | 3 | 4 | 5 | null;
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

// ===========================================
// API HELPERS
// ===========================================

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string; code: string } | null;
}

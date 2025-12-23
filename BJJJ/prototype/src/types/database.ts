/**
 * Database Types
 *
 * TypeScript interfaces that mirror the Supabase database schema.
 * These types are used throughout the app and will work with both:
 * - localStorage (current prototype)
 * - Supabase API (iOS production)
 *
 * Schema documented in: /internal-docs/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md
 */

// ===========================================
// ENUMS
// ===========================================

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type TrainingType = 'gi' | 'nogi' | 'openmat' | 'private' | 'competition';
export type ProficiencyLevel = 'learning' | 'developing' | 'proficient' | 'advanced';
export type LoggingPreference = 'voice' | 'text' | 'undecided';

// ===========================================
// PROFILES TABLE
// ===========================================

export interface Profile {
  id: string; // UUID, references auth.users
  name: string;
  belt_level: BeltLevel;
  stripes: number; // 0-4
  gym_name: string | null;
  training_start_date: string | null; // ISO date
  target_frequency: number | null; // sessions per week
  logging_preference: LoggingPreference;
  onboarding_complete: boolean;
  session_count: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Insert type (for creating new profiles)
export interface ProfileInsert {
  id: string;
  name: string;
  belt_level?: BeltLevel;
  stripes?: number;
  gym_name?: string | null;
  training_start_date?: string | null;
  target_frequency?: number | null;
  logging_preference?: LoggingPreference;
  onboarding_complete?: boolean;
  session_count?: number;
}

// Update type (for partial updates)
export interface ProfileUpdate {
  name?: string;
  belt_level?: BeltLevel;
  stripes?: number;
  gym_name?: string | null;
  training_start_date?: string | null;
  target_frequency?: number | null;
  logging_preference?: LoggingPreference;
  onboarding_complete?: boolean;
  session_count?: number;
  updated_at?: string;
}

// ===========================================
// SESSIONS TABLE
// ===========================================

export interface Session {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  date: string; // ISO date
  time: string | null; // e.g., "18:30"
  training_type: TrainingType;
  duration_minutes: number | null;
  sparring_rounds: number | null;
  techniques: string[]; // Array of technique names
  worked_well: string[]; // Things that went well
  struggles: string[]; // Areas of difficulty
  notes: string | null;
  voice_transcript: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Insert type
export interface SessionInsert {
  user_id: string;
  date: string;
  training_type: TrainingType;
  time?: string | null;
  duration_minutes?: number | null;
  sparring_rounds?: number | null;
  techniques?: string[];
  worked_well?: string[];
  struggles?: string[];
  notes?: string | null;
  voice_transcript?: string | null;
}

// Update type
export interface SessionUpdate {
  date?: string;
  time?: string | null;
  training_type?: TrainingType;
  duration_minutes?: number | null;
  sparring_rounds?: number | null;
  techniques?: string[];
  worked_well?: string[];
  struggles?: string[];
  notes?: string | null;
  voice_transcript?: string | null;
  updated_at?: string;
}

// ===========================================
// TECHNIQUE PROGRESS TABLE
// ===========================================

export interface TechniqueProgress {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  technique_id: string; // Reference to technique catalog
  proficiency: ProficiencyLevel;
  times_drilled: number;
  times_used_live: number;
  success_rate: number | null; // 0.00 to 1.00
  notes: string | null;
  last_practiced: string | null; // ISO date
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Insert type
export interface TechniqueProgressInsert {
  user_id: string;
  technique_id: string;
  proficiency?: ProficiencyLevel;
  times_drilled?: number;
  times_used_live?: number;
  success_rate?: number | null;
  notes?: string | null;
  last_practiced?: string | null;
}

// Update type
export interface TechniqueProgressUpdate {
  proficiency?: ProficiencyLevel;
  times_drilled?: number;
  times_used_live?: number;
  success_rate?: number | null;
  notes?: string | null;
  last_practiced?: string | null;
  updated_at?: string;
}

// ===========================================
// TECHNIQUE CATALOG (Static Reference Data)
// ===========================================

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  subcategory: string | null;
  description: string | null;
  position_start: string | null;
  position_end: string | null;
  belt_requirement: BeltLevel; // Minimum belt typically learned
  is_competition_legal: boolean;
  gi_only: boolean;
  nogi_only: boolean;
  key_details: string[];
  common_mistakes: string[];
  video_url: string | null;
}

export type TechniqueCategory =
  | 'takedown'
  | 'guard'
  | 'pass'
  | 'sweep'
  | 'submission'
  | 'escape'
  | 'control'
  | 'transition';

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===========================================
// QUERY FILTERS
// ===========================================

export interface SessionFilters {
  startDate?: string;
  endDate?: string;
  trainingType?: TrainingType;
  limit?: number;
  offset?: number;
}

export interface TechniqueFilters {
  category?: TechniqueCategory;
  beltLevel?: BeltLevel;
  search?: string;
  giOnly?: boolean;
  nogiOnly?: boolean;
}

// ===========================================
// SESSION DATA (for logging flow)
// ===========================================

/**
 * SessionData is used during the session logging flow.
 * This is the in-memory representation before saving to database.
 */
export interface SessionData {
  date: string; // ISO date string
  time: string; // e.g., "18:30"
  dayOfWeek: string; // e.g., "Monday"
  trainingType: TrainingType | null;
  durationMinutes: number | null;
  sparringRounds: number | null;
  techniques: string[];
  workedWell: string[];
  struggles: string[];
  rawText?: string; // Original text input (TextLogger)
  voiceTranscript?: string; // Voice transcription (VoiceLogger)
}

/**
 * Default empty session data for initializing logging flow
 */
export const DEFAULT_SESSION_DATA: SessionData = {
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  trainingType: null,
  durationMinutes: null,
  sparringRounds: null,
  techniques: [],
  workedWell: [],
  struggles: [],
};

// ===========================================
// AGGREGATED STATS
// ===========================================

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  totalSparringRounds: number;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  averageSessionDuration: number;
  mostPracticedTechniques: string[];
  recentActivity: Session[];
}

export interface ProgressStats {
  beltProgress: number; // 0-100 percentage toward next belt
  techniquesLearned: number;
  techniquesProficient: number;
  daysAtCurrentBelt: number;
  estimatedTimeToNextBelt: number | null; // days
}

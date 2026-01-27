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
/** @deprecated Use BeltLevel - kept for backwards compatibility */
export type BeltColor = BeltLevel;
export type TrainingType = 'gi' | 'nogi' | 'openmat' | 'drilling' | 'private' | 'competition';
export type ProficiencyLevel = 'learning' | 'developing' | 'proficient' | 'advanced';
export type LoggingPreference = 'voice' | 'text' | 'undecided';
export type PracticeLogSource = 'technique_library' | 'session_logger' | 'quick_add';

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

  // Learning/Drilling section
  lesson_topic: string | null; // What did the coach teach today?
  techniques_drilled: string[]; // What techniques were practiced?

  // Sparring section (gated by did_spar)
  did_spar: boolean;
  sparring_rounds: number | null;

  // Legacy field - prefer techniques_drilled
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
  lesson_topic?: string | null;
  techniques_drilled?: string[];
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques?: string[]; // Legacy
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
  lesson_topic?: string | null;
  techniques_drilled?: string[];
  did_spar?: boolean;
  sparring_rounds?: number | null;
  techniques?: string[]; // Legacy
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
 *
 * DATA COLLECTION PHILOSOPHY:
 * Only collect data users will reliably provide (exhausted post-training).
 * See: Data Science Audit (Dec 2024) for reliability analysis.
 */
export interface SessionData {
  // Auto-captured
  date: string; // ISO date string
  time: string; // e.g., "18:30"
  dayOfWeek: string; // e.g., "Monday"

  // Quick context (3 taps max)
  trainingType: TrainingType | null;
  durationMinutes: number | null;

  // Learning section (what did you learn/drill today?)
  lessonTopic: string | null; // What did the coach teach?
  techniquesDrilled: string[]; // What techniques were practiced?

  // Sparring section (gated by didSpar)
  didSpar: boolean;
  sparringRounds: number | null;
  submissionsGiven: SubmissionCount[]; // Technique with count (e.g., 3 armbars)
  submissionsReceived: SubmissionCount[]; // Technique with count

  // Qualitative (parsed from voice/text)
  workedWell: string[];
  struggles: string[];

  // Legacy fields
  techniques: string[]; // Deprecated: use techniquesDrilled

  // Raw input
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
  lessonTopic: null,
  techniquesDrilled: [],
  didSpar: false,
  sparringRounds: null,
  submissionsGiven: [],
  submissionsReceived: [],
  workedWell: [],
  struggles: [],
  techniques: [], // Legacy
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

// ===========================================
// SUBMISSIONS TABLE
// ===========================================

export type SubmissionOutcome = 'given' | 'received';
export type BodyRegion = 'neck' | 'shoulders' | 'elbows' | 'wrists' | 'knees' | 'ankles';

/**
 * Submission with count - for tracking multiple of the same submission in a session
 * e.g., { name: 'Armbar', count: 3 } means 3 armbars in one session
 */
export interface SubmissionCount {
  name: string;
  count: number;
}

export interface SubmissionRecord {
  id: string; // UUID
  session_id: string; // UUID, references sessions.id
  user_id: string; // UUID, references profiles.id
  technique_name: string; // e.g., "Armbar", "Triangle"
  outcome: SubmissionOutcome;
  body_region: BodyRegion; // Derived from technique
  date: string; // ISO date (denormalized for fast queries)
  created_at: string; // ISO timestamp

  // DEPRECATED: Users don't reliably provide these (see Data Science Audit Dec 2024)
  // Kept for backwards compatibility but not collected in new sessions
  partner_belt?: BeltLevel | null; // DEPRECATED: Users roll with multiple partners, don't know belts
  position?: string | null; // DEPRECATED: Users don't remember position context
}

// Insert type
export interface SubmissionInsert {
  session_id: string;
  user_id: string;
  technique_name: string;
  outcome: SubmissionOutcome;
  date: string;
  // DEPRECATED: Not collected in new sessions
  partner_belt?: BeltLevel | null;
  position?: string | null;
}

// ===========================================
// TECHNIQUE TO BODY REGION MAPPING
// ===========================================

/**
 * Maps submission techniques to their target body region
 * Used for heat map visualization
 *
 * Granular regions:
 * - neck: chokes/strangles
 * - shoulders: shoulder locks (kimura, americana)
 * - elbows: armbars, omoplata
 * - wrists: wristlocks
 * - knees: kneebars, calf slicers
 * - ankles: ankle locks, heel hooks, toe holds
 */
export const TECHNIQUE_BODY_MAP: Record<string, BodyRegion> = {
  // Neck/Head submissions (chokes, strangles)
  'rnc': 'neck',
  'rear naked choke': 'neck',
  'rear naked': 'neck',
  'guillotine': 'neck',
  'triangle': 'neck',
  'triangle choke': 'neck',
  'darce': 'neck',
  'd\'arce': 'neck',
  'anaconda': 'neck',
  'anaconda choke': 'neck',
  'ezekiel': 'neck',
  'ezekiel choke': 'neck',
  'cross collar choke': 'neck',
  'cross collar': 'neck',
  'collar choke': 'neck',
  'bow and arrow': 'neck',
  'bow and arrow choke': 'neck',
  'baseball bat choke': 'neck',
  'baseball bat': 'neck',
  'baseball choke': 'neck',
  'north south choke': 'neck',
  'north-south choke': 'neck',
  'arm triangle': 'neck',
  'arm-triangle': 'neck',
  'head and arm choke': 'neck',
  'kata gatame': 'neck',
  'loop choke': 'neck',
  'clock choke': 'neck',
  'paper cutter': 'neck',
  'paper cutter choke': 'neck',
  'breadcutter': 'neck',
  'breadcutter choke': 'neck',
  'von flue choke': 'neck',
  'von flue': 'neck',
  'gogoplata': 'neck',
  'peruvian necktie': 'neck',
  'japanese necktie': 'neck',
  'brabo choke': 'neck',
  'brabo': 'neck',

  // Shoulder submissions (shoulder locks)
  'kimura': 'shoulders',
  'double wristlock': 'shoulders',
  'americana': 'shoulders',
  'keylock': 'shoulders',
  'key lock': 'shoulders',
  'tarikoplata': 'shoulders',
  'baratoplata': 'shoulders',
  'monoplata': 'shoulders',

  // Elbow submissions (armbars)
  'armbar': 'elbows',
  'arm bar': 'elbows',
  'juji gatame': 'elbows',
  'omoplata': 'elbows',
  'straight armlock': 'elbows',
  'straight arm lock': 'elbows',
  'bicep slicer': 'elbows',
  'bicep crusher': 'elbows',

  // Wrist submissions (wristlocks)
  'wristlock': 'wrists',
  'wrist lock': 'wrists',
  'gooseneck': 'wrists',

  // Knee submissions (kneebars, calf slicers)
  'kneebar': 'knees',
  'knee bar': 'knees',
  'calf slicer': 'knees',
  'calf crusher': 'knees',
  'texas cloverleaf': 'knees',
  'electric chair': 'knees',
  'banana split': 'knees',
  'vaporizer': 'knees',
  'twister': 'knees', // Technically spine but often grouped with leg attacks

  // Ankle submissions (ankle locks, heel hooks, toe holds)
  'heel hook': 'ankles',
  'inside heel hook': 'ankles',
  'outside heel hook': 'ankles',
  'toe hold': 'ankles',
  'toehold': 'ankles',
  'ankle lock': 'ankles',
  'straight ankle lock': 'ankles',
  'straight ankle': 'ankles',
  'achilles lock': 'ankles',
  'estima lock': 'ankles',
  'aoki lock': 'ankles',
};

/**
 * Get body region for a technique name
 * Falls back to 'neck' if unknown (most submissions target upper body)
 */
export function getBodyRegion(techniqueName: string): BodyRegion {
  const normalized = techniqueName.toLowerCase().trim();
  return TECHNIQUE_BODY_MAP[normalized] || 'neck';
}

// ===========================================
// SUBMISSION STATS (Computed)
// ===========================================

export interface SubmissionStats {
  totalGiven: number;
  totalReceived: number;

  // Deadliest attack (only shown if totalGiven >= 50)
  deadliestAttack: {
    technique: string;
    count: number;
  } | null;

  // Achilles heel (only for white/blue belts)
  achillesHeel: {
    technique: string;
    count: number;
  } | null;

  // Heat map data
  bodyHeatMap: {
    given: Record<BodyRegion, number>;
    received: Record<BodyRegion, number>;
  };

  // Breakdown by technique
  techniqueBreakdown: {
    given: Array<{ technique: string; count: number }>;
    received: Array<{ technique: string; count: number }>;
  };
}

// ===========================================
// PRACTICE LOGS TABLE
// ===========================================

/**
 * PracticeLog captures deliberate practice events from the Technique Library.
 * Distinct from Session Logging - this is lightweight, single-technique focus.
 *
 * See: /docs/data-and-ai/PRACTICE_TRACKING.md
 */
export interface PracticeLog {
  id: string; // UUID
  user_id: string; // UUID, references profiles.id
  technique_id: string; // Reference to technique catalog
  technique_name: string; // Denormalized for quick display
  position: string; // Technique's position category
  timestamp: string; // ISO 8601 datetime
  source: PracticeLogSource;
  notes: string | null; // Optional quick note
  created_at: string; // ISO timestamp
}

// Insert type
export interface PracticeLogInsert {
  user_id: string;
  technique_id: string;
  technique_name: string;
  position: string;
  source?: PracticeLogSource;
  notes?: string | null;
}

// Filters for querying
export interface PracticeLogFilters {
  startDate?: string;
  endDate?: string;
  techniqueId?: string;
  position?: string;
  limit?: number;
  offset?: number;
}

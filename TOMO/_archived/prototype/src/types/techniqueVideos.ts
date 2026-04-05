/**
 * Technique Videos Types
 *
 * Types for the technique video library and recommendation system.
 * Videos are sourced from curated YouTube content by priority instructors.
 */

import type { BeltLevel, ProficiencyLevel } from './database';

// ===========================================
// VIDEO TYPES
// ===========================================

/**
 * Type of instructional video content
 */
export type VideoType =
  | 'instructional'  // Full technique breakdown (5-15 min)
  | 'quicktip'       // Quick tip or detail (1-3 min)
  | 'competition'    // Competition footage or breakdown
  | 'chain'          // Flow/chain drill connecting techniques
  | 'mindset'        // Mental game, psychology, motivation
  | 'lifestyle';     // Training lifestyle, recovery, longevity

/**
 * Priority instructors per brand philosophy
 *
 * Technique instructors: World-class competitors and coaches
 * Mindset instructors: Respected voices on BJJ psychology and lifestyle
 */
export type Instructor =
  // Technique instructors
  | 'John Danaher'
  | 'Gordon Ryan'
  | 'Lachlan Giles'
  | 'Craig Jones'
  | 'Roger Gracie'
  | 'André Galvão'
  | 'Mikey Musumeci'
  | 'Mayssa Bastos'
  | 'Tom DeBlass'
  | 'Renzo Gracie'
  | 'Leo Vieira'
  | 'Darragh O\'Conaill'
  | 'Fabio Gurgel'
  | 'Stephan Kesting'
  // Mindset & lifestyle instructors
  | 'Chewjitsu'           // Nick Albin - motivation, belt psychology
  | 'Rob Biernacki'       // Conceptual BJJ, older grapplers
  | 'Jon Thomas'          // Training methodology, mindset
  | 'Bernardo Faria'      // Journey stories, motivation
  | 'Firas Zahabi'        // Mental game, training philosophy
  | 'Jocko Willink'       // Discipline, mindset
  | string; // Allow other instructors

/**
 * Gi/No-Gi applicability for videos
 */
export type GiNogiApplicability = 'gi' | 'nogi' | 'both';

/**
 * Difficulty level for belt-appropriate recommendations
 * Matches belt progression:
 * 1-2: White belt fundamentals
 * 3-4: White/Blue transition
 * 5-6: Blue belt
 * 7-8: Purple belt
 * 9-10: Brown/Black belt
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Video production/instructional quality rating
 * 1: Poor quality, hard to follow
 * 2: Acceptable quality
 * 3: Good quality, clear instruction
 * 4: High quality, excellent instruction
 * 5: World-class production and teaching
 */
export type QualityScore = 1 | 2 | 3 | 4 | 5;

/**
 * Conceptual tags for video content
 * Used for cross-video discovery and learning paths
 */
export type ConceptTag =
  | 'weight_distribution'
  | 'leverage'
  | 'timing'
  | 'grip_fighting'
  | 'hip_movement'
  | 'frames'
  | 'pressure'
  | 'angle'
  | 'connection'
  | 'posture'
  | 'base'
  | 'transitions'
  | 'combinations'
  | 'setups'
  | 'counters'
  | 'defense'
  | 'fundamentals'
  | 'competition'
  | 'mindset'
  | 'longevity';

/**
 * A single video entry for a technique
 *
 * CORE FIELDS (required):
 * - technique_id, video_type, youtube_id, instructor, title, duration_seconds
 *
 * ENRICHMENT FIELDS (optional, added during curation):
 * - difficulty_level, belt_prerequisite, gi_nogi, concepts
 * - related_techniques, prerequisites, quality_score
 *
 * CLIP FIELDS (optional, for timestamped segments):
 * - timestamp_start, timestamp_end
 *
 * METADATA FIELDS (optional):
 * - language, has_subtitles, source_channel
 */
export interface TechniqueVideo {
  // === CORE FIELDS (required) ===
  technique_id: string;        // References bjj-techniques CSV technique_id
  video_type: VideoType;
  youtube_id: string;          // YouTube video ID (not full URL)
  instructor: Instructor;
  title: string;
  duration_seconds: number;

  // === ENRICHMENT FIELDS (optional) ===
  /** Difficulty level 1-10, maps to belt progression */
  difficulty_level?: DifficultyLevel;
  /** Minimum belt level to benefit from this video */
  belt_prerequisite?: BeltLevel;
  /** Gi, no-gi, or both */
  gi_nogi?: GiNogiApplicability;
  /** Conceptual tags for cross-video discovery */
  concepts?: ConceptTag[];
  /** Related technique IDs that chain well with this video's technique */
  related_techniques?: string[];
  /** YouTube IDs of videos to watch before this one */
  prerequisites?: string[];
  /** Video production and teaching quality 1-5 */
  quality_score?: QualityScore;

  // === CLIP FIELDS (optional) ===
  /** Start timestamp in seconds (for clips from longer videos) */
  timestamp_start?: number;
  /** End timestamp in seconds (for clips from longer videos) */
  timestamp_end?: number;

  // === METADATA FIELDS (optional) ===
  /** Video language (ISO 639-1 code, e.g., "en", "pt") */
  language?: string;
  /** Whether video has subtitles/captions */
  has_subtitles?: boolean;
  /** YouTube channel name for attribution */
  source_channel?: string;
}

/**
 * Legacy TechniqueVideo type without enrichment fields
 * @deprecated Use TechniqueVideo with optional enrichment fields
 */
export type TechniqueVideoLegacy = Pick<TechniqueVideo,
  'technique_id' | 'video_type' | 'youtube_id' | 'instructor' | 'title' | 'duration_seconds'
>;

/**
 * All videos for a specific technique
 */
export interface TechniqueVideoSet {
  technique_id: string;
  instructional: TechniqueVideo[];
  quicktip: TechniqueVideo[];
  competition: TechniqueVideo[];
  chain: TechniqueVideo[];
}

// ===========================================
// RECOMMENDATION TYPES
// ===========================================

/**
 * Reason why a video is recommended
 */
export type RecommendationReason =
  | 'recent_struggle'        // User struggled with this in recent sessions
  | 'plateau_technique'      // Technique stuck at developing for 3+ weeks
  | 'belt_level_gap'         // Core technique for belt not yet proficient
  | 'chain_completion'       // Completes a technique chain user is building
  | 'fundamentals_refresh'   // Fundamental hasn't been practiced in 30+ days
  | 'next_progression'       // Natural next step from recently mastered technique
  | 'training_focus';        // Matches user's stated training goals

/**
 * Recommendation priority (affects sort order)
 */
export type RecommendationPriority = 'high' | 'medium' | 'low';

/**
 * A personalized video recommendation
 */
export interface VideoRecommendation {
  video: TechniqueVideo;
  technique_name: string;      // Human-readable technique name
  position_category: string;   // Position category (e.g., "Closed Guard")
  reason: RecommendationReason;
  reason_text: string;         // Human-readable explanation
  priority: RecommendationPriority;
  user_proficiency: ProficiencyLevel | null; // User's current level
  times_practiced: number;     // How many times user has practiced
  last_practiced: string | null; // ISO date of last practice
}

/**
 * "For You" section data
 */
export interface ForYouSection {
  recommendations: VideoRecommendation[];
  generated_at: string;        // ISO timestamp
  based_on_sessions: number;   // How many sessions were analyzed
  user_belt: BeltLevel;
}

// ===========================================
// TRAINING FEEDBACK TYPES
// ===========================================

/**
 * Training feedback insight (from AI assistant)
 */
export interface TrainingInsight {
  id: string;
  title: string;               // Short headline
  content: string;             // Full insight text
  techniques_mentioned: string[]; // Technique IDs referenced
  videos_suggested: TechniqueVideo[];
  generated_at: string;        // ISO timestamp
  session_context: {
    sessions_analyzed: number;
    date_range: {
      start: string;           // ISO date
      end: string;             // ISO date
    };
  };
}

/**
 * State for typewriter-style feedback display
 */
export interface FeedbackDisplayState {
  isGenerating: boolean;
  displayedText: string;       // Text shown so far (typewriter effect)
  fullText: string;            // Complete text to display
  charIndex: number;           // Current character position
  isComplete: boolean;
}

// ===========================================
// TECHNIQUE CATALOG TYPES (Extended)
// ===========================================

/**
 * Position categories from bjj-techniques CSVs
 */
export type PositionCategory =
  // Technical positions
  | 'closed_guard'
  | 'half_guard'
  | 'open_guard'
  | 'mount'
  | 'side_control'
  | 'back_control'
  | 'north_south'
  | 'turtle'
  | 'takedowns'
  | 'clinch'
  | 'guard_passing'
  | 'knee_on_belly'
  | 'submissions'
  | 'leg_entanglements'  // Modern leg lock positions (ashi garami, saddle, 50/50)
  | 'transitions'
  // Mindset & lifestyle categories
  | 'belt_journey'      // White belt survival, blue belt blues, etc.
  | 'mental_game'       // Competition anxiety, ego, flow state
  | 'age_longevity'     // Training over 40, injury prevention, recovery
  | 'lifestyle'         // Work-life balance, motivation, consistency
  | 'injury_recovery'   // Coming back from injury, prehab mindset
  | 'new_to_bjj'        // Getting started: hygiene, etiquette, belt tying, first class
  | 'belt_milestones';  // Promotion celebration: "life at this belt" + "road to next belt"

/**
 * Extended technique from CSV catalog
 */
export interface CatalogTechnique {
  technique_id: string;        // e.g., "CG_001"
  name: string;
  position: PositionCategory;
  white_belt: boolean;
  blue_belt: boolean;
  purple_belt: boolean;
  brown_belt: boolean;
  black_belt: boolean;
  type: string;                // e.g., "position", "submission", "sweep"
  key_details: string | null;
  common_mistakes: string | null;
  videos: TechniqueVideoSet | null;
}

/**
 * Filter options for technique library
 */
export interface TechniqueLibraryFilters {
  position?: PositionCategory;
  belt_level?: BeltLevel;
  search?: string;
  has_videos?: boolean;
  user_proficiency?: ProficiencyLevel;
}

// ===========================================
// UI STATE TYPES
// ===========================================

/**
 * Library view mode
 */
export type LibraryViewMode = 'for_you' | 'browse';

/**
 * Video player state
 */
export interface VideoPlayerState {
  isOpen: boolean;
  currentVideo: TechniqueVideo | null;
  isLoading: boolean;
}

/**
 * Technique detail view state
 */
export interface TechniqueDetailState {
  technique: CatalogTechnique | null;
  isLoading: boolean;
  activeVideoType: VideoType;
}

/**
 * Belt Personalization System - Type Definitions
 *
 * Core types for the belt-aware personalization engine.
 * This system adapts app behavior based on user's belt level,
 * training history, and journal content.
 *
 * Designed for:
 * - React prototype (current)
 * - React Native + Supabase (TestFlight)
 * - Future RAG/AI integration
 */

import type { BeltLevel } from '../../types/database';

// ===========================================
// BELT PROFILE TYPES
// ===========================================

/**
 * Psychological stage a practitioner experiences at each belt
 * Derived from research on practitioner journey
 */
export interface BeltPsychologyProfile {
  belt: BeltLevel;
  stageName: string; // e.g., "Survival Mode", "Identity Crisis"
  stageDescription: string;

  // Timeline (from research)
  typicalDurationMonths: { min: number; max: number };
  dropoutRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  dropoutPeakWindow: { startMonth: number; endMonth: number } | null;

  // Psychological characteristics
  primaryFocus: string;
  mindsetShift: string;
  identityMarkers: string[];
  commonStruggles: string[];

  // Motivation profile
  dominantMotivations: MotivationType[];
  motivationTrajectory: 'external_to_internal' | 'building' | 'stable' | 'legacy';

  // Learning curve
  learningCurveShape: 'steep' | 'logarithmic' | 'flat_with_spikes' | 'marginal';
  plateauPatterns: PlateauPattern[];

  // Relationship dynamics
  coachRelationship: CoachRelationshipStage;
  peerDynamics: string;
}

export type MotivationType =
  | 'survival'
  | 'self_defense'
  | 'fitness'
  | 'competition'
  | 'competence'
  | 'identity'
  | 'mastery'
  | 'teaching'
  | 'legacy'
  | 'community';

export interface PlateauPattern {
  timing: string; // e.g., "2-3 months", "first year post-promotion"
  description: string;
  breakthroughTrigger: string;
}

export type CoachRelationshipStage =
  | 'complete_novice' // White: high dependency
  | 'beginning_ownership' // Blue: mentor-apprentice
  | 'teaching_introduction' // Purple: mutual learning begins
  | 'near_peer'; // Brown: consultant/advisor

// ===========================================
// FEATURE ADAPTATION TYPES
// ===========================================

/**
 * Defines how a specific feature adapts based on belt level
 */
export interface FeatureAdaptation<T = unknown> {
  featureId: string;
  featureName: string;
  description: string;
  adaptations: Record<BeltLevel, T>;
}

/**
 * Dashboard feature adaptations
 */
export interface DashboardAdaptation {
  primaryMetric: DashboardMetric;
  secondaryMetrics: DashboardMetric[];
  insightFocus: InsightFocus;
  celebrationThreshold: number; // sessions to trigger celebration
  streakEmphasis: 'high' | 'medium' | 'low';
  showCompetitionStats: boolean;
  progressVisualization: 'survival' | 'breadth' | 'depth' | 'refinement';
}

export type DashboardMetric =
  | 'session_streak'
  | 'sessions_this_week'
  | 'total_sessions'
  | 'technique_variety'
  | 'submission_ratio'
  | 'teaching_sessions'
  | 'time_at_belt'
  | 'sparring_rounds';

export type InsightFocus =
  | 'survival_skills'
  | 'defense_first'
  | 'game_development'
  | 'plateau_support'
  | 'systems_thinking'
  | 'teaching_growth'
  | 'refinement'
  | 'legacy';

/**
 * Session logging adaptations
 */
export interface SessionLoggerAdaptation {
  promptStyle: 'encouraging' | 'neutral' | 'analytical';
  suggestedPrompts: string[];
  techniqueSuggestionCount: number;
  showAdvancedFields: boolean;
  defaultDuration: number; // minutes
  sparringEmphasis: 'low' | 'medium' | 'high';
  postSessionMessage: string;
}

/**
 * Chatbot/AI response adaptations
 */
export interface ChatbotAdaptation {
  toneProfile: ToneProfile;
  responseDepth: 'simple' | 'moderate' | 'detailed' | 'comprehensive';
  technicalVocabulary: 'basic' | 'intermediate' | 'advanced' | 'expert';
  encouragementLevel: 'high' | 'moderate' | 'minimal';
  assumedKnowledge: string[]; // concepts we can reference without explaining
  avoidTopics: string[]; // topics inappropriate for this level
  emphasizeTopics: string[]; // topics to prioritize
}

export interface ToneProfile {
  primary: 'supportive' | 'coaching' | 'collaborative' | 'peer';
  warmth: 'high' | 'moderate' | 'professional';
  directness: 'gentle' | 'balanced' | 'direct';
}

/**
 * Video tutorial recommendation adaptations
 */
export interface VideoTutorialAdaptation {
  recommendedCategories: string[];
  difficultyRange: { min: number; max: number }; // 1-10 scale
  prioritizeDefense: boolean;
  includeConceptual: boolean;
  weeklyRecommendationCount: number;
  personalizedPlaylistName: string;
}

/**
 * Belt progress screen adaptations
 */
export interface BeltProgressAdaptation {
  showTimeEstimate: boolean;
  emphasizeRequirements: 'technical' | 'subjective' | 'balanced';
  milestoneGranularity: 'stripes' | 'skills' | 'both';
  comparisonBenchmark: 'none' | 'average' | 'age_group';
  motivationalFraming: string;
}

/**
 * Progressive profiling adaptations
 */
export interface ProfilingAdaptation {
  questionTiming: 'early' | 'standard' | 'delayed';
  questionStyle: 'friendly' | 'professional';
  skipTolerance: number; // how many skips before we stop asking
  priorityQuestions: string[]; // question IDs to ask first
}

// ===========================================
// RISK DETECTION TYPES
// ===========================================

/**
 * Categories of dropout risk factors
 */
export type RiskCategory =
  | 'attendance'
  | 'plateau'
  | 'injury'
  | 'psychological'
  | 'social'
  | 'life_circumstances'
  | 'burnout'
  | 'financial';

/**
 * A specific risk signal that can be detected
 */
export interface RiskSignal {
  id: string;
  category: RiskCategory;
  name: string;
  description: string;

  // Detection
  detectionMethod: DetectionMethod;
  warningThreshold: number | string;
  criticalThreshold: number | string;

  // Belt-specific modifiers (multiplier for risk score)
  beltModifiers: Record<BeltLevel, number>;

  // Timing
  timeToDropout: string; // e.g., "2-4 weeks", "1-3 months"
  interventionWindow: string;

  // Response
  suggestedIntervention: InterventionType;
  interventionMessage: Record<BeltLevel, string>;
}

export type DetectionMethod =
  | 'session_frequency' // Declining attendance
  | 'session_gap' // Days since last session
  | 'sentiment_analysis' // Journal text analysis
  | 'technique_variety' // Repetitive logging
  | 'sparring_avoidance' // Declining sparring rounds
  | 'injury_mentions' // Injury keywords in journal
  | 'promotion_proximity' // Time since/until promotion
  | 'streak_break'; // Breaking a training streak

export type InterventionType =
  | 'gentle_checkin'
  | 'encouragement'
  | 'plateau_support'
  | 'injury_guidance'
  | 'goal_recalibration'
  | 'community_connection'
  | 'milestone_celebration'
  | 'rest_recommendation';

// ===========================================
// JOURNAL ANALYSIS TYPES
// ===========================================

/**
 * Pattern to detect in journal entries
 */
export interface JournalPattern {
  id: string;
  name: string;
  category: JournalPatternCategory;

  // Pattern matching
  patterns: RegExp[];
  negativePatterns?: RegExp[]; // Patterns that negate a match

  // Interpretation
  signal: JournalSignal;
  confidence: 'high' | 'medium' | 'low';

  // Response generation
  responseKey: string;
  beltContextResponses: Record<BeltLevel, string>;
}

export type JournalPatternCategory =
  | 'ego_challenge'
  | 'progress_indicator'
  | 'plateau_indicator'
  | 'injury_mention'
  | 'social_dynamic'
  | 'technique_focus'
  | 'competition_mention'
  | 'motivation_signal'
  | 'teaching_mention';

export type JournalSignal =
  | 'got_smashed' // Ego challenge - common at white/blue
  | 'first_success' // First sweep, sub, etc.
  | 'stuck_feeling' // Plateau indicator
  | 'injury_concern' // Physical issue mentioned
  | 'partner_issue' // Training partner dynamic
  | 'technique_breakthrough' // Skill click moment
  | 'competition_anxiety' // Comp-related stress
  | 'motivation_high' // Positive training session
  | 'motivation_low' // Struggle session
  | 'teaching_experience'; // Helped someone else

/**
 * Analyzed journal entry result
 */
export interface JournalAnalysisResult {
  sessionId: string;
  detectedPatterns: DetectedPattern[];
  overallSentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  riskSignals: string[]; // Risk signal IDs triggered
  suggestedFollowUp: string | null;
  beltAppropriateResponse: string | null;
}

export interface DetectedPattern {
  patternId: string;
  matchedText: string;
  signal: JournalSignal;
  confidence: 'high' | 'medium' | 'low';
}

// ===========================================
// INTERVENTION TYPES
// ===========================================

/**
 * A proactive intervention triggered by risk detection
 */
export interface Intervention {
  id: string;
  type: InterventionType;
  triggerReason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Content
  title: string;
  message: string;
  actionLabel?: string;
  actionRoute?: string;

  // Timing
  showAfterDays: number;
  expiresAfterDays: number;
  maxShowCount: number;

  // Tracking
  dismissable: boolean;
  trackEngagement: boolean;
}

// ===========================================
// PERSONALIZATION CONTEXT
// ===========================================

/**
 * Full personalization context for a user
 * Computed from profile + sessions + analysis
 */
export interface PersonalizationContext {
  // User basics
  belt: BeltLevel;
  stripes: number;
  sessionCount: number;
  daysAtBelt: number;

  // Computed states
  isInDropoutRiskWindow: boolean;
  currentRiskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  activeRiskSignals: string[];

  // Training patterns
  averageSessionsPerWeek: number;
  daysSinceLastSession: number;
  recentSentimentTrend: 'improving' | 'stable' | 'declining';

  // Recommendations
  activeInterventions: Intervention[];
  suggestedFocus: string[];
  nextMilestone: string | null;
}

// ===========================================
// CONFIGURATION EXPORTS
// ===========================================

/**
 * Complete belt system configuration
 */
export interface BeltSystemConfig {
  profiles: Record<BeltLevel, BeltPsychologyProfile>;
  featureAdaptations: {
    dashboard: FeatureAdaptation<DashboardAdaptation>;
    sessionLogger: FeatureAdaptation<SessionLoggerAdaptation>;
    chatbot: FeatureAdaptation<ChatbotAdaptation>;
    videoTutorials: FeatureAdaptation<VideoTutorialAdaptation>;
    beltProgress: FeatureAdaptation<BeltProgressAdaptation>;
    profiling: FeatureAdaptation<ProfilingAdaptation>;
  };
  riskSignals: RiskSignal[];
  journalPatterns: JournalPattern[];
}

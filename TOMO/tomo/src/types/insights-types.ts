/**
 * TOMO Insights — TypeScript Types
 *
 * Types for the tiered AI insights system (weekly/monthly/quarterly),
 * conversational follow-up, and User Context Document (UCD).
 *
 * See docs/insights/ for architecture and model specs.
 */

import type { BeltLevel, Submission } from './mvp-types';

// ===========================================
// ENUMS & CONSTANTS
// ===========================================

export type InsightTier = 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';

export type InsightType = 'technique' | 'consistency' | 'sparring' | 'risk' | 'milestone' | 'game_development';

export type SentimentValue = 'positive' | 'neutral' | 'negative' | 'mixed';

export type TrendDirection = 'improving' | 'declining' | 'stable';

export type TechniqueProfile = 'specialist' | 'generalist' | 'developing';

export const INSIGHT_MODELS: Record<InsightTier, string> = {
  weekly: 'claude-haiku-4-5-20251001',
  monthly: 'claude-sonnet-4-6-20250514',
  quarterly: 'claude-opus-4-6-20250514',
  semi_annual: 'claude-opus-4-6-20250514',
  annual: 'claude-opus-4-6-20250514',
};

export const MAX_CHAT_EXCHANGES = 5;

export const MINIMUM_SESSIONS: Record<InsightTier, number> = {
  weekly: 1,
  monthly: 5,
  quarterly: 0, // requires 2 monthly reviews instead
  semi_annual: 0,
  annual: 0,
};

// ===========================================
// INSIGHT RECORDS (Database)
// ===========================================

export interface Insight {
  id: string;
  user_id: string;
  tier: InsightTier;
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
  insight_data: WeeklyInsightOutput | MonthlyInsightOutput | QuarterlyInsightOutput;
  context_for_lower_tiers: LowerTierContext | null;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  generated_at: string;
  feedback: 'helpful' | 'not_helpful' | null;
  has_been_viewed: boolean;
  first_viewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsightInsert {
  tier: InsightTier;
  period_start: string;
  period_end: string;
  insight_data: object;
  context_for_lower_tiers?: LowerTierContext | null;
  model: string;
  input_tokens?: number;
  output_tokens?: number;
}

// Context passed down from higher tiers
export interface LowerTierContext {
  focusArea?: string;
  gameIdentity?: string;
  watchItem?: string;
  priorities?: string[];
  escalatingConcerns?: string[];
}

// ===========================================
// WEEKLY HAIKU — INPUT/OUTPUT
// ===========================================

export interface WeeklyInsightInput {
  belt: BeltLevel;
  userContext: string; // serialized UCD text

  week: { start: string; end: string };
  sessionsThisWeek: number;
  targetFrequency: number;
  totalSessionsAllTime: number;

  weekData: {
    totalMinutes: number;
    modes: Record<string, number>;
    kinds: Record<string, number>;
    techniquesDrilled: string[];
    sparringRounds: number;
    submissionsGiven: Submission[];
    submissionsReceived: Submission[];
    injuries: string[];
    sentiment: SentimentValue;
    detectedPatterns: string[];
    streakDays: number;
  };

  priorWeekDelta: {
    sessionsDelta: number;
    sparringDelta: number;
    newTechniques: string[];
    recurringInjuries: string[];
  } | null;

  monthlyContext: {
    focusArea: string;
    gameIdentity: string;
    watchItem: string | null;
  } | null;

  quarterlyPriorities: string[] | null;
}

export interface WeeklyInsightOutput {
  insights: Array<{
    type: InsightType;
    title: string;
    body: string;
  }>;
  focusNext: string;
}

// New message-style output (Phase 1 approved design)
export interface WeeklyInsightParagraph {
  text: string;       // Can contain **bold** markers
  isWatch: boolean;   // True = injury/risk item, rendered with red left border
  defer?: string;     // Coach deferral note (only when isWatch)
}

export interface WeeklyInsightOutputV2 {
  paragraphs: WeeklyInsightParagraph[];
  focusNext: string;
}

// ===========================================
// MONTHLY SONNET — INPUT/OUTPUT
// ===========================================

export interface MonthlyInsightInput {
  belt: BeltLevel;
  stripes: number;
  userContext: string;

  month: string; // "March 2026"
  totalSessionsAllTime: number;

  monthlyStats: {
    sessionsLogged: number;
    targetFrequency: number;
    adherenceRate: number;
    totalMinutes: number;
    avgDuration: number;
    modeBreakdown: Record<string, number>;
    kindBreakdown: Record<string, number>;
    totalSparringRounds: number;
    avgRoundsPerSession: number;
  };

  techniqueAnalysis: {
    mostDrilled: Array<{ technique: string; count: number }>;
    newThisMonth: string[];
    droppedFromLastMonth: string[];
  };

  submissionProfile: {
    given: Record<string, number>;
    received: Record<string, number>;
    ratioThisMonth: number;
    ratioLastMonth: number | null;
    trend: TrendDirection;
  };

  injuryLog: {
    mentions: string[];
    recurring: string[];
    weeksWithInjury: number;
  };

  consistencyPattern: {
    weekByWeek: number[];
    longestStreak: number;
    gapDays: number;
  };

  sentimentTrend: SentimentValue[];
  weeklyInsightsSummary: string[];

  quarterlyPriorities: string[] | null;
  lastMonthFocusArea: string | null;
}

export interface MonthlyInsightOutput {
  overview: string;
  developing: string;
  sparring: string | null;
  consistency: string;
  watch: string | null;
  focusNextMonth: string;
}

// ===========================================
// QUARTERLY OPUS — INPUT/OUTPUT
// ===========================================

export interface QuarterlyInsightInput {
  belt: BeltLevel;
  stripes: number;
  userContext: string;

  quarter: string; // "Q1 2026"
  monthsTraining: number;
  totalSessionsAllTime: number;

  quarterlyStats: {
    sessionsLogged: number;
    avgSessionsPerWeek: number;
    targetFrequency: number;
    adherenceRate: number;
    sparringRounds: number;
    uniqueTechniquesDrilled: number;
    totalMinutes: number;
  };

  techniqueEvolution: {
    emergingSystem: string;
    diversityTrend: 'narrowing' | 'broadening' | 'stable';
    addedOverQuarter: string[];
    droppedOverQuarter: string[];
  };

  submissionEvolution: Record<string, {
    ratio: number;
    topGiven: string;
    topReceived: string;
  }>;

  injuryArc: Record<string, string[]>;
  escalatingInjuries: string[];

  consistencyArc: Record<string, {
    sessions: number;
    adherence: number;
  }>;

  monthlyReviews: Array<{
    month: string;
    summary: string;
    focusSet: string;
  }>;

  sentimentArc: Record<string, string>;

  profileContext: {
    trainingGoals: string[] | null;
    experienceLevel: string | null;
    gym: string;
  };

  priorQuarterPriorities: string[] | null;
}

export interface QuarterlyInsightOutput {
  quarterSentence: string;
  gameForming: string;
  progression: string;
  consistency: string;
  bodyCheck: string | null;
  nextQuarterPriorities: string[];
}

// ===========================================
// CHAT / CONVERSATION
// ===========================================

export interface InsightConversation {
  id: string;
  user_id: string;
  insight_id: string;
  messages: ChatMessage[];
  exchange_count: number;
  complete: boolean;
  model: string;
  total_input_tokens: number;
  total_output_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  insightId: string;
  tier: InsightTier;
  userMessage: string;
  // Sent on first message only
  context?: {
    insightData: WeeklyInsightOutput | MonthlyInsightOutput | QuarterlyInsightOutput;
    userContext: string;
    belt: BeltLevel;
  };
}

export interface ChatResponse {
  message: string;
  exchangeCount: number;
  complete: boolean;
  closeMessage?: string;
}

// ===========================================
// USER CONTEXT DOCUMENT (UCD)
// ===========================================

export interface UserContext {
  id: string;
  user_id: string;
  context_document: UserContextDocument;
  serialized_text: string | null;
  version: number;
  sessions_analyzed: number;
  last_rebuilt: string;
  changelog: UCDChangeEntry[];
  created_at: string;
  updated_at: string;
}

export interface UserContextDocument {
  version: number;
  sessionsAnalyzed: number;
  lastRebuilt: string;

  profile: {
    name: string;
    belt: BeltLevel;
    stripes: number;
    age: number;
    gender: 'male' | 'female' | null;
    bodyWeightKg: number | null;
    gym: string;
    monthsTraining: number;
    trainingGoals: string[] | null;
    experienceLevel: string | null;
    targetFrequency: number;
  };

  patterns: {
    styleIdentity: string | null;
    topSubmissions: Array<{ type: string; count: number }> | null;
    vulnerabilities: Array<{ type: string; count: number }> | null;
    avgFrequency: number | null;
    modePreference: { gi: number; nogi: number } | null;
    injuryHistory: Array<{
      bodyPart: string;
      occurrences: number;
      firstMentioned: string;
      lastMentioned: string;
    }>;
    consistencyPattern: {
      avgStreak: number;
      longestStreak: number;
      adherenceRate: number;
    } | null;
    breakthroughLog: Array<{ technique: string; date: string }>;
    plateauHistory: Array<{ period: string; resolved: boolean }>;
    sparringIntensity: {
      avgRounds: number;
      trend: TrendDirection;
    } | null;
    techniqueProfile: TechniqueProfile | null;
    submissionRatioTrend: TrendDirection | null;
  };

  preferences: {
    chatStyle: string | null;
    insightPreference: string | null;
    coachRelationship: string | null;
  };

  recentChanges: UCDChangeEntry[];
}

export interface UCDChangeEntry {
  date: string;
  field: string;
  oldValue: string | number | null;
  newValue: string | number | null;
  reason: string;
}

// ===========================================
// PATTERN ENGINE — Intermediate computation types
// ===========================================

export interface WeeklyPatterns {
  weekStart: string;
  weekEnd: string;
  sessionsLogged: number;
  totalMinutes: number;
  modes: Record<string, number>;
  kinds: Record<string, number>;
  techniquesDrilled: string[];
  techniqueFrequency: Record<string, number>;
  sparringRounds: number;
  submissionsGiven: Submission[];
  submissionsReceived: Submission[];
  injuries: string[];
  sentiment: SentimentValue;
  detectedPatterns: string[];
  streakDays: number;
}

export interface MonthlyPatterns {
  month: string; // "March 2026"
  monthStart: string;
  monthEnd: string;
  sessionsLogged: number;
  totalMinutes: number;
  avgDuration: number;
  targetFrequency: number;
  adherenceRate: number;
  modeBreakdown: Record<string, number>;
  kindBreakdown: Record<string, number>;
  totalSparringRounds: number;
  avgRoundsPerSession: number;
  techniqueFrequency: Record<string, number>;
  newTechniques: string[];
  droppedTechniques: string[];
  submissionsGiven: Record<string, number>;
  submissionsReceived: Record<string, number>;
  submissionRatio: number;
  injuries: string[];
  recurringInjuries: string[];
  weeksWithInjury: number;
  weekByWeekSessions: number[];
  longestStreak: number;
  gapDays: number;
  sentimentByWeek: SentimentValue[];
}

export interface QuarterlyPatterns {
  quarter: string; // "Q1 2026"
  quarterStart: string;
  quarterEnd: string;
  sessionsLogged: number;
  totalMinutes: number;
  avgSessionsPerWeek: number;
  adherenceRate: number;
  sparringRounds: number;
  uniqueTechniques: number;
  techniqueEvolution: {
    emergingSystem: string;
    diversityTrend: 'narrowing' | 'broadening' | 'stable';
    added: string[];
    dropped: string[];
  };
  submissionsByMonth: Record<string, { ratio: number; topGiven: string; topReceived: string }>;
  injuriesByMonth: Record<string, string[]>;
  escalatingInjuries: string[];
  consistencyByMonth: Record<string, { sessions: number; adherence: number }>;
  sentimentByMonth: Record<string, string>;
}

// ===========================================
// INSIGHT ELIGIBILITY
// ===========================================

export interface InsightEligibility {
  weekly: { eligible: boolean; reason?: string; sessionsThisWeek: number };
  monthly: { eligible: boolean; reason?: string; sessionsThisMonth: number; weeklyInsightsCount: number };
  quarterly: { eligible: boolean; reason?: string; monthlyReviewsCount: number };
}

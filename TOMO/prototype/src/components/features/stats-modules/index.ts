/**
 * Stats Modules - Belt-Adaptive Dashboard Components
 *
 * Phase 1: White Belt Modules (Retention-focused)
 * - WeeklyProgressRing: Apple Watch-style circular progress toward weekly goal
 * - CalendarHeatMap: GitHub-style training consistency visualization
 * - DashboardSummaryCard: Key metrics at-a-glance (sessions, hours, streak, belt)
 * - DefenseFocus: Offense/defense bar charts
 *
 * Phase 2: Blue Belt Modules (Identity & Game Development)
 * - TechniquePairings: Co-occurrence analysis, emerging chains
 * - BluesDetector: Dropout risk detection, interventions
 *
 * Phase 3: Purple/Brown Belt Modules (Depth & Systems)
 * - YourJourney: Multi-year progression + submission trends (merged LongGame + SubmissionTrends)
 * - TechniqueMastery: Specialization depth by proficiency (simplified)
 *
 * Universal Modules (shown to all belts):
 * - RecentRolls: Defense coaching with video links
 * - AttackProfile: Comprehensive submission story (in parent features/)
 *
 * REMOVED/ARCHIVED:
 * - YourProgress, FoundationsProgress → replaced by Tier 1 infographic modules
 * - JourneyTimeline, ConsistencyScore → merged into YourProgress (then deprecated)
 * - YourStyle, VulnerabilityMap → consolidated into AttackProfile
 * - LongGame, SubmissionTrends → merged into YourJourney
 *
 * See: /internal-docs/data-visualization/INFOGRAPHIC_STRATEGY.md
 */

// White Belt Modules - Tier 1 Infographics
export { WeeklyProgressRing } from './WeeklyProgressRing';
export { CalendarHeatMap } from './CalendarHeatMap';
export { DashboardSummaryCard } from './DashboardSummaryCard';
export { DefenseFocus } from './DefenseFocus';

// REMOVED: YourProgress, FoundationsProgress
// These legacy modules were replaced by WeeklyProgressRing, CalendarHeatMap, DashboardSummaryCard, DefenseFocus
// If you need them, import directly from the files (not recommended)

// Blue Belt Modules
export { TechniquePairings } from './TechniquePairings';
export { BluesDetector } from './BluesDetector';

// Blue/Purple Belt Modules (Tier 1 Infographics)
export { SessionTypeDistribution } from './SessionTypeDistribution';
export { SparringPatternAnalysis } from './SparringPatternAnalysis';
export { AchievementTimeline } from './AchievementTimeline';

// Purple/Brown Belt Modules
export { YourJourney } from './YourJourney';
export { TechniqueMastery } from './TechniqueMastery';

// Archived modules (see _archived/README.md):
// - JourneyTimeline, ConsistencyScore → merged into YourProgress
// - YourStyle, VulnerabilityMap → consolidated into AttackProfile
// - LongGame, SubmissionTrends → merged into YourJourney

// Universal Modules
export { RecentRolls } from './RecentRolls';
export type { SubmissionReceived, RollRecord, BeltLevel as RollBeltLevel } from './RecentRolls';

// Re-export types and utilities from data
export {
  JOURNEY_MILESTONES,
  DROPOUT_CLIFF_MESSAGES,
  WHITE_BELT_FOUNDATIONS,
  STYLE_DEFINITIONS,
  DEFENSE_SUGGESTIONS,
  BLUES_INTERVENTIONS,
  MOCK_PURPLE_BELT_STATS,
  MOCK_PURPLE_TECHNIQUE_MASTERY,
  getMilestoneStatus,
  getDropoutCliffMessage,
  checkFoundationsTouched,
  getStyleFromRatio,
  calculateBodyRegionBreakdown,
  getTopTechniques,
  calculateTechniqueCoOccurrence,
  checkSentiment,
  type JourneyMilestone,
  type FoundationCategory,
  type SubmissionRecord,
  type TechniqueSession,
  type StyleDefinition,
  type BluesInterventionTemplate,
  type YearlyCount,
  type TechniqueMasteryRecord,
} from '../../../data/stats-modules';

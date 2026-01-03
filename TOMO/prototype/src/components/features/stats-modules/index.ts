/**
 * Stats Modules - Belt-Adaptive Dashboard Components
 *
 * Phase 1: White Belt Modules (Retention-focused)
 * - YourProgress: Consolidated progress to 50 + weekly/monthly frequency
 * - FoundationsProgress: Fundamental technique checklist
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
 * REMOVED (consolidated into other modules):
 * - JourneyTimeline, ConsistencyScore → merged into YourProgress
 * - YourStyle, VulnerabilityMap → consolidated into AttackProfile
 * - LongGame, SubmissionTrends → merged into YourJourney
 *
 * See: /internal-docs/research/STATS_MODULE_IMPLEMENTATION.md
 */

// White Belt Modules
export { YourProgress } from './YourProgress';
export { FoundationsProgress } from './FoundationsProgress';

// Blue Belt Modules
export { TechniquePairings } from './TechniquePairings';
export { BluesDetector } from './BluesDetector';

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

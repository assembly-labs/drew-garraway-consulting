/**
 * Stats Modules - Belt-Adaptive Dashboard Components
 *
 * Phase 1: White Belt Modules (Retention-focused)
 * - JourneyTimeline: Milestone tracking, dropout cliff positioning
 * - ConsistencyScore: Session count emphasis, streak tracking
 * - FoundationsProgress: Fundamental technique checklist
 *
 * Phase 2: Blue Belt Modules (Identity & Game Development)
 * - YourStyle: Submission balance, emerging style label
 * - VulnerabilityMap: Where you're getting caught, defense suggestions
 * - TechniquePairings: Co-occurrence analysis, emerging chains
 * - BluesDetector: Dropout risk detection, interventions
 *
 * Phase 3: Purple Belt Modules (Depth & Systems)
 * - LongGame: Multi-year progression visualization
 * - SubmissionTrends: Finishing trends over time
 * - TechniqueMastery: Specialization depth by proficiency
 *
 * See: /internal-docs/research/STATS_MODULE_IMPLEMENTATION.md
 */

// White Belt Modules
export { JourneyTimeline } from './JourneyTimeline';
export { ConsistencyScore } from './ConsistencyScore';
export { FoundationsProgress } from './FoundationsProgress';

// Blue Belt Modules
export { YourStyle } from './YourStyle';
export { VulnerabilityMap } from './VulnerabilityMap';
export { TechniquePairings } from './TechniquePairings';
export { BluesDetector } from './BluesDetector';

// Purple Belt Modules
export { LongGame } from './LongGame';
export { SubmissionTrends } from './SubmissionTrends';
export { TechniqueMastery } from './TechniqueMastery';

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

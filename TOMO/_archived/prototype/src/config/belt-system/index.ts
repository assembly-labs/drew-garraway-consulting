/**
 * Belt Personalization System
 *
 * Central export for the belt-aware personalization engine.
 * This system adapts app behavior based on user's belt level,
 * training history, and journal content.
 *
 * Usage:
 *   import { getBeltProfile, getDashboardAdaptation } from '@/config/belt-system';
 *   import { useBeltPersonalization } from '@/hooks/useBeltPersonalization';
 */

// Type exports
export * from './types';

// Belt psychology profiles
export {
  beltProfiles,
  getBeltProfile,
  isInDropoutRiskWindow,
  getCurrentPlateauPattern,
  whiteBeltProfile,
  blueBeltProfile,
  purpleBeltProfile,
  brownBeltProfile,
  blackBeltProfile,
} from './belt-profiles';

// Feature adaptations
export {
  allFeatureAdaptations,
  dashboardAdaptation,
  sessionLoggerAdaptation,
  chatbotAdaptation,
  videoTutorialAdaptation,
  beltProgressAdaptation,
  profilingAdaptation,
  getFeatureAdaptation,
  getDashboardAdaptation,
  getSessionLoggerAdaptation,
  getChatbotAdaptation,
  getVideoTutorialAdaptation,
} from './feature-adaptations';

// Risk signal detection
export {
  riskSignals,
  interventionTemplates,
  getRiskSignal,
  getRiskSignalsByCategory,
  getAdjustedRiskScore,
  getInterventionMessage,
  createIntervention,
} from './risk-signals';

// Journal pattern analysis
export {
  journalPatterns,
  analyzeJournalEntry,
  getBeltAppropriateResponse,
  getPatternsByCategory,
  quickSentimentCheck,
} from './journal-patterns';

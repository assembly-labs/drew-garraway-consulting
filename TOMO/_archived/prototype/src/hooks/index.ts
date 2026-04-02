/**
 * Hooks Index
 *
 * Central export for all custom React hooks.
 */

// Journal hook (legacy)
export { useJournal } from './useJournal';

// Animation hooks
export { useCountUp, useCountUpPercent } from './useCountUp';

// Belt personalization hooks
export {
  useBeltPersonalization,
  useDashboardAdaptation,
  useSessionLoggerAdaptation,
  useChatbotAdaptation,
  useDropoutRiskStatus,
  useBeltSuggestedContent,
  useBeltMotivation,
  type BeltPersonalizationResult,
} from './useBeltPersonalization';

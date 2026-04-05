/**
 * TOMO Insight Limitation Messages
 *
 * Displayed on the Insights tab when the user doesn't have sufficient data
 * for TOMO to generate a weekly debrief.
 *
 * Only requirement: 1+ session logged this week.
 * No account age gate -- users should see value after their first session.
 *
 * COPY RULES:
 * - Direct, honest, specific about what's needed
 * - Tone: training partner, not system notification
 * - 1-3 sentences max
 * - No hollow motivational language
 * - No jargon
 */

export type InsightLimitationState =
  | 'no_sessions'   // 0 sessions this week -- log one to unlock
  | 'generating';   // 1+ sessions, insight is being generated

export interface InsightLimitation {
  state: InsightLimitationState;
  message: string;
  /** What the user is missing -- useful for analytics or future UI hints */
  missing: ('sessions' | 'none')[];
}

const LIMITATIONS: Record<InsightLimitationState, InsightLimitation> = {
  no_sessions: {
    state: 'no_sessions',
    message:
      'Your weekly debrief lives here. Log a session and TOMO will have something to work with.',
    missing: ['sessions'],
  },

  generating: {
    state: 'generating',
    message:
      "You've put in the work this week. Your debrief is on the way.",
    missing: [],
  },
};

/**
 * Determine the current limitation state based on session count.
 *
 * @param sessionsThisWeek - Number of sessions logged in the current week
 * @param _accountAgeDays - Unused (kept for backwards compat, will remove)
 * @param hasInsightThisWeek - Whether a weekly insight has already been generated
 */
export function getInsightLimitation(
  sessionsThisWeek: number,
  _accountAgeDays: number,
  hasInsightThisWeek: boolean
): InsightLimitation | null {
  // If they already have an insight this week, no limitation to show
  if (hasInsightThisWeek) return null;

  if (sessionsThisWeek === 0) return LIMITATIONS.no_sessions;

  // 1+ sessions but no insight yet -- generation pending
  return LIMITATIONS.generating;
}

/** Get the raw message for a given state (useful for testing) */
export function getLimitationMessage(state: InsightLimitationState): string {
  return LIMITATIONS[state].message;
}

/** All limitation entries (useful for previewing/testing the full bank) */
export const ALL_LIMITATIONS = Object.values(LIMITATIONS);

/**
 * TOMO Insight Limitation Messages
 *
 * Displayed on the Insights tab when the user doesn't have sufficient data
 * for TOMO to generate a weekly debrief.
 *
 * Two requirements for a weekly insight:
 *   1. Account is at least 7 days old
 *   2. 2+ sessions logged this week
 *
 * Each state gets one definitive message. The limitation is a fact about
 * where the user stands -- it shouldn't rotate. A motivational quote
 * (from quotes.ts) types in fresh underneath to provide variety.
 *
 * COPY RULES:
 * - Direct, honest, specific about what's needed
 * - Reinforce: more training = better insights
 * - Tone: training partner, not system notification
 * - 1-3 sentences max
 * - No hollow motivational language
 * - No jargon
 *
 * This bank will be enriched over time as we learn what resonates.
 */

export type InsightLimitationState =
  | 'new_no_sessions'       // State A: 0 sessions, account < 7 days
  | 'new_one_session'       // State B: 1 session, account < 7 days
  | 'new_enough_sessions'   // State C: 2+ sessions, account < 7 days
  | 'older_no_sessions'     // State D: 0 sessions, account >= 7 days
  | 'older_one_session'     // State E: 1 session, account >= 7 days
  | 'generating';           // State F: 2+ sessions, account >= 7 days, insight pending

export interface InsightLimitation {
  state: InsightLimitationState;
  message: string;
  /** What the user is missing -- useful for analytics or future UI hints */
  missing: ('sessions' | 'time' | 'none')[];
}

const LIMITATIONS: Record<InsightLimitationState, InsightLimitation> = {
  // State A: Brand new user, never logged
  new_no_sessions: {
    state: 'new_no_sessions',
    message:
      'Your weekly debrief lives here. Log at least 2 sessions this week and TOMO will have enough to start spotting patterns. The more you log, the sharper it gets.',
    missing: ['sessions', 'time'],
  },

  // State B: Logged once, need more + still too early
  new_one_session: {
    state: 'new_one_session',
    message:
      'One session in the books. Log one more this week and your first debrief unlocks. Two sessions gives TOMO enough to connect the dots.',
    missing: ['sessions', 'time'],
  },

  // State C: Enough sessions, just waiting for the week to close
  new_enough_sessions: {
    state: 'new_enough_sessions',
    message:
      'The work is in. Your first weekly debrief is being put together and will land here at the end of the week.',
    missing: ['time'],
  },

  // State D: Been here a week+, but not logging
  older_no_sessions: {
    state: 'older_no_sessions',
    message:
      'TOMO builds your debrief from real training data. Log at least 2 sessions this week to unlock your first one. More sessions, sharper insights.',
    missing: ['sessions'],
  },

  // State E: One session this week, need one more
  older_one_session: {
    state: 'older_one_session',
    message:
      'One session this week. Log one more and your weekly debrief unlocks. TOMO needs at least two data points to find patterns worth mentioning.',
    missing: ['sessions'],
  },

  // State F: Requirements met, insight is being generated or will generate soon
  generating: {
    state: 'generating',
    message:
      "You've put in the work this week. Your debrief is on the way.",
    missing: [],
  },
};

/**
 * Determine the current limitation state based on session count and account age.
 *
 * @param sessionsThisWeek - Number of sessions logged in the current week
 * @param accountAgeDays - Days since account creation
 * @param hasInsightThisWeek - Whether a weekly insight has already been generated
 */
export function getInsightLimitation(
  sessionsThisWeek: number,
  accountAgeDays: number,
  hasInsightThisWeek: boolean
): InsightLimitation | null {
  // If they already have an insight this week, no limitation to show
  if (hasInsightThisWeek) return null;

  const isNew = accountAgeDays < 7;
  const enoughSessions = sessionsThisWeek >= 2;

  if (isNew) {
    if (sessionsThisWeek === 0) return LIMITATIONS.new_no_sessions;
    if (sessionsThisWeek === 1) return LIMITATIONS.new_one_session;
    return LIMITATIONS.new_enough_sessions;
  }

  // Account >= 7 days old
  if (sessionsThisWeek === 0) return LIMITATIONS.older_no_sessions;
  if (sessionsThisWeek === 1) return LIMITATIONS.older_one_session;
  if (enoughSessions) return LIMITATIONS.generating;

  return null;
}

/** Get the raw message for a given state (useful for testing) */
export function getLimitationMessage(state: InsightLimitationState): string {
  return LIMITATIONS[state].message;
}

/** All limitation entries (useful for previewing/testing the full bank) */
export const ALL_LIMITATIONS = Object.values(LIMITATIONS);

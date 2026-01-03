/**
 * Breakthrough Detection System
 *
 * Detects skill jumps, milestones, and notable improvements in training data.
 * Designed to celebrate wins while being honest about confidence levels.
 *
 * Detection Philosophy:
 * - Under-promise, over-deliver (better to miss than celebrate noise)
 * - Belt-appropriate messaging
 * - Exhausted-user compatible (glanceable, no cognitive load)
 */

import type { JournalEntry } from '../data/journal';

// ===========================================
// TYPES
// ===========================================

export type BreakthroughType =
  | 'first_submission'           // First time logging a submission type
  | 'technique_streak'           // Used same technique 3+ times successfully
  | 'consistency_milestone'      // 50, 100, 200 sessions etc.
  | 'streak_record'              // Beat personal best streak
  | 'return_strong'              // Came back after gap, performed well
  | 'volume_increase'            // Sustainable training increase
  | 'competition_achievement'    // First comp, podium, etc.
  | 'pattern_break'              // Stopped getting caught by something
  | 'plateau_breaking';          // Broke through a plateau

// REMOVED (unreliable data sources):
// - 'first_submission_on_belt' - requires partner belt data users won't provide
// - 'sparring_improvement' - requires W/L outcomes users won't track
// - 'sentiment_turnaround' - requires mood scores users won't submit

export type BreakthroughConfidence = 'high' | 'medium' | 'low';

export interface Breakthrough {
  id: string;
  type: BreakthroughType;
  detectedAt: string;
  confidence: BreakthroughConfidence;
  title: string;
  description: string;
  stat?: {
    value: number | string;
    label: string;
  };
  beltContext: string;
  icon: 'trophy' | 'flame' | 'target' | 'shield' | 'zap' | 'trending-up' | 'award' | 'check-circle';
}

export interface BreakthroughDetectionInput {
  journalEntries: JournalEntry[];
  trainingStats: {
    totalSessions: number;
    currentStreak: number;
    longestStreak: number;
    sparringRecord: {
      wins: number;
      losses: number;
      draws: number;
    };
    submissionsMade: Record<string, number>;
    submissionsReceived: Record<string, number>;
  };
  belt: string;
  monthsAtBelt?: number;
}

// ===========================================
// BELT CONTEXT MESSAGES
// ===========================================

const beltContextMessages = {
  first_submission: {
    white: 'Your first {technique}! This is huge. Remember this feeling.',
    blue: 'First {technique} locked in. Your arsenal is growing.',
    purple: '{technique} added to the collection. Chain it with your A-game.',
    brown: 'New finish unlocked: {technique}.',
    black: '{technique} - another tool in the toolkit.',
  },
  // REMOVED: first_submission_on_belt - requires partner belt data we can't reliably collect
  consistency_milestone: {
    white: {
      10: 'Most white belts quit by now. You didn\'t.',
      25: 'You\'re officially not a beginner anymore.',
      50: 'Halfway to the typical white belt journey.',
      100: 'Blue belt territory. Keep grinding.',
    },
    blue: {
      100: 'Imposter syndrome is normal. Trust the belt.',
      150: 'Purple belt mindset is forming.',
      200: 'Only 50% of blue belts make it this far.',
      250: 'The grind is real. So is your progress.',
    },
    purple: {
      200: 'Systems are connecting.',
      250: 'Your depth of understanding is remarkable.',
      300: 'Teaching deepens mastery.',
    },
    brown: {
      250: 'Refinement is the path.',
      300: 'The finish line is in sight.',
      350: 'Black belt is inevitable.',
    },
    black: {
      300: 'The journey continues.',
      400: 'Mastery through repetition.',
      500: 'Half a thousand sessions. Legend status.',
    },
  },
  // REMOVED: sparring_improvement - requires W/L outcomes we can't reliably collect
  streak_record: {
    white: 'New personal best. Consistency builds champions.',
    blue: 'Streak record broken. This is who you are now.',
    purple: 'New streak record. Discipline is your edge.',
    brown: 'Record streak. Experience meets consistency.',
    black: 'New record. Leading by example.',
  },
  pattern_break: {
    white: 'You stopped getting {technique}d! Your defense is working.',
    blue: '{technique} defense improving. That hole is closing.',
    purple: 'Shored up the {technique} vulnerability. Gap closed.',
    brown: '{technique} no longer a liability.',
    black: '{technique} defense dialed.',
  },
  technique_streak: {
    white: '{technique} is becoming reliable. Keep drilling.',
    blue: '{technique} is clicking. It\'s becoming your weapon.',
    purple: '{technique} is a go-to now. Chain it with your systems.',
    brown: '{technique} is signature-level.',
    black: '{technique} is refined.',
  },
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Reserved for future use (e.g., "return after X days" detection)
function _daysSince(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
void _daysSince; // Suppress unused warning

function getSessionsInWindow(
  entries: JournalEntry[],
  days: number,
  offsetDays: number = 0
): JournalEntry[] {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - days - offsetDays);
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() - offsetDays);

  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= windowStart && entryDate <= windowEnd;
  });
}

function countSubmissionType(
  entries: JournalEntry[],
  submissionType: string,
  direction: 'made' | 'received'
): number {
  let count = 0;
  for (const entry of entries) {
    for (const round of entry.sparringRounds) {
      if (direction === 'made' && round.outcome === 'submission-win') {
        if (round.submissionType?.toLowerCase() === submissionType.toLowerCase()) {
          count++;
        }
      } else if (direction === 'received' && round.outcome === 'submission-loss') {
        if (round.submissionType?.toLowerCase() === submissionType.toLowerCase()) {
          count++;
        }
      }
    }
  }
  return count;
}

// REMOVED: isBeltHigher, countHigherBeltSubmissions, calculateSparringRecord, average
// These helper functions required data we can't reliably collect (partner belt, W/L outcomes, mood scores)

function getBeltContext(
  type: keyof typeof beltContextMessages,
  belt: string,
  replacements?: Record<string, string | number>
): string {
  const messages = beltContextMessages[type];
  let message = '';

  if (typeof messages === 'object' && 'white' in messages) {
    if (typeof messages[belt as keyof typeof messages] === 'object') {
      // Milestone messages with specific values
      return 'Keep going.';
    }
    message = (messages as Record<string, string>)[belt] || (messages as Record<string, string>).white || '';
  }

  if (replacements && message) {
    for (const [key, value] of Object.entries(replacements)) {
      message = message.replace(`{${key}}`, String(value));
    }
  }

  return message;
}

function getMilestoneContext(belt: string, milestone: number): string {
  const beltMessages = beltContextMessages.consistency_milestone[belt as keyof typeof beltContextMessages.consistency_milestone];
  if (beltMessages && typeof beltMessages === 'object') {
    return (beltMessages as Record<number, string>)[milestone] || 'Keep grinding.';
  }
  return 'Keep grinding.';
}

// ===========================================
// MAIN DETECTION FUNCTION
// ===========================================

export function detectBreakthroughs(input: BreakthroughDetectionInput): Breakthrough[] {
  const { journalEntries, trainingStats, belt } = input;
  const detected: Breakthrough[] = [];

  if (journalEntries.length === 0) return detected;

  const latestEntry = journalEntries[0]; // Assuming sorted newest first
  const allPreviousEntries = journalEntries.slice(1);

  // =========================================
  // TIER 1: HIGH CONFIDENCE DETECTIONS
  // =========================================

  // 1. First-time submission type
  for (const round of latestEntry.sparringRounds) {
    if (round.outcome === 'submission-win' && round.submissionType) {
      const previousOccurrences = countSubmissionType(
        allPreviousEntries,
        round.submissionType,
        'made'
      );

      if (previousOccurrences === 0) {
        detected.push({
          id: `first-sub-${round.submissionType}-${Date.now()}`,
          type: 'first_submission',
          detectedAt: new Date().toISOString(),
          confidence: 'high',
          title: `First ${round.submissionType}`,
          description: `You landed your first ${round.submissionType} in live rolling.`,
          stat: {
            value: round.submissionType,
            label: 'NEW SUBMISSION',
          },
          beltContext: getBeltContext('first_submission', belt, { technique: round.submissionType }),
          icon: 'trophy',
        });
      }
    }
  }

  // REMOVED: first_submission_on_belt detection - requires partner belt data we can't reliably collect

  // 2. Consistency milestones
  const milestones = [10, 25, 50, 100, 150, 200, 250, 300, 350, 400, 500, 750, 1000];
  const justHitMilestone = milestones.find(m => trainingStats.totalSessions === m);

  if (justHitMilestone) {
    detected.push({
      id: `milestone-${justHitMilestone}-${Date.now()}`,
      type: 'consistency_milestone',
      detectedAt: new Date().toISOString(),
      confidence: 'high',
      title: `${justHitMilestone} Sessions`,
      description: getMilestoneDescription(justHitMilestone),
      stat: {
        value: justHitMilestone,
        label: 'SESSIONS LOGGED',
      },
      beltContext: getMilestoneContext(belt, justHitMilestone),
      icon: 'flame',
    });
  }

  // 4. Streak record
  if (trainingStats.currentStreak > trainingStats.longestStreak && trainingStats.currentStreak > 7) {
    detected.push({
      id: `streak-record-${Date.now()}`,
      type: 'streak_record',
      detectedAt: new Date().toISOString(),
      confidence: 'high',
      title: 'New Streak Record',
      description: `${trainingStats.currentStreak} days is your longest streak ever.`,
      stat: {
        value: trainingStats.currentStreak,
        label: 'DAY STREAK',
      },
      beltContext: getBeltContext('streak_record', belt),
      icon: 'zap',
    });
  }

  // =========================================
  // TIER 2: MEDIUM CONFIDENCE DETECTIONS
  // =========================================

  // REMOVED: sparring_improvement detection - requires W/L outcomes we can't reliably collect

  // 3. Technique becoming reliable (3+ uses in last 10 sessions)
  const last10Sessions = journalEntries.slice(0, 10);
  const submissionCounts: Record<string, number> = {};

  for (const session of last10Sessions) {
    for (const round of session.sparringRounds) {
      if (round.outcome === 'submission-win' && round.submissionType) {
        const key = round.submissionType.toLowerCase();
        submissionCounts[key] = (submissionCounts[key] || 0) + 1;
      }
    }
  }

  for (const [subType, count] of Object.entries(submissionCounts)) {
    if (count >= 3) {
      // Check if this is a new pattern
      const totalMade = trainingStats.submissionsMade[subType] || 0;
      const priorUses = totalMade - count;
      const sessionsBeforeLast10 = trainingStats.totalSessions - 10;

      if (sessionsBeforeLast10 > 10) {
        const priorRate = priorUses / sessionsBeforeLast10;
        const recentRate = count / 10;

        if (recentRate > priorRate * 1.5 && priorUses > 0) {
          detected.push({
            id: `technique-streak-${subType}-${Date.now()}`,
            type: 'technique_streak',
            detectedAt: new Date().toISOString(),
            confidence: 'medium',
            title: `${capitalize(subType)} is Clicking`,
            description: `You've landed ${count} ${subType}s in your last 10 sessions.`,
            stat: {
              value: count,
              label: 'RECENT FINISHES',
            },
            beltContext: getBeltContext('technique_streak', belt, { technique: subType }),
            icon: 'target',
          });
          break; // Only show one technique streak
        }
      }
    }
  }

  // 7. Pattern break (stopped getting caught by something)
  const recentReceived = getSubmissionsReceived(getSessionsInWindow(journalEntries, 14));
  const baselineReceived = getSubmissionsReceived(getSessionsInWindow(journalEntries, 56, 14));

  for (const [subType, baselineCount] of Object.entries(baselineReceived)) {
    const recentCount = recentReceived[subType] || 0;

    // If they were getting caught 3+ times in baseline and now 0-1 times
    if (baselineCount >= 3 && recentCount <= 1) {
      detected.push({
        id: `pattern-break-${subType}-${Date.now()}`,
        type: 'pattern_break',
        detectedAt: new Date().toISOString(),
        confidence: 'medium',
        title: `${capitalize(subType)} Defense Up`,
        description: `You've stopped getting caught in ${subType}s.`,
        stat: {
          value: `${baselineCount} → ${recentCount}`,
          label: 'TIMES CAUGHT',
        },
        beltContext: getBeltContext('pattern_break', belt, { technique: subType }),
        icon: 'shield',
      });
      break; // Only show one pattern break
    }
  }

  // REMOVED: sentiment_turnaround detection - requires mood scores users won't submit

  return detected;
}

function getSubmissionsReceived(entries: JournalEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const entry of entries) {
    for (const round of entry.sparringRounds) {
      if (round.outcome === 'submission-loss' && round.submissionType) {
        const key = round.submissionType.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    }
  }

  return counts;
}

function getMilestoneDescription(milestone: number): string {
  switch (milestone) {
    case 10: return 'Double digits. You\'re officially training.';
    case 25: return 'A quarter century of sessions.';
    case 50: return 'Half a hundred. Dedication is showing.';
    case 100: return 'Triple digits. You\'re in the game now.';
    case 150: return 'One-fifty. Consistency compounds.';
    case 200: return 'Two hundred sessions. This is who you are.';
    case 250: return 'A quarter thousand. Remarkable.';
    case 300: return 'Three hundred. Mastery through repetition.';
    case 350: return 'Three-fifty. The grind never stops.';
    case 400: return 'Four hundred. Elite dedication.';
    case 500: return 'Half a thousand. Legend status.';
    case 750: return 'Seven-fifty. The long game.';
    case 1000: return 'One thousand sessions. True mastery.';
    default: return 'Keep going.';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===========================================
// PLATEAU DETECTION (COMPANION FEATURE)
// ===========================================

export interface PlateauDetection {
  detected: boolean;
  type: 'technical' | 'motivational' | 'competitive';
  duration: string;
  beltContext: string;
  suggestedAction: string;
}

export function detectPlateau(input: BreakthroughDetectionInput): PlateauDetection | null {
  const { journalEntries, belt } = input;

  if (journalEntries.length < 6) return null;

  // REMOVED: motivational plateau detection - requires mood scores users won't submit

  // Check for technical plateau (same techniques repeatedly)
  const recentTechniques = new Set<string>();
  const last6Sessions = journalEntries.slice(0, 6);

  for (const session of last6Sessions) {
    for (const tech of session.techniques) {
      recentTechniques.add(tech.techniqueId);
    }
  }

  if (recentTechniques.size <= 3 && last6Sessions.reduce((sum, s) => sum + s.techniques.length, 0) > 10) {
    return {
      detected: true,
      type: 'technical',
      duration: '6 sessions',
      beltContext: belt === 'white'
        ? 'Focusing on fundamentals is valid. But variety prevents plateaus.'
        : 'Depth is good, but try adding one new technique to explore.',
      suggestedAction: 'Ask your coach for something new to work on.',
    };
  }

  return null;
}

// ===========================================
// GET MOST SIGNIFICANT BREAKTHROUGH
// ===========================================

/**
 * Returns the single most significant breakthrough to display as hero.
 * Prioritizes by: confidence (high first), then type (first achievements over improvements)
 */
export function getMostSignificantBreakthrough(breakthroughs: Breakthrough[]): Breakthrough | null {
  if (breakthroughs.length === 0) return null;

  // Priority order for types (only includes types we can reliably detect)
  const typePriority: BreakthroughType[] = [
    'first_submission',
    'consistency_milestone',
    'streak_record',
    'technique_streak',
    'pattern_break',
    'competition_achievement',
    'return_strong',
    'volume_increase',
    'plateau_breaking',
  ];

  // Sort by confidence first, then by type priority
  const sorted = [...breakthroughs].sort((a, b) => {
    const confidenceOrder = { high: 0, medium: 1, low: 2 };
    const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    if (confDiff !== 0) return confDiff;

    return typePriority.indexOf(a.type) - typePriority.indexOf(b.type);
  });

  return sorted[0];
}

/**
 * TOMO User Context Document (UCD) Service
 *
 * Builds and maintains a personalization profile for each user.
 * The UCD grows richer as more sessions are logged and insights generated.
 * It gets injected into every AI prompt as natural language context.
 *
 * See docs/insights/PERSONALIZATION.md for full spec.
 */

import type { Session, Profile, BeltLevel, Submission } from '../types/mvp-types';
import type {
  UserContextDocument,
  UCDChangeEntry,
  TrendDirection,
  TechniqueProfile,
} from '../types/insights-types';
import { quickSentimentCheck } from '../config/belt-system/journal-patterns';

// ===========================================
// HELPERS
// ===========================================

/** Calculate age in years from an ISO date string (YYYY-MM-DD) */
function calculateAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// ===========================================
// UCD BUILDER
// ===========================================

/**
 * Build a complete UCD from a user's profile and session history.
 * Called after each new session is saved to recompute patterns.
 */
export function buildUserContext(
  profile: Profile,
  sessions: Session[]
): UserContextDocument {
  const activeSessions = sessions.filter((s) => s.deleted_at === null);
  const monthsTraining = calculateMonthsTraining(profile.created_at);

  return {
    version: 1,
    sessionsAnalyzed: activeSessions.length,
    lastRebuilt: new Date().toISOString(),

    profile: {
      name: profile.name,
      belt: profile.belt,
      stripes: profile.stripes,
      age: calculateAge(profile.birth_date),
      gender: profile.gender,
      bodyWeightKg: profile.body_weight_kg,
      gym: profile.gym_name,
      monthsTraining,
      trainingGoals: profile.training_goals,
      experienceLevel: profile.experience_level,
      targetFrequency: profile.target_frequency,
    },

    patterns: buildPatterns(activeSessions, profile),

    preferences: {
      chatStyle: null, // populated after chat interactions
      insightPreference: null, // populated after feedback
      coachRelationship: detectCoachRelationship(activeSessions),
    },

    recentChanges: [],
  };
}

// ===========================================
// PATTERN BUILDERS
// ===========================================

function buildPatterns(sessions: Session[], profile: Profile) {
  return {
    styleIdentity: sessions.length >= 10 ? identifyStyle(sessions) : null,
    topSubmissions: computeTopSubmissions(sessions),
    vulnerabilities: computeVulnerabilities(sessions),
    avgFrequency: computeAvgFrequency(sessions),
    modePreference: sessions.length >= 10 ? computeModePreference(sessions) : null,
    injuryHistory: buildInjuryHistory(sessions),
    consistencyPattern: computeConsistencyPattern(sessions, profile.target_frequency),
    breakthroughLog: detectBreakthroughs(sessions),
    plateauHistory: detectPlateaus(sessions, profile.belt),
    sparringIntensity: computeSparringIntensity(sessions),
    techniqueProfile: sessions.length >= 10 ? classifyTechniqueProfile(sessions) : null,
    submissionRatioTrend: computeSubmissionRatioTrend(sessions),
  };
}

/**
 * Identify the user's emerging style based on top techniques.
 * Returns natural language like "Half guard player with armbar finish"
 */
function identifyStyle(sessions: Session[]): string {
  // Count all techniques across sessions
  const techCounts: Record<string, number> = {};
  for (const s of sessions) {
    for (const t of s.techniques_drilled ?? []) {
      const normalized = t.toLowerCase().trim();
      if (normalized) {
        techCounts[normalized] = (techCounts[normalized] ?? 0) + 1;
      }
    }
  }

  const sorted = Object.entries(techCounts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return 'Developing -- exploring multiple positions';

  // Categorize techniques into positions and finishes
  const positionKeywords = [
    'guard', 'half guard', 'mount', 'side control', 'back', 'turtle',
    'closed guard', 'open guard', 'butterfly', 'de la riva', 'x guard',
    'spider guard', 'lasso', 'z guard', 'knee shield', 'deep half',
  ];
  const finishKeywords = [
    'armbar', 'triangle', 'kimura', 'guillotine', 'choke', 'americana',
    'rear naked', 'rnc', 'darce', 'anaconda', 'ezekiel', 'cross collar',
    'bow and arrow', 'omoplata', 'heel hook', 'kneebar', 'toe hold',
    'wristlock', 'north south choke', 'loop choke',
  ];
  const movementKeywords = [
    'sweep', 'pass', 'takedown', 'escape', 'knee slice', 'torreando',
    'stack pass', 'leg drag', 'single leg', 'double leg',
  ];

  const topPositions: string[] = [];
  const topFinishes: string[] = [];
  const topMovements: string[] = [];

  for (const [tech] of sorted.slice(0, 15)) {
    if (topPositions.length < 2 && positionKeywords.some((kw) => tech.includes(kw))) {
      topPositions.push(tech);
    } else if (topFinishes.length < 2 && finishKeywords.some((kw) => tech.includes(kw))) {
      topFinishes.push(tech);
    } else if (topMovements.length < 2 && movementKeywords.some((kw) => tech.includes(kw))) {
      topMovements.push(tech);
    }
  }

  // Also check top submissions for finish info
  const subCounts: Record<string, number> = {};
  for (const s of sessions) {
    for (const sub of s.submissions_given ?? []) {
      const normalized = sub.type.toLowerCase().trim();
      subCounts[normalized] = (subCounts[normalized] ?? 0) + sub.count;
    }
  }
  const topSub = Object.entries(subCounts).sort((a, b) => b[1] - a[1])[0];
  if (topSub && topFinishes.length === 0) {
    topFinishes.push(topSub[0]);
  }

  // Build natural language description
  const parts: string[] = [];

  if (topPositions.length > 0) {
    parts.push(capitalize(topPositions[0]) + ' player');
  }

  if (topMovements.length > 0) {
    parts.push(capitalize(topMovements[0]));
  }

  if (topFinishes.length > 0) {
    parts.push(capitalize(topFinishes[0]) + ' finish');
  }

  if (parts.length === 0) {
    // Fallback: just use the top 3 techniques
    const top3 = sorted.slice(0, 3).map(([t]) => capitalize(t));
    if (top3.length > 0) {
      return `Developing -- focuses on ${top3.join(', ')}`;
    }
    return 'Developing -- exploring multiple positions';
  }

  return parts.join(' -- ');
}

/**
 * Top submissions given (what the user finishes with)
 */
function computeTopSubmissions(
  sessions: Session[]
): Array<{ type: string; count: number }> | null {
  const subCounts: Record<string, number> = {};

  for (const s of sessions) {
    for (const sub of s.submissions_given ?? []) {
      const normalized = sub.type.toLowerCase().trim();
      if (normalized) {
        subCounts[normalized] = (subCounts[normalized] ?? 0) + sub.count;
      }
    }
  }

  const sorted = Object.entries(subCounts)
    .map(([type, count]) => ({ type: capitalize(type), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return sorted.length > 0 ? sorted : null;
}

/**
 * Top submissions received (what catches the user)
 */
function computeVulnerabilities(
  sessions: Session[]
): Array<{ type: string; count: number }> | null {
  const subCounts: Record<string, number> = {};

  for (const s of sessions) {
    for (const sub of s.submissions_received ?? []) {
      const normalized = sub.type.toLowerCase().trim();
      if (normalized) {
        subCounts[normalized] = (subCounts[normalized] ?? 0) + sub.count;
      }
    }
  }

  const sorted = Object.entries(subCounts)
    .map(([type, count]) => ({ type: capitalize(type), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return sorted.length > 0 ? sorted : null;
}

/**
 * Rolling 4-week average sessions per week
 */
function computeAvgFrequency(sessions: Session[]): number | null {
  if (sessions.length === 0) return null;

  const now = new Date();
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Check if we have at least 2 weeks of data (earliest session is >= 14 days old)
  const sortedByDate = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const earliestSession = new Date(sortedByDate[0].date);
  if (earliestSession > twoWeeksAgo) return null;

  // Count unique training days in the last 28 days
  const recentDays = new Set<string>();
  for (const s of sessions) {
    const sessionDate = new Date(s.date);
    if (sessionDate >= fourWeeksAgo && sessionDate <= now) {
      recentDays.add(s.date);
    }
  }

  const weeksOfData = Math.min(
    4,
    Math.ceil((now.getTime() - Math.max(earliestSession.getTime(), fourWeeksAgo.getTime())) / (7 * 24 * 60 * 60 * 1000))
  );

  if (weeksOfData === 0) return null;

  return Math.round((recentDays.size / weeksOfData) * 10) / 10;
}

/**
 * Gi vs nogi preference as percentages
 */
function computeModePreference(
  sessions: Session[]
): { gi: number; nogi: number } | null {
  let giCount = 0;
  let nogiCount = 0;

  for (const s of sessions) {
    if (s.training_mode === 'gi') giCount++;
    else if (s.training_mode === 'nogi') nogiCount++;
  }

  const total = giCount + nogiCount;
  if (total === 0) return null;

  return {
    gi: Math.round((giCount / total) * 100),
    nogi: Math.round((nogiCount / total) * 100),
  };
}

/**
 * Build injury history from all session injury mentions
 */
function buildInjuryHistory(
  sessions: Session[]
): Array<{
  bodyPart: string;
  occurrences: number;
  firstMentioned: string;
  lastMentioned: string;
}> {
  const injuryMap: Record<
    string,
    { occurrences: number; firstMentioned: string; lastMentioned: string }
  > = {};

  // Sort sessions by date ascending for accurate first/last tracking
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const s of sorted) {
    for (const injury of s.injuries ?? []) {
      const bodyPart = normalizeBodyPart(injury);
      if (!injuryMap[bodyPart]) {
        injuryMap[bodyPart] = {
          occurrences: 1,
          firstMentioned: s.date,
          lastMentioned: s.date,
        };
      } else {
        injuryMap[bodyPart].occurrences++;
        injuryMap[bodyPart].lastMentioned = s.date;
      }
    }
  }

  return Object.entries(injuryMap)
    .map(([bodyPart, data]) => ({ bodyPart, ...data }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

/**
 * Compute consistency pattern from session dates
 */
function computeConsistencyPattern(
  sessions: Session[],
  targetFrequency: number
): { avgStreak: number; longestStreak: number; adherenceRate: number } | null {
  if (sessions.length === 0) return null;

  const now = new Date();
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Check we have at least 2 weeks of data
  const sortedByDate = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const earliestSession = new Date(sortedByDate[0].date);
  if (earliestSession > twoWeeksAgo) return null;

  // Get unique training dates sorted ascending
  const uniqueDatesSet = new Set(sessions.map((s) => s.date));
  const uniqueDates = [...uniqueDatesSet].sort();

  // Calculate streaks: a "streak" is consecutive calendar days with training
  const streaks: number[] = [];
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      currentStreak++;
    } else {
      streaks.push(currentStreak);
      currentStreak = 1;
    }
  }
  streaks.push(currentStreak);

  const longestStreak = Math.max(...streaks);
  const avgStreak =
    Math.round((streaks.reduce((a, b) => a + b, 0) / streaks.length) * 10) / 10;

  // Calculate adherence over last 4 weeks
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  let weeksChecked = 0;
  let weeksHit = 0;

  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(fourWeeksAgo);
    weekStart.setDate(weekStart.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Only count weeks where the user had an account
    if (weekStart < earliestSession && weekEnd < earliestSession) continue;

    weeksChecked++;
    const sessionsInWeek = sessions.filter((s) => {
      const d = new Date(s.date);
      return d >= weekStart && d < weekEnd;
    });

    // Count unique days in this week
    const daysInWeek = new Set(sessionsInWeek.map((s) => s.date)).size;
    if (daysInWeek >= targetFrequency) {
      weeksHit++;
    }
  }

  const adherenceRate =
    weeksChecked > 0 ? Math.round((weeksHit / weeksChecked) * 100) : 0;

  return { avgStreak, longestStreak, adherenceRate };
}

/**
 * Detect breakthrough moments from journal text.
 * Uses patterns like "finally clicked", "figured it out", "first time I ever"
 */
function detectBreakthroughs(
  sessions: Session[]
): Array<{ technique: string; date: string }> {
  const breakthroughPatterns = [
    /finally (clicked|got|landed|hit|figured out|understand)/i,
    /first time I (ever )?(got|hit|landed|pulled off|finished)/i,
    /something clicked/i,
    /it (all )?made sense/i,
    /breakthrough/i,
    /light ?bulb (moment|went off)/i,
    /a-?ha moment/i,
    /everything came together/i,
  ];

  const breakthroughs: Array<{ technique: string; date: string }> = [];

  // Sort sessions by date ascending
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const s of sorted) {
    const textToScan = [s.notes ?? '', s.transcript ?? ''].join(' ').trim();
    if (!textToScan) continue;

    for (const pattern of breakthroughPatterns) {
      const match = textToScan.match(pattern);
      if (match) {
        // Try to extract a technique name from the surrounding context
        const technique = extractTechniqueFromContext(textToScan, match.index ?? 0, s);
        breakthroughs.push({ technique, date: s.date });
        break; // One breakthrough per session
      }
    }
  }

  return breakthroughs;
}

/**
 * Extract the most likely technique name near a breakthrough mention.
 * Falls back to techniques_drilled or lesson_topic if text extraction fails.
 */
function extractTechniqueFromContext(
  text: string,
  matchIndex: number,
  session: Session
): string {
  // Check for common technique names near the match (within 100 chars)
  const surroundingStart = Math.max(0, matchIndex - 60);
  const surroundingEnd = Math.min(text.length, matchIndex + 100);
  const surrounding = text.slice(surroundingStart, surroundingEnd).toLowerCase();

  const techniqueNames = [
    'armbar', 'triangle', 'kimura', 'guillotine', 'americana', 'rear naked',
    'rnc', 'darce', 'anaconda', 'ezekiel', 'cross collar', 'bow and arrow',
    'omoplata', 'heel hook', 'kneebar', 'toe hold', 'wristlock',
    'north south', 'loop choke', 'half guard', 'closed guard', 'open guard',
    'butterfly guard', 'de la riva', 'x guard', 'spider guard', 'z guard',
    'deep half', 'knee slice', 'torreando', 'stack pass', 'leg drag',
    'single leg', 'double leg', 'hip escape', 'bridge', 'sweep',
    'mount escape', 'side control escape', 'back take', 'berimbolo',
    'arm drag', 'collar drag', 'scissor sweep', 'flower sweep',
    'pendulum sweep', 'hip bump sweep',
  ];

  for (const tech of techniqueNames) {
    if (surrounding.includes(tech)) {
      return capitalize(tech);
    }
  }

  // Fallback: use the session's lesson_topic or first technique drilled
  if (session.lesson_topic) return session.lesson_topic;
  if (session.techniques_drilled?.length > 0) return session.techniques_drilled[0];

  return 'General technique';
}

/**
 * Detect plateau periods from sentiment and session patterns.
 * A plateau is 2+ weeks with negative/stuck sentiment or a 2+ week gap.
 */
function detectPlateaus(
  sessions: Session[],
  _belt: BeltLevel
): Array<{ period: string; resolved: boolean }> {
  if (sessions.length < 4) return [];

  const plateaus: Array<{ period: string; resolved: boolean }> = [];

  // Sort sessions by date ascending
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Detect sentiment-based plateaus: sliding 2-week windows with negative sentiment
  const windowSizeDays = 14;
  let plateauStart: string | null = null;

  for (let i = 0; i < sorted.length; i++) {
    const windowEnd = new Date(sorted[i].date);
    const windowStart = new Date(windowEnd);
    windowStart.setDate(windowStart.getDate() - windowSizeDays);

    const windowSessions = sorted.filter((s) => {
      const d = new Date(s.date);
      return d >= windowStart && d <= windowEnd;
    });

    if (windowSessions.length < 2) continue;

    // Check sentiment of sessions in this window
    const sentiments = windowSessions.map((s) => {
      const text = [s.notes ?? '', s.transcript ?? ''].join(' ').trim();
      return text ? quickSentimentCheck(text) : 'neutral';
    });

    const negativeCount = sentiments.filter((s) => s === 'negative').length;
    const isNegativeWindow = negativeCount >= Math.ceil(windowSessions.length * 0.5);

    if (isNegativeWindow && !plateauStart) {
      plateauStart = sorted[i].date;
    } else if (!isNegativeWindow && plateauStart) {
      const startMonth = formatDate(plateauStart);
      const endMonth = formatDate(sorted[i].date);
      const period = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
      plateaus.push({ period, resolved: true });
      plateauStart = null;
    }
  }

  // If still in a plateau at the end
  if (plateauStart) {
    plateaus.push({ period: `Since ${formatDate(plateauStart)}`, resolved: false });
  }

  // Detect gap-based plateaus: 2+ week gaps between sessions
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const gapDays = Math.round(
      (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (gapDays >= 14) {
      const period = `${formatDate(sorted[i - 1].date)} - ${formatDate(sorted[i].date)}`;
      // Check if positive sentiment returned after the gap
      const afterGapText = [sorted[i].notes ?? '', sorted[i].transcript ?? ''].join(' ').trim();
      const resolved = afterGapText ? quickSentimentCheck(afterGapText) === 'positive' : true;
      plateaus.push({ period: `${gapDays}-day gap (${period})`, resolved });
    }
  }

  return plateaus;
}

/**
 * Average sparring rounds per session and trend
 */
function computeSparringIntensity(
  sessions: Session[]
): { avgRounds: number; trend: TrendDirection } | null {
  const sparringSessions = sessions.filter(
    (s) => s.did_spar && s.sparring_rounds != null && s.sparring_rounds > 0
  );

  if (sparringSessions.length < 2) return null;

  // Sort by date ascending
  const sorted = [...sparringSessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalRounds = sorted.reduce((sum, s) => sum + (s.sparring_rounds ?? 0), 0);
  const avgRounds = Math.round((totalRounds / sorted.length) * 10) / 10;

  // Compute trend: compare last 4 weeks to prior 4 weeks
  const now = new Date();
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const recentSessions = sorted.filter((s) => new Date(s.date) >= fourWeeksAgo);
  const priorSessions = sorted.filter(
    (s) => new Date(s.date) >= eightWeeksAgo && new Date(s.date) < fourWeeksAgo
  );

  let trend: TrendDirection = 'stable';

  if (recentSessions.length > 0 && priorSessions.length > 0) {
    const recentAvg =
      recentSessions.reduce((sum, s) => sum + (s.sparring_rounds ?? 0), 0) /
      recentSessions.length;
    const priorAvg =
      priorSessions.reduce((sum, s) => sum + (s.sparring_rounds ?? 0), 0) /
      priorSessions.length;

    const delta = recentAvg - priorAvg;
    if (delta > 0.5) trend = 'improving';
    else if (delta < -0.5) trend = 'declining';
  }

  return { avgRounds, trend };
}

/**
 * Classify whether user is specialist (deep in few techniques) or generalist (broad).
 */
function classifyTechniqueProfile(sessions: Session[]): TechniqueProfile {
  const techCounts: Record<string, number> = {};
  let totalDrillInstances = 0;

  for (const s of sessions) {
    for (const t of s.techniques_drilled ?? []) {
      const normalized = t.toLowerCase().trim();
      if (normalized) {
        techCounts[normalized] = (techCounts[normalized] ?? 0) + 1;
        totalDrillInstances++;
      }
    }
  }

  if (totalDrillInstances === 0) return 'developing';

  const sorted = Object.entries(techCounts).sort((a, b) => b[1] - a[1]);
  const top3Count = sorted.slice(0, 3).reduce((sum, [, count]) => sum + count, 0);
  const top3Ratio = top3Count / totalDrillInstances;

  if (top3Ratio > 0.6) return 'specialist';
  if (top3Ratio < 0.3) return 'generalist';
  return 'developing';
}

/**
 * Submission ratio trend over last 3 months.
 * Ratio = submissions given / (given + received).
 */
function computeSubmissionRatioTrend(sessions: Session[]): TrendDirection | null {
  const now = new Date();

  // Compute ratio for each of the last 3 months
  const monthlyRatios: Array<{ month: number; ratio: number }> = [];

  for (let m = 2; m >= 0; m--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0);

    const monthSessions = sessions.filter((s) => {
      const d = new Date(s.date);
      return d >= monthStart && d <= monthEnd;
    });

    let given = 0;
    let received = 0;

    for (const s of monthSessions) {
      for (const sub of s.submissions_given ?? []) given += sub.count;
      for (const sub of s.submissions_received ?? []) received += sub.count;
    }

    const total = given + received;
    if (total > 0) {
      monthlyRatios.push({ month: m, ratio: given / total });
    }
  }

  // Need at least 2 months of submission data
  if (monthlyRatios.length < 2) return null;

  const first = monthlyRatios[0].ratio;
  const last = monthlyRatios[monthlyRatios.length - 1].ratio;
  const delta = last - first;

  if (delta > 0.1) return 'improving';
  if (delta < -0.1) return 'declining';
  return 'stable';
}

/**
 * Detect if user mentions coach/privates in journal text.
 */
function detectCoachRelationship(sessions: Session[]): string | null {
  const coachPatterns = [
    { pattern: /private (lesson|class) with (\w+)/i, type: 'private_lessons' },
    { pattern: /my (coach|professor|instructor) (\w+)/i, type: 'named_coach' },
    { pattern: /coach (\w+)/i, type: 'named_coach' },
    { pattern: /professor (\w+)/i, type: 'named_coach' },
    { pattern: /lesson with (\w+)/i, type: 'lesson_with' },
    { pattern: /private(s)? (with|from)/i, type: 'takes_privates' },
  ];

  const coachNames = new Set<string>();
  let takesPrivates = false;

  for (const s of sessions) {
    const textToScan = [s.notes ?? '', s.transcript ?? ''].join(' ').trim();
    if (!textToScan) continue;

    // Also check the instructor field
    if (s.instructor) {
      coachNames.add(s.instructor);
    }

    for (const { pattern, type } of coachPatterns) {
      const match = textToScan.match(pattern);
      if (match) {
        if (type === 'takes_privates' || type === 'private_lessons') {
          takesPrivates = true;
        }
        // Extract coach name from capture groups (skip common false positives)
        const name = match[match.length - 1];
        if (
          name &&
          name.length > 1 &&
          !['my', 'the', 'a', 'an', 'some', 'with', 'from'].includes(name.toLowerCase())
        ) {
          coachNames.add(name);
        }
      }
    }
  }

  if (coachNames.size === 0 && !takesPrivates) return null;

  const parts: string[] = [];
  if (coachNames.size > 0) {
    const names = [...coachNames].slice(0, 3).join(', ');
    parts.push(`Trains with ${names}`);
  }
  if (takesPrivates) {
    parts.push('takes private lessons');
  }

  return parts.join('; ');
}

// ===========================================
// MONTHS TRAINING CALCULATOR
// ===========================================

function calculateMonthsTraining(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  return Math.max(0, months);
}

// ===========================================
// UCD SERIALIZATION
// ===========================================

/**
 * Serialize the UCD to natural language for prompt injection.
 * Output should be ~200-400 tokens, concise but complete.
 */
export function serializeUCD(ucd: UserContextDocument): string {
  const lines: string[] = [];

  // Profile
  lines.push(`Name: ${ucd.profile.name}`);
  lines.push(
    `Belt: ${capitalize(ucd.profile.belt)} (${ucd.profile.stripes} stripes), ${ucd.profile.monthsTraining} months training`
  );
  if (ucd.profile.gym) {
    lines.push(`Gym: ${ucd.profile.gym}`);
  }

  if (ucd.profile.trainingGoals?.length) {
    lines.push(`Goals: ${ucd.profile.trainingGoals.join(', ')}`);
  }

  if (ucd.profile.experienceLevel) {
    lines.push(`Experience: ${capitalize(ucd.profile.experienceLevel)}`);
  }

  // Style
  if (ucd.patterns.styleIdentity) {
    lines.push(`Style: ${ucd.patterns.styleIdentity}`);
  }

  // Technique Profile
  if (ucd.patterns.techniqueProfile) {
    lines.push(`Technique approach: ${capitalize(ucd.patterns.techniqueProfile)}`);
  }

  // Submissions
  if (ucd.patterns.topSubmissions?.length) {
    const top = ucd.patterns.topSubmissions
      .slice(0, 3)
      .map((s) => `${s.type} (${s.count}x)`)
      .join(', ');
    lines.push(`Top submissions: ${top}`);
  }

  if (ucd.patterns.vulnerabilities?.length) {
    const top = ucd.patterns.vulnerabilities
      .slice(0, 3)
      .map((s) => `${s.type} (${s.count}x received)`)
      .join(', ');
    lines.push(`Vulnerabilities: ${top}`);
  }

  // Submission ratio trend
  if (ucd.patterns.submissionRatioTrend) {
    lines.push(`Submission ratio trend: ${ucd.patterns.submissionRatioTrend}`);
  }

  // Training frequency
  if (ucd.patterns.avgFrequency !== null) {
    lines.push(
      `Training: ${ucd.patterns.avgFrequency} sessions/week (target: ${ucd.profile.targetFrequency})`
    );
  }

  if (ucd.patterns.modePreference) {
    lines.push(
      `Mode: ${ucd.patterns.modePreference.gi}% gi, ${ucd.patterns.modePreference.nogi}% nogi`
    );
  }

  // Consistency
  if (ucd.patterns.consistencyPattern) {
    const cp = ucd.patterns.consistencyPattern;
    lines.push(
      `Consistency: ${cp.adherenceRate}% adherence, longest streak ${cp.longestStreak} days`
    );
  }

  // Sparring
  if (ucd.patterns.sparringIntensity) {
    const si = ucd.patterns.sparringIntensity;
    lines.push(`Sparring: ${si.avgRounds} avg rounds/session (${si.trend})`);
  }

  // Injuries
  if (ucd.patterns.injuryHistory.length > 0) {
    const injuries = ucd.patterns.injuryHistory
      .map(
        (i) =>
          `${i.bodyPart} (${i.occurrences}x, since ${formatDate(i.firstMentioned)})`
      )
      .join(', ');
    lines.push(`Injury history: ${injuries}`);
  }

  // Breakthroughs
  if (ucd.patterns.breakthroughLog.length > 0) {
    const recent = ucd.patterns.breakthroughLog
      .slice(-3)
      .map((b) => `${b.technique} (${formatDate(b.date)})`)
      .join(', ');
    lines.push(`Recent breakthroughs: ${recent}`);
  }

  // Plateaus
  const activePlateaus = ucd.patterns.plateauHistory.filter((p) => !p.resolved);
  if (activePlateaus.length > 0) {
    lines.push(`Active plateau: ${activePlateaus[0].period}`);
  }

  // Coach
  if (ucd.preferences.coachRelationship) {
    lines.push(`Coach: ${ucd.preferences.coachRelationship}`);
  }

  // Preferences
  if (ucd.preferences.chatStyle) {
    lines.push(`Chat preference: ${ucd.preferences.chatStyle}`);
  }

  if (ucd.preferences.insightPreference) {
    lines.push(`Insight preference: ${ucd.preferences.insightPreference}`);
  }

  return lines.join('\n');
}

// ===========================================
// CHANGE DETECTION
// ===========================================

/**
 * Compare two UCDs and return meaningful changes.
 * Only logs changes that would affect insight generation.
 */
export function detectChanges(
  current: UserContextDocument,
  previous: UserContextDocument
): UCDChangeEntry[] {
  const changes: UCDChangeEntry[] = [];
  const now = new Date().toISOString().split('T')[0];

  // Check style identity change
  if (current.patterns.styleIdentity !== previous.patterns.styleIdentity) {
    changes.push({
      date: now,
      field: 'styleIdentity',
      oldValue: previous.patterns.styleIdentity,
      newValue: current.patterns.styleIdentity,
      reason: 'Technique frequency shifted top positions',
    });
  }

  // Check belt change
  if (current.profile.belt !== previous.profile.belt) {
    changes.push({
      date: now,
      field: 'belt',
      oldValue: previous.profile.belt,
      newValue: current.profile.belt,
      reason: 'Belt promotion',
    });
  }

  // Check stripe change
  if (current.profile.stripes !== previous.profile.stripes) {
    changes.push({
      date: now,
      field: 'stripes',
      oldValue: previous.profile.stripes,
      newValue: current.profile.stripes,
      reason:
        current.profile.stripes > previous.profile.stripes
          ? 'Stripe promotion'
          : 'Belt promotion reset stripes',
    });
  }

  // Check technique profile shift
  if (current.patterns.techniqueProfile !== previous.patterns.techniqueProfile) {
    changes.push({
      date: now,
      field: 'techniqueProfile',
      oldValue: previous.patterns.techniqueProfile,
      newValue: current.patterns.techniqueProfile,
      reason: 'Technique diversity changed',
    });
  }

  // Check submission ratio trend shift
  if (
    current.patterns.submissionRatioTrend !== previous.patterns.submissionRatioTrend
  ) {
    changes.push({
      date: now,
      field: 'submissionRatioTrend',
      oldValue: previous.patterns.submissionRatioTrend,
      newValue: current.patterns.submissionRatioTrend,
      reason: 'Sparring outcomes shifted',
    });
  }

  // Check new recurring injury
  const currentInjuryParts = new Set(
    current.patterns.injuryHistory.map((i) => i.bodyPart)
  );
  const previousInjuryParts = new Set(
    previous.patterns.injuryHistory.map((i) => i.bodyPart)
  );
  for (const part of currentInjuryParts) {
    if (!previousInjuryParts.has(part)) {
      changes.push({
        date: now,
        field: 'injuryHistory',
        oldValue: null,
        newValue: part,
        reason: 'New recurring injury detected',
      });
    }
  }

  // Check new breakthrough
  if (
    current.patterns.breakthroughLog.length >
    previous.patterns.breakthroughLog.length
  ) {
    const newBreakthroughs = current.patterns.breakthroughLog.slice(
      previous.patterns.breakthroughLog.length
    );
    for (const b of newBreakthroughs) {
      changes.push({
        date: now,
        field: 'breakthroughLog',
        oldValue: null,
        newValue: b.technique,
        reason: 'Breakthrough detected in journal',
      });
    }
  }

  // Check sparring intensity trend change
  if (
    current.patterns.sparringIntensity?.trend !==
    previous.patterns.sparringIntensity?.trend
  ) {
    changes.push({
      date: now,
      field: 'sparringIntensity',
      oldValue: previous.patterns.sparringIntensity?.trend ?? null,
      newValue: current.patterns.sparringIntensity?.trend ?? null,
      reason: 'Sparring volume trend changed',
    });
  }

  // Check coach relationship change
  if (
    current.preferences.coachRelationship !== previous.preferences.coachRelationship
  ) {
    changes.push({
      date: now,
      field: 'coachRelationship',
      oldValue: previous.preferences.coachRelationship,
      newValue: current.preferences.coachRelationship,
      reason: 'Coach/instructor relationship updated',
    });
  }

  return changes;
}

/**
 * Determine if changes warrant a UCD version bump.
 * Only meaningful changes trigger a version increment.
 */
export function hasSignificantChanges(changes: UCDChangeEntry[]): boolean {
  const significantFields = [
    'styleIdentity',
    'belt',
    'techniqueProfile',
    'injuryHistory',
    'submissionRatioTrend',
  ];
  return changes.some((c) => significantFields.includes(c.field));
}

// ===========================================
// HELPERS
// ===========================================

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Body part normalization map
const BODY_PART_ALIASES: Record<string, string> = {
  'shoulder soreness': 'shoulder',
  'sore shoulder': 'shoulder',
  'left shoulder': 'shoulder',
  'right shoulder': 'shoulder',
  'shoulder pain': 'shoulder',
  'knee pain': 'knee',
  'sore knee': 'knee',
  'left knee': 'knee',
  'right knee': 'knee',
  'back pain': 'back',
  'lower back': 'back',
  'upper back': 'back',
  'sore back': 'back',
  'neck pain': 'neck',
  'stiff neck': 'neck',
  'sore neck': 'neck',
  'finger injury': 'fingers',
  'jammed finger': 'fingers',
  'sore fingers': 'fingers',
  'finger pain': 'fingers',
  'elbow pain': 'elbow',
  'sore elbow': 'elbow',
  'left elbow': 'elbow',
  'right elbow': 'elbow',
  'ankle pain': 'ankle',
  'twisted ankle': 'ankle',
  'sore ankle': 'ankle',
  'wrist pain': 'wrist',
  'sore wrist': 'wrist',
  'rib injury': 'ribs',
  'sore ribs': 'ribs',
  'cracked rib': 'ribs',
  'rib pain': 'ribs',
  'hip pain': 'hip',
  'sore hip': 'hip',
  'left hip': 'hip',
  'right hip': 'hip',
  'toe injury': 'toes',
  'jammed toe': 'toes',
  'broken toe': 'toes',
};

function normalizeBodyPart(injury: string): string {
  const lower = injury.toLowerCase().trim();
  if (BODY_PART_ALIASES[lower]) return BODY_PART_ALIASES[lower];

  // Try to extract body part from the string
  const bodyParts = [
    'shoulder',
    'knee',
    'back',
    'neck',
    'finger',
    'elbow',
    'ankle',
    'wrist',
    'rib',
    'hip',
    'toe',
  ];
  for (const part of bodyParts) {
    if (lower.includes(part)) {
      if (part === 'finger') return 'fingers';
      if (part === 'rib') return 'ribs';
      if (part === 'toe') return 'toes';
      return part;
    }
  }
  return lower; // fallback to the raw string
}

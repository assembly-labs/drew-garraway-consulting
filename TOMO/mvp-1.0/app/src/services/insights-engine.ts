/**
 * TOMO Insights Engine -- Client-Side Pattern Computation
 *
 * Computes training patterns from session data without any AI calls.
 * Feeds pre-computed summaries to edge functions for AI insight generation.
 *
 * All computation is local -- free, fast, works offline.
 * See docs/insights/README.md for architecture.
 */

import type { Session, Submission, BeltLevel } from '../types/mvp-types';
import type {
  WeeklyPatterns,
  MonthlyPatterns,
  QuarterlyPatterns,
  WeeklyInsightInput,
  MonthlyInsightInput,
  QuarterlyInsightInput,
  SentimentValue,
  TrendDirection,
  InsightEligibility,
  LowerTierContext,
} from '../types/insights-types';
import { analyzeJournalEntry, quickSentimentCheck } from '../config/belt-system/journal-patterns';

// ===========================================
// DATE HELPERS
// ===========================================

/** Get the Monday-to-Sunday week bounds for a given date */
export function getWeekBounds(date: Date): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: toDateString(monday),
    end: toDateString(sunday),
  };
}

/** Get month bounds */
function getMonthBounds(year: number, month: number): { start: string; end: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month
  return {
    start: toDateString(start),
    end: toDateString(end),
  };
}

/** Get quarter bounds (Q1=Jan-Mar, Q2=Apr-Jun, etc.) */
function getQuarterBounds(year: number, quarter: number): { start: string; end: string } {
  const startMonth = (quarter - 1) * 3; // 0-indexed month
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0); // last day of 3rd month
  return {
    start: toDateString(start),
    end: toDateString(end),
  };
}

/** Get current quarter number (1-4) */
function getCurrentQuarter(): number {
  return Math.floor(new Date().getMonth() / 3) + 1;
}

/** Calculate days between two dates */
function daysBetween(a: string, b: string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const diff = Math.abs(dateB.getTime() - dateA.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Format month name from date string (YYYY-MM-DD) -> "March 2026" */
function formatMonth(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Helper: Date -> YYYY-MM-DD string */
export function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get today as YYYY-MM-DD */
function todayString(): string {
  return toDateString(new Date());
}

// ===========================================
// SESSION FILTERING
// ===========================================

/** Filter sessions to a date range, excluding soft-deleted */
function filterSessions(sessions: Session[], start: string, end: string): Session[] {
  return sessions.filter(
    (s) => s.date >= start && s.date <= end && s.deleted_at === null
  );
}

/** Filter sessions for the current week */
function getThisWeekSessions(sessions: Session[]): Session[] {
  const { start, end } = getWeekBounds(new Date());
  return filterSessions(sessions, start, end);
}

/** Filter sessions for the prior week (for delta comparison) */
function getPriorWeekSessions(sessions: Session[]): Session[] {
  const priorWeekDate = new Date();
  priorWeekDate.setDate(priorWeekDate.getDate() - 7);
  const { start, end } = getWeekBounds(priorWeekDate);
  return filterSessions(sessions, start, end);
}

/** Filter sessions for a specific month */
function getMonthSessions(sessions: Session[], year: number, month: number): Session[] {
  const { start, end } = getMonthBounds(year, month);
  return filterSessions(sessions, start, end);
}

/** Filter sessions for a quarter */
function getQuarterSessions(sessions: Session[], year: number, quarter: number): Session[] {
  const { start, end } = getQuarterBounds(year, quarter);
  return filterSessions(sessions, start, end);
}

// ===========================================
// CORE COMPUTATIONS
// ===========================================

/** Count techniques across sessions, return sorted by frequency */
function computeTechniqueFrequency(sessions: Session[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const session of sessions) {
    for (const technique of session.techniques_drilled) {
      const normalized = technique.toLowerCase().trim();
      freq[normalized] = (freq[normalized] || 0) + 1;
    }
  }
  return Object.fromEntries(
    Object.entries(freq).sort(([, a], [, b]) => b - a)
  );
}

/** Aggregate submissions given/received across sessions */
function aggregateSubmissions(sessions: Session[]): {
  given: Record<string, number>;
  received: Record<string, number>;
  ratio: number;
} {
  const given: Record<string, number> = {};
  const received: Record<string, number> = {};
  let totalGiven = 0;
  let totalReceived = 0;

  for (const session of sessions) {
    for (const sub of session.submissions_given) {
      given[sub.type] = (given[sub.type] || 0) + sub.count;
      totalGiven += sub.count;
    }
    for (const sub of session.submissions_received) {
      received[sub.type] = (received[sub.type] || 0) + sub.count;
      totalReceived += sub.count;
    }
  }

  return {
    given: Object.fromEntries(Object.entries(given).sort(([, a], [, b]) => b - a)),
    received: Object.fromEntries(Object.entries(received).sort(([, a], [, b]) => b - a)),
    ratio: totalReceived === 0 ? totalGiven : Number((totalGiven / totalReceived).toFixed(2)),
  };
}

/** Get mode breakdown (gi/nogi/other) */
function computeModeBreakdown(sessions: Session[]): Record<string, number> {
  const modes: Record<string, number> = {};
  for (const session of sessions) {
    modes[session.training_mode] = (modes[session.training_mode] || 0) + 1;
  }
  return modes;
}

/** Get kind breakdown (class/open_mat/etc.) */
function computeKindBreakdown(sessions: Session[]): Record<string, number> {
  const kinds: Record<string, number> = {};
  for (const session of sessions) {
    kinds[session.session_kind] = (kinds[session.session_kind] || 0) + 1;
  }
  return kinds;
}

/** Total sparring rounds across sessions */
function computeSparringRounds(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + (s.sparring_rounds || 0), 0);
}

/** Collect all injuries mentioned */
function collectInjuries(sessions: Session[]): string[] {
  const injuries: string[] = [];
  for (const session of sessions) {
    injuries.push(...session.injuries);
  }
  return injuries;
}

/** Find recurring injuries (mentioned 2+ times in the period) */
function findRecurringInjuries(injuries: string[]): string[] {
  const freq: Record<string, number> = {};
  for (const injury of injuries) {
    const normalized = injury.toLowerCase().trim();
    freq[normalized] = (freq[normalized] || 0) + 1;
  }
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .map(([injury]) => injury);
}

/** Compute sentiment for a set of sessions */
function computeSessionsSentiment(sessions: Session[]): SentimentValue {
  let positive = 0;
  let negative = 0;
  for (const session of sessions) {
    const text = [session.notes, session.transcript].filter(Boolean).join(' ');
    if (text) {
      const sentiment = quickSentimentCheck(text);
      if (sentiment === 'positive') positive++;
      if (sentiment === 'negative') negative++;
    }
  }
  if (positive > 0 && negative > 0) return 'mixed';
  if (positive > negative) return 'positive';
  if (negative > positive) return 'negative';
  return 'neutral';
}

/** Detect patterns from journal-patterns.ts across sessions */
function detectPatterns(sessions: Session[], belt: BeltLevel): string[] {
  const patterns = new Set<string>();
  for (const session of sessions) {
    const text = [session.notes, session.transcript].filter(Boolean).join(' ');
    if (text) {
      const result = analyzeJournalEntry(session.id, text, belt);
      for (const p of result.detectedPatterns) {
        patterns.add(p.patternId);
      }
    }
  }
  return Array.from(patterns);
}

/** Calculate training streak (consecutive days with at least one session, walking back from today) */
function calculateStreak(sessions: Session[]): number {
  const today = todayString();
  const sessionDates = new Set(
    sessions.filter((s) => s.deleted_at === null).map((s) => s.date)
  );

  let streak = 0;
  const currentDate = new Date(today + 'T00:00:00');

  while (true) {
    const dateStr = toDateString(currentDate);
    if (sessionDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/** Calculate adherence rate (actual sessions / target sessions for period) */
function calculateAdherence(sessionsLogged: number, targetPerWeek: number, weeks: number): number {
  const expected = targetPerWeek * weeks;
  if (expected === 0) return 0;
  return Number((sessionsLogged / expected).toFixed(2));
}

/** Find techniques new this period that weren't in prior period */
function findNewTechniques(currentTechniques: string[], priorTechniques: string[]): string[] {
  const priorSet = new Set(priorTechniques.map((t) => t.toLowerCase().trim()));
  return [...new Set(currentTechniques)]
    .filter((t) => !priorSet.has(t.toLowerCase().trim()));
}

/** Find techniques in prior period that didn't appear in current */
function findDroppedTechniques(currentTechniques: string[], priorTechniques: string[]): string[] {
  const currentSet = new Set(currentTechniques.map((t) => t.toLowerCase().trim()));
  return [...new Set(priorTechniques)]
    .filter((t) => !currentSet.has(t.toLowerCase().trim()));
}

/** Compute submission ratio trend across months */
function computeRatioTrend(current: number, prior: number | null): TrendDirection {
  if (prior === null) return 'stable';
  if (current > prior + 0.15) return 'improving';
  if (current < prior - 0.15) return 'declining';
  return 'stable';
}

/** Identify the emerging technique system from top techniques */
function identifyEmergingSystem(techniqueFreq: Record<string, number>): string {
  const top3 = Object.entries(techniqueFreq).slice(0, 3);
  if (top3.length === 0) return 'developing';
  return top3.map(([technique]) => technique).join(' / ');
}

/** Determine if technique diversity is narrowing (specializing) or broadening */
function computeDiversityTrend(
  currentUnique: number,
  priorUnique: number | null
): 'narrowing' | 'broadening' | 'stable' {
  if (priorUnique === null) return 'stable';
  if (currentUnique < priorUnique - 2) return 'narrowing';
  if (currentUnique > priorUnique + 2) return 'broadening';
  return 'stable';
}

/** Compute longest streak within a period (consecutive session dates) */
function computeLongestStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const sortedDates = [...new Set(sessions.map((s) => s.date))].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    if (daysBetween(sortedDates[i - 1], sortedDates[i]) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

/** Compute largest gap (in days) between consecutive sessions */
function computeLargestGap(sessions: Session[]): number {
  if (sessions.length <= 1) return 0;
  const sortedDates = [...new Set(sessions.map((s) => s.date))].sort();
  let maxGap = 0;
  for (let i = 1; i < sortedDates.length; i++) {
    const gap = daysBetween(sortedDates[i - 1], sortedDates[i]);
    if (gap > maxGap) maxGap = gap;
  }
  return maxGap;
}

/** Count how many calendar weeks had at least one injury mention */
function countWeeksWithInjury(sessions: Session[]): number {
  const weeks = new Set<string>();
  for (const session of sessions) {
    if (session.injuries.length > 0) {
      const { start } = getWeekBounds(new Date(session.date + 'T00:00:00'));
      weeks.add(start);
    }
  }
  return weeks.size;
}

/** Get sentiment per calendar week within a date range */
function computeSentimentByWeek(sessions: Session[]): SentimentValue[] {
  if (sessions.length === 0) return [];
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const weekMap = new Map<string, Session[]>();
  for (const session of sortedSessions) {
    const { start } = getWeekBounds(new Date(session.date + 'T00:00:00'));
    if (!weekMap.has(start)) weekMap.set(start, []);
    weekMap.get(start)!.push(session);
  }
  const sortedWeeks = [...weekMap.keys()].sort();
  return sortedWeeks.map((week) => computeSessionsSentiment(weekMap.get(week)!));
}

/** Get session counts per calendar week within a period */
function computeWeekByWeekSessions(sessions: Session[]): number[] {
  if (sessions.length === 0) return [];
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const weekMap = new Map<string, number>();
  for (const session of sortedSessions) {
    const { start } = getWeekBounds(new Date(session.date + 'T00:00:00'));
    weekMap.set(start, (weekMap.get(start) || 0) + 1);
  }
  const sortedWeeks = [...weekMap.keys()].sort();
  return sortedWeeks.map((week) => weekMap.get(week) || 0);
}

/** Get the top entry from a Record<string, number> or a default */
function topEntry(record: Record<string, number>, fallback: string): string {
  const entries = Object.entries(record).sort(([, a], [, b]) => b - a);
  return entries.length > 0 ? entries[0][0] : fallback;
}

/** Count the number of calendar weeks that overlap a date range */
function countWeeksInRange(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = e.getTime() - s.getTime();
  const days = diff / (1000 * 60 * 60 * 24) + 1;
  return Math.max(1, Math.ceil(days / 7));
}

// ===========================================
// WEEKLY PATTERN COMPUTATION
// ===========================================

export function computeWeeklyPatterns(
  sessions: Session[],
  belt: BeltLevel
): WeeklyPatterns {
  const { start, end } = getWeekBounds(new Date());
  const weekSessions = filterSessions(sessions, start, end);
  const techniques = weekSessions.flatMap((s) => s.techniques_drilled);

  return {
    weekStart: start,
    weekEnd: end,
    sessionsLogged: weekSessions.length,
    totalMinutes: weekSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
    modes: computeModeBreakdown(weekSessions),
    kinds: computeKindBreakdown(weekSessions),
    techniquesDrilled: [...new Set(techniques.map((t) => t.toLowerCase().trim()))],
    techniqueFrequency: computeTechniqueFrequency(weekSessions),
    sparringRounds: computeSparringRounds(weekSessions),
    submissionsGiven: weekSessions.flatMap((s) => s.submissions_given),
    submissionsReceived: weekSessions.flatMap((s) => s.submissions_received),
    injuries: collectInjuries(weekSessions),
    sentiment: computeSessionsSentiment(weekSessions),
    detectedPatterns: detectPatterns(weekSessions, belt),
    streakDays: calculateStreak(sessions), // streak uses ALL sessions, not just this week
  };
}

// ===========================================
// WEEKLY DELTA (comparison to prior week)
// ===========================================

export function computeWeeklyDelta(
  sessions: Session[],
  currentWeek: WeeklyPatterns,
  belt: BeltLevel
): WeeklyInsightInput['priorWeekDelta'] {
  const today = new Date();
  const priorWeekDate = new Date(today);
  priorWeekDate.setDate(priorWeekDate.getDate() - 7);
  const { start, end } = getWeekBounds(priorWeekDate);
  const priorSessions = filterSessions(sessions, start, end);

  if (priorSessions.length === 0) return null;

  const priorTechniques = priorSessions.flatMap((s) => s.techniques_drilled);
  const priorInjuries = collectInjuries(priorSessions);
  const currentInjuries = currentWeek.injuries;

  return {
    sessionsDelta: currentWeek.sessionsLogged - priorSessions.length,
    sparringDelta: currentWeek.sparringRounds - computeSparringRounds(priorSessions),
    newTechniques: findNewTechniques(currentWeek.techniquesDrilled, priorTechniques),
    recurringInjuries: findRecurringInjuries([...currentInjuries, ...priorInjuries]),
  };
}

// ===========================================
// BUILD WEEKLY INPUT (for Haiku edge function)
// ===========================================

export interface ProfileContext {
  name: string;
  belt: BeltLevel;
  stripes: number;
  targetFrequency: number;
  trainingGoals: string[] | null;
  experienceLevel: string | null;
  gymName: string;
  birthDate: string | null; // YYYY-MM-DD
  gender: string | null;
}

function computeAge(birthDate: string | null): number | undefined {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Compute average mood_rating for a set of sessions.
 * Returns null if no sessions have mood ratings.
 */
function computeMoodAverage(sessions: Session[]): number | null {
  const rated = sessions.filter((s) => s.mood_rating !== null && s.mood_rating !== undefined);
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, s) => acc + (s.mood_rating as number), 0);
  return Number((sum / rated.length).toFixed(2));
}

/**
 * Compute mood averages for the last N weeks (oldest first).
 * Returns array of length N — null where no mood data exists for that week.
 */
function computeMoodTrend(sessions: Session[], weeksBack: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i * 7);
    const { start, end } = getWeekBounds(targetDate);
    const weekSessions = filterSessions(sessions, start, end);
    result.push(computeMoodAverage(weekSessions));
  }
  return result;
}

// ===========================================
// ENH-07: PLATEAU DETECTION
// ===========================================

/**
 * Detect plateau signals over a 4-week sliding window.
 * Fires when 2+ of checks 1-3 are true, OR 1+ of 1-3 AND either 4 or 5.
 */
export function computePlateauSignal(
  sessions: Session[],
  belt: BeltLevel,
  moodTrend: (number | null)[] | null,
  accountCreatedAt?: string
): { signal: boolean; context: string | undefined } {
  const activeSessions = sessions.filter((s) => s.deleted_at === null);
  if (activeSessions.length < 4) return { signal: false, context: undefined };

  // Bucket sessions into 4 weeks (current + prior 3)
  const weekBuckets: Session[][] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const { start, end } = getWeekBounds(d);
    weekBuckets.unshift(filterSessions(activeSessions, start, end)); // oldest first
  }

  // Skip if any week has zero sessions (not enough data)
  if (weekBuckets.some((w) => w.length === 0)) return { signal: false, context: undefined };

  const signals: string[] = [];

  // 1. Technique diversity flat: same top 3 techniques for 4 consecutive weeks
  const weekTop3s = weekBuckets.map((w) => {
    const freq = computeTechniqueFrequency(w);
    return new Set(Object.keys(freq).slice(0, 3));
  });
  const firstTop3 = weekTop3s[0];
  const techFlat =
    firstTop3.size >= 3 &&
    weekTop3s.every(
      (s) => s.size >= 3 && [...firstTop3].every((t) => s.has(t))
    );
  if (techFlat) signals.push('technique_diversity_flat');

  // 2. Frequency flat/declining: session counts flat (within +/-1) or monotonically declining for 3+ weeks
  const weekCounts = weekBuckets.map((w) => w.length);
  const freqFlat = weekCounts.slice(1).every(
    (c, i) => Math.abs(c - weekCounts[i]) <= 1
  );
  const freqDeclining = weekCounts.slice(1).every(
    (c, i) => c <= weekCounts[i]
  ) && weekCounts[0] > weekCounts[weekCounts.length - 1];
  if (freqFlat || freqDeclining) signals.push('frequency_flat');

  // 3. No new techniques: zero techniques this week not in prior 3 weeks
  const priorTechniques = new Set(
    weekBuckets
      .slice(0, 3)
      .flatMap((w) => w.flatMap((s) => s.techniques_drilled.map((t) => t.toLowerCase().trim())))
  );
  const thisWeekTechniques = weekBuckets[3].flatMap((s) =>
    s.techniques_drilled.map((t) => t.toLowerCase().trim())
  );
  const hasNewTechniques = thisWeekTechniques.some((t) => !priorTechniques.has(t));
  if (!hasNewTechniques) signals.push('no_new_techniques');

  // 4. Mood declining (optional): 3+ consecutive drops
  let moodDeclining = false;
  if (moodTrend && moodTrend.length >= 3) {
    const nonNull = moodTrend.filter((v): v is number => v !== null);
    if (nonNull.length >= 3) {
      let consecutiveDrops = 0;
      for (let i = 1; i < nonNull.length; i++) {
        if (nonNull[i] < nonNull[i - 1]) {
          consecutiveDrops++;
        } else {
          consecutiveDrops = 0;
        }
      }
      moodDeclining = consecutiveDrops >= 2; // 3+ data points = 2+ drops
    }
  }

  // 5. Danger zone (optional): account age 4-7 months AND white belt
  let dangerZone = false;
  if (accountCreatedAt && belt === 'white') {
    const monthsOld = Math.floor(
      (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    dangerZone = monthsOld >= 4 && monthsOld <= 7;
  }

  // Compound signal: 2+ of checks 1-3, OR 1+ of 1-3 AND either 4 or 5
  const coreCount = signals.length;
  const hasPlateau =
    coreCount >= 2 || (coreCount >= 1 && (moodDeclining || dangerZone));

  if (!hasPlateau) return { signal: false, context: undefined };

  if (moodDeclining) signals.push('mood_declining');
  if (dangerZone) signals.push('danger_zone');

  const context = signals.join(', ');
  return { signal: true, context };
}

// ===========================================
// ENH-08: HISTORICAL SESSION LOOKUP
// ===========================================

/**
 * Find a session from 12, 6, or 3 months ago (prioritize longer) within +/- 7 days.
 * Only fires in the first 7 days of each month.
 */
export function findHistoricalSession(
  sessions: Session[]
): { date: string; summary: string; monthsAgo: number } | null {
  // Rate limit: first 7 days of each month only
  if (new Date().getDate() > 7) return null;

  const activeSessions = sessions.filter((s) => s.deleted_at === null);
  if (activeSessions.length === 0) return null;

  const today = new Date();
  const targets = [12, 6, 3]; // prefer longer comparisons

  for (const monthsAgo of targets) {
    const targetDate = new Date(today);
    targetDate.setMonth(targetDate.getMonth() - monthsAgo);
    const targetTime = targetDate.getTime();
    const windowMs = 7 * 24 * 60 * 60 * 1000; // +/- 7 days

    const match = activeSessions.find((s) => {
      const sessionTime = new Date(s.date + 'T00:00:00').getTime();
      return Math.abs(sessionTime - targetTime) <= windowMs;
    });

    if (match) {
      const techniques = match.techniques_drilled.slice(0, 5).join(', ');
      const notesExcerpt = match.notes ? match.notes.slice(0, 100) : '';
      const parts = [
        `Date: ${match.date}`,
        `Mode: ${match.training_mode}`,
        `Duration: ${match.duration_minutes}min`,
      ];
      if (techniques) parts.push(`Techniques: ${techniques}`);
      if (notesExcerpt) parts.push(`Notes: ${notesExcerpt}`);

      return {
        date: match.date,
        summary: parts.join('. '),
        monthsAgo,
      };
    }
  }

  return null;
}

// ===========================================
// BUILD WEEKLY INPUT (for Haiku edge function)
// ===========================================

export function buildWeeklyInput(
  sessions: Session[],
  profile: ProfileContext,
  userContextText: string,
  monthlyContext: LowerTierContext | null,
  quarterlyPriorities: string[] | null
): WeeklyInsightInput {
  const weekPatterns = computeWeeklyPatterns(sessions, profile.belt);
  const delta = computeWeeklyDelta(sessions, weekPatterns, profile.belt);

  // Aggregate instructors and lesson topics from this week's sessions
  const weekStart = weekPatterns.weekStart;
  const weekEnd = weekPatterns.weekEnd;
  const weekSessions = filterSessions(sessions, weekStart, weekEnd);
  const instructors = [...new Set(weekSessions.map(s => s.instructor).filter(Boolean))] as string[];
  const lessonTopics = [...new Set(weekSessions.map(s => s.lesson_topic).filter(Boolean))] as string[];

  // ENH-05: Mood aggregation
  const moodAverage = computeMoodAverage(weekSessions);
  const moodCount = weekSessions.filter((s) => s.mood_rating !== null && s.mood_rating !== undefined).length;
  const moodTrend = computeMoodTrend(sessions, 4);

  // ENH-06: Days since last session (before this week, using prior week or beyond)
  const activeSessions = sessions.filter((s) => s.deleted_at === null);
  const priorSessions = activeSessions.filter((s) => s.date < weekStart);
  let daysSinceLastSession: number | undefined;
  if (priorSessions.length > 0) {
    const sorted = [...priorSessions].sort((a, b) => b.date.localeCompare(a.date));
    const lastDate = sorted[0].date;
    const today = toDateString(new Date());
    const msPerDay = 1000 * 60 * 60 * 24;
    daysSinceLastSession = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / msPerDay
    );
  }

  return {
    // Profile fields for the prompt
    name: profile.name,
    belt: profile.belt,
    stripes: profile.stripes,
    trainingGoals: profile.trainingGoals,
    experienceLevel: profile.experienceLevel,
    gymName: profile.gymName,
    age: computeAge(profile.birthDate),
    gender: profile.gender,
    // Existing fields
    userContext: userContextText,
    week: { start: weekStart, end: weekEnd },
    sessionsThisWeek: weekPatterns.sessionsLogged,
    targetFrequency: profile.targetFrequency,
    totalSessionsAllTime: sessions.filter((s) => s.deleted_at === null).length,
    weekData: {
      totalMinutes: weekPatterns.totalMinutes,
      modes: weekPatterns.modes,
      kinds: weekPatterns.kinds,
      techniquesDrilled: weekPatterns.techniquesDrilled,
      sparringRounds: weekPatterns.sparringRounds,
      submissionsGiven: weekPatterns.submissionsGiven,
      submissionsReceived: weekPatterns.submissionsReceived,
      injuries: weekPatterns.injuries,
      sentiment: weekPatterns.sentiment,
      detectedPatterns: weekPatterns.detectedPatterns,
      streakDays: weekPatterns.streakDays,
      instructors,
      lessonTopics,
    },
    priorWeekDelta: delta,
    monthlyContext: monthlyContext
      ? {
          focusArea: monthlyContext.focusArea || '',
          gameIdentity: monthlyContext.gameIdentity || '',
          watchItem: monthlyContext.watchItem || null,
        }
      : null,
    quarterlyPriorities,
    // ENH-05: Mood Pulse
    moodAverage: moodAverage,
    moodCount: moodCount > 0 ? moodCount : null,
    moodTrend,
    // ENH-06: Quiet Week
    daysSinceLastSession,
    // ENH-07: The Reframe — plateau detection
    ...(() => {
      const plateau = computePlateauSignal(sessions, profile.belt, moodTrend);
      return plateau.signal
        ? { plateauSignal: true, plateauContext: plateau.context }
        : {};
    })(),
    // ENH-08: One Year Ago — historical session comparison
    historicalComparison: findHistoricalSession(sessions),
  };
}

// ===========================================
// MONTHLY PATTERN COMPUTATION
// ===========================================

export function computeMonthlyPatterns(
  sessions: Session[],
  year: number,
  month: number,
  targetFrequency: number,
  belt: BeltLevel
): MonthlyPatterns {
  const { start, end } = getMonthBounds(year, month);
  const monthSessions = filterSessions(sessions, start, end);
  const weeks = countWeeksInRange(start, end);

  // Prior month for comparison
  const priorMonth = month === 1 ? 12 : month - 1;
  const priorYear = month === 1 ? year - 1 : year;
  const { start: priorStart, end: priorEnd } = getMonthBounds(priorYear, priorMonth);
  const priorSessions = filterSessions(sessions, priorStart, priorEnd);

  const currentTechniques = monthSessions.flatMap((s) => s.techniques_drilled);
  const priorTechniques = priorSessions.flatMap((s) => s.techniques_drilled);
  const techFreq = computeTechniqueFrequency(monthSessions);
  const subs = aggregateSubmissions(monthSessions);
  const injuries = collectInjuries(monthSessions);
  const sparringTotal = computeSparringRounds(monthSessions);
  const sessionsWithSparring = monthSessions.filter((s) => (s.sparring_rounds || 0) > 0).length;

  return {
    month: formatMonth(start),
    monthStart: start,
    monthEnd: end,
    sessionsLogged: monthSessions.length,
    totalMinutes: monthSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
    avgDuration:
      monthSessions.length > 0
        ? Number(
            (
              monthSessions.reduce((sum, s) => sum + s.duration_minutes, 0) /
              monthSessions.length
            ).toFixed(1)
          )
        : 0,
    targetFrequency,
    adherenceRate: calculateAdherence(monthSessions.length, targetFrequency, weeks),
    modeBreakdown: computeModeBreakdown(monthSessions),
    kindBreakdown: computeKindBreakdown(monthSessions),
    totalSparringRounds: sparringTotal,
    avgRoundsPerSession:
      sessionsWithSparring > 0
        ? Number((sparringTotal / sessionsWithSparring).toFixed(1))
        : 0,
    techniqueFrequency: techFreq,
    newTechniques: findNewTechniques(currentTechniques, priorTechniques),
    droppedTechniques: findDroppedTechniques(currentTechniques, priorTechniques),
    submissionsGiven: subs.given,
    submissionsReceived: subs.received,
    submissionRatio: subs.ratio,
    injuries,
    recurringInjuries: findRecurringInjuries(injuries),
    weeksWithInjury: countWeeksWithInjury(monthSessions),
    weekByWeekSessions: computeWeekByWeekSessions(monthSessions),
    longestStreak: computeLongestStreak(monthSessions),
    gapDays: computeLargestGap(monthSessions),
    sentimentByWeek: computeSentimentByWeek(monthSessions),
  };
}

// ===========================================
// BUILD MONTHLY INPUT (for Sonnet edge function)
// ===========================================

export function buildMonthlyInput(
  sessions: Session[],
  belt: BeltLevel,
  stripes: number,
  targetFrequency: number,
  userContextText: string,
  weeklyInsightsSummary: string[],
  quarterlyPriorities: string[] | null,
  lastMonthFocusArea: string | null
): MonthlyInsightInput {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const mp = computeMonthlyPatterns(sessions, year, month, targetFrequency, belt);

  // Prior month submission ratio for trend
  const priorMonth = month === 1 ? 12 : month - 1;
  const priorYear = month === 1 ? year - 1 : year;
  const priorMp = computeMonthlyPatterns(sessions, priorYear, priorMonth, targetFrequency, belt);
  const priorRatio = priorMp.sessionsLogged > 0 ? priorMp.submissionRatio : null;

  const techEntries = Object.entries(mp.techniqueFrequency)
    .slice(0, 10)
    .map(([technique, count]) => ({ technique, count }));

  return {
    belt,
    stripes,
    userContext: userContextText,
    month: mp.month,
    totalSessionsAllTime: sessions.filter((s) => s.deleted_at === null).length,
    monthlyStats: {
      sessionsLogged: mp.sessionsLogged,
      targetFrequency: mp.targetFrequency,
      adherenceRate: mp.adherenceRate,
      totalMinutes: mp.totalMinutes,
      avgDuration: mp.avgDuration,
      modeBreakdown: mp.modeBreakdown,
      kindBreakdown: mp.kindBreakdown,
      totalSparringRounds: mp.totalSparringRounds,
      avgRoundsPerSession: mp.avgRoundsPerSession,
    },
    techniqueAnalysis: {
      mostDrilled: techEntries,
      newThisMonth: mp.newTechniques,
      droppedFromLastMonth: mp.droppedTechniques,
    },
    submissionProfile: {
      given: mp.submissionsGiven,
      received: mp.submissionsReceived,
      ratioThisMonth: mp.submissionRatio,
      ratioLastMonth: priorRatio,
      trend: computeRatioTrend(mp.submissionRatio, priorRatio),
    },
    injuryLog: {
      mentions: mp.injuries,
      recurring: mp.recurringInjuries,
      weeksWithInjury: mp.weeksWithInjury,
    },
    consistencyPattern: {
      weekByWeek: mp.weekByWeekSessions,
      longestStreak: mp.longestStreak,
      gapDays: mp.gapDays,
    },
    sentimentTrend: mp.sentimentByWeek,
    weeklyInsightsSummary,
    quarterlyPriorities,
    lastMonthFocusArea,
  };
}

// ===========================================
// QUARTERLY PATTERN COMPUTATION
// ===========================================

export function computeQuarterlyPatterns(
  sessions: Session[],
  year: number,
  quarter: number,
  targetFrequency: number,
  belt: BeltLevel
): QuarterlyPatterns {
  const { start, end } = getQuarterBounds(year, quarter);
  const qSessions = filterSessions(sessions, start, end);
  const weeks = countWeeksInRange(start, end);
  const startMonth = (quarter - 1) * 3 + 1; // 1-indexed month
  const months = [startMonth, startMonth + 1, startMonth + 2];

  // Prior quarter for diversity trend
  const priorQuarter = quarter === 1 ? 4 : quarter - 1;
  const priorYear = quarter === 1 ? year - 1 : year;
  const { start: priorStart, end: priorEnd } = getQuarterBounds(priorYear, priorQuarter);
  const priorSessions = filterSessions(sessions, priorStart, priorEnd);
  const priorUniqueTechniques = new Set(
    priorSessions.flatMap((s) => s.techniques_drilled.map((t) => t.toLowerCase().trim()))
  ).size;

  // Aggregate techniques for the quarter
  const allTechniques = qSessions.flatMap((s) => s.techniques_drilled);
  const uniqueTechniques = new Set(allTechniques.map((t) => t.toLowerCase().trim()));
  const techFreq = computeTechniqueFrequency(qSessions);

  // Prior quarter techniques for added/dropped
  const priorTechniques = priorSessions.flatMap((s) => s.techniques_drilled);

  // Per-month breakdowns
  const submissionsByMonth: Record<string, { ratio: number; topGiven: string; topReceived: string }> = {};
  const injuriesByMonth: Record<string, string[]> = {};
  const consistencyByMonth: Record<string, { sessions: number; adherence: number }> = {};
  const sentimentByMonth: Record<string, string> = {};

  for (const m of months) {
    const { start: mStart, end: mEnd } = getMonthBounds(year, m);
    const mSessions = filterSessions(sessions, mStart, mEnd);
    const mWeeks = countWeeksInRange(mStart, mEnd);
    const monthLabel = formatMonth(mStart);
    const mSubs = aggregateSubmissions(mSessions);

    submissionsByMonth[monthLabel] = {
      ratio: mSubs.ratio,
      topGiven: topEntry(mSubs.given, 'none'),
      topReceived: topEntry(mSubs.received, 'none'),
    };

    injuriesByMonth[monthLabel] = collectInjuries(mSessions);
    consistencyByMonth[monthLabel] = {
      sessions: mSessions.length,
      adherence: calculateAdherence(mSessions.length, targetFrequency, mWeeks),
    };
    sentimentByMonth[monthLabel] = computeSessionsSentiment(mSessions);
  }

  // Escalating injuries: injuries that appear in 2+ months
  const monthlyInjuryFreq: Record<string, number> = {};
  for (const monthInjuries of Object.values(injuriesByMonth)) {
    const uniqueInMonth = new Set(monthInjuries.map((i) => i.toLowerCase().trim()));
    for (const injury of uniqueInMonth) {
      monthlyInjuryFreq[injury] = (monthlyInjuryFreq[injury] || 0) + 1;
    }
  }
  const escalatingInjuries = Object.entries(monthlyInjuryFreq)
    .filter(([, count]) => count >= 2)
    .map(([injury]) => injury);

  return {
    quarter: `Q${quarter} ${year}`,
    quarterStart: start,
    quarterEnd: end,
    sessionsLogged: qSessions.length,
    totalMinutes: qSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
    avgSessionsPerWeek:
      weeks > 0 ? Number((qSessions.length / weeks).toFixed(1)) : 0,
    adherenceRate: calculateAdherence(qSessions.length, targetFrequency, weeks),
    sparringRounds: computeSparringRounds(qSessions),
    uniqueTechniques: uniqueTechniques.size,
    techniqueEvolution: {
      emergingSystem: identifyEmergingSystem(techFreq),
      diversityTrend: computeDiversityTrend(
        uniqueTechniques.size,
        priorSessions.length > 0 ? priorUniqueTechniques : null
      ),
      added: findNewTechniques(allTechniques, priorTechniques),
      dropped: findDroppedTechniques(allTechniques, priorTechniques),
    },
    submissionsByMonth,
    injuriesByMonth,
    escalatingInjuries,
    consistencyByMonth,
    sentimentByMonth,
  };
}

// ===========================================
// BUILD QUARTERLY INPUT (for Opus edge function)
// ===========================================

export function buildQuarterlyInput(
  sessions: Session[],
  belt: BeltLevel,
  stripes: number,
  monthsTraining: number,
  targetFrequency: number,
  userContextText: string,
  monthlyReviews: Array<{ month: string; summary: string; focusSet: string }>,
  profileContext: QuarterlyInsightInput['profileContext'],
  priorQuarterPriorities: string[] | null
): QuarterlyInsightInput {
  const now = new Date();
  const year = now.getFullYear();
  const quarter = getCurrentQuarter();
  const qp = computeQuarterlyPatterns(sessions, year, quarter, targetFrequency, belt);

  return {
    belt,
    stripes,
    userContext: userContextText,
    quarter: qp.quarter,
    monthsTraining,
    totalSessionsAllTime: sessions.filter((s) => s.deleted_at === null).length,
    quarterlyStats: {
      sessionsLogged: qp.sessionsLogged,
      avgSessionsPerWeek: qp.avgSessionsPerWeek,
      targetFrequency,
      adherenceRate: qp.adherenceRate,
      sparringRounds: qp.sparringRounds,
      uniqueTechniquesDrilled: qp.uniqueTechniques,
      totalMinutes: qp.totalMinutes,
    },
    techniqueEvolution: {
      emergingSystem: qp.techniqueEvolution.emergingSystem,
      diversityTrend: qp.techniqueEvolution.diversityTrend,
      addedOverQuarter: qp.techniqueEvolution.added,
      droppedOverQuarter: qp.techniqueEvolution.dropped,
    },
    submissionEvolution: qp.submissionsByMonth,
    injuryArc: qp.injuriesByMonth,
    escalatingInjuries: qp.escalatingInjuries,
    consistencyArc: qp.consistencyByMonth,
    monthlyReviews,
    sentimentArc: qp.sentimentByMonth,
    profileContext,
    priorQuarterPriorities,
  };
}

// ===========================================
// ELIGIBILITY CHECKS
// ===========================================

export function checkInsightEligibility(
  sessions: Session[],
  existingInsights: Array<{ tier: string; period_start: string }>,
  targetFrequency: number
): InsightEligibility {
  const now = new Date();

  // --- Weekly eligibility ---
  const { start: weekStart } = getWeekBounds(now);
  const weekSessions = getThisWeekSessions(sessions);
  const hasWeeklyThisWeek = existingInsights.some(
    (i) => i.tier === 'weekly' && i.period_start === weekStart
  );
  const weeklyEligible = weekSessions.length >= 2 && !hasWeeklyThisWeek;

  // --- Monthly eligibility ---
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { start: monthStart } = getMonthBounds(year, month);
  const monthSessions = getMonthSessions(sessions, year, month);
  const hasMonthlyThisMonth = existingInsights.some(
    (i) => i.tier === 'monthly' && i.period_start === monthStart
  );
  const weeklyInsightsThisMonth = existingInsights.filter(
    (i) => i.tier === 'weekly' && i.period_start >= monthStart
  ).length;
  const monthlyEligible =
    monthSessions.length >= 5 && weeklyInsightsThisMonth >= 2 && !hasMonthlyThisMonth;

  // --- Quarterly eligibility ---
  const quarter = getCurrentQuarter();
  const { start: quarterStart } = getQuarterBounds(year, quarter);
  const hasQuarterlyThisQuarter = existingInsights.some(
    (i) => i.tier === 'quarterly' && i.period_start === quarterStart
  );
  const monthlyReviewsThisQuarter = existingInsights.filter(
    (i) => i.tier === 'monthly' && i.period_start >= quarterStart
  ).length;
  const quarterlyEligible = monthlyReviewsThisQuarter >= 2 && !hasQuarterlyThisQuarter;

  return {
    weekly: {
      eligible: weeklyEligible,
      reason: !weeklyEligible
        ? hasWeeklyThisWeek
          ? 'Weekly insight already generated for this week'
          : `Need at least 1 session this week (have ${weekSessions.length})`
        : undefined,
      sessionsThisWeek: weekSessions.length,
    },
    monthly: {
      eligible: monthlyEligible,
      reason: !monthlyEligible
        ? hasMonthlyThisMonth
          ? 'Monthly insight already generated for this month'
          : monthSessions.length < 5
            ? `Need at least 5 sessions this month (have ${monthSessions.length})`
            : `Need at least 2 weekly insights this month (have ${weeklyInsightsThisMonth})`
        : undefined,
      sessionsThisMonth: monthSessions.length,
      weeklyInsightsCount: weeklyInsightsThisMonth,
    },
    quarterly: {
      eligible: quarterlyEligible,
      reason: !quarterlyEligible
        ? hasQuarterlyThisQuarter
          ? 'Quarterly insight already generated for this quarter'
          : `Need at least 2 monthly reviews this quarter (have ${monthlyReviewsThisQuarter})`
        : undefined,
      monthlyReviewsCount: monthlyReviewsThisQuarter,
    },
  };
}

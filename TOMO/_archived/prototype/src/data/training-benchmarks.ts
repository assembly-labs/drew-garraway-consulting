/**
 * Training Benchmarks by Belt Level
 *
 * Data source: Internal research + BJJ community surveys
 * Used for Tournament Readiness module to contextualize user's training volume
 */

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface TrainingVolume {
  sessions: number;  // Per week
  hours: number;     // Per week (assuming 1.5 hr avg session)
}

export interface BeltBenchmark {
  casual: TrainingVolume;           // Recreational practitioners
  average: TrainingVolume;          // Typical hobbyist
  competitor: TrainingVolume;       // Active competitors
  compPrepRecommended: TrainingVolume; // Minimum for competition prep
}

export const TRAINING_BENCHMARKS: Record<BeltLevel, BeltBenchmark> = {
  white: {
    casual: { sessions: 2, hours: 3 },
    average: { sessions: 3, hours: 4.5 },
    competitor: { sessions: 4, hours: 6 },
    compPrepRecommended: { sessions: 3, hours: 4.5 },
  },
  blue: {
    casual: { sessions: 2, hours: 3 },
    average: { sessions: 3, hours: 4.5 },
    competitor: { sessions: 5, hours: 7.5 },
    compPrepRecommended: { sessions: 4, hours: 6 },
  },
  purple: {
    casual: { sessions: 3, hours: 4.5 },
    average: { sessions: 4, hours: 6 },
    competitor: { sessions: 6, hours: 9 },
    compPrepRecommended: { sessions: 5, hours: 7.5 },
  },
  brown: {
    casual: { sessions: 3, hours: 4.5 },
    average: { sessions: 4, hours: 6 },
    competitor: { sessions: 6, hours: 9 },
    compPrepRecommended: { sessions: 5, hours: 7.5 },
  },
  black: {
    casual: { sessions: 3, hours: 4.5 },
    average: { sessions: 4, hours: 6 },
    competitor: { sessions: 6, hours: 9 },
    compPrepRecommended: { sessions: 5, hours: 7.5 },
  },
};

/**
 * Get training volume position on the benchmark scale
 * Returns a value 0-100 representing where user falls between min and max
 */
export function getVolumePosition(
  sessionsPerWeek: number,
  belt: BeltLevel
): number {
  const benchmark = TRAINING_BENCHMARKS[belt];
  const min = benchmark.casual.sessions;
  const max = benchmark.competitor.sessions;

  if (sessionsPerWeek <= min) return 0;
  if (sessionsPerWeek >= max) return 100;

  return Math.round(((sessionsPerWeek - min) / (max - min)) * 100);
}

/**
 * Get contextual label for user's training volume
 */
export function getVolumeLabel(
  sessionsPerWeek: number,
  belt: BeltLevel
): 'below_casual' | 'casual' | 'average' | 'above_average' | 'competitor' {
  const benchmark = TRAINING_BENCHMARKS[belt];

  if (sessionsPerWeek < benchmark.casual.sessions) return 'below_casual';
  if (sessionsPerWeek < benchmark.average.sessions) return 'casual';
  if (sessionsPerWeek < benchmark.average.sessions + 0.5) return 'average';
  if (sessionsPerWeek < benchmark.competitor.sessions) return 'above_average';
  return 'competitor';
}

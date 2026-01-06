/**
 * Dashboard Feature - BOLD DESIGN
 * Dark, aggressive, typography-forward
 * NO boring cards. NO generic layouts.
 *
 * DESIGN RULES:
 * - Large numbers dominate
 * - Full-bleed sections
 * - Gold accents on black
 * - GREEN = positive, RED = negative
 * - NO EMOJIS - lineart only
 *
 * Demo Mode: Uses mock profile data for prototype approval
 */

import { useState, useMemo } from 'react';
import { mockTrainingStats, mockJournalEntries } from '../../data/journal';
import { mockSubmissionStats } from '../../data/submissions';
import {
  getCompetitionStatsByBelt,
  getUpcomingCompetitionByBelt,
  type BeltLevel as CompetitionBeltLevel,
} from '../../data/competitions';
import {
  BreakthroughHero,
  BreakthroughList,
  TournamentReadinessCard,
  StyleFingerprint,
} from '../ui';
import type { StyleFingerprintData } from '../ui';
import { AttackProfile } from './AttackProfile';
import {
  WeeklyProgressRing,
  CalendarHeatMap,
  DashboardSummaryCard,
  DefenseFocus,
  TechniquePairings,
  BluesDetector,
  YourJourney,
  TechniqueMastery,
  RecentRolls,
  SessionTypeDistribution,
  SparringPatternAnalysis,
  AchievementTimeline,
  type SubmissionReceived,
} from './stats-modules';
import { UpNextVideos } from './UpNextVideos';
import {
  MOCK_BLUE_BELT_STATS,
  MOCK_WHITE_BELT_STATS,
  MOCK_PURPLE_BELT_STATS,
  MOCK_PURPLE_TECHNIQUE_MASTERY,
  type SubmissionRecord,
} from '../../data/stats-modules';
import { useCountUp, useBeltPersonalization } from '../../hooks';
import { useUserProfile } from '../../context/UserProfileContext';
import {
  detectBreakthroughs,
  getMostSignificantBreakthrough,
  type BreakthroughDetectionInput,
  type Breakthrough,
} from '../../utils/breakthrough-detection';
import type { TournamentReadinessInput } from '../../utils/tournament-readiness';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

// Minimum sessions required before showing style profile
const STYLE_PROFILE_MIN_SESSIONS = 20;

// Default mock style fingerprint (for non-demo mode)
const mockStyleFingerprint: StyleFingerprintData = {
  dimensions: [
    { id: 'guard', label: 'Guard Game', shortLabel: 'Guard', value: 65, description: 'Bottom position offense - sweeps and submissions from guard' },
    { id: 'passing', label: 'Passing', shortLabel: 'Pass', value: 52, description: "Ability to navigate and pass opponent's guard" },
    { id: 'top', label: 'Top Control', shortLabel: 'Top', value: 58, description: 'Dominance from mount, side control, and knee on belly' },
    { id: 'back', label: 'Back Attacks', shortLabel: 'Back', value: 72, description: 'Taking the back and finishing from back control' },
    { id: 'takedowns', label: 'Takedowns', shortLabel: 'TD', value: 35, description: 'Standing game - wrestling, judo, and guard pulls' },
    { id: 'leglocks', label: 'Leg Locks', shortLabel: 'Legs', value: 48, description: 'Modern leg attack game - heel hooks, knee bars, ankle locks' },
  ],
  archetype: {
    name: 'BACK HUNTER',
    description: 'Constantly seeking the back. Once there, the finish is inevitable.',
    icon: 'back',
    famousExamples: ['Marcelo Garcia', 'Rubens Charles (Cobrinha)'],
  },
  dominantStyle: 'Back Attacks',
  weakestArea: 'Takedowns',
  balanceScore: 55,
};

// Mock submissions received - WHITE BELT (common upper body submissions)
const MOCK_WHITE_BELT_SUBMISSIONS: SubmissionReceived[] = [
  { technique: 'Triangle', daysAgo: 1 },
  { technique: 'Armbar', daysAgo: 2 },
  { technique: 'Triangle', daysAgo: 3 },
  { technique: 'RNC', daysAgo: 4 },
  { technique: 'Triangle', daysAgo: 5 },
  { technique: 'Guillotine', daysAgo: 6 },
];

// Mock technique stats for white belts (aggregated counts)
// Excelling white belt (Jake Thompson) - good submission numbers
const MOCK_WHITE_BELT_OFFENSE = [
  { technique: 'RNC', count: 8 },
  { technique: 'Armbar', count: 6 },
  { technique: 'Triangle', count: 4 },
  { technique: 'Guillotine', count: 3 },
  { technique: 'Americana', count: 2 },
];

const MOCK_WHITE_BELT_DEFENSE = [
  { technique: 'Triangle', count: 14 },
  { technique: 'Armbar', count: 12 },
  { technique: 'RNC', count: 8 },
  { technique: 'Guillotine', count: 8 },
  { technique: 'Kimura', count: 6 },
];

// At-risk white belt (David Morrison) - struggling, low offense, high defense
// Per persona: Americana: 4, Kimura: 3, RNC: 2
const MOCK_WHITE_BELT_AT_RISK_OFFENSE = [
  { technique: 'Americana', count: 4 },
  { technique: 'Kimura', count: 3 },
  { technique: 'RNC', count: 2 },
];

// David gets caught a lot - "Everything: Too many to count"
const MOCK_WHITE_BELT_AT_RISK_DEFENSE = [
  { technique: 'RNC', count: 18 },
  { technique: 'Armbar', count: 16 },
  { technique: 'Triangle', count: 14 },
  { technique: 'Kimura', count: 12 },
  { technique: 'Guillotine', count: 10 },
];

// Mock submissions received - BLUE BELT (leg lock focus)
const MOCK_BLUE_BELT_SUBMISSIONS: SubmissionReceived[] = [
  { technique: 'Heel Hook', daysAgo: 1 },
  { technique: 'Ankle Lock', daysAgo: 2 },
  { technique: 'Heel Hook', daysAgo: 3 },
  { technique: 'Kneebar', daysAgo: 4 },
  { technique: 'Heel Hook', daysAgo: 5 },
  { technique: 'Ankle Lock', daysAgo: 7 },
];

// Mock submissions received - PURPLE+ BELT (varied advanced attacks)
const MOCK_PURPLE_BELT_SUBMISSIONS: SubmissionReceived[] = [
  { technique: 'Heel Hook', daysAgo: 2 },
  { technique: 'Darce', daysAgo: 3 },
  { technique: 'Kimura', daysAgo: 5 },
  { technique: 'Kneebar', daysAgo: 6 },
];

// Mock session type data for blue belts
const MOCK_BLUE_BELT_SESSION_TYPES = [
  { type: 'gi' as const, count: 18, label: 'Gi', color: '#3B82F6' },
  { type: 'nogi' as const, count: 12, label: 'No-Gi', color: '#F97316' },
  { type: 'openmat' as const, count: 8, label: 'Open Mat', color: '#A855F7' },
  { type: 'drilling' as const, count: 4, label: 'Drilling', color: '#22C55E' },
];

// Mock session type data for purple+ belts (more variety)
const MOCK_PURPLE_BELT_SESSION_TYPES = [
  { type: 'gi' as const, count: 24, label: 'Gi', color: '#3B82F6' },
  { type: 'nogi' as const, count: 20, label: 'No-Gi', color: '#F97316' },
  { type: 'openmat' as const, count: 14, label: 'Open Mat', color: '#A855F7' },
  { type: 'drilling' as const, count: 8, label: 'Drilling', color: '#22C55E' },
  { type: 'competition' as const, count: 6, label: 'Comp Prep', color: '#EF4444' },
];

// Mock sparring exchange data for blue belts
const MOCK_BLUE_BELT_EXCHANGES = [
  { technique: 'Armbar', landed: 8, received: 6 },
  { technique: 'Triangle', landed: 5, received: 8 },
  { technique: 'RNC', landed: 12, received: 4 },
  { technique: 'Heel Hook', landed: 2, received: 7 },
  { technique: 'Guillotine', landed: 6, received: 5 },
];

// Mock sparring exchange data for purple+ belts
const MOCK_PURPLE_BELT_EXCHANGES = [
  { technique: 'Heel Hook', landed: 15, received: 8 },
  { technique: 'RNC', landed: 22, received: 6 },
  { technique: 'Armbar', landed: 18, received: 10 },
  { technique: 'Darce', landed: 12, received: 4 },
  { technique: 'Triangle', landed: 14, received: 7 },
];

// Mock achievements for blue belts
const MOCK_BLUE_BELT_ACHIEVEMENTS = [
  { id: 'ach-1', type: 'promotion' as const, title: 'Blue Belt Earned', description: 'Promoted after 18 months of training', date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), highlight: true },
  { id: 'ach-2', type: 'technique' as const, title: 'First Triangle in Sparring', description: 'Landed your first triangle on a resisting opponent', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-3', type: 'streak' as const, title: '10 Day Training Streak', description: 'Trained 10 days in a row', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-4', type: 'session' as const, title: '100 Sessions', description: 'Reached 100 training sessions', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-5', type: 'competition' as const, title: 'First Competition', description: 'Competed in local tournament', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
];

// Mock achievements for purple+ belts
const MOCK_PURPLE_BELT_ACHIEVEMENTS = [
  { id: 'ach-p1', type: 'promotion' as const, title: 'Purple Belt Earned', description: 'Promoted after 4 years of dedication', date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), highlight: true },
  { id: 'ach-p2', type: 'technique' as const, title: 'Berimbolo Chain Working', description: 'Berimbolo to back take hitting consistently', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-p3', type: 'milestone' as const, title: '200 Sessions', description: 'Two hundred training sessions logged', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-p4', type: 'competition' as const, title: 'Gold at Regionals', description: 'Won gold in purple belt division', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), highlight: true },
  { id: 'ach-p5', type: 'streak' as const, title: '21 Day Streak', description: 'Three weeks of consistent training', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'ach-p6', type: 'technique' as const, title: 'First Heel Hook', description: 'Caught first heel hook in competition', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
];

// Hero metric configuration by primary metric type
interface HeroMetric {
  value: number;
  label: string;
  sublabel: string;
}

function getHeroMetricData(
  primaryMetric: string,
  stats: typeof mockTrainingStats
): HeroMetric {
  switch (primaryMetric) {
    case 'session_streak':
      return {
        value: stats.currentStreak,
        label: 'day streak',
        sublabel: `Best: ${stats.longestStreak} days. Keep showing up.`,
      };
    case 'technique_variety':
      return {
        value: stats.thisMonth.techniques,
        label: 'techniques this month',
        sublabel: `${stats.thisMonth.sessions} sessions logged. Build your game.`,
      };
    case 'sparring_rounds':
      return {
        value: stats.thisMonth.sparringRounds,
        label: 'rounds this month',
        sublabel: `${stats.thisMonth.sessions} sessions logged. Time on the mat matters.`,
      };
    case 'teaching_sessions': {
      // Derive from sessions (prototype approximation: ~20% of sessions involve teaching)
      const teachingSessions = Math.round(stats.thisMonth.sessions * 0.2);
      return {
        value: teachingSessions || 2,
        label: 'students helped',
        sublabel: `${stats.totalSessions} total sessions. Teaching deepens understanding.`,
      };
    }
    default:
      return {
        value: stats.totalSessions,
        label: 'sessions logged',
        sublabel: `${stats.totalHours} hours on the mat.`,
      };
  }
}

// Insight messages based on dashboard focus
// At-risk personas get attendance-focused messaging
function getInsightMessage(insightFocus: string, isAtRisk?: boolean): { working: string; focus: string } {
  // Special messaging for at-risk users - emphasize attendance
  if (isAtRisk) {
    return {
      working: "Every session you complete is a win. You're still here.",
      focus: 'Showing up matters. Aim for one more session this week.',
    };
  }

  switch (insightFocus) {
    case 'survival_skills':
      return {
        working: "You're building your foundation. Every class counts.",
        focus: 'Focus on escapes and position recognition.',
      };
    case 'game_development':
      return {
        working: 'Your guard retention is improving. Build on this.',
        focus: 'Develop 2-3 techniques you can chain together.',
      };
    case 'systems_thinking':
      return {
        working: 'Your depth of understanding is growing.',
        focus: 'Connect your positions into complete systems.',
      };
    case 'refinement':
      return {
        working: 'Efficiency is increasing. Details matter now.',
        focus: 'Refine timing and leverage on your A-game.',
      };
    case 'legacy':
      return {
        working: 'Your teaching is shaping the next generation.',
        focus: 'Continue exploring new concepts to share.',
      };
    default:
      return {
        working: 'Progress continues.',
        focus: 'Stay consistent.',
      };
  }
}

// Generate mock session dates for heat map visualization
// Creates a realistic training pattern based on total sessions and persona type
function generateMockSessionDates(
  totalSessions: number,
  isAtRisk: boolean
): Record<string, number> {
  const sessionsByDate: Record<string, number> = {};
  const today = new Date();
  const weeksBack = 13;

  // Training frequency patterns (probability of training each day)
  // At-risk: sporadic, gaps; Healthy: consistent Mon/Wed/Fri/Sat
  const dayWeights = isAtRisk
    ? [0.15, 0.1, 0.15, 0.1, 0.2, 0.25, 0.1] // Lower, more random
    : [0.6, 0.2, 0.7, 0.2, 0.5, 0.8, 0.3];   // Higher on Mon, Wed, Fri, Sat

  // Distribute sessions across the weeks
  const sessionsToDistribute = Math.min(totalSessions, weeksBack * 4);
  let remaining = sessionsToDistribute;

  for (let week = 0; week < weeksBack && remaining > 0; week++) {
    // At-risk users have "gap weeks" where they skip
    const isGapWeek = isAtRisk && (week === 4 || week === 5 || week === 8);

    for (let day = 0; day < 7 && remaining > 0; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (weeksBack - week - 1) * 7 - (6 - day));
      const dateStr = date.toISOString().split('T')[0];

      if (!isGapWeek && Math.random() < dayWeights[day]) {
        // Sometimes train twice on weekends (open mat + class)
        const isSaturday = day === 5;
        const sessionCount = isSaturday && Math.random() > 0.7 ? 2 : 1;
        sessionsByDate[dateStr] = sessionCount;
        remaining -= sessionCount;
      }
    }
  }

  return sessionsByDate;
}

export function Dashboard(_: DashboardProps) {
  void _; // Props reserved for future use
  // Check for demo mode and get persona info
  const { isDemoMode, activeDemoProfile, activePersona } = useUserProfile();

  // State for dismissing breakthrough hero
  const [breakthroughDismissed, setBreakthroughDismissed] = useState(false);

  // Use demo profile data if in demo mode, otherwise use default mock data
  const stats = isDemoMode && activeDemoProfile
    ? activeDemoProfile.trainingStats as typeof mockTrainingStats
    : mockTrainingStats;
  const allJournalEntries = isDemoMode && activeDemoProfile
    ? activeDemoProfile.journalEntries
    : mockJournalEntries;

  // Belt personalization for adaptive dashboard behavior
  const { profile, dashboard, isInRiskWindow } = useBeltPersonalization();

  // Check if current persona is at-risk (high/critical risk or struggling/declining)
  const isAtRiskPersona = activePersona?.riskLevel === 'high' ||
    activePersona?.riskLevel === 'critical' ||
    activePersona?.status === 'struggling' ||
    activePersona?.status === 'declining';

  // Get style fingerprint data (from demo profile or mock)
  const styleFingerprint = isDemoMode && activeDemoProfile
    ? activeDemoProfile.styleFingerprint
    : mockStyleFingerprint;

  // Check if we have enough sessions to show style profile
  const hasEnoughDataForStyle = stats.totalSessions >= STYLE_PROFILE_MIN_SESSIONS;

  // ===========================================
  // BREAKTHROUGH DETECTION
  // ===========================================
  const { breakthrough, allBreakthroughs } = useMemo(() => {
    // Stable reference date for mock data (avoids impure Date.now() calls)
    const referenceDate = new Date('2026-01-05T12:00:00Z').getTime();
    const daysAgo = (days: number) => new Date(referenceDate - days * 24 * 60 * 60 * 1000).toISOString();

    const input: BreakthroughDetectionInput = {
      journalEntries: allJournalEntries,
      trainingStats: {
        totalSessions: stats.totalSessions,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        sparringRecord: stats.sparringRecord,
        submissionsMade: stats.submissionsMade,
        submissionsReceived: stats.submissionsReceived,
      },
      belt: profile.belt,
    };

    const detected = detectBreakthroughs(input);

    // Belt-specific mock historical breakthroughs for demo purposes
    const getBeltBreakthroughs = (): Breakthrough[] => {
      switch (profile.belt) {
        case 'white':
          return [
            {
              id: 'hist-white-1',
              type: 'first_submission',
              detectedAt: daysAgo(4),
              confidence: 'high',
              title: 'First Americana',
              description: 'You landed your first americana on a training partner.',
              stat: { value: 'Americana', label: 'FIRST SUBMISSION' },
              beltContext: 'Your first submission! The journey has begun.',
              icon: 'trophy',
            },
            {
              id: 'hist-white-2',
              type: 'consistency_milestone',
              detectedAt: daysAgo(14),
              confidence: 'high',
              title: '50 Sessions',
              description: 'You reached 50 training sessions.',
              stat: { value: 50, label: 'SESSIONS' },
              beltContext: 'Most white belts quit before 20. You\'re ahead.',
              icon: 'award',
            },
            {
              id: 'hist-white-3',
              type: 'pattern_break',
              detectedAt: daysAgo(21),
              confidence: 'medium',
              title: 'Survived a Round',
              description: 'You went a full round without getting submitted.',
              stat: { value: '5 min', label: 'SURVIVED' },
              beltContext: 'Defense is the first step. Well done.',
              icon: 'shield',
            },
          ];
        case 'blue':
          return [
            {
              id: 'hist-blue-1',
              type: 'first_submission',
              detectedAt: daysAgo(7),
              confidence: 'high',
              title: 'First Triangle',
              description: 'You landed your first triangle in live rolling.',
              stat: { value: 'Triangle', label: 'NEW SUBMISSION' },
              beltContext: 'Your closed guard game is evolving.',
              icon: 'trophy',
            },
            {
              id: 'hist-blue-2',
              type: 'streak_record',
              detectedAt: daysAgo(14),
              confidence: 'high',
              title: '10 Day Streak',
              description: 'You hit a new personal best training streak.',
              stat: { value: 10, label: 'DAY STREAK' },
              beltContext: 'Blue belt is about consistency. This is it.',
              icon: 'zap',
            },
            {
              id: 'hist-blue-3',
              type: 'pattern_break',
              detectedAt: daysAgo(21),
              confidence: 'medium',
              title: 'Armbar Defense Up',
              description: 'You stopped getting caught in armbars.',
              stat: { value: '4 → 0', label: 'TIMES CAUGHT' },
              beltContext: 'That hole is closing.',
              icon: 'shield',
            },
          ];
        case 'purple':
          return [
            {
              id: 'hist-purple-1',
              type: 'technique_streak',
              detectedAt: daysAgo(5),
              confidence: 'high',
              title: 'Berimbolo Chain Working',
              description: 'Your berimbolo to back take hit 5 times this week.',
              stat: { value: 5, label: 'SUCCESSFUL CHAINS' },
              beltContext: 'Your system is coming together.',
              icon: 'trending-up',
            },
            {
              id: 'hist-purple-2',
              type: 'consistency_milestone',
              detectedAt: daysAgo(12),
              confidence: 'high',
              title: '200 Sessions',
              description: 'Two hundred training sessions logged.',
              stat: { value: 200, label: 'SESSIONS' },
              beltContext: 'The middle of the journey. Depth over breadth.',
              icon: 'award',
            },
            {
              id: 'hist-purple-3',
              type: 'first_submission',
              detectedAt: daysAgo(18),
              confidence: 'high',
              title: 'First Leg Lock',
              description: 'You caught your first heel hook in competition.',
              stat: { value: 'Heel Hook', label: 'COMP SUBMISSION' },
              beltContext: 'Your leg game is dangerous now.',
              icon: 'trophy',
            },
          ];
        case 'brown':
          return [
            {
              id: 'hist-brown-1',
              type: 'technique_streak',
              detectedAt: daysAgo(3),
              confidence: 'high',
              title: 'Pressure Passing Streak',
              description: 'Your pressure passing scored in 8 consecutive rounds.',
              stat: { value: 8, label: 'ROUND STREAK' },
              beltContext: 'Efficiency at brown belt level.',
              icon: 'trending-up',
            },
            {
              id: 'hist-brown-2',
              type: 'consistency_milestone',
              detectedAt: daysAgo(10),
              confidence: 'high',
              title: '500 Sessions',
              description: 'Five hundred sessions on the mat.',
              stat: { value: 500, label: 'LIFETIME SESSIONS' },
              beltContext: 'The finish line is in sight.',
              icon: 'award',
            },
            {
              id: 'hist-brown-3',
              type: 'pattern_break',
              detectedAt: daysAgo(25),
              confidence: 'medium',
              title: 'Teaching Breakthrough',
              description: 'Three students hit the technique you taught.',
              stat: { value: 3, label: 'STUDENT SUCCESSES' },
              beltContext: 'Your teaching deepens your own understanding.',
              icon: 'check-circle',
            },
          ];
        default: // black
          return [
            {
              id: 'hist-black-1',
              type: 'consistency_milestone',
              detectedAt: daysAgo(7),
              confidence: 'high',
              title: '1000 Sessions',
              description: 'One thousand sessions logged.',
              stat: { value: '1000', label: 'LIFETIME SESSIONS' },
              beltContext: 'A lifetime on the mat. The journey continues.',
              icon: 'award',
            },
            {
              id: 'hist-black-2',
              type: 'technique_streak',
              detectedAt: daysAgo(14),
              confidence: 'high',
              title: 'New Concept Explored',
              description: 'You integrated a new guard concept into your game.',
              stat: { value: 'Mikey Lock', label: 'NEW ADDITION' },
              beltContext: 'Even at black belt, the art reveals new layers.',
              icon: 'zap',
            },
          ];
      }
    };

    const combinedBreakthroughs = [...detected, ...getBeltBreakthroughs()];

    return {
      breakthrough: getMostSignificantBreakthrough(detected),
      allBreakthroughs: combinedBreakthroughs,
    };
  }, [allJournalEntries, stats, profile.belt]);

  // Show breakthrough hero if we have one and it hasn't been dismissed
  const showBreakthroughHero = breakthrough !== null && !breakthroughDismissed;

  // ===========================================
  // TOURNAMENT READINESS DATA
  // ===========================================
  const tournamentReadinessInput: TournamentReadinessInput = useMemo(() => {
    // Get belt-specific competition data
    const competitionStats = getCompetitionStatsByBelt(profile.belt as CompetitionBeltLevel);
    const upcomingCompetition = getUpcomingCompetitionByBelt(profile.belt as CompetitionBeltLevel);

    // Calculate days until upcoming competition (if any)
    let daysUntil = -1;
    if (upcomingCompetition) {
      const upcomingDate = new Date(upcomingCompetition.date);
      const today = new Date();
      daysUntil = Math.ceil((upcomingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Belt-specific technique category distribution
    const getTechniqueCategories = () => {
      switch (profile.belt) {
        case 'white':
          return { guards: 4, passes: 3, submissions: 3, escapes: 6, takedowns: 2 };
        case 'blue':
          return { guards: 14, passes: 9, submissions: 12, escapes: 6, takedowns: 6 };
        case 'purple':
          return { guards: 22, passes: 18, submissions: 20, escapes: 12, takedowns: 10 };
        case 'brown':
          return { guards: 28, passes: 25, submissions: 28, escapes: 18, takedowns: 15 };
        default:
          return { guards: 35, passes: 30, submissions: 35, escapes: 22, takedowns: 18 };
      }
    };

    // Belt-specific technique count
    const getTechniquesLogged = () => {
      switch (profile.belt) {
        case 'white': return 18;
        case 'blue': return 47;
        case 'purple': return 82;
        case 'brown': return 114;
        default: return 140;
      }
    };

    return {
      belt: profile.belt as TournamentReadinessInput['belt'],
      // Consistency metrics
      currentStreak: stats.currentStreak,
      sessionsThisMonth: stats.thisMonth.sessions,
      sessionsLastMonth: Math.max(6, stats.thisMonth.sessions - 2),
      weeklyTarget: profile.belt === 'white' ? 2 : profile.belt === 'purple' ? 5 : 3,
      weeksHitTarget: profile.belt === 'purple' ? 12 : profile.belt === 'brown' ? 11 : 8,
      totalWeeksTracked: 13,
      // Technical metrics
      techniquesLogged: getTechniquesLogged(),
      techniqueCategories: getTechniqueCategories(),
      // Sparring metrics
      submissionsLanded: stats.sparringRecord.wins,
      timesTapped: stats.sparringRecord.losses,
      sparringRoundsThisMonth: stats.thisMonth.sparringRounds,
      // Competition history (belt-specific)
      totalCompetitions: competitionStats.totalCompetitions,
      totalMatches: competitionStats.totalMatches,
      competitionWins: competitionStats.wins,
      medals: competitionStats.medals,
      // Upcoming competition (belt-specific)
      hasUpcomingCompetition: daysUntil > 0 && daysUntil < 180,
      daysUntilCompetition: daysUntil > 0 ? daysUntil : undefined,
    };
  }, [profile.belt, stats]);

  // Get belt-specific hero metric
  const heroMetric = getHeroMetricData(dashboard.primaryMetric, stats);
  const animatedHeroValue = useCountUp(heroMetric.value, { duration: 600, delay: 100 });

  // Get insight messages based on belt focus (at-risk personas get attendance-focused messaging)
  const insightMessages = getInsightMessage(dashboard.insightFocus, isAtRiskPersona);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Animated count-up for stats
  const animatedStreak = useCountUp(stats.currentStreak, { duration: 500, delay: 200 });

  // Belt-adaptive streak glow threshold - higher threshold for more experienced practitioners
  // White belts: glow at 7 days (encourage early), Brown/Black: glow at higher streaks
  const streakGlowThreshold = dashboard.streakEmphasis === 'high' ? 7 : dashboard.streakEmphasis === 'medium' ? 10 : 14;
  const showStreakGlow = stats.currentStreak >= streakGlowThreshold;

  // Derive technique history for Foundations Progress module
  const techniqueHistory = useMemo(() => {
    return allJournalEntries.slice(0, 20).map((entry) => ({
      date: entry.date,
      techniques: [
        ...(entry.techniquesDrilled || []),
        ...entry.techniques.map((t) => t.techniqueName),
      ],
    }));
  }, [allJournalEntries]);

  // Check if we should show belt-specific modules
  const showWhiteBeltModules = profile.belt === 'white';
  const showBlueBeltModules = profile.belt === 'blue';
  const showPurpleBeltModules = profile.belt === 'purple' || profile.belt === 'brown' || profile.belt === 'black';

  // Derive submission data for Blue Belt modules
  const blueBeltData = useMemo(() => {
    // Use mock data based on belt level for demo
    const mockStats = profile.belt === 'blue' ? MOCK_BLUE_BELT_STATS : MOCK_WHITE_BELT_STATS;

    // Calculate days since last session (approximate from current streak)
    const daysSinceLastSession = stats.currentStreak > 0 ? 0 : 3; // Mock: 0 if on streak, 3 otherwise

    // Calculate sessions last month (approximate from this month)
    const sessionsLastMonth = Math.max(6, stats.thisMonth.sessions - 2);

    // Get recent notes for sentiment analysis
    const recentNotes = allJournalEntries
      .slice(0, 5)
      .map((entry) => entry.notes || '')
      .filter((note) => note.length > 0);

    return {
      submissionsGiven: mockStats.submissionsGiven as SubmissionRecord[],
      submissionsReceived: mockStats.submissionsReceived as SubmissionRecord[],
      sessionsThisMonth: stats.thisMonth.sessions,
      sessionsLastMonth,
      daysSinceLastSession,
      daysSincePromotion: 180, // Mock: 6 months since getting blue belt
      recentNotes,
    };
  }, [profile.belt, stats, allJournalEntries]);

  // Derive data for Purple Belt modules
  const purpleBeltData = useMemo(() => {
    // Use purple belt mock data for demo
    const mockStats = MOCK_PURPLE_BELT_STATS;

    return {
      yearlyData: mockStats.yearlySessionCounts,
      totalSessions: mockStats.sessionCount,
      totalMinutes: mockStats.totalMinutes,
      sparringRounds: mockStats.sparringRounds,
      trainingStartDate: mockStats.trainingStartDate,
      submissionsGiven: mockStats.submissionsGiven as SubmissionRecord[],
      submissionsReceived: mockStats.submissionsReceived as SubmissionRecord[],
      techniqueMastery: MOCK_PURPLE_TECHNIQUE_MASTERY,
    };
  }, []);

  // Belt-specific motivational message based on current stage
  const getBeltMotivationalMessage = () => {
    if (isInRiskWindow) {
      return `${profile.stageName} is challenging. You're not alone - and it passes.`;
    }
    switch (profile.belt) {
      case 'white':
        return "You're building your foundation. Every class counts.";
      case 'blue':
        return "Developing your game. The plateau is part of the process.";
      case 'purple':
        return "Systems thinking. Your depth of understanding is growing.";
      case 'brown':
        return "Refinement phase. The finish line is in sight.";
      case 'black':
        return "The journey continues. Teaching is the highest expression.";
      default:
        return "You're showing up.";
    }
  };

  return (
    <div style={{ background: 'var(--color-black)', minHeight: '100vh' }}>

      {/* ============================================
          HERO - Breakthrough or Session Count
          ============================================ */}
      {showBreakthroughHero && breakthrough ? (
        <BreakthroughHero
          breakthrough={breakthrough}
          onDismiss={() => setBreakthroughDismissed(true)}
        />
      ) : (
        <section
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px',
            paddingBottom: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gold glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-30%',
              width: '150%',
              height: '150%',
              background: 'radial-gradient(circle at 70% 30%, rgba(245, 166, 35, 0.12) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-gold)',
              marginBottom: '12px',
            }}
          >
            {monthName}
          </div>

          <div
            style={{
              fontSize: 'clamp(100px, 30vw, 160px)',
              fontWeight: 800, /* Extra Bold for hero numbers */
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(180deg, #ffffff 0%, #666666 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {animatedHeroValue}
          </div>

          <div
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 500,
              color: 'var(--color-gray-400)',
              marginTop: '-4px',
              marginBottom: '24px',
            }}
          >
            {heroMetric.label}
          </div>

          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-gray-400)',
              maxWidth: '300px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {heroMetric.sublabel}
            {' '}{getBeltMotivationalMessage()}
          </p>

        </section>
      )}

      {/* ============================================
          STYLE PROFILE - Hero radar chart visualization
          ============================================ */}
      <section
        style={{
          padding: '32px 24px',
          borderTop: '1px solid var(--color-gray-800)',
          position: 'relative',
        }}
      >
        {/* Section header */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: hasEnoughDataForStyle ? 'var(--color-gold)' : 'var(--color-gray-600)',
          marginBottom: 'var(--space-lg)',
          textAlign: 'center',
        }}>
          Style Profile
        </div>

        {/* Has enough data - show full style fingerprint */}
        {hasEnoughDataForStyle && (
          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
          }}>
            <StyleFingerprint
              data={styleFingerprint}
              size={280}
              showLabels={true}
              showArchetype={true}
              animated={true}
            />
          </div>
        )}

        {/* Not enough data - greyed out state */}
        {!hasEnoughDataForStyle && (
          <div style={{
            position: 'relative',
          }}>
            {/* Greyed out radar chart */}
            <div style={{
              opacity: 0.25,
              filter: 'grayscale(100%)',
              pointerEvents: 'none',
            }}>
              <div style={{
                backgroundColor: 'var(--color-gray-900)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
              }}>
                <StyleFingerprint
                  data={styleFingerprint}
                  size={280}
                  showLabels={true}
                  showArchetype={false}
                  animated={false}
                />
              </div>
            </div>

            {/* Overlay message */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 'var(--space-xl)',
            }}>
              {/* Lock icon */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--color-gray-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-md)',
                border: '2px solid var(--color-gray-700)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>

              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-xs)',
              }}>
                Awaiting More Data
              </div>

              <p style={{
                color: 'var(--color-gray-500)',
                fontSize: 'var(--text-sm)',
                maxWidth: '240px',
                lineHeight: 1.5,
                margin: 0,
                marginBottom: 'var(--space-md)',
              }}>
                Log {STYLE_PROFILE_MIN_SESSIONS - stats.totalSessions} more sessions to unlock your style fingerprint.
              </p>

              {/* Progress bar */}
              <div style={{
                width: '180px',
                height: '6px',
                backgroundColor: 'var(--color-gray-800)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min((stats.totalSessions / STYLE_PROFILE_MIN_SESSIONS) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-gray-600)',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{
                marginTop: 'var(--space-xs)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-600)',
                fontFamily: 'var(--font-mono)',
              }}>
                {stats.totalSessions} / {STYLE_PROFILE_MIN_SESSIONS} sessions
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================
          UP NEXT - Personalized video recommendations
          Belt-specific videos based on what each persona is working on
          At-risk personas see psychological support content
          ============================================ */}
      <UpNextVideos
        maxLevelUpVideos={4}
        showSupportSection={true}
      />

      {/* ============================================
          WATCH OUT - Vulnerability alert with defense coaching
          Belt-specific: White belts see common subs, Blue belts see leg locks
          ============================================ */}
      <section
        style={{
          padding: '24px',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        <RecentRolls
          submissionsReceived={
            profile.belt === 'white' ? MOCK_WHITE_BELT_SUBMISSIONS :
            profile.belt === 'blue' ? MOCK_BLUE_BELT_SUBMISSIONS :
            MOCK_PURPLE_BELT_SUBMISSIONS
          }
        />
      </section>

      {/* ============================================
          WHITE BELT MODULES - Tier 1 Infographics
          Only shown for white belts to maximize retention

          NEW: Weekly Progress Ring, Calendar Heat Map, Dashboard Summary
          REMOVED: YourProgress, FoundationsProgress (replaced by above)
          KEPT: DefenseFocus (offense/defense bar charts)
          ============================================ */}
      {showWhiteBeltModules && (
        <>
          {/* Weekly Progress Ring - Apple Watch-style weekly goal */}
          <WeeklyProgressRing
            sessionsThisWeek={isAtRiskPersona ? 1 : stats.thisMonth.sessions > 0 ? Math.min(4, Math.ceil(stats.thisMonth.sessions / 4)) : 2}
            weeklyGoal={activeDemoProfile?.contextProfile?.targetFrequency || 3}
          />

          {/* Calendar Heat Map - GitHub-style consistency visualization */}
          <CalendarHeatMap
            sessionsByDate={generateMockSessionDates(stats.totalSessions, isAtRiskPersona)}
            weeks={13}
            totalSessions={stats.totalSessions}
            avgPerWeek={isAtRiskPersona ? 1.5 : 2.8}
          />

          {/* Dashboard Summary Card - Key metrics at-a-glance */}
          <DashboardSummaryCard
            totalSessions={stats.totalSessions}
            totalHours={stats.totalHours}
            currentStreak={stats.currentStreak}
            bestStreak={stats.longestStreak}
            belt={profile.belt}
            stripes={activeDemoProfile?.contextProfile?.stripes || 0}
            trainingStartDate={activeDemoProfile?.contextProfile?.trainingStartDate || undefined}
          />

          {/* Defense Focus - Toggleable offense/defense stats */}
          {/* At-risk personas see their low offense and high defense numbers */}
          <DefenseFocus
            submissionsGiven={isAtRiskPersona ? MOCK_WHITE_BELT_AT_RISK_OFFENSE : MOCK_WHITE_BELT_OFFENSE}
            submissionsReceived={isAtRiskPersona ? MOCK_WHITE_BELT_AT_RISK_DEFENSE : MOCK_WHITE_BELT_DEFENSE}
            defaultView="defense"
          />
        </>
      )}

      {/* ============================================
          BLUE BELT MODULES - Identity & Game Development
          Only shown for blue belts

          Tier 1 Infographics:
          - SessionTypeDistribution: Donut chart of training mix
          - SparringPatternAnalysis: Submission exchange rates
          - AchievementTimeline: Personal journey milestones

          Legacy modules (kept for unique functionality):
          - TechniquePairings: Unique drilling co-occurrence analysis
          - BluesDetector: Unique dropout intervention system
          ============================================ */}
      {showBlueBeltModules && (
        <>
          {/* Session Type Distribution - Donut chart of training mix */}
          <SessionTypeDistribution
            sessionTypes={MOCK_BLUE_BELT_SESSION_TYPES}
          />

          {/* Sparring Pattern Analysis - Submission exchange rates */}
          <SparringPatternAnalysis
            exchanges={MOCK_BLUE_BELT_EXCHANGES}
            periodLabel="Last 30 Rolls"
          />

          {/* Achievement Timeline - Personal journey milestones */}
          <AchievementTimeline
            achievements={MOCK_BLUE_BELT_ACHIEVEMENTS}
            maxItems={5}
          />

          {/* Technique Pairings - Co-occurrence analysis */}
          <TechniquePairings
            techniqueHistory={techniqueHistory}
          />

          {/* Blues Detector - Dropout risk interventions */}
          <BluesDetector
            sessionsThisMonth={blueBeltData.sessionsThisMonth}
            sessionsLastMonth={blueBeltData.sessionsLastMonth}
            daysSinceLastSession={blueBeltData.daysSinceLastSession}
            daysSincePromotion={blueBeltData.daysSincePromotion}
            recentNotes={blueBeltData.recentNotes}
          />
        </>
      )}

      {/* ============================================
          PURPLE BELT MODULES - Depth & Systems
          Shown for purple, brown, and black belts

          Tier 1 Infographics:
          - SessionTypeDistribution: Donut chart of training mix
          - SparringPatternAnalysis: Submission exchange rates
          - AchievementTimeline: Personal journey milestones

          Legacy modules (kept for unique functionality):
          - YourJourney: Multi-year progression + submission trends
          - TechniqueMastery: Specialization depth analysis
          ============================================ */}
      {showPurpleBeltModules && (
        <>
          {/* Session Type Distribution - Donut chart of training mix */}
          <SessionTypeDistribution
            sessionTypes={MOCK_PURPLE_BELT_SESSION_TYPES}
          />

          {/* Sparring Pattern Analysis - Submission exchange rates */}
          <SparringPatternAnalysis
            exchanges={MOCK_PURPLE_BELT_EXCHANGES}
            periodLabel="Last 30 Rolls"
          />

          {/* Achievement Timeline - Personal journey milestones */}
          <AchievementTimeline
            achievements={MOCK_PURPLE_BELT_ACHIEVEMENTS}
            maxItems={6}
          />

          {/* Your Journey - Multi-year progression + submission trends */}
          <YourJourney
            yearlyData={purpleBeltData.yearlyData}
            totalSessions={purpleBeltData.totalSessions}
            totalMinutes={purpleBeltData.totalMinutes}
            sparringRounds={purpleBeltData.sparringRounds}
            trainingStartDate={purpleBeltData.trainingStartDate}
            submissionsGiven={purpleBeltData.submissionsGiven}
          />

          {/* Technique Mastery - Specialization depth */}
          <TechniqueMastery
            techniques={purpleBeltData.techniqueMastery}
          />
        </>
      )}

      {/* ============================================
          ATTACK PROFILE - Full submission story visualization
          Hidden for white belts (they see defense-focused modules instead)
          ============================================ */}
      {!showWhiteBeltModules && (
        <section
          style={{
            borderTop: '1px solid var(--color-gray-800)',
          }}
        >
          <AttackProfile
            submissionStats={mockSubmissionStats}
            belt={profile.belt}
          />
        </section>
      )}

      {/* ============================================
          REMOVED: Sparring Dominance Grid + Submission Profile Cards

          These were redundant with AttackProfile which shows:
          - Subs Given / Tapped Out / Win Rate in footer
          - Top 5 weapons (better than DeadliestAttackCard)
          - Top 5 vulnerabilities (covered by RecentRolls)
          ============================================ */}

      {/* ============================================
          STREAK - Massive typographic statement
          ============================================ */}
      <section
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          position: 'relative',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        {/* Glow behind number - animated pulse for 7+ day streaks */}
        <div
          className={showStreakGlow ? 'animate-streak-glow' : undefined}
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, var(--color-positive-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            fontSize: 'clamp(120px, 40vw, 200px)',
            fontWeight: 800, /* Extra Bold for hero numbers */
            lineHeight: 0.75,
            letterSpacing: '-0.05em',
            color: 'var(--color-positive)',
            position: 'relative',
          }}
        >
          {animatedStreak}
        </div>

        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            color: 'var(--color-positive)',
            marginTop: '20px',
          }}
        >
          Day Streak
        </div>

        {/* Meta stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '64px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid var(--color-gray-800)',
          }}
        >
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-white)' }}>
              {stats.longestStreak}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginTop: '4px',
            }}>
              Best Ever
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-gold)' }}>
              {Math.round((stats.thisMonth.sessions / stats.thisMonth.targetSessions) * 100)}%
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginTop: '4px',
            }}>
              Monthly Goal
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CALLOUTS - Belt-personalized insights
          ============================================ */}
      <>
        {/* GREEN - What's working (belt-personalized) */}
        <div
          style={{
            padding: '32px 24px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, transparent 100%)',
            borderLeft: '3px solid var(--color-positive)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-positive)',
              marginBottom: '12px',
            }}
          >
            What's Working
          </div>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-100)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {insightMessages.working}
          </p>
        </div>

        {/* GOLD - Focus area (belt-personalized) */}
        <div
          style={{
            padding: '32px 24px',
            background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.12) 0%, transparent 100%)',
            borderLeft: '3px solid var(--color-accent)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-accent)',
              marginBottom: '12px',
            }}
          >
            Focus Area
          </div>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-100)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {insightMessages.focus}
          </p>
        </div>
      </>

      {/* ============================================
          TOURNAMENT READINESS - Competition prep score
          ============================================ */}
      <TournamentReadinessCard
        input={tournamentReadinessInput}
        showFullBreakdown={false}
      />

      {/* ============================================
          BREAKTHROUGH HISTORY - Recent wins and achievements
          ============================================ */}
      <BreakthroughList
        breakthroughs={allBreakthroughs}
        maxVisible={5}
        showEmptyState={true}
        belt={profile.belt}
      />

      {/* Bottom spacer for tab bar */}
      <div style={{ height: '100px' }} />
    </div>
  );
}

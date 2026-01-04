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
  YourProgress,
  FoundationsProgress,
  DefenseFocus,
  TechniquePairings,
  BluesDetector,
  YourJourney,
  TechniqueMastery,
  RecentRolls,
  type SubmissionReceived,
} from './stats-modules';
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
function getInsightMessage(insightFocus: string): { working: string; focus: string } {
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

export function Dashboard(_props: DashboardProps) {
  // Check for demo mode
  const { isDemoMode, activeDemoProfile } = useUserProfile();

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
              detectedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
              detectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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

  // Get insight messages based on belt focus
  const insightMessages = getInsightMessage(dashboard.insightFocus);

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

          {/* Scroll hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--color-gray-600)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              opacity: 0.6,
            }}
          >
            scroll
          </div>
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
          WHITE BELT MODULES - Retention-focused stats
          Only shown for white belts to maximize retention

          Consolidated: JourneyTimeline + ConsistencyScore → YourProgress
          - Session count shown in Hero (not duplicated here)
          - Streak shown in Streak Section (not duplicated here)
          - Focus on progress to 50 + weekly/monthly frequency
          ============================================ */}
      {showWhiteBeltModules && (
        <>
          {/* Your Progress - Progress to 50 and frequency tracking */}
          <YourProgress
            sessionCount={stats.totalSessions}
            sessionsThisWeek={4}
            sessionsThisMonth={stats.thisMonth.sessions}
            targetFrequency={3}
          />

          {/* Defense Focus - Toggleable offense/defense stats */}
          <DefenseFocus
            submissionsGiven={MOCK_WHITE_BELT_OFFENSE}
            submissionsReceived={MOCK_WHITE_BELT_DEFENSE}
            defaultView="defense"
          />

          {/* Foundations Progress - Fundamental technique checklist */}
          <FoundationsProgress
            techniqueHistory={techniqueHistory}
          />
        </>
      )}

      {/* ============================================
          BLUE BELT MODULES - Identity & Game Development
          Only shown for blue belts

          Consolidated:
          - YourStyle, VulnerabilityMap → AttackProfile handles submission story
          - RecentRolls handles defense coaching with videos
          - Keep: TechniquePairings (unique drilling analysis)
          - Keep: BluesDetector (unique intervention system)
          ============================================ */}
      {showBlueBeltModules && (
        <>
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

          Consolidated:
          - LongGame + SubmissionTrends → YourJourney
          - TechniqueMastery simplified (depth analysis removed, in AttackProfile)
          ============================================ */}
      {showPurpleBeltModules && (
        <>
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

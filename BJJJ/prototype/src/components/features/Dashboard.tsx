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
import { TrainingBadge, DeadliestAttackCard, AchillesHeelCard, BreakthroughHero } from '../ui';
import { AttackProfile } from './AttackProfile';
import { useCountUp, useBeltPersonalization } from '../../hooks';
import { useUserProfile } from '../../context/UserProfileContext';
import {
  detectBreakthroughs,
  getMostSignificantBreakthrough,
  type BreakthroughDetectionInput,
} from '../../utils/breakthrough-detection';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

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

export function Dashboard({ onNavigate }: DashboardProps) {
  // Check for demo mode
  const { isDemoMode, activeDemoProfile } = useUserProfile();

  // State for dismissing breakthrough hero
  const [breakthroughDismissed, setBreakthroughDismissed] = useState(false);

  // Use demo profile data if in demo mode, otherwise use default mock data
  const stats = isDemoMode && activeDemoProfile
    ? activeDemoProfile.trainingStats as typeof mockTrainingStats
    : mockTrainingStats;
  const recentEntries = isDemoMode && activeDemoProfile
    ? activeDemoProfile.journalEntries.slice(0, 3)
    : mockJournalEntries.slice(0, 3);
  const allJournalEntries = isDemoMode && activeDemoProfile
    ? activeDemoProfile.journalEntries
    : mockJournalEntries;

  // Belt personalization for adaptive dashboard behavior
  const { profile, dashboard, isInRiskWindow } = useBeltPersonalization();

  // ===========================================
  // BREAKTHROUGH DETECTION
  // ===========================================
  const breakthrough = useMemo(() => {
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

    const detectedBreakthroughs = detectBreakthroughs(input);
    return getMostSignificantBreakthrough(detectedBreakthroughs);
  }, [allJournalEntries, stats, profile.belt]);

  // Show breakthrough hero if we have one and it hasn't been dismissed
  const showBreakthroughHero = breakthrough !== null && !breakthroughDismissed;

  // Get belt-specific hero metric
  const heroMetric = getHeroMetricData(dashboard.primaryMetric, stats);
  const animatedHeroValue = useCountUp(heroMetric.value, { duration: 600, delay: 100 });

  // Get insight messages based on belt focus
  const insightMessages = getInsightMessage(dashboard.insightFocus);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Animated count-up for stats
  const animatedStreak = useCountUp(stats.currentStreak, { duration: 500, delay: 200 });
  const animatedSubmissions = useCountUp(stats.sparringRecord.wins, { duration: 500, delay: 100 });
  const animatedTapped = useCountUp(stats.sparringRecord.losses, { duration: 500, delay: 150 });

  // Belt-adaptive streak glow threshold - higher threshold for more experienced practitioners
  // White belts: glow at 7 days (encourage early), Brown/Black: glow at higher streaks
  const streakGlowThreshold = dashboard.streakEmphasis === 'high' ? 7 : dashboard.streakEmphasis === 'medium' ? 10 : 14;
  const showStreakGlow = stats.currentStreak >= streakGlowThreshold;

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
              fontWeight: 700,
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
              fontWeight: 300,
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
          ATTACK PROFILE - Full submission story visualization
          ============================================ */}
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

      {/* ============================================
          SPARRING DOMINANCE - Full bleed grid
          Only shown for blue+ belts (showCompetitionStats)
          ============================================ */}
      {dashboard.showCompetitionStats && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'var(--color-gray-800)',
        }}
      >
        {/* SUBS GIVEN - GREEN (positive) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, var(--color-black) 100%)',
            padding: '40px 24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-positive)',
              marginBottom: '12px',
            }}
          >
            Subs Given
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: 'var(--color-positive)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {animatedSubmissions}
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: '8px',
            }}
          >
            total finishes
          </div>
        </div>

        {/* SUBMITTED BY - RED (negative) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, var(--color-black) 100%)',
            padding: '40px 24px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-negative)',
              marginBottom: '12px',
            }}
          >
            Submitted By
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: 'var(--color-negative)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {animatedTapped}
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: '8px',
            }}
          >
            times caught
          </div>
        </div>
      </div>
      )}

      {/* ============================================
          SUBMISSION PROFILE - Deadliest & Achilles Heel
          Only shown for blue+ belts (showCompetitionStats)
          ============================================ */}
      {dashboard.showCompetitionStats && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mockSubmissionStats.deadliestAttack && (profile.belt === 'white' || profile.belt === 'blue') && mockSubmissionStats.achillesHeel
            ? '1fr 1fr'
            : '1fr',
          gap: '1px',
          background: 'var(--color-gray-800)',
        }}
      >
        {/* Deadliest Attack - only show after 50 total submissions */}
        {mockSubmissionStats.deadliestAttack && mockSubmissionStats.totalGiven >= 50 && (
          <DeadliestAttackCard
            technique={mockSubmissionStats.deadliestAttack.technique}
            count={mockSubmissionStats.deadliestAttack.count}
          />
        )}

        {/* Achilles Heel - only for white and blue belts */}
        {(profile.belt === 'white' || profile.belt === 'blue') && mockSubmissionStats.achillesHeel && (
          <AchillesHeelCard
            technique={mockSubmissionStats.achillesHeel.technique}
            count={mockSubmissionStats.achillesHeel.count}
          />
        )}
      </div>
      )}

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
            top: '50%',
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
            fontWeight: 700,
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
          QUICK ACTIONS - Bold buttons
          ============================================ */}
      <section style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => onNavigate('voice-logger')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              background: 'var(--color-gold)',
              border: 'none',
              color: 'var(--color-black)',
              cursor: 'pointer',
              gap: '12px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Log Training
            </span>
          </button>

          <button
            onClick={() => onNavigate('library')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              background: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              color: 'var(--color-white)',
              cursor: 'pointer',
              gap: '12px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Techniques
            </span>
          </button>
        </div>
      </section>

      {/* ============================================
          RECENT SESSIONS - Clean list
          ============================================ */}
      <section
        style={{
          padding: '48px 24px',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--color-white)',
          }}>
            Recent Sessions
          </span>
          <button
            onClick={() => onNavigate('journal')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            View All
          </button>
        </div>

        {recentEntries.map((entry) => {
          const date = new Date(entry.date);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          let dateLabel: string;
          if (date.toDateString() === today.toDateString()) {
            dateLabel = 'Today';
          } else if (date.toDateString() === yesterday.toDateString()) {
            dateLabel = 'Yesterday';
          } else {
            dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }

          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid var(--color-gray-800)',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-white)' }}>
                  {dateLabel}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-400)',
                  marginTop: '4px',
                }}>
                  {entry.duration}min / {entry.techniques.length} tech / {entry.sparringRounds.length} rolls
                </div>
              </div>
              <TrainingBadge type={entry.type} size="sm" />
            </div>
          );
        })}
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

      {/* Bottom spacer for tab bar */}
      <div style={{ height: '100px' }} />
    </div>
  );
}

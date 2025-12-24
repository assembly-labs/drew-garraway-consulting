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
 */

import { currentUser } from '../../data/users';
import { mockTrainingStats, mockJournalEntries } from '../../data/journal';
import { mockProgressSummary, mockTonyChenPromotionReadiness } from '../../data/progress';
import { mockSubmissionStats } from '../../data/submissions';
import { BeltBadge, TrainingBadge, DeadliestAttackCard, AchillesHeelCard } from '../ui';
import { useCountUp } from '../../utils/useCountUp';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const user = currentUser;
  const stats = mockTrainingStats;
  const progress = mockProgressSummary;
  const readiness = mockTonyChenPromotionReadiness;
  const recentEntries = mockJournalEntries.slice(0, 3);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Animated count-up for hero stats
  const animatedSessions = useCountUp(stats.totalSessions, { duration: 600, delay: 100 });
  const animatedStreak = useCountUp(stats.currentStreak, { duration: 500, delay: 200 });
  const animatedSubmissions = useCountUp(stats.sparringRecord.wins, { duration: 500, delay: 100 });
  const animatedTapped = useCountUp(stats.sparringRecord.losses, { duration: 500, delay: 150 });

  // Streak glow threshold (7+ days gets the celebration glow)
  const showStreakGlow = stats.currentStreak >= 7;

  return (
    <div style={{ background: 'var(--color-black)', minHeight: '100vh' }}>

      {/* ============================================
          HERO - Massive session count
          ============================================ */}
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
          {animatedSessions}
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
          sessions logged
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
          <strong style={{ color: 'var(--color-white)' }}>{stats.totalHours} hours</strong> on the mat.
          You're showing up.
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

      {/* ============================================
          SPARRING DOMINANCE - Full bleed grid
          ============================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'var(--color-gray-800)',
        }}
      >
        {/* SUBMISSIONS - GREEN (positive) */}
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
            Submissions
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
            you landed
          </div>
        </div>

        {/* TAPPED - RED (negative) */}
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
            Tapped Out
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
            this month
          </div>
        </div>
      </div>

      {/* ============================================
          SUBMISSION PROFILE - Deadliest & Achilles Heel
          ============================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mockSubmissionStats.deadliestAttack && (user.belt === 'white' || user.belt === 'blue') && mockSubmissionStats.achillesHeel
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
        {(user.belt === 'white' || user.belt === 'blue') && mockSubmissionStats.achillesHeel && (
          <AchillesHeelCard
            technique={mockSubmissionStats.achillesHeel.technique}
            count={mockSubmissionStats.achillesHeel.count}
          />
        )}
      </div>

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
          BELT PROGRESS - Arsenal style grid
          ============================================ */}
      <section
        style={{
          padding: '48px 24px',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--color-white)',
          }}>
            {user.belt === 'blue' ? 'Purple' : 'Next'} Belt Progress
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
          }}>
            {readiness.technicalProgress.overallPercentage}% ready
          </span>
        </div>

        {/* Big percentage + belt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: readiness.technicalProgress.overallPercentage >= 70 ? 'var(--color-positive)' : 'var(--color-gold)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {readiness.technicalProgress.overallPercentage}%
          </div>
          <div>
            <BeltBadge belt={user.belt} stripes={user.stripes} size="lg" />
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: '8px',
            }}>
              {progress.timeAtBelt} at {user.belt} belt
            </div>
          </div>
        </div>

        {/* Category breakdown - arsenal grid style */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            background: 'var(--color-gray-800)',
            marginBottom: '24px',
          }}
        >
          {readiness.technicalProgress.byCategory.slice(0, 4).map((cat) => {
            const isStrong = cat.percentage >= 70;
            const isWeak = cat.percentage < 40;
            return (
              <div
                key={cat.category}
                style={{
                  background: isStrong
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, var(--color-gray-900) 100%)'
                    : isWeak
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, var(--color-gray-900) 100%)'
                    : 'var(--color-gray-900)',
                  padding: '20px 12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: isStrong ? 'var(--color-positive)' : isWeak ? 'var(--color-negative)' : 'var(--color-white)',
                    lineHeight: 1,
                  }}
                >
                  {cat.percentage}%
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: '8px',
                  }}
                >
                  {cat.category.replace('-', ' ').split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onNavigate('progress')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            border: '1px solid var(--color-gray-700)',
            color: 'var(--color-white)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
        >
          View Full Progress
        </button>
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
          CALLOUTS - Strength & Watch
          ============================================ */}
      {readiness.areasNeedingWork && readiness.areasNeedingWork.length > 0 && (
        <>
          {/* GREEN - What's working */}
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
              Progress toward {user.belt === 'blue' ? 'purple' : 'next'} belt at {readiness.technicalProgress.overallPercentage}%.
              {readiness.meetsTimeRequirement ? ' Time requirement met.' : ` ${readiness.timeAtCurrentBelt}/${readiness.timeRequired} months.`}
            </p>
          </div>

          {/* RED - Needs work */}
          <div
            style={{
              padding: '32px 24px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, transparent 100%)',
              borderLeft: '3px solid var(--color-negative)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--color-negative)',
                marginBottom: '12px',
              }}
            >
              Needs Work
            </div>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-gray-100)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              {readiness.areasNeedingWork[0]} is a gap. Focus here during your next few sessions.
            </p>
          </div>
        </>
      )}

      {/* Bottom spacer for tab bar */}
      <div style={{ height: '100px' }} />
    </div>
  );
}

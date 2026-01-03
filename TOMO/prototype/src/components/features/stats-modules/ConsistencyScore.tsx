/**
 * Consistency Score - White Belt Stats Module
 *
 * Replaces "Survival Score" which requires data we don't have (round duration, escapes).
 * Instead, celebrates what we CAN measure: showing up consistently.
 *
 * Design: Large hero number with streak emphasis, positioned against dropout rates
 * Data: session_count, session dates for streak calculation (all reliable)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';

interface ConsistencyScoreProps {
  sessionCount: number;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  targetFrequency?: number | null;
  variant?: 'hero' | 'standard' | 'compact';
}

export function ConsistencyScore({
  sessionCount,
  currentStreak,
  longestStreak,
  sessionsThisWeek,
  sessionsThisMonth,
  targetFrequency,
  variant = 'standard',
}: ConsistencyScoreProps) {
  // Calculate progress toward 50 sessions (dropout cliff milestone)
  const progressTo50 = useMemo(() => {
    return Math.min(100, Math.round((sessionCount / 50) * 100));
  }, [sessionCount]);

  // Calculate weekly goal progress
  const weeklyProgress = useMemo(() => {
    if (!targetFrequency) return null;
    return Math.min(100, Math.round((sessionsThisWeek / targetFrequency) * 100));
  }, [sessionsThisWeek, targetFrequency]);

  // Get personalized message based on session count
  const getMessage = () => {
    if (sessionCount < 10) {
      return "You're building the habit. Every session counts.";
    } else if (sessionCount < 25) {
      return "The foundation is forming. Keep showing up.";
    } else if (sessionCount < 50) {
      return "You're in the 30% who keep going. Almost to 50.";
    } else if (sessionCount < 100) {
      return "Past the dropout cliff. This is who you are now.";
    } else {
      return "Triple digits. A true practitioner.";
    }
  };

  // Get streak status
  const getStreakStatus = () => {
    if (currentStreak === 0) {
      return { label: 'Start a new streak', color: 'var(--color-gray-500)' };
    } else if (currentStreak >= longestStreak && currentStreak > 3) {
      return { label: 'Personal best!', color: 'var(--color-gold)' };
    } else if (currentStreak >= 7) {
      return { label: 'On fire', color: 'var(--color-positive)' };
    } else if (currentStreak >= 3) {
      return { label: 'Building momentum', color: 'var(--color-positive)' };
    } else {
      return { label: 'Keep going', color: 'var(--color-gray-400)' };
    }
  };

  const streakStatus = getStreakStatus();

  if (variant === 'hero') {
    return (
      <HeroConsistency
        sessionCount={sessionCount}
        currentStreak={currentStreak}
        getMessage={getMessage}
        streakStatus={streakStatus}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <CompactConsistency
        sessionCount={sessionCount}
        currentStreak={currentStreak}
        progressTo50={progressTo50}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Icons.Flame size={20} color="var(--color-positive)" />
        </div>
        <span style={styles.headerLabel}>CONSISTENCY</span>
      </div>

      {/* Hero Number - Session Count */}
      <div style={styles.heroSection}>
        <span style={styles.heroNumber}>{sessionCount}</span>
        <span style={styles.heroLabel}>sessions logged</span>
      </div>

      {/* Progress to 50 */}
      {sessionCount < 50 && (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>PROGRESS TO 50</span>
            <span style={styles.progressPercent}>{progressTo50}%</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressTo50}%`,
              }}
            />
          </div>
          <p style={styles.progressMessage}>
            70% of white belts quit before 50 sessions.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Current Streak */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <Icons.Flame size={14} color={streakStatus.color} />
            <span style={{ ...styles.statLabel, color: streakStatus.color }}>
              {streakStatus.label.toUpperCase()}
            </span>
          </div>
          <div style={styles.statValueRow}>
            <span
              style={{
                ...styles.statValue,
                color:
                  currentStreak > 0
                    ? 'var(--color-positive)'
                    : 'var(--color-gray-500)',
              }}
            >
              {currentStreak}
            </span>
            <span style={styles.statUnit}>day streak</span>
          </div>
          {longestStreak > 0 && currentStreak < longestStreak && (
            <span style={styles.statSubtext}>Best: {longestStreak} days</span>
          )}
        </div>

        {/* This Week */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <Icons.Calendar size={14} color="var(--color-gray-500)" />
            <span style={styles.statLabel}>THIS WEEK</span>
          </div>
          <div style={styles.statValueRow}>
            <span style={styles.statValue}>{sessionsThisWeek}</span>
            <span style={styles.statUnit}>
              {targetFrequency ? `/ ${targetFrequency}` : 'sessions'}
            </span>
          </div>
          {weeklyProgress !== null && (
            <div style={styles.miniProgressBar}>
              <div
                style={{
                  ...styles.miniProgressFill,
                  width: `${weeklyProgress}%`,
                  background:
                    weeklyProgress >= 100
                      ? 'var(--color-positive)'
                      : 'var(--color-gold)',
                }}
              />
            </div>
          )}
        </div>

        {/* This Month */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <Icons.TrendUp size={14} color="var(--color-gray-500)" />
            <span style={styles.statLabel}>THIS MONTH</span>
          </div>
          <div style={styles.statValueRow}>
            <span style={styles.statValue}>{sessionsThisMonth}</span>
            <span style={styles.statUnit}>sessions</span>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div style={styles.messageBox}>
        <p style={styles.message}>{getMessage()}</p>
      </div>
    </section>
  );
}

// Hero variant - Large streak display
function HeroConsistency({
  sessionCount,
  currentStreak,
  getMessage,
  streakStatus,
}: {
  sessionCount: number;
  currentStreak: number;
  getMessage: () => string;
  streakStatus: { label: string; color: string };
}) {
  return (
    <section style={styles.heroContainer}>
      <div style={styles.heroGlow} />
      <div style={styles.heroContent}>
        <span style={styles.megaNumber}>{currentStreak}</span>
        <span style={styles.megaLabel}>DAY STREAK</span>
        <span style={{ ...styles.heroStatus, color: streakStatus.color }}>
          {streakStatus.label}
        </span>
      </div>
      <div style={styles.heroFooter}>
        <span style={styles.heroStat}>{sessionCount} total sessions</span>
        <span style={styles.heroMessage}>{getMessage()}</span>
      </div>
    </section>
  );
}

// Compact variant for smaller displays
function CompactConsistency({
  sessionCount,
  currentStreak,
  progressTo50,
}: {
  sessionCount: number;
  currentStreak: number;
  progressTo50: number;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Flame size={16} color="var(--color-positive)" />
        <span style={styles.compactLabel}>CONSISTENCY</span>
      </div>
      <div style={styles.compactRow}>
        <div style={styles.compactStat}>
          <span style={styles.compactValue}>{sessionCount}</span>
          <span style={styles.compactUnit}>sessions</span>
        </div>
        <div style={styles.compactDivider} />
        <div style={styles.compactStat}>
          <span
            style={{
              ...styles.compactValue,
              color:
                currentStreak > 0
                  ? 'var(--color-positive)'
                  : 'var(--color-gray-500)',
            }}
          >
            {currentStreak}
          </span>
          <span style={styles.compactUnit}>day streak</span>
        </div>
      </div>
      {sessionCount < 50 && (
        <div style={styles.compactProgress}>
          <div style={styles.compactProgressBar}>
            <div
              style={{
                ...styles.compactProgressFill,
                width: `${progressTo50}%`,
              }}
            />
          </div>
          <span style={styles.compactProgressText}>{progressTo50}% to 50</span>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-widest)',
    color: 'var(--color-gray-400)',
    textTransform: 'uppercase' as const,
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: 'var(--space-xl)',
  },
  heroNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-5xl)',
    fontWeight: 700,
    color: 'var(--color-white)',
    lineHeight: 'var(--leading-none)',
  },
  heroLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
    marginTop: 'var(--space-sm)',
  },
  progressSection: {
    marginBottom: 'var(--space-lg)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-sm)',
  },
  progressLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
  },
  progressPercent: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
  },
  progressBar: {
    height: '8px',
    background: 'var(--color-gray-700)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: 'var(--space-sm)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-gold), var(--color-positive))',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  progressMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    margin: 0,
    textAlign: 'center' as const,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: 'var(--color-gray-700)',
    marginBottom: 'var(--space-lg)',
  },
  statCard: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)',
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
  },
  statValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: 'var(--color-white)',
    lineHeight: 'var(--leading-none)',
  },
  statUnit: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  statSubtext: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 500,
    color: 'var(--color-gray-600)',
  },
  miniProgressBar: {
    height: '3px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: 'var(--space-xs)',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: '2px',
  },
  messageBox: {
    padding: 'var(--space-md)',
    background: 'var(--color-positive-dim)',
    borderLeft: '3px solid var(--color-positive)',
  },
  message: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-200)',
    margin: 0,
    lineHeight: 'var(--leading-normal)',
  },
  // Hero variant styles
  heroContainer: {
    background: 'var(--color-black)',
    padding: 'var(--space-2xl) var(--space-lg)',
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: 'center' as const,
  },
  heroGlow: {
    position: 'absolute' as const,
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, var(--color-positive-glow) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  megaNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-hero)',
    fontWeight: 900,
    color: 'var(--color-positive)',
    lineHeight: 'var(--leading-none)',
    letterSpacing: 'var(--tracking-tight)',
  },
  megaLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-widest)',
    color: 'var(--color-white)',
    marginTop: 'var(--space-sm)',
  },
  heroStatus: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    marginTop: 'var(--space-sm)',
    textTransform: 'uppercase' as const,
  },
  heroFooter: {
    position: 'relative' as const,
    zIndex: 1,
    marginTop: 'var(--space-xl)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  heroStat: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  heroMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    fontStyle: 'italic',
  },
  // Compact styles
  compactContainer: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-md)',
  },
  compactHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    marginBottom: 'var(--space-sm)',
  },
  compactLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
  },
  compactRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-lg)',
    marginBottom: 'var(--space-sm)',
  },
  compactStat: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-xs)',
  },
  compactDivider: {
    width: '1px',
    height: '24px',
    background: 'var(--color-gray-700)',
  },
  compactValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  compactUnit: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  compactProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  compactProgressBar: {
    flex: 1,
    height: '4px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    background: 'var(--color-gold)',
    borderRadius: '2px',
  },
  compactProgressText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    whiteSpace: 'nowrap' as const,
  },
};

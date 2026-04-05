/**
 * Your Progress - White Belt Stats Module (Consolidated)
 *
 * Merges JourneyTimeline + ConsistencyScore into a single focused module.
 * Shows progress to 50 sessions (the dropout cliff milestone) and
 * actionable frequency metrics (this week, this month).
 *
 * Design: Clean progress bar with 2-column stats grid
 * Data: session_count, weekly/monthly frequency (all reliable)
 *
 * What was REMOVED (handled elsewhere):
 * - Session count hero (in Dashboard Hero)
 * - Streak display (in Streak Section)
 * - Days active (not actionable)
 * - Milestone timeline (visual noise)
 * - Multiple motivational messages (in Hero sublabel + Callouts)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';

interface YourProgressProps {
  sessionCount: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  targetFrequency?: number | null;
}

export function YourProgress({
  sessionCount,
  sessionsThisWeek,
  sessionsThisMonth,
  targetFrequency,
}: YourProgressProps) {
  // Calculate progress toward 50 sessions (dropout cliff milestone)
  const progressTo50 = useMemo(() => {
    return Math.min(100, Math.round((sessionCount / 50) * 100));
  }, [sessionCount]);

  const sessionsRemaining = Math.max(0, 50 - sessionCount);
  const hasPassed50 = sessionCount >= 50;

  // Calculate weekly goal progress
  const weeklyProgress = useMemo(() => {
    if (!targetFrequency) return null;
    return Math.min(100, Math.round((sessionsThisWeek / targetFrequency) * 100));
  }, [sessionsThisWeek, targetFrequency]);

  // Calculate monthly target (weekly goal × 4 weeks)
  const monthlyTarget = targetFrequency ? targetFrequency * 4 : null;

  // Calculate monthly goal progress
  const monthlyProgress = useMemo(() => {
    if (!monthlyTarget) return null;
    return Math.min(100, Math.round((sessionsThisMonth / monthlyTarget) * 100));
  }, [sessionsThisMonth, monthlyTarget]);

  // Progress message based on where they are
  const getProgressMessage = () => {
    if (hasPassed50) {
      return 'Past the cliff. Keep building.';
    }
    return `${sessionsRemaining} more to pass the cliff`;
  };

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Icons.Target size={18} color="var(--color-gold)" />
        </div>
        <span style={styles.headerLabel}>PROGRESS</span>
      </div>

      {/* Progress Bar Section */}
      <div style={styles.progressSection}>
        {/* Progress Bar */}
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${progressTo50}%`,
            }}
          />
        </div>

        {/* Progress Stats Row */}
        <div style={styles.progressStats}>
          <span style={styles.progressPercent}>{progressTo50}%</span>
          <span style={styles.progressContext}>
            {sessionCount} of 50 sessions
          </span>
        </div>

        {/* Progress Message */}
        <p style={styles.progressMessage}>{getProgressMessage()}</p>
      </div>

      {/* Stats Grid - This Week / This Month */}
      <div style={styles.statsGrid}>
        {/* This Week */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <Icons.Calendar size={14} color="var(--color-gray-500)" />
            <span style={styles.statLabel}>THIS WEEK</span>
          </div>
          <div style={styles.statValueRow}>
            <span style={styles.statValue}>{sessionsThisWeek}</span>
            {targetFrequency && (
              <span style={styles.statTarget}>/ {targetFrequency}</span>
            )}
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
            {monthlyTarget ? (
              <span style={styles.statTarget}>/ {monthlyTarget}</span>
            ) : (
              <span style={styles.statUnit}>sessions</span>
            )}
          </div>
          {monthlyProgress !== null && (
            <div style={styles.miniProgressBar}>
              <div
                style={{
                  ...styles.miniProgressFill,
                  width: `${monthlyProgress}%`,
                  background:
                    monthlyProgress >= 100
                      ? 'var(--color-positive)'
                      : 'var(--color-gold)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
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
  progressSection: {
    marginBottom: 'var(--space-lg)',
  },
  progressBarContainer: {
    height: '8px',
    background: 'var(--color-gray-700)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: 'var(--space-sm)',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-gold), var(--color-positive))',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  progressStats: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-xs)',
  },
  progressPercent: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: 'var(--color-gold)',
    lineHeight: 'var(--leading-none)',
  },
  progressContext: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  progressMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    background: 'var(--color-gray-700)',
    borderRadius: '8px',
    overflow: 'hidden',
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
  statTarget: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  statUnit: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
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
    transition: 'width 0.3s ease',
  },
};

export default YourProgress;

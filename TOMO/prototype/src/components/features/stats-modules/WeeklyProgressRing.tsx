/**
 * Weekly Progress Ring - White Belt Stats Module
 *
 * Apple Watch-style circular progress indicator showing progress
 * toward weekly training goal. Creates "close the ring" motivation.
 *
 * Design: Circular SVG with animated fill
 * Data: sessionsThisWeek, weeklyGoal
 */

import { useMemo } from 'react';

interface WeeklyProgressRingProps {
  /** Number of sessions completed this week */
  sessionsThisWeek: number;
  /** Weekly session goal */
  weeklyGoal: number;
  /** Size of the ring in pixels */
  size?: number;
  /** Whether to show the goal text below */
  showGoalText?: boolean;
}

export function WeeklyProgressRing({
  sessionsThisWeek,
  weeklyGoal,
  size = 200,
  showGoalText = true,
}: WeeklyProgressRingProps) {
  // Calculate progress
  const progress = useMemo(() => {
    const percent = Math.min(100, (sessionsThisWeek / weeklyGoal) * 100);
    const isComplete = sessionsThisWeek >= weeklyGoal;
    return { percent, isComplete };
  }, [sessionsThisWeek, weeklyGoal]);

  // SVG calculations
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.percent / 100) * circumference;

  // Ring color based on completion
  const ringColor = progress.isComplete
    ? 'var(--color-positive)'
    : 'var(--color-gold)';

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <span style={styles.headerLabel}>THIS WEEK</span>
      </div>

      {/* Ring Container */}
      <div style={styles.ringContainer}>
        <div style={{ ...styles.ring, width: size, height: size }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-gray-800)"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
              }}
            />
          </svg>

          {/* Center content */}
          <div style={styles.center}>
            <div
              style={{
                ...styles.value,
                color: progress.isComplete ? 'var(--color-positive)' : 'var(--color-white)',
              }}
            >
              {sessionsThisWeek}
            </div>
            <div style={styles.label}>of {weeklyGoal}</div>
          </div>
        </div>

        {/* Goal text */}
        {showGoalText && (
          <div style={styles.goalText}>
            {progress.isComplete ? (
              <span style={{ color: 'var(--color-positive)' }}>
                Weekly goal complete
              </span>
            ) : (
              <>
                <span style={{ color: 'var(--color-gray-300)' }}>
                  {weeklyGoal - sessionsThisWeek} more
                </span>
                <span style={{ color: 'var(--color-gray-500)' }}>
                  {' '}to hit your goal
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-xl) var(--space-lg)',
    marginBottom: '1px',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--space-lg)',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-widest)',
    color: 'var(--color-gold)',
    textTransform: 'uppercase' as const,
  },
  ringContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  ring: {
    position: 'relative' as const,
  },
  center: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: '48px',
    fontWeight: 800,
    lineHeight: 1,
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--color-gray-400)',
    marginTop: '4px',
  },
  goalText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    textAlign: 'center' as const,
  },
};

export default WeeklyProgressRing;

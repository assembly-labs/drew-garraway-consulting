/**
 * Journey Timeline - White Belt Stats Module
 *
 * Shows milestones achieved and progress through the "dropout cliff."
 * Celebrates consistency and positions user against industry dropout rates.
 *
 * Design: Full-bleed dark section with timeline visualization
 * Data: session_count, training_start_date (both reliably collected)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  JOURNEY_MILESTONES,
  getMilestoneStatus,
  getDropoutCliffMessage,
  MODULE_COPY,
  type JourneyMilestone,
} from '../../../data/stats-modules';

interface JourneyTimelineProps {
  sessionCount: number;
  trainingStartDate: string | null;
  variant?: 'full' | 'compact';
}

export function JourneyTimeline({
  sessionCount,
  trainingStartDate,
  variant = 'full',
}: JourneyTimelineProps) {
  // Calculate days active
  const daysActive = useMemo(() => {
    if (!trainingStartDate) return 0;
    const start = new Date(trainingStartDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [trainingStartDate]);

  // Get milestone status
  const { achieved, next } = useMemo(
    () => getMilestoneStatus(sessionCount, daysActive),
    [sessionCount, daysActive]
  );

  // Get dropout cliff message
  const cliffMessage = useMemo(
    () => getDropoutCliffMessage(daysActive),
    [daysActive]
  );

  // Get module copy
  const copy = MODULE_COPY.find((c) => c.moduleId === 'journey-timeline');

  // Get progress percentage to next milestone
  const progressToNext = useMemo(() => {
    if (!next) return 100;
    const lastAchieved = achieved[achieved.length - 1];
    const startValue = lastAchieved?.threshold || 0;
    const currentValue = next.type === 'sessions' ? sessionCount : daysActive;
    const range = next.threshold - startValue;
    const progress = currentValue - startValue;
    return Math.min(100, Math.round((progress / range) * 100));
  }, [achieved, next, sessionCount, daysActive]);

  // Filter to show only session-based milestones for visual clarity
  const sessionMilestones = JOURNEY_MILESTONES.filter(
    (m) => m.type === 'sessions'
  ).slice(0, 6); // Show first 6 session milestones

  if (variant === 'compact') {
    return (
      <CompactJourneyTimeline
        sessionCount={sessionCount}
        daysActive={daysActive}
        achieved={achieved}
        next={next}
        progressToNext={progressToNext}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Icons.Flag size={20} color="var(--color-gold)" />
        </div>
        <span style={styles.headerLabel}>YOUR JOURNEY</span>
      </div>

      {/* Main Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBlock}>
          <span style={styles.statValue}>{sessionCount}</span>
          <span style={styles.statLabel}>sessions</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statBlock}>
          <span style={styles.statValue}>{daysActive}</span>
          <span style={styles.statLabel}>days in</span>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div style={styles.timeline}>
        <div style={styles.timelineTrack}>
          {sessionMilestones.map((milestone) => {
            const isAchieved = achieved.some((a) => a.id === milestone.id);
            const isCurrent = next?.id === milestone.id;

            return (
              <div
                key={milestone.id}
                style={{
                  ...styles.milestoneMarker,
                  ...(isAchieved ? styles.milestoneAchieved : {}),
                  ...(isCurrent ? styles.milestoneCurrent : {}),
                }}
              >
                <div
                  style={{
                    ...styles.markerDot,
                    ...(isAchieved ? styles.markerDotAchieved : {}),
                    ...(isCurrent ? styles.markerDotCurrent : {}),
                  }}
                >
                  {isAchieved && (
                    <Icons.Check size={12} color="var(--color-black)" />
                  )}
                </div>
                <span
                  style={{
                    ...styles.markerLabel,
                    ...(isAchieved ? styles.markerLabelAchieved : {}),
                    ...(isCurrent ? styles.markerLabelCurrent : {}),
                  }}
                >
                  {milestone.threshold}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${Math.min(100, (sessionCount / 100) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Current Milestone Message */}
      {next && (
        <div style={styles.nextMilestone}>
          <div style={styles.nextMilestoneHeader}>
            <Icons.Target size={16} color="var(--color-gray-400)" />
            <span style={styles.nextMilestoneLabel}>NEXT MILESTONE</span>
          </div>
          <span style={styles.nextMilestoneTitle}>{next.title}</span>
          <span style={styles.nextMilestoneProgress}>
            {next.threshold - (next.type === 'sessions' ? sessionCount : daysActive)}{' '}
            {next.type === 'sessions' ? 'sessions' : 'days'} to go
          </span>
        </div>
      )}

      {/* Dropout Cliff Callout */}
      <div
        style={{
          ...styles.cliffCallout,
          ...(cliffMessage.severity === 'danger' ? styles.cliffDanger : {}),
          ...(cliffMessage.severity === 'warning' ? styles.cliffWarning : {}),
          ...(cliffMessage.severity === 'safe' ? styles.cliffSafe : {}),
        }}
      >
        <div style={styles.cliffHeader}>
          {cliffMessage.severity === 'danger' && (
            <Icons.AlertCircle size={16} color="var(--color-negative)" />
          )}
          {cliffMessage.severity === 'warning' && (
            <Icons.AlertCircle size={16} color="var(--color-warning)" />
          )}
          {cliffMessage.severity === 'safe' && (
            <Icons.CheckCircle size={16} color="var(--color-positive)" />
          )}
          <span
            style={{
              ...styles.cliffLabel,
              ...(cliffMessage.severity === 'danger'
                ? { color: 'var(--color-negative)' }
                : {}),
              ...(cliffMessage.severity === 'warning'
                ? { color: 'var(--color-warning)' }
                : {}),
              ...(cliffMessage.severity === 'safe'
                ? { color: 'var(--color-positive)' }
                : {}),
            }}
          >
            {cliffMessage.severity === 'danger'
              ? 'DROPOUT DANGER ZONE'
              : cliffMessage.severity === 'warning'
              ? 'CRITICAL PERIOD'
              : 'PAST THE CLIFF'}
          </span>
        </div>
        <p style={styles.cliffMessage}>{cliffMessage.message}</p>
      </div>

      {/* Insight */}
      <p style={styles.insight}>
        {copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
          'Every session counts.'}
      </p>
    </section>
  );
}

// Compact variant for smaller displays
function CompactJourneyTimeline({
  sessionCount,
  next,
  progressToNext,
}: {
  sessionCount: number;
  daysActive: number;
  achieved: JourneyMilestone[];
  next: JourneyMilestone | null;
  progressToNext: number;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Flag size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>JOURNEY</span>
      </div>
      <div style={styles.compactStats}>
        <span style={styles.compactValue}>{sessionCount}</span>
        <span style={styles.compactUnit}>sessions</span>
      </div>
      {next && (
        <div style={styles.compactProgress}>
          <div style={styles.compactProgressBar}>
            <div
              style={{
                ...styles.compactProgressFill,
                width: `${progressToNext}%`,
              }}
            />
          </div>
          <span style={styles.compactNext}>
            {next.threshold - sessionCount} to {next.title}
          </span>
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
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xl)',
    marginBottom: 'var(--space-xl)',
  },
  statBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-4xl)',
    fontWeight: 700,
    color: 'var(--color-white)',
    lineHeight: 'var(--leading-none)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
    marginTop: 'var(--space-xs)',
  },
  statDivider: {
    width: '1px',
    height: '48px',
    background: 'var(--color-gray-700)',
  },
  timeline: {
    marginBottom: 'var(--space-lg)',
  },
  timelineTrack: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-sm)',
  },
  milestoneMarker: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  milestoneAchieved: {},
  milestoneCurrent: {},
  markerDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--color-gray-700)',
    border: '2px solid var(--color-gray-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDotAchieved: {
    background: 'var(--color-positive)',
    border: '2px solid var(--color-positive)',
  },
  markerDotCurrent: {
    background: 'var(--color-gold-dim)',
    border: '2px solid var(--color-gold)',
  },
  markerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-600)',
  },
  markerLabelAchieved: {
    color: 'var(--color-positive)',
  },
  markerLabelCurrent: {
    color: 'var(--color-gold)',
  },
  progressContainer: {
    height: '4px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-positive), var(--color-gold))',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  nextMilestone: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-md)',
    borderLeft: '3px solid var(--color-gold)',
  },
  nextMilestoneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    marginBottom: 'var(--space-xs)',
  },
  nextMilestoneLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
  },
  nextMilestoneTitle: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-white)',
    marginBottom: 'var(--space-xs)',
  },
  nextMilestoneProgress: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gold)',
  },
  cliffCallout: {
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-md)',
    borderLeft: '3px solid var(--color-gray-600)',
    background: 'var(--color-gray-900)',
  },
  cliffDanger: {
    borderLeftColor: 'var(--color-negative)',
    background: 'var(--color-negative-dim)',
  },
  cliffWarning: {
    borderLeftColor: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.1)',
  },
  cliffSafe: {
    borderLeftColor: 'var(--color-positive)',
    background: 'var(--color-positive-dim)',
  },
  cliffHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-xs)',
  },
  cliffLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-400)',
  },
  cliffMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    lineHeight: 'var(--leading-normal)',
    margin: 0,
  },
  insight: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-500)',
    textAlign: 'center' as const,
    margin: 0,
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
  compactStats: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-xs)',
    marginBottom: 'var(--space-sm)',
  },
  compactValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xl)',
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
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)',
  },
  compactProgressBar: {
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
  compactNext: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
};

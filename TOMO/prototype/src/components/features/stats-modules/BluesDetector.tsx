/**
 * Blues Detector - Blue Belt Stats Module
 *
 * Detects dropout risk signals and shows appropriate interventions.
 * Analyzes attendance patterns and recent journal sentiment.
 *
 * Design: Intervention cards with dismissable actions
 * Data: sessionHistory, recentNotes[], promotion date (if available)
 */

import { useMemo, useState } from 'react';
import { Icons } from '../../ui/Icons';
import {
  checkSentiment,
  BLUES_INTERVENTIONS,
  MODULE_COPY,
  type BluesInterventionTemplate,
} from '../../../data/stats-modules';

interface BluesDetectorProps {
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  daysSinceLastSession: number;
  daysSincePromotion?: number; // Days since getting blue belt
  recentNotes?: string[]; // Last few session notes for sentiment
  variant?: 'full' | 'compact';
  onDismiss?: (interventionId: string) => void;
}

export function BluesDetector({
  sessionsThisMonth,
  sessionsLastMonth,
  daysSinceLastSession,
  daysSincePromotion,
  recentNotes = [],
  variant = 'full',
  onDismiss,
}: BluesDetectorProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Detect applicable interventions
  const activeInterventions = useMemo(() => {
    const interventions: BluesInterventionTemplate[] = [];

    // 1. Attendance drop (30%+ decrease from last month)
    if (
      sessionsLastMonth > 0 &&
      sessionsThisMonth < sessionsLastMonth * 0.7
    ) {
      const intervention = BLUES_INTERVENTIONS.find(
        (i) => i.trigger === 'attendance_drop'
      );
      if (intervention) interventions.push(intervention);
    }

    // 2. Extended gap (10+ days since last session)
    if (daysSinceLastSession >= 10) {
      const intervention = BLUES_INTERVENTIONS.find(
        (i) => i.trigger === 'extended_gap'
      );
      if (intervention) interventions.push(intervention);
    }

    // 3. Post-promotion blues (first year at blue belt)
    if (daysSincePromotion && daysSincePromotion <= 365 && daysSincePromotion >= 30) {
      const intervention = BLUES_INTERVENTIONS.find(
        (i) => i.trigger === 'post_promotion'
      );
      if (intervention) interventions.push(intervention);
    }

    // 4. Negative sentiment in recent notes
    if (recentNotes.length > 0) {
      const allNotes = recentNotes.join(' ');
      const sentiment = checkSentiment(allNotes);

      if (sentiment.hasNegativeSignals) {
        // Check for imposter syndrome specifically
        const hasImposterSignals =
          allNotes.toLowerCase().includes('imposter') ||
          allNotes.toLowerCase().includes('impostor') ||
          allNotes.toLowerCase().includes("don't belong") ||
          allNotes.toLowerCase().includes('dont belong') ||
          allNotes.toLowerCase().includes('fake');

        if (hasImposterSignals) {
          const intervention = BLUES_INTERVENTIONS.find(
            (i) => i.trigger === 'imposter_syndrome'
          );
          if (intervention) interventions.push(intervention);
        } else {
          const intervention = BLUES_INTERVENTIONS.find(
            (i) => i.trigger === 'negative_sentiment'
          );
          if (intervention) interventions.push(intervention);
        }
      }
    }

    // Filter out dismissed interventions
    return interventions.filter((i) => !dismissedIds.has(i.id));
  }, [
    sessionsThisMonth,
    sessionsLastMonth,
    daysSinceLastSession,
    daysSincePromotion,
    recentNotes,
    dismissedIds,
  ]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    onDismiss?.(id);
  };

  const copy = MODULE_COPY.find((c) => c.moduleId === 'blues-detector');

  // No active interventions - show positive reinforcement
  if (activeInterventions.length === 0) {
    if (variant === 'compact') {
      return (
        <div style={styles.compactContainerPositive}>
          <Icons.CheckCircle size={16} color="var(--color-positive)" />
          <span style={styles.compactPositiveText}>Training on track</span>
        </div>
      );
    }

    return (
      <section style={styles.containerPositive}>
        <div style={styles.positiveContent}>
          <Icons.CheckCircle size={24} color="var(--color-positive)" />
          <div style={styles.positiveTextContainer}>
            <span style={styles.positiveTitle}>No blues detected</span>
            <p style={styles.positiveMessage}>
              {copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
                "You're showing up. That's what matters."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactBluesDetector
        intervention={activeInterventions[0]}
        onDismiss={() => handleDismiss(activeInterventions[0].id)}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.AlertCircle size={20} color="var(--color-warning)" />
          </div>
          <span style={styles.headerLabel}>THE BLUES CHECK</span>
        </div>
      </div>

      {/* Interventions */}
      <div style={styles.interventionsSection}>
        {activeInterventions.map((intervention) => (
          <div key={intervention.id} style={styles.interventionCard}>
            <div style={styles.interventionContent}>
              <h3 style={styles.interventionTitle}>{intervention.title}</h3>
              <p style={styles.interventionMessage}>{intervention.message}</p>
            </div>

            <div style={styles.interventionActions}>
              <button
                style={styles.primaryAction}
                onClick={() => handleDismiss(intervention.id)}
              >
                {intervention.primaryAction}
              </button>
              {intervention.secondaryAction && (
                <button
                  style={styles.secondaryAction}
                  onClick={() => {
                    // For now, just log - in real app would navigate
                    console.log('Secondary action:', intervention.secondaryAction);
                  }}
                >
                  {intervention.secondaryAction}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Context */}
      <div style={styles.statsContext}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>This month</span>
          <span
            style={{
              ...styles.statValue,
              color:
                sessionsThisMonth < sessionsLastMonth * 0.7
                  ? 'var(--color-warning)'
                  : 'var(--color-gray-300)',
            }}
          >
            {sessionsThisMonth} sessions
          </span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Last session</span>
          <span
            style={{
              ...styles.statValue,
              color:
                daysSinceLastSession >= 10
                  ? 'var(--color-warning)'
                  : 'var(--color-gray-300)',
            }}
          >
            {daysSinceLastSession === 0
              ? 'Today'
              : daysSinceLastSession === 1
              ? 'Yesterday'
              : `${daysSinceLastSession} days ago`}
          </span>
        </div>
      </div>

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          50% of blue belts quit in their first year. The plateau is normal. It passes.
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactBluesDetector({
  intervention,
  onDismiss,
}: {
  intervention: BluesInterventionTemplate;
  onDismiss: () => void;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.AlertCircle size={16} color="var(--color-warning)" />
        <span style={styles.compactLabel}>BLUES CHECK</span>
      </div>
      <div style={styles.compactContent}>
        <p style={styles.compactTitle}>{intervention.title}</p>
        <button style={styles.compactDismiss} onClick={onDismiss}>
          {intervention.primaryAction}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  containerPositive: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-lg)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
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
  positiveContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--color-positive-dim)',
    borderLeft: '3px solid var(--color-positive)',
  },
  positiveTextContainer: {
    flex: 1,
  },
  positiveTitle: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-positive)',
    marginBottom: 'var(--space-xs)',
  },
  positiveMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    margin: 0,
    lineHeight: 'var(--leading-normal)',
  },
  interventionsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-lg)',
  },
  interventionCard: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
    borderLeft: '3px solid var(--color-warning)',
  },
  interventionContent: {
    marginBottom: 'var(--space-lg)',
  },
  interventionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-white)',
    margin: 0,
    marginBottom: 'var(--space-sm)',
  },
  interventionMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    margin: 0,
    lineHeight: 'var(--leading-normal)',
  },
  interventionActions: {
    display: 'flex',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap' as const,
  },
  primaryAction: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-black)',
    background: 'var(--color-gold)',
    border: 'none',
    padding: 'var(--space-sm) var(--space-md)',
    cursor: 'pointer',
    minHeight: '44px',
  },
  secondaryAction: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
    background: 'transparent',
    border: '1px solid var(--color-gray-600)',
    padding: 'var(--space-sm) var(--space-md)',
    cursor: 'pointer',
    minHeight: '44px',
  },
  statsContext: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
    marginBottom: 'var(--space-lg)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    flex: 1,
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gray-300)',
  },
  statDivider: {
    width: '1px',
    height: '32px',
    background: 'var(--color-gray-700)',
  },
  insightBox: {
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
    borderLeft: '3px solid var(--color-gray-600)',
  },
  insight: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-400)',
    margin: 0,
    lineHeight: 'var(--leading-normal)',
  },
  // Compact styles
  compactContainer: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-md)',
    borderLeft: '3px solid var(--color-warning)',
  },
  compactContainerPositive: {
    background: 'var(--color-gray-800)',
    padding: 'var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
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
    color: 'var(--color-warning)',
  },
  compactContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  compactTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-gray-300)',
    margin: 0,
  },
  compactDismiss: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gold)',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  compactPositiveText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-positive)',
  },
};

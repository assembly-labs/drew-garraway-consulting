/**
 * Defense Focus - Toggleable Offense/Defense Stats Module
 *
 * Shows techniques ranked by frequency with proportional bars.
 * Toggle between "Your Weapons" (offense) and "Watch Out For" (defense).
 *
 * Design: Concept 4 - Compact Cards with Visual Ranking
 * - Proportional horizontal bars
 * - Summary insight at bottom
 * - Green for offense, gold/amber for defense
 */

import { useState, useMemo } from 'react';
import { Icons } from '../../ui/Icons';

interface TechniqueCount {
  technique: string;
  count: number;
}

type ViewMode = 'offense' | 'defense';

interface DefenseFocusProps {
  /** Submissions given by the user (offense) */
  submissionsGiven?: TechniqueCount[];
  /** Submissions received by the user (defense) */
  submissionsReceived: TechniqueCount[];
  /** Default view mode */
  defaultView?: ViewMode;
  /** Hide offense toggle (for white belts) */
  hideOffense?: boolean;
}

export function DefenseFocus({
  submissionsGiven = [],
  submissionsReceived,
  defaultView = 'defense',
  hideOffense = false,
}: DefenseFocusProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  // Process offense data
  const offenseData = useMemo(() => {
    const sorted = [...submissionsGiven].sort((a, b) => b.count - a.count).slice(0, 5);
    const total = sorted.reduce((sum, t) => sum + t.count, 0);
    const maxCount = sorted[0]?.count || 1;
    return { items: sorted, total, maxCount };
  }, [submissionsGiven]);

  // Process defense data
  const defenseData = useMemo(() => {
    const sorted = [...submissionsReceived].sort((a, b) => b.count - a.count).slice(0, 5);
    const total = sorted.reduce((sum, t) => sum + t.count, 0);
    const maxCount = sorted[0]?.count || 1;
    return { items: sorted, total, maxCount };
  }, [submissionsReceived]);

  // Current view data
  const currentData = viewMode === 'offense' ? offenseData : defenseData;
  const isOffense = viewMode === 'offense';

  // Colors based on mode
  const accentColor = isOffense ? 'var(--color-positive)' : 'var(--color-gold)';
  const barGradient = isOffense
    ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)'
    : 'linear-gradient(90deg, rgba(245, 166, 35, 0.2) 0%, rgba(245, 166, 35, 0.05) 100%)';

  // Calculate top 3 percentage for insight
  const top3Total = currentData.items.slice(0, 3).reduce((sum, t) => sum + t.count, 0);
  const top3Percentage = currentData.total > 0 ? Math.round((top3Total / currentData.total) * 100) : 0;

  if (currentData.items.length === 0) {
    return null;
  }

  return (
    <section style={styles.container}>
      {/* Toggle Header */}
      <div style={styles.toggleContainer}>
        {!hideOffense && (
          <button
            onClick={() => setViewMode('offense')}
            style={{
              ...styles.toggleButton,
              borderColor: isOffense ? 'var(--color-positive)' : 'var(--color-gray-700)',
              color: isOffense ? 'var(--color-positive)' : 'var(--color-gray-500)',
            }}
          >
            <Icons.Star size={14} />
            <span>Your Weapons</span>
          </button>
        )}
        <button
          onClick={() => setViewMode('defense')}
          style={{
            ...styles.toggleButton,
            borderColor: viewMode === 'defense' ? 'var(--color-gold)' : 'var(--color-gray-700)',
            color: viewMode === 'defense' ? 'var(--color-gold)' : 'var(--color-gray-500)',
            ...(hideOffense ? { flex: 1 } : {}),
          }}
        >
          <Icons.Shield size={14} />
          <span>Watch Out For</span>
        </button>
      </div>

      {/* Technique List */}
      <div style={styles.list}>
        {currentData.items.map((tech, index) => {
          const barWidth = (tech.count / currentData.maxCount) * 100;

          return (
            <div key={tech.technique} style={styles.row}>
              {/* Progress bar background */}
              <div
                style={{
                  ...styles.progressBar,
                  width: `${barWidth}%`,
                  background: barGradient,
                }}
              />

              {/* Content */}
              <div style={styles.rowContent}>
                <div style={styles.rowLeft}>
                  <span style={styles.rankCircle}>
                    {index + 1}
                  </span>
                  <span style={styles.technique}>{tech.technique}</span>
                </div>
                <span style={{ ...styles.count, color: accentColor }}>
                  {tech.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Insight */}
      <div style={{ ...styles.insight, borderLeftColor: accentColor }}>
        <span style={{ ...styles.insightHighlight, color: accentColor }}>
          {isOffense ? 'Your top 3' : 'Top 3 threats'}
        </span>
        <span style={styles.insightText}>
          {' = '}{top3Percentage}% of {isOffense ? 'submissions' : 'times caught'}
        </span>
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
  toggleContainer: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
  },
  toggleButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
    padding: '12px 16px',
    background: 'var(--color-gray-900)',
    border: '2px solid var(--color-gray-700)',
    borderRadius: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  row: {
    position: 'relative' as const,
    padding: '14px 16px',
    background: 'var(--color-gray-900)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
    transition: 'width 0.5s ease-out',
  },
  rowContent: {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rankCircle: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--color-gray-800)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-gray-400)',
  },
  technique: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-white)',
  },
  count: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
  },
  insight: {
    marginTop: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
    borderRadius: '8px',
    borderLeft: '3px solid',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '4px',
  },
  insightHighlight: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
  },
  insightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
};

export default DefenseFocus;

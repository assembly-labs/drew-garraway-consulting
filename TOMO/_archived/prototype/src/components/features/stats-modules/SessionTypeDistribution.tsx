/**
 * Session Type Distribution - Blue/Purple Belt Stats Module
 *
 * Donut chart showing training balance across session types.
 * Reveals if training is imbalanced (gi-only, drilling-only, etc.)
 *
 * Design: SVG donut chart with legend
 * Data: Session type counts (gi, no-gi, open mat, competition prep)
 */

import { useMemo } from 'react';

interface SessionTypeCount {
  type: 'gi' | 'nogi' | 'openmat' | 'drilling' | 'competition';
  count: number;
  label: string;
  color: string;
}

interface SessionTypeDistributionProps {
  /** Session counts by type */
  sessionTypes: SessionTypeCount[];
  /** Total sessions to display in center */
  totalSessions?: number;
}

// Default colors for session types
const TYPE_COLORS: Record<string, string> = {
  gi: '#3B82F6',        // Blue
  nogi: '#F97316',      // Orange
  openmat: '#A855F7',   // Purple
  drilling: '#22C55E',  // Green
  competition: '#EF4444', // Red
};

export function SessionTypeDistribution({
  sessionTypes,
  totalSessions,
}: SessionTypeDistributionProps) {
  // Calculate total and percentages
  const { total, segments } = useMemo(() => {
    const sum = totalSessions || sessionTypes.reduce((acc, t) => acc + t.count, 0);

    // Calculate stroke-dasharray values for each segment
    const circumference = 2 * Math.PI * 70; // radius = 70
    let offset = 0;

    const segs = sessionTypes
      .filter((t) => t.count > 0)
      .map((t) => {
        const percent = (t.count / sum) * 100;
        const dashLength = (percent / 100) * circumference;
        const seg = {
          ...t,
          percent,
          dashArray: `${dashLength} ${circumference - dashLength}`,
          dashOffset: -offset,
          color: t.color || TYPE_COLORS[t.type] || '#888',
        };
        offset += dashLength;
        return seg;
      });

    return { total: sum, segments: segs };
  }, [sessionTypes, totalSessions]);

  if (segments.length === 0) {
    return null;
  }

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerLabel}>TRAINING MIX</span>
      </div>

      {/* Chart + Legend */}
      <div style={styles.content}>
        {/* Donut Chart */}
        <div style={styles.chartContainer}>
          <svg viewBox="0 0 200 200" style={styles.chart}>
            {segments.map((seg) => (
              <circle
                key={seg.type}
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke={seg.color}
                strokeWidth="24"
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  transition: 'stroke-dashoffset 0.5s ease',
                }}
              />
            ))}
          </svg>

          {/* Center text */}
          <div style={styles.center}>
            <div style={styles.centerValue}>{total}</div>
            <div style={styles.centerLabel}>Sessions</div>
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          {segments.map((seg) => (
            <div key={seg.type} style={styles.legendItem}>
              <div
                style={{
                  ...styles.legendColor,
                  background: seg.color,
                }}
              />
              <span style={styles.legendLabel}>{seg.label}</span>
              <span style={styles.legendValue}>
                {seg.count} ({Math.round(seg.percent)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      {segments.length >= 2 && (
        <div style={styles.insight}>
          <span style={styles.insightText}>
            {getBalanceInsight(segments)}
          </span>
        </div>
      )}
    </section>
  );
}

// Generate insight based on distribution
function getBalanceInsight(
  segments: Array<{ type: string; percent: number; label: string }>
): string {
  const sorted = [...segments].sort((a, b) => b.percent - a.percent);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];

  if (top.percent > 70) {
    return `Heavy focus on ${top.label}. Consider adding variety.`;
  }

  if (top.percent - bottom.percent < 20) {
    return 'Well-balanced training across session types.';
  }

  return `${top.label} is your primary focus (${Math.round(top.percent)}%).`;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
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
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xl)',
  },
  chartContainer: {
    position: 'relative' as const,
    width: '160px',
    height: '160px',
    flexShrink: 0,
  },
  chart: {
    width: '100%',
    height: '100%',
  },
  center: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  centerValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--color-white)',
    lineHeight: 1,
  },
  centerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginTop: '4px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
    flex: 1,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  legendColor: {
    width: '14px',
    height: '14px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  legendLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    flex: 1,
  },
  legendValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
  },
  insight: {
    marginTop: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-800)',
    borderLeft: '3px solid var(--color-gold)',
  },
  insightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
  },
};

export default SessionTypeDistribution;

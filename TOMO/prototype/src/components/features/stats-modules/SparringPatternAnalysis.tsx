/**
 * Sparring Pattern Analysis - Blue/Purple Belt Stats Module
 *
 * Horizontal bar charts showing submission exchange rates.
 * Shows what's working in live rolling vs. just drilling.
 * Self-comparison focus avoids toxic leaderboard psychology.
 *
 * Design: Stacked horizontal bars (landed vs received)
 * Data: Submission counts by technique
 */

interface SubmissionExchange {
  technique: string;
  landed: number;
  received: number;
}

interface SparringPatternAnalysisProps {
  /** Submission exchanges by technique */
  exchanges: SubmissionExchange[];
  /** Time period label */
  periodLabel?: string;
  /** Max items to show */
  maxItems?: number;
}

export function SparringPatternAnalysis({
  exchanges,
  periodLabel = 'Last 30 Rolls',
  maxItems = 5,
}: SparringPatternAnalysisProps) {
  // Sort by total activity and take top N
  const sortedExchanges = [...exchanges]
    .sort((a, b) => (b.landed + b.received) - (a.landed + a.received))
    .slice(0, maxItems);

  // Find max for scaling bars
  const maxTotal = Math.max(
    ...sortedExchanges.map((e) => e.landed + e.received),
    1
  );

  // Calculate totals
  const totalLanded = exchanges.reduce((sum, e) => sum + e.landed, 0);
  const totalReceived = exchanges.reduce((sum, e) => sum + e.received, 0);
  const winRate = totalLanded + totalReceived > 0
    ? Math.round((totalLanded / (totalLanded + totalReceived)) * 100)
    : 0;

  if (sortedExchanges.length === 0) {
    return null;
  }

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerLabel}>SUBMISSION EXCHANGE</span>
          <span style={styles.headerPeriod}>{periodLabel}</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.winRate}>{winRate}%</span>
          <span style={styles.winRateLabel}>Win Rate</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={styles.barList}>
        {sortedExchanges.map((exchange) => {
          const total = exchange.landed + exchange.received;
          const landedPercent = total > 0 ? (exchange.landed / total) * 100 : 50;
          const barWidth = (total / maxTotal) * 100;

          return (
            <div key={exchange.technique} style={styles.barRow}>
              <div style={styles.barLabel}>{exchange.technique}</div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barContainer,
                    width: `${barWidth}%`,
                  }}
                >
                  {exchange.landed > 0 && (
                    <div
                      style={{
                        ...styles.barPositive,
                        width: `${landedPercent}%`,
                      }}
                    >
                      {exchange.landed > 0 && (
                        <span style={styles.barValue}>{exchange.landed}</span>
                      )}
                    </div>
                  )}
                  {exchange.received > 0 && (
                    <div
                      style={{
                        ...styles.barNegative,
                        width: `${100 - landedPercent}%`,
                      }}
                    >
                      {exchange.received > 0 && (
                        <span style={styles.barValueNeg}>{exchange.received}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: 'var(--color-positive)' }} />
          <span style={styles.legendText}>Landed ({totalLanded})</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: 'var(--color-negative)' }} />
          <span style={styles.legendText}>Received ({totalReceived})</span>
        </div>
      </div>

      {/* Insight */}
      <div style={styles.insight}>
        {getPatternInsight(sortedExchanges, totalLanded, totalReceived)}
      </div>
    </section>
  );
}

// Generate insight based on patterns
function getPatternInsight(
  exchanges: SubmissionExchange[],
  totalLanded: number,
  totalReceived: number
): React.ReactNode {
  // Find best and worst techniques
  const sorted = [...exchanges].sort(
    (a, b) => (b.landed - b.received) - (a.landed - a.received)
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  if (totalLanded > totalReceived * 1.5) {
    return (
      <span style={styles.insightText}>
        <span style={{ color: 'var(--color-positive)' }}>Strong offense.</span>
        {' '}{best?.technique} is your most effective weapon.
      </span>
    );
  }

  if (totalReceived > totalLanded * 1.5) {
    return (
      <span style={styles.insightText}>
        <span style={{ color: 'var(--color-negative)' }}>Defense needs work.</span>
        {' '}Focus on {worst?.technique} defense.
      </span>
    );
  }

  return (
    <span style={styles.insightText}>
      Balanced exchange. {best?.technique} is your strength, watch for {worst?.technique}.
    </span>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--space-lg)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-widest)',
    color: 'var(--color-gold)',
    textTransform: 'uppercase' as const,
  },
  headerPeriod: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  headerRight: {
    textAlign: 'right' as const,
  },
  winRate: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--color-white)',
    lineHeight: 1,
    display: 'block',
  },
  winRateLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  barList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-md)',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  barLabel: {
    width: '90px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: '28px',
    background: 'var(--color-gray-800)',
    position: 'relative' as const,
  },
  barContainer: {
    display: 'flex',
    height: '100%',
    transition: 'width 0.5s ease',
  },
  barPositive: {
    background: 'var(--color-positive)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '6px',
    minWidth: '24px',
  },
  barNegative: {
    background: 'var(--color-negative)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '6px',
    minWidth: '24px',
  },
  barValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-black)',
  },
  barValueNeg: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-xl)',
    marginTop: 'var(--space-lg)',
    paddingTop: 'var(--space-md)',
    borderTop: '1px solid var(--color-gray-800)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  legendText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  insight: {
    marginTop: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-800)',
    borderLeft: '3px solid var(--color-gray-600)',
  },
  insightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
  },
};

export default SparringPatternAnalysis;

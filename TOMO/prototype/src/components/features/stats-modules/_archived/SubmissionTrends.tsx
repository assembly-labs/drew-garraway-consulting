/**
 * Submission Trends - Purple Belt Stats Module
 *
 * Shows submission trends over time - finishing evolution.
 * Compares year-over-year submission data to show improvement.
 *
 * Design: Year comparison with trend analysis
 * Data: yearlySessionCounts[], submissionsGiven[], submissionsReceived[]
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  getTopTechniques,
  MODULE_COPY,
  type YearlyCount,
  type SubmissionRecord,
} from '../../../data/stats-modules';

interface SubmissionTrendsProps {
  yearlyData: YearlyCount[];
  submissionsGiven: SubmissionRecord[];
  submissionsReceived: SubmissionRecord[]; // Used for future vulnerability trend analysis
  variant?: 'full' | 'compact';
}

export function SubmissionTrends({
  yearlyData,
  submissionsGiven,
  submissionsReceived: _submissionsReceived, // Preserved for future trend analysis
  variant = 'full',
}: SubmissionTrendsProps) {
  // Get current and previous year data
  const currentYear = new Date().getFullYear();
  const thisYearData = yearlyData.find((y) => y.year === currentYear);
  const lastYearData = yearlyData.find((y) => y.year === currentYear - 1);

  // Calculate trends
  const trends = useMemo(() => {
    if (!thisYearData || !lastYearData) {
      return null;
    }

    const givenChange = thisYearData.submissionsGiven - lastYearData.submissionsGiven;
    const receivedChange = thisYearData.submissionsReceived - lastYearData.submissionsReceived;

    const givenPercent = lastYearData.submissionsGiven > 0
      ? Math.round((givenChange / lastYearData.submissionsGiven) * 100)
      : 0;
    const receivedPercent = lastYearData.submissionsReceived > 0
      ? Math.round((receivedChange / lastYearData.submissionsReceived) * 100)
      : 0;

    return {
      givenChange,
      receivedChange,
      givenPercent,
      receivedPercent,
      givenTrend: givenChange > 0 ? 'up' : givenChange < 0 ? 'down' : 'flat',
      receivedTrend: receivedChange < 0 ? 'improved' : receivedChange > 0 ? 'worse' : 'flat',
    };
  }, [thisYearData, lastYearData]);

  // Get top techniques this year vs last year
  const techniqueEvolution = useMemo(() => {
    // Filter submissions by year
    const thisYearGiven = submissionsGiven.filter(
      (s) => new Date(s.date).getFullYear() === currentYear
    );
    const lastYearGiven = submissionsGiven.filter(
      (s) => new Date(s.date).getFullYear() === currentYear - 1
    );

    const thisYearTop = getTopTechniques(thisYearGiven, 3);
    const lastYearTop = getTopTechniques(lastYearGiven, 3);

    // Find most improved
    const techCountsThisYear: Record<string, number> = {};
    const techCountsLastYear: Record<string, number> = {};

    thisYearGiven.forEach((s) => {
      techCountsThisYear[s.technique] = (techCountsThisYear[s.technique] || 0) + 1;
    });
    lastYearGiven.forEach((s) => {
      techCountsLastYear[s.technique] = (techCountsLastYear[s.technique] || 0) + 1;
    });

    // Find technique with biggest improvement
    let mostImproved = { technique: '', change: 0 };
    for (const tech of Object.keys(techCountsThisYear)) {
      const change = (techCountsThisYear[tech] || 0) - (techCountsLastYear[tech] || 0);
      if (change > mostImproved.change) {
        mostImproved = { technique: tech, change };
      }
    }

    // Find new additions (in this year, not last year)
    const newAdditions = Object.keys(techCountsThisYear).filter(
      (tech) => !techCountsLastYear[tech]
    );

    // Find declining (in last year, fewer this year)
    let declining = { technique: '', change: 0 };
    for (const tech of Object.keys(techCountsLastYear)) {
      const thisCount = techCountsThisYear[tech] || 0;
      const lastCount = techCountsLastYear[tech] || 0;
      const change = thisCount - lastCount;
      if (change < declining.change) {
        declining = { technique: tech, change };
      }
    }

    return {
      thisYearTop,
      lastYearTop,
      mostImproved: mostImproved.change > 0 ? mostImproved : null,
      newAdditions: newAdditions.slice(0, 2),
      declining: declining.change < 0 ? declining : null,
    };
  }, [submissionsGiven, currentYear]);

  // Calculate max for bar scaling
  const maxYearValue = useMemo(() => {
    return Math.max(
      ...yearlyData.map((y) => Math.max(y.submissionsGiven, y.submissionsReceived)),
      1
    );
  }, [yearlyData]);

  const copy = MODULE_COPY.find((c) => c.moduleId === 'submission-trends');

  // Empty state
  if (yearlyData.length < 2) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <Icons.TrendUp size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>FINISHING TRENDS</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.TrendUp size={32} color="var(--color-gray-600)" />
          <p style={styles.emptyText}>
            {copy?.emptyState || 'Log more submissions to see your offensive evolution.'}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactSubmissionTrends
        thisYearGiven={thisYearData?.submissionsGiven || 0}
        thisYearReceived={thisYearData?.submissionsReceived || 0}
        trend={trends}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.TrendUp size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>FINISHING TRENDS</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerPeriod}>Last {yearlyData.length} years</span>
        </div>
      </div>

      {/* Year-over-Year Comparison Chart */}
      <div style={styles.chartSection}>
        <span style={styles.sectionTitle}>SUBMISSIONS BY YEAR</span>
        <div style={styles.chartContainer}>
          {yearlyData.slice(-5).map((year) => (
            <div key={year.year} style={styles.chartColumn}>
              <div style={styles.chartBars}>
                {/* Given bar */}
                <div
                  style={{
                    ...styles.chartBarGiven,
                    height: `${(year.submissionsGiven / maxYearValue) * 100}%`,
                  }}
                />
                {/* Received bar */}
                <div
                  style={{
                    ...styles.chartBarReceived,
                    height: `${(year.submissionsReceived / maxYearValue) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.chartYear}>{year.year.toString().slice(2)}</span>
            </div>
          ))}
        </div>
        <div style={styles.chartLegend}>
          <div style={styles.legendItem}>
            <div style={styles.legendDotGiven} />
            <span style={styles.legendLabel}>Given</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDotReceived} />
            <span style={styles.legendLabel}>Received</span>
          </div>
        </div>
      </div>

      {/* Year Comparison */}
      {thisYearData && lastYearData && (
        <div style={styles.comparisonSection}>
          <div style={styles.comparisonRow}>
            <span style={styles.comparisonLabel}>This year</span>
            <div style={styles.comparisonValues}>
              <span style={styles.comparisonGiven}>
                {thisYearData.submissionsGiven} given
              </span>
              <span style={styles.comparisonDivider}>/</span>
              <span style={styles.comparisonReceived}>
                {thisYearData.submissionsReceived} received
              </span>
            </div>
          </div>
          <div style={styles.comparisonRow}>
            <span style={styles.comparisonLabel}>Last year</span>
            <div style={styles.comparisonValues}>
              <span style={styles.comparisonGiven}>
                {lastYearData.submissionsGiven} given
              </span>
              <span style={styles.comparisonDivider}>/</span>
              <span style={styles.comparisonReceived}>
                {lastYearData.submissionsReceived} received
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trend Indicators */}
      {trends && (
        <div style={styles.trendSection}>
          <span style={styles.sectionTitle}>TREND</span>
          <div style={styles.trendGrid}>
            <div style={styles.trendItem}>
              <div style={styles.trendIcon}>
                {trends.givenTrend === 'up' ? (
                  <Icons.TrendUp size={16} color="var(--color-positive)" />
                ) : trends.givenTrend === 'down' ? (
                  <Icons.TrendDown size={16} color="var(--color-negative)" />
                ) : (
                  <Icons.Minus size={16} color="var(--color-gray-500)" />
                )}
              </div>
              <span
                style={{
                  ...styles.trendChange,
                  color:
                    trends.givenTrend === 'up'
                      ? 'var(--color-positive)'
                      : trends.givenTrend === 'down'
                      ? 'var(--color-negative)'
                      : 'var(--color-gray-500)',
                }}
              >
                {trends.givenPercent > 0 ? '+' : ''}{trends.givenPercent}%
              </span>
              <span style={styles.trendLabel}>Offensive</span>
            </div>
            <div style={styles.trendItem}>
              <div style={styles.trendIcon}>
                {trends.receivedTrend === 'improved' ? (
                  <Icons.TrendDown size={16} color="var(--color-positive)" />
                ) : trends.receivedTrend === 'worse' ? (
                  <Icons.TrendUp size={16} color="var(--color-negative)" />
                ) : (
                  <Icons.Minus size={16} color="var(--color-gray-500)" />
                )}
              </div>
              <span
                style={{
                  ...styles.trendChange,
                  color:
                    trends.receivedTrend === 'improved'
                      ? 'var(--color-positive)'
                      : trends.receivedTrend === 'worse'
                      ? 'var(--color-negative)'
                      : 'var(--color-gray-500)',
                }}
              >
                {trends.receivedPercent > 0 ? '+' : ''}{trends.receivedPercent}%
              </span>
              <span style={styles.trendLabel}>Defensive</span>
            </div>
          </div>
        </div>
      )}

      {/* Technique Evolution */}
      {(techniqueEvolution.mostImproved || techniqueEvolution.newAdditions.length > 0) && (
        <div style={styles.evolutionSection}>
          <span style={styles.sectionTitle}>YOUR EVOLUTION</span>
          <div style={styles.evolutionList}>
            {techniqueEvolution.mostImproved && (
              <div style={styles.evolutionItem}>
                <Icons.TrendUp size={14} color="var(--color-positive)" />
                <span style={styles.evolutionText}>
                  Most improved: <strong>{techniqueEvolution.mostImproved.technique}</strong>
                  {' '}(+{techniqueEvolution.mostImproved.change} this year)
                </span>
              </div>
            )}
            {techniqueEvolution.newAdditions.length > 0 && (
              <div style={styles.evolutionItem}>
                <Icons.Plus size={14} color="var(--color-gold)" />
                <span style={styles.evolutionText}>
                  New addition: <strong>{techniqueEvolution.newAdditions.join(', ')}</strong>
                  {' '}(first logged this year)
                </span>
              </div>
            )}
            {techniqueEvolution.declining && (
              <div style={styles.evolutionItem}>
                <Icons.TrendDown size={14} color="var(--color-gray-500)" />
                <span style={styles.evolutionText}>
                  Declining: <strong>{techniqueEvolution.declining.technique}</strong>
                  {' '}({techniqueEvolution.declining.change} from last year)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {trends && trends.givenTrend === 'up' && trends.receivedTrend === 'improved'
            ? 'Your offensive output is up. Defense is tighter.'
            : copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
              'Efficiency over effort. Your finishing rate tells the story.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactSubmissionTrends({
  thisYearGiven,
  thisYearReceived,
  trend,
}: {
  thisYearGiven: number;
  thisYearReceived: number;
  trend: {
    givenPercent: number;
    receivedPercent: number;
  } | null;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.TrendUp size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>TRENDS</span>
      </div>
      <div style={styles.compactContent}>
        <div style={styles.compactStats}>
          <span style={styles.compactGiven}>{thisYearGiven} given</span>
          <span style={styles.compactDivider}>/</span>
          <span style={styles.compactReceived}>{thisYearReceived} received</span>
        </div>
        {trend && (
          <div style={styles.compactTrends}>
            <span
              style={{
                ...styles.compactTrend,
                color: trend.givenPercent >= 0 ? 'var(--color-positive)' : 'var(--color-negative)',
              }}
            >
              {trend.givenPercent > 0 ? '+' : ''}{trend.givenPercent}%
            </span>
          </div>
        )}
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
  headerRight: {},
  headerPeriod: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-xl)',
  },
  emptyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    textAlign: 'center' as const,
    margin: 0,
  },
  chartSection: {
    marginBottom: 'var(--space-lg)',
  },
  sectionTitle: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--space-md)',
  },
  chartContainer: {
    display: 'flex',
    gap: 'var(--space-md)',
    height: '100px',
    marginBottom: 'var(--space-sm)',
  },
  chartColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  },
  chartBars: {
    flex: 1,
    width: '100%',
    display: 'flex',
    gap: '4px',
    alignItems: 'flex-end',
  },
  chartBarGiven: {
    flex: 1,
    background: 'var(--color-positive)',
    borderRadius: '2px',
    transition: 'height 0.5s ease',
  },
  chartBarReceived: {
    flex: 1,
    background: 'var(--color-negative)',
    opacity: 0.7,
    borderRadius: '2px',
    transition: 'height 0.5s ease',
  },
  chartYear: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  chartLegend: {
    display: 'flex',
    gap: 'var(--space-md)',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  legendDotGiven: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: 'var(--color-positive)',
  },
  legendDotReceived: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: 'var(--color-negative)',
    opacity: 0.7,
  },
  legendLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  comparisonSection: {
    marginBottom: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
  },
  comparisonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-sm) 0',
  },
  comparisonLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  comparisonValues: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  comparisonGiven: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-positive)',
  },
  comparisonReceived: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-negative)',
  },
  comparisonDivider: {
    color: 'var(--color-gray-600)',
  },
  trendSection: {
    marginBottom: 'var(--space-lg)',
  },
  trendGrid: {
    display: 'flex',
    gap: 'var(--space-lg)',
  },
  trendItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
  },
  trendIcon: {
    marginBottom: '4px',
  },
  trendChange: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
  },
  trendLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
  },
  evolutionSection: {
    marginBottom: 'var(--space-lg)',
  },
  evolutionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  evolutionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm)',
    background: 'var(--color-gray-900)',
  },
  evolutionText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    lineHeight: 'var(--leading-normal)',
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
  compactContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  compactGiven: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-positive)',
  },
  compactReceived: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-negative)',
  },
  compactDivider: {
    color: 'var(--color-gray-600)',
  },
  compactTrends: {},
  compactTrend: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
  },
};

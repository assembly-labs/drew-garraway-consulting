/**
 * Your Journey - Purple/Brown Belt Stats Module (Consolidated)
 *
 * Merges LongGame + SubmissionTrends into a single focused module.
 * Shows multi-year progression with training volume and submission trends.
 *
 * Design: Years hero + dual bar chart (sessions + submissions) + trends
 * Data: yearlySessionCounts[], submissionsGiven[], trainingStartDate
 *
 * What was MERGED:
 * - LongGame: Years active, sessions by year, mat hours, sparring rounds
 * - SubmissionTrends: Offense/defense trends, technique evolution
 *
 * What was REMOVED (handled elsewhere):
 * - Lifetime submission totals (in AttackProfile footer)
 * - Techniques drilled count (in TechniqueMastery)
 * - Submission ratio (in AttackProfile footer as win rate)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  type YearlyCount,
  type SubmissionRecord,
} from '../../../data/stats-modules';

interface YourJourneyProps {
  yearlyData: YearlyCount[];
  totalSessions: number;
  totalMinutes: number;
  sparringRounds: number;
  trainingStartDate: string;
  submissionsGiven: SubmissionRecord[];
}

export function YourJourney({
  yearlyData,
  totalSessions,
  totalMinutes,
  sparringRounds,
  trainingStartDate,
  submissionsGiven,
}: YourJourneyProps) {
  // Calculate years active
  const yearsActive = useMemo(() => {
    const startYear = new Date(trainingStartDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear + 1;
  }, [trainingStartDate]);

  // Calculate total hours
  const totalHours = Math.round(totalMinutes / 60);

  // Get current and previous year data for trends
  const currentYear = new Date().getFullYear();
  const thisYearData = yearlyData.find((y) => y.year === currentYear);
  const lastYearData = yearlyData.find((y) => y.year === currentYear - 1);

  // Calculate max values for chart scaling
  const chartData = useMemo(() => {
    const recentYears = yearlyData.slice(-6); // Last 6 years max
    const maxSessions = Math.max(...recentYears.map((y) => y.sessions), 1);
    const maxSubs = Math.max(
      ...recentYears.map((y) => Math.max(y.submissionsGiven, y.submissionsReceived)),
      1
    );
    return { recentYears, maxSessions, maxSubs };
  }, [yearlyData]);

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
      // For defense, down is good (fewer taps)
      receivedTrend: receivedChange < 0 ? 'improved' : receivedChange > 0 ? 'worse' : 'flat',
    };
  }, [thisYearData, lastYearData]);

  // Get technique evolution
  const techniqueEvolution = useMemo(() => {
    // Filter submissions by year
    const thisYearGiven = submissionsGiven.filter(
      (s) => new Date(s.date).getFullYear() === currentYear
    );
    const lastYearGiven = submissionsGiven.filter(
      (s) => new Date(s.date).getFullYear() === currentYear - 1
    );

    // Count by technique
    const techCountsThisYear: Record<string, number> = {};
    const techCountsLastYear: Record<string, number> = {};

    thisYearGiven.forEach((s) => {
      techCountsThisYear[s.technique] = (techCountsThisYear[s.technique] || 0) + 1;
    });
    lastYearGiven.forEach((s) => {
      techCountsLastYear[s.technique] = (techCountsLastYear[s.technique] || 0) + 1;
    });

    // Find most improved
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

    return {
      mostImproved: mostImproved.change > 0 ? mostImproved : null,
      newAdditions: newAdditions.slice(0, 2),
    };
  }, [submissionsGiven, currentYear]);

  // Empty state
  if (yearlyData.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <Icons.Clock size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>YOUR JOURNEY</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.Calendar size={32} color="var(--color-gray-600)" />
          <p style={styles.emptyText}>
            Keep training to see your multi-year journey.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.Clock size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>YOUR JOURNEY</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.yearsLabel}>{yearsActive} years</span>
        </div>
      </div>

      {/* Years Hero */}
      <div style={styles.yearsHero}>
        <span style={styles.yearsNumber}>{yearsActive}</span>
        <span style={styles.yearsText}>years on the mat</span>
      </div>

      {/* Training by Year - Dual Bar Chart */}
      <div style={styles.chartSection}>
        <span style={styles.sectionTitle}>TRAINING BY YEAR</span>
        <div style={styles.chartContainer}>
          {chartData.recentYears.map((year) => (
            <div key={year.year} style={styles.chartColumn}>
              <div style={styles.chartBars}>
                {/* Sessions bar (gold) */}
                <div
                  style={{
                    ...styles.chartBarSessions,
                    height: `${(year.sessions / chartData.maxSessions) * 100}%`,
                  }}
                  title={`${year.sessions} sessions`}
                />
                {/* Submissions bar (green, overlaid) */}
                <div
                  style={{
                    ...styles.chartBarSubs,
                    height: `${(year.submissionsGiven / chartData.maxSessions) * 50}%`,
                  }}
                  title={`${year.submissionsGiven} submissions`}
                />
              </div>
              <span style={styles.chartYear}>{year.year.toString().slice(2)}</span>
            </div>
          ))}
        </div>
        <div style={styles.chartLegend}>
          <div style={styles.legendItem}>
            <div style={styles.legendDotSessions} />
            <span style={styles.legendLabel}>Sessions</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDotSubs} />
            <span style={styles.legendLabel}>Submissions</span>
          </div>
        </div>
      </div>

      {/* Trend Indicators */}
      {trends && (
        <div style={styles.trendSection}>
          <span style={styles.sectionTitle}>YEAR-OVER-YEAR</span>
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
          <span style={styles.sectionTitle}>EVOLUTION</span>
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
                  New: <strong>{techniqueEvolution.newAdditions.join(', ')}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lifetime Stats Grid - Simplified */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{totalSessions}</span>
          <span style={styles.statLabel}>Sessions</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{totalHours.toLocaleString()}</span>
          <span style={styles.statLabel}>Mat hours</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{sparringRounds.toLocaleString()}</span>
          <span style={styles.statLabel}>Rounds</span>
        </div>
      </div>

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {yearsActive >= 5
            ? `${yearsActive} years. ${totalSessions} sessions. This is a lifestyle.`
            : `${yearsActive} years in. The depth of your understanding grows with each session.`}
        </p>
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
  yearsLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
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
  yearsHero: {
    textAlign: 'center' as const,
    marginBottom: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    background: 'var(--color-gold-dim)',
    borderLeft: '3px solid var(--color-gold)',
  },
  yearsNumber: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(60px, 15vw, 80px)',
    fontWeight: 800,
    color: 'var(--color-gold)',
    lineHeight: 0.9,
  },
  yearsText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-lg)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
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
    gap: 'var(--space-sm)',
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
    gap: '2px',
    alignItems: 'flex-end',
  },
  chartBarSessions: {
    flex: 1,
    background: 'var(--color-gold)',
    borderRadius: '2px',
    transition: 'height 0.5s ease',
  },
  chartBarSubs: {
    flex: 1,
    background: 'var(--color-positive)',
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
  legendDotSessions: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: 'var(--color-gold)',
  },
  legendDotSubs: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    background: 'var(--color-positive)',
  },
  legendLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
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
    textAlign: 'center' as const,
  },
  statValue: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 800,
    color: 'var(--color-white)',
    marginBottom: '2px',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
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
};

export default YourJourney;

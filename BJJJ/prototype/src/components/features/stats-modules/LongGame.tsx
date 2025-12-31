/**
 * Long Game - Purple Belt Stats Module
 *
 * Multi-year progression visualization for experienced practitioners.
 * Shows sessions by year, lifetime totals, and the journey timeline.
 *
 * Design: Year-over-year chart with lifetime stats
 * Data: yearlySessionCounts[], trainingStartDate, totalMinutes
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import { MODULE_COPY, type YearlyCount } from '../../../data/stats-modules';

interface LongGameProps {
  yearlyData: YearlyCount[];
  totalSessions: number;
  totalMinutes: number;
  sparringRounds: number;
  trainingStartDate: string;
  variant?: 'full' | 'compact';
}

export function LongGame({
  yearlyData,
  totalSessions,
  totalMinutes,
  sparringRounds,
  trainingStartDate,
  variant = 'full',
}: LongGameProps) {
  // Calculate years active
  const yearsActive = useMemo(() => {
    const startYear = new Date(trainingStartDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear + 1;
  }, [trainingStartDate]);

  // Calculate total hours
  const totalHours = Math.round(totalMinutes / 60);

  // Find max session count for scaling bars
  const maxSessions = useMemo(() => {
    return Math.max(...yearlyData.map((y) => y.sessions), 1);
  }, [yearlyData]);

  // Calculate unique techniques drilled (approximation from session count)
  const uniqueTechniques = Math.min(Math.round(totalSessions * 0.5), 250);

  // Calculate lifetime submission totals
  const lifetimeSubs = useMemo(() => {
    return yearlyData.reduce(
      (acc, year) => ({
        given: acc.given + year.submissionsGiven,
        received: acc.received + year.submissionsReceived,
      }),
      { given: 0, received: 0 }
    );
  }, [yearlyData]);

  const copy = MODULE_COPY.find((c) => c.moduleId === 'long-game');

  // Empty state
  if (yearlyData.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <Icons.Clock size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>THE LONG GAME</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.Calendar size={32} color="var(--color-gray-600)" />
          <p style={styles.emptyText}>
            {copy?.emptyState || 'Keep training to see your multi-year journey.'}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactLongGame
        yearsActive={yearsActive}
        totalSessions={totalSessions}
        totalHours={totalHours}
      />
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
          <span style={styles.headerLabel}>THE LONG GAME</span>
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

      {/* Year-over-Year Chart */}
      <div style={styles.chartSection}>
        <span style={styles.sectionTitle}>SESSIONS BY YEAR</span>
        <div style={styles.chartContainer}>
          {yearlyData.map((year) => (
            <div key={year.year} style={styles.chartBar}>
              <div style={styles.barWrapper}>
                <div
                  style={{
                    ...styles.barFill,
                    height: `${(year.sessions / maxSessions) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.barYear}>{year.year.toString().slice(2)}</span>
              <span style={styles.barCount}>{year.sessions}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lifetime Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{totalSessions}</span>
          <span style={styles.statLabel}>Total sessions</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{totalHours}</span>
          <span style={styles.statLabel}>Mat hours</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{sparringRounds.toLocaleString()}</span>
          <span style={styles.statLabel}>Sparring rounds</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{uniqueTechniques}</span>
          <span style={styles.statLabel}>Techniques drilled</span>
        </div>
      </div>

      {/* Lifetime Submission Summary */}
      <div style={styles.subsSummary}>
        <span style={styles.sectionTitle}>LIFETIME SUBMISSIONS</span>
        <div style={styles.subsGrid}>
          <div style={styles.subsItem}>
            <span style={styles.subsValue}>{lifetimeSubs.given}</span>
            <span style={styles.subsLabel}>Given</span>
          </div>
          <div style={styles.subsDivider} />
          <div style={styles.subsItem}>
            <span style={styles.subsValueNegative}>{lifetimeSubs.received}</span>
            <span style={styles.subsLabel}>Received</span>
          </div>
          <div style={styles.subsDivider} />
          <div style={styles.subsItem}>
            <span style={styles.subsRatio}>
              {lifetimeSubs.received > 0
                ? (lifetimeSubs.given / lifetimeSubs.received).toFixed(1)
                : lifetimeSubs.given}
              :1
            </span>
            <span style={styles.subsLabel}>Ratio</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {yearsActive >= 5
            ? `${yearsActive} years. ${totalSessions} sessions. This is a lifestyle.`
            : copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
              'The journey continues.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactLongGame({
  yearsActive,
  totalSessions,
  totalHours,
}: {
  yearsActive: number;
  totalSessions: number;
  totalHours: number;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Clock size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>THE LONG GAME</span>
      </div>
      <div style={styles.compactContent}>
        <div style={styles.compactHero}>
          <span style={styles.compactYears}>{yearsActive}</span>
          <span style={styles.compactYearsLabel}>years</span>
        </div>
        <div style={styles.compactStats}>
          <span style={styles.compactStat}>{totalSessions} sessions</span>
          <span style={styles.compactDivider}>/</span>
          <span style={styles.compactStat}>{totalHours} hours</span>
        </div>
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
    marginBottom: 'var(--space-xl)',
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
    height: '120px',
    alignItems: 'flex-end',
  },
  chartBar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  barFill: {
    width: '100%',
    background: 'var(--color-gold)',
    borderRadius: '2px',
    transition: 'height 0.5s ease',
  },
  barYear: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  barCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
    fontSize: 'var(--text-2xl)',
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
  subsSummary: {
    marginBottom: 'var(--space-lg)',
  },
  subsGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gray-900)',
  },
  subsItem: {
    textAlign: 'center' as const,
    minWidth: '60px',
  },
  subsValue: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-positive)',
    marginBottom: '2px',
  },
  subsValueNegative: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-negative)',
    marginBottom: '2px',
  },
  subsRatio: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-gold)',
    marginBottom: '2px',
  },
  subsLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
  },
  subsDivider: {
    width: '1px',
    height: '40px',
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
  compactHero: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-xs)',
  },
  compactYears: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--color-gold)',
  },
  compactYearsLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  compactStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  compactStat: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  compactDivider: {
    color: 'var(--color-gray-600)',
  },
};

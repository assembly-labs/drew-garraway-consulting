/**
 * Your Style - Blue Belt Stats Module
 *
 * Simplified version of "Game DNA" - shows submission balance and emerging style.
 * Uses data we reliably collect (submissions given/received) to infer playing style.
 *
 * Design: Hero style label with submission breakdown
 * Data: submissionsGiven[], submissionsReceived[] (both reliable)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  getStyleFromRatio,
  getTopTechniques,
  calculateBodyRegionBreakdown,
  calculateSubmissionRatio,
  MODULE_COPY,
  type SubmissionRecord,
} from '../../../data/stats-modules';

interface YourStyleProps {
  submissionsGiven: SubmissionRecord[];
  submissionsReceived: SubmissionRecord[];
  variant?: 'full' | 'compact';
}

export function YourStyle({
  submissionsGiven,
  submissionsReceived,
  variant = 'full',
}: YourStyleProps) {
  // Calculate style metrics
  const givenCount = submissionsGiven.length;
  const receivedCount = submissionsReceived.length;

  const style = useMemo(
    () => getStyleFromRatio(givenCount, receivedCount),
    [givenCount, receivedCount]
  );

  const ratio = useMemo(
    () => calculateSubmissionRatio(givenCount, receivedCount),
    [givenCount, receivedCount]
  );

  const topAttacks = useMemo(
    () => getTopTechniques(submissionsGiven, 3),
    [submissionsGiven]
  );

  const bodyBreakdown = useMemo(
    () => calculateBodyRegionBreakdown(submissionsGiven),
    [submissionsGiven]
  );

  const totalBodyAttacks = bodyBreakdown.neck + bodyBreakdown.arms + bodyBreakdown.legs;

  const copy = MODULE_COPY.find((c) => c.moduleId === 'your-style');

  if (variant === 'compact') {
    return (
      <CompactYourStyle
        style={style}
        givenCount={givenCount}
        receivedCount={receivedCount}
        ratio={ratio}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Icons.Target size={20} color="var(--color-gold)" />
        </div>
        <span style={styles.headerLabel}>YOUR STYLE</span>
      </div>

      {/* Style Label Hero */}
      <div style={styles.styleHero}>
        <span style={styles.styleLabel}>{style.label}</span>
        <p style={styles.styleDescription}>{style.description}</p>
      </div>

      {/* Submission Balance */}
      <div style={styles.balanceSection}>
        <div style={styles.balanceHeader}>
          <span style={styles.balanceTitle}>SUBMISSION BALANCE</span>
          <span style={styles.balanceRatio}>{ratio.label}</span>
        </div>

        <div style={styles.balanceBars}>
          {/* Given Bar */}
          <div style={styles.balanceRow}>
            <span style={styles.balanceLabel}>Given</span>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  ...styles.barFillPositive,
                  width: `${Math.min(100, (givenCount / Math.max(givenCount, receivedCount, 1)) * 100)}%`,
                }}
              />
            </div>
            <span style={styles.balanceCount}>{givenCount}</span>
          </div>

          {/* Received Bar */}
          <div style={styles.balanceRow}>
            <span style={styles.balanceLabel}>Received</span>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  ...styles.barFillNegative,
                  width: `${Math.min(100, (receivedCount / Math.max(givenCount, receivedCount, 1)) * 100)}%`,
                }}
              />
            </div>
            <span style={styles.balanceCount}>{receivedCount}</span>
          </div>
        </div>

        {/* Ratio Insight */}
        <p style={styles.ratioInsight}>
          {ratio.ratio >= 2
            ? "You're finishing more than you're getting caught. Offensive pressure."
            : ratio.ratio >= 1
            ? 'Balanced exchange. Attack and defense in harmony.'
            : ratio.ratio >= 0.5
            ? "You're getting caught more than finishing. Focus on defense."
            : "Defense is the priority right now. Survival builds foundation."}
        </p>
      </div>

      {/* Top Attacks */}
      {topAttacks.length > 0 && (
        <div style={styles.topAttacksSection}>
          <span style={styles.sectionTitle}>YOUR GO-TO ATTACKS</span>
          <div style={styles.attacksList}>
            {topAttacks.map((attack, index) => (
              <div key={attack.technique} style={styles.attackRow}>
                <span style={styles.attackRank}>{index + 1}.</span>
                <span style={styles.attackName}>{attack.technique}</span>
                <div style={styles.attackBarContainer}>
                  <div
                    style={{
                      ...styles.attackBarFill,
                      width: `${(attack.count / topAttacks[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span style={styles.attackCount}>{attack.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body Region Breakdown */}
      {totalBodyAttacks > 0 && (
        <div style={styles.bodySection}>
          <span style={styles.sectionTitle}>ATTACK ZONES</span>
          <div style={styles.bodyGrid}>
            <div style={styles.bodyItem}>
              <div style={styles.bodyBarContainer}>
                <div
                  style={{
                    ...styles.bodyBarFill,
                    height: `${(bodyBreakdown.neck / totalBodyAttacks) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.bodyLabel}>Neck</span>
              <span style={styles.bodyPercent}>
                {Math.round((bodyBreakdown.neck / totalBodyAttacks) * 100)}%
              </span>
            </div>
            <div style={styles.bodyItem}>
              <div style={styles.bodyBarContainer}>
                <div
                  style={{
                    ...styles.bodyBarFill,
                    height: `${(bodyBreakdown.arms / totalBodyAttacks) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.bodyLabel}>Arms</span>
              <span style={styles.bodyPercent}>
                {Math.round((bodyBreakdown.arms / totalBodyAttacks) * 100)}%
              </span>
            </div>
            <div style={styles.bodyItem}>
              <div style={styles.bodyBarContainer}>
                <div
                  style={{
                    ...styles.bodyBarFill,
                    height: `${(bodyBreakdown.legs / totalBodyAttacks) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.bodyLabel}>Legs</span>
              <span style={styles.bodyPercent}>
                {Math.round((bodyBreakdown.legs / totalBodyAttacks) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
            'Blue belt is when your game starts to take shape.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactYourStyle({
  style,
  givenCount,
  receivedCount,
  ratio,
}: {
  style: ReturnType<typeof getStyleFromRatio>;
  givenCount: number;
  receivedCount: number;
  ratio: ReturnType<typeof calculateSubmissionRatio>;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Target size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>YOUR STYLE</span>
      </div>
      <div style={styles.compactContent}>
        <span style={styles.compactStyleLabel}>{style.label}</span>
        <div style={styles.compactStats}>
          <span style={styles.compactStat}>
            <span style={{ color: 'var(--color-positive)' }}>{givenCount}</span> given
          </span>
          <span style={styles.compactDivider}>/</span>
          <span style={styles.compactStat}>
            <span style={{ color: 'var(--color-negative)' }}>{receivedCount}</span> received
          </span>
          <span style={styles.compactRatio}>({ratio.label})</span>
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
  styleHero: {
    textAlign: 'center' as const,
    marginBottom: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    background: 'var(--color-gold-dim)',
    borderLeft: '3px solid var(--color-gold)',
  },
  styleLabel: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--color-gold)',
    textTransform: 'uppercase' as const,
    letterSpacing: 'var(--tracking-wide)',
    marginBottom: 'var(--space-sm)',
  },
  styleDescription: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    margin: 0,
    lineHeight: 'var(--leading-normal)',
  },
  balanceSection: {
    marginBottom: 'var(--space-lg)',
  },
  balanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-md)',
  },
  balanceTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
  },
  balanceRatio: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  balanceBars: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-md)',
  },
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  balanceLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    width: '60px',
  },
  barContainer: {
    flex: 1,
    height: '12px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  barFillPositive: {
    background: 'var(--color-positive)',
  },
  barFillNegative: {
    background: 'var(--color-negative)',
  },
  balanceCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-white)',
    width: '32px',
    textAlign: 'right' as const,
  },
  ratioInsight: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    margin: 0,
    fontStyle: 'italic',
  },
  topAttacksSection: {
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
  attacksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-sm)',
  },
  attackRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm)',
    background: 'var(--color-gray-900)',
  },
  attackRank: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
    width: '20px',
  },
  attackName: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    width: '80px',
  },
  attackBarContainer: {
    flex: 1,
    height: '8px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  attackBarFill: {
    height: '100%',
    background: 'var(--color-positive)',
    borderRadius: '2px',
  },
  attackCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gray-400)',
    width: '24px',
    textAlign: 'right' as const,
  },
  bodySection: {
    marginBottom: 'var(--space-lg)',
  },
  bodyGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: 'var(--space-md)',
  },
  bodyItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  bodyBarContainer: {
    width: '40px',
    height: '80px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  bodyBarFill: {
    width: '100%',
    background: 'var(--color-gold)',
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.5s ease',
  },
  bodyLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
  },
  bodyPercent: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-white)',
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
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)',
  },
  compactStyleLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-gold)',
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
  compactRatio: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
};

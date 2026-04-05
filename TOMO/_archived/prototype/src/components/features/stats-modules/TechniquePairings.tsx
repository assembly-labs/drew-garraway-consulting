/**
 * Technique Pairings - Blue Belt Stats Module
 *
 * Shows techniques that are frequently drilled together.
 * Identifies emerging "chains" and "systems" in the user's game.
 *
 * Design: Primary technique with co-occurrence connections
 * Data: techniquesDrilledHistory[] (reliable)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  calculateTechniqueCoOccurrence,
  MODULE_COPY,
  type TechniqueSession,
} from '../../../data/stats-modules';

interface TechniquePairingsProps {
  techniqueHistory: TechniqueSession[];
  variant?: 'full' | 'compact';
}

interface TechniqueWithPairings {
  technique: string;
  totalDrills: number;
  pairings: Array<{ technique: string; count: number }>;
}

export function TechniquePairings({
  techniqueHistory,
  variant = 'full',
}: TechniquePairingsProps) {
  // Count all technique occurrences
  const techniqueCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const session of techniqueHistory) {
      for (const tech of session.techniques) {
        counts[tech] = (counts[tech] || 0) + 1;
      }
    }
    return counts;
  }, [techniqueHistory]);

  // Get top 3 most drilled techniques with their pairings
  const topTechniquesWithPairings = useMemo((): TechniqueWithPairings[] => {
    const sorted = Object.entries(techniqueCounts)
      .map(([technique, count]) => ({ technique, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return sorted.map(({ technique, count }) => ({
      technique,
      totalDrills: count,
      pairings: calculateTechniqueCoOccurrence(techniqueHistory, technique, 3),
    }));
  }, [techniqueCounts, techniqueHistory]);

  // Calculate total unique techniques and sessions
  const stats = useMemo(() => {
    const uniqueTechniques = Object.keys(techniqueCounts).length;
    const totalSessions = techniqueHistory.length;
    return { uniqueTechniques, totalSessions };
  }, [techniqueCounts, techniqueHistory]);

  const copy = MODULE_COPY.find((c) => c.moduleId === 'technique-pairings');

  // Empty state
  if (techniqueHistory.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <Icons.Zap size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>TECHNIQUE PAIRINGS</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.Grid size={32} color="var(--color-gray-600)" />
          <p style={styles.emptyText}>
            {copy?.emptyState || 'Drill more techniques to see patterns emerge.'}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactTechniquePairings
        topTechnique={topTechniquesWithPairings[0]}
        uniqueCount={stats.uniqueTechniques}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.Zap size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>TECHNIQUE PAIRINGS</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerStat}>
            {stats.uniqueTechniques} techniques across {stats.totalSessions} sessions
          </span>
        </div>
      </div>

      {/* Intro Text */}
      <p style={styles.introText}>
        Techniques you drill together form your systems. These are your emerging chains.
      </p>

      {/* Top Techniques with Pairings */}
      <div style={styles.pairingsSection}>
        {topTechniquesWithPairings.map((techData, index) => (
          <div key={techData.technique} style={styles.pairingCard}>
            <div style={styles.pairingHeader}>
              <div style={styles.pairingPrimary}>
                <span style={styles.pairingRank}>{index + 1}.</span>
                <span style={styles.pairingTechnique}>{techData.technique}</span>
              </div>
              <span style={styles.pairingCount}>{techData.totalDrills}x</span>
            </div>

            {techData.pairings.length > 0 ? (
              <div style={styles.pairingConnections}>
                <span style={styles.connectionsLabel}>Often paired with:</span>
                <div style={styles.connectionsList}>
                  {techData.pairings.map((pairing) => (
                    <div key={pairing.technique} style={styles.connectionItem}>
                      <Icons.ChevronRight
                        size={12}
                        color="var(--color-gray-600)"
                      />
                      <span style={styles.connectionTechnique}>
                        {pairing.technique}
                      </span>
                      <span style={styles.connectionCount}>
                        {pairing.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.pairingConnections}>
                <span style={styles.noConnections}>
                  No consistent pairings yet
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pattern Analysis */}
      {topTechniquesWithPairings.length > 0 &&
        topTechniquesWithPairings[0].pairings.length > 0 && (
          <div style={styles.patternBox}>
            <div style={styles.patternHeader}>
              <Icons.TrendUp size={16} color="var(--color-positive)" />
              <span style={styles.patternTitle}>EMERGING CHAIN</span>
            </div>
            <p style={styles.patternText}>
              You're building a{' '}
              <strong>{topTechniquesWithPairings[0].technique}</strong>
              {' → '}
              <strong>{topTechniquesWithPairings[0].pairings[0]?.technique}</strong>
              {' connection. Keep developing this chain.'}
            </p>
          </div>
        )}

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
            'Systems beat random techniques.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactTechniquePairings({
  topTechnique,
  uniqueCount,
}: {
  topTechnique: TechniqueWithPairings | undefined;
  uniqueCount: number;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Zap size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>PAIRINGS</span>
        <span style={styles.compactCount}>{uniqueCount} techniques</span>
      </div>

      {topTechnique && (
        <div style={styles.compactContent}>
          <div style={styles.compactPrimary}>
            <span style={styles.compactTechnique}>
              {topTechnique.technique}
            </span>
            <span style={styles.compactDrillCount}>
              {topTechnique.totalDrills}x
            </span>
          </div>

          {topTechnique.pairings.length > 0 && (
            <div style={styles.compactChain}>
              <Icons.ChevronRight size={12} color="var(--color-gray-600)" />
              <span style={styles.compactPairing}>
                {topTechnique.pairings[0].technique}
              </span>
            </div>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--space-md)',
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
  headerStat: {
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
  introText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    margin: 0,
    marginBottom: 'var(--space-lg)',
    lineHeight: 'var(--leading-normal)',
  },
  pairingsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-lg)',
  },
  pairingCard: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-md)',
  },
  pairingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-sm)',
  },
  pairingPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  pairingRank: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
    width: '20px',
  },
  pairingTechnique: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  pairingCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
  },
  pairingConnections: {
    paddingLeft: '28px',
  },
  connectionsLabel: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-600)',
    marginBottom: 'var(--space-xs)',
  },
  connectionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  connectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  connectionTechnique: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    flex: 1,
  },
  connectionCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  noConnections: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-600)',
  },
  patternBox: {
    marginBottom: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-positive-dim)',
    borderLeft: '3px solid var(--color-positive)',
  },
  patternHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-sm)',
  },
  patternTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-positive)',
  },
  patternText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    margin: 0,
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
    flex: 1,
  },
  compactCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  compactContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)',
  },
  compactPrimary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTechnique: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
  },
  compactDrillCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  compactChain: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  compactPairing: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
};

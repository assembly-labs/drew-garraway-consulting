/**
 * Technique Mastery - Purple Belt Stats Module
 *
 * Shows specialization depth - techniques grouped by proficiency level.
 * Highlights signature moves and developing areas.
 *
 * Design: Proficiency tiers with drill counts
 * Data: TechniqueMasteryRecord[]
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import { MODULE_COPY, type TechniqueMasteryRecord } from '../../../data/stats-modules';

interface TechniqueMasteryProps {
  techniques: TechniqueMasteryRecord[];
  variant?: 'full' | 'compact';
}

type ProficiencyLevel = 'advanced' | 'proficient' | 'developing' | 'learning';

const PROFICIENCY_CONFIG: Record<
  ProficiencyLevel,
  { label: string; color: string; barColor: string }
> = {
  advanced: {
    label: 'ADVANCED',
    color: 'var(--color-gold)',
    barColor: 'var(--color-gold)',
  },
  proficient: {
    label: 'PROFICIENT',
    color: 'var(--color-positive)',
    barColor: 'var(--color-positive)',
  },
  developing: {
    label: 'DEVELOPING',
    color: 'var(--color-gray-400)',
    barColor: 'var(--color-gray-500)',
  },
  learning: {
    label: 'LEARNING',
    color: 'var(--color-gray-500)',
    barColor: 'var(--color-gray-600)',
  },
};

export function TechniqueMastery({
  techniques,
  variant = 'full',
}: TechniqueMasteryProps) {
  // Group techniques by proficiency
  const grouped = useMemo(() => {
    const groups: Record<ProficiencyLevel, TechniqueMasteryRecord[]> = {
      advanced: [],
      proficient: [],
      developing: [],
      learning: [],
    };

    techniques.forEach((tech) => {
      if (groups[tech.proficiency]) {
        groups[tech.proficiency].push(tech);
      }
    });

    // Sort each group by times drilled
    Object.keys(groups).forEach((key) => {
      groups[key as ProficiencyLevel].sort((a, b) => b.timesDrilled - a.timesDrilled);
    });

    return groups;
  }, [techniques]);

  // Find signature move (most drilled advanced technique)
  const signatureMove = useMemo(() => {
    if (grouped.advanced.length === 0) return null;
    return grouped.advanced[0];
  }, [grouped]);

  // Find max drill count for bar scaling
  const maxDrills = useMemo(() => {
    return Math.max(...techniques.map((t) => t.timesDrilled), 1);
  }, [techniques]);

  // Calculate total techniques at each level
  const levelCounts = useMemo(() => {
    return {
      advanced: grouped.advanced.length,
      proficient: grouped.proficient.length,
      developing: grouped.developing.length,
      learning: grouped.learning.length,
      total: techniques.length,
    };
  }, [grouped, techniques]);

  // Find primary system (most common category in advanced/proficient)
  const primarySystem = useMemo(() => {
    const advancedNames = grouped.advanced.map((t) => t.techniqueName.toLowerCase());

    // Simple heuristic for system detection
    const guardAttacks = ['triangle', 'armbar', 'omoplata', 'kimura'].filter((t) =>
      advancedNames.some((n) => n.includes(t))
    );

    if (guardAttacks.length >= 2) {
      return 'Closed guard attacks';
    }

    const chokes = ['rnc', 'rear naked', 'guillotine', 'darce', 'anaconda'].filter((t) =>
      advancedNames.some((n) => n.includes(t))
    );

    if (chokes.length >= 2) {
      return 'Choke specialist';
    }

    const legLocks = ['heel hook', 'knee bar', 'toe hold', 'calf'].filter((t) =>
      advancedNames.some((n) => n.includes(t))
    );

    if (legLocks.length >= 2) {
      return 'Leg lock system';
    }

    return null;
  }, [grouped]);

  const copy = MODULE_COPY.find((c) => c.moduleId === 'technique-mastery');

  // Empty state
  if (techniques.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <Icons.Award size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>YOUR MASTERY</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.Award size={32} color="var(--color-gray-600)" />
          <p style={styles.emptyText}>
            {copy?.emptyState || 'Track technique progress to see your specializations.'}
          </p>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactTechniqueMastery
        signatureMove={signatureMove}
        levelCounts={levelCounts}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.Award size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>YOUR MASTERY</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerCount}>{levelCounts.total} techniques</span>
        </div>
      </div>

      {/* Signature Move Hero */}
      {signatureMove && (
        <div style={styles.signatureHero}>
          <span style={styles.signatureLabel}>YOUR SIGNATURE</span>
          <span style={styles.signatureName}>{signatureMove.techniqueName}</span>
          <div style={styles.signatureStats}>
            <span style={styles.signatureStat}>
              {signatureMove.timesDrilled} drills
            </span>
            <span style={styles.signatureDivider}>|</span>
            <span style={styles.signatureStat}>
              {signatureMove.timesUsedLive} live
            </span>
          </div>
        </div>
      )}

      {/* Proficiency Tiers */}
      {(['advanced', 'proficient', 'developing'] as ProficiencyLevel[]).map((level) => {
        if (grouped[level].length === 0) return null;
        const config = PROFICIENCY_CONFIG[level];
        const displayTechniques = grouped[level].slice(0, level === 'developing' ? 4 : 5);
        const remaining = grouped[level].length - displayTechniques.length;

        return (
          <div key={level} style={styles.tierSection}>
            <div style={styles.tierHeader}>
              <span style={{ ...styles.tierLabel, color: config.color }}>
                {config.label}
              </span>
              <span style={styles.tierCount}>({grouped[level].length})</span>
            </div>

            <div style={styles.techniqueList}>
              {displayTechniques.map((tech) => (
                <div key={tech.techniqueId} style={styles.techniqueRow}>
                  <span style={styles.techniqueName}>{tech.techniqueName}</span>
                  <div style={styles.techniqueBarContainer}>
                    <div
                      style={{
                        ...styles.techniqueBarFill,
                        width: `${(tech.timesDrilled / maxDrills) * 100}%`,
                        background: config.barColor,
                      }}
                    />
                  </div>
                  <span style={styles.techniqueDrills}>{tech.timesDrilled}</span>
                </div>
              ))}
              {remaining > 0 && (
                <span style={styles.moreText}>... and {remaining} more</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Depth Analysis */}
      {primarySystem && (
        <div style={styles.analysisBox}>
          <div style={styles.analysisHeader}>
            <Icons.Zap size={16} color="var(--color-gold)" />
            <span style={styles.analysisTitle}>DEPTH ANALYSIS</span>
          </div>
          <p style={styles.analysisText}>
            Primary system: <strong>{primarySystem}</strong>
            {signatureMove && (
              <>
                {' '}({signatureMove.techniqueName} → chain)
              </>
            )}
          </p>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightBox}>
        <p style={styles.insight}>
          {signatureMove
            ? `Your ${signatureMove.techniqueName.toLowerCase()} is your signature. ${signatureMove.timesDrilled} drills deep.`
            : copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
              'Depth over breadth at this stage.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactTechniqueMastery({
  signatureMove,
  levelCounts,
}: {
  signatureMove: TechniqueMasteryRecord | null;
  levelCounts: { advanced: number; proficient: number; developing: number; total: number };
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <Icons.Award size={16} color="var(--color-gold)" />
        <span style={styles.compactLabel}>MASTERY</span>
        <span style={styles.compactCount}>{levelCounts.total} techniques</span>
      </div>
      <div style={styles.compactContent}>
        {signatureMove && (
          <div style={styles.compactSignature}>
            <span style={styles.compactSignatureName}>{signatureMove.techniqueName}</span>
            <span style={styles.compactSignatureDrills}>
              {signatureMove.timesDrilled} drills
            </span>
          </div>
        )}
        <div style={styles.compactLevels}>
          <span style={styles.compactLevel}>
            <span style={{ color: 'var(--color-gold)' }}>{levelCounts.advanced}</span> adv
          </span>
          <span style={styles.compactDivider}>/</span>
          <span style={styles.compactLevel}>
            <span style={{ color: 'var(--color-positive)' }}>{levelCounts.proficient}</span> prof
          </span>
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
  headerCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
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
  signatureHero: {
    textAlign: 'center' as const,
    marginBottom: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    background: 'var(--color-gold-dim)',
    borderLeft: '3px solid var(--color-gold)',
  },
  signatureLabel: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gold)',
    marginBottom: 'var(--space-sm)',
  },
  signatureName: {
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 800,
    color: 'var(--color-white)',
    marginBottom: 'var(--space-sm)',
  },
  signatureStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  signatureStat: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
  },
  signatureDivider: {
    color: 'var(--color-gray-600)',
  },
  tierSection: {
    marginBottom: 'var(--space-lg)',
  },
  tierHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-sm)',
  },
  tierLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    letterSpacing: 'var(--tracking-wider)',
  },
  tierCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  techniqueList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  techniqueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm)',
    background: 'var(--color-gray-900)',
  },
  techniqueName: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    width: '120px',
    flexShrink: 0,
  },
  techniqueBarContainer: {
    flex: 1,
    height: '8px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  techniqueBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  techniqueDrills: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-gray-400)',
    width: '32px',
    textAlign: 'right' as const,
  },
  moreText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-600)',
    paddingLeft: 'var(--space-sm)',
  },
  analysisBox: {
    marginBottom: 'var(--space-lg)',
    padding: 'var(--space-md)',
    background: 'var(--color-gold-dim)',
    borderLeft: '3px solid var(--color-gold)',
  },
  analysisHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-sm)',
  },
  analysisTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gold)',
  },
  analysisText: {
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
    gap: 'var(--space-sm)',
  },
  compactSignature: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactSignatureName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
  },
  compactSignatureDrills: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  compactLevels: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  compactLevel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  compactDivider: {
    color: 'var(--color-gray-600)',
  },
};

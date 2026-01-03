/**
 * Foundations Progress - White Belt Stats Module
 *
 * Tracks progress through fundamental BJJ techniques.
 * Derives "touched" status from techniques drilled in session history.
 *
 * Design: Category-based progress bars with technique checklist
 * Data: techniquesDrilled[] from sessions (reliable)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';
import {
  checkFoundationsTouched,
  MODULE_COPY,
  type TechniqueSession,
} from '../../../data/stats-modules';

interface FoundationsProgressProps {
  techniqueHistory: TechniqueSession[];
  variant?: 'full' | 'compact';
}

export function FoundationsProgress({
  techniqueHistory,
  variant = 'full',
}: FoundationsProgressProps) {
  // Calculate foundation progress
  const progress = useMemo(
    () => checkFoundationsTouched(techniqueHistory),
    [techniqueHistory]
  );

  // Calculate overall progress
  const overall = useMemo(() => {
    const totalTouched = progress.reduce((acc, cat) => acc + cat.touched, 0);
    const totalTechniques = progress.reduce((acc, cat) => acc + cat.total, 0);
    return {
      touched: totalTouched,
      total: totalTechniques,
      percent: Math.round((totalTouched / totalTechniques) * 100),
    };
  }, [progress]);

  // Get recently touched techniques
  const recentlyTouched = useMemo(() => {
    if (techniqueHistory.length === 0) return [];
    const lastSession = techniqueHistory[0];
    return lastSession.techniques.slice(0, 3);
  }, [techniqueHistory]);

  const copy = MODULE_COPY.find((c) => c.moduleId === 'foundations-progress');

  if (variant === 'compact') {
    return (
      <CompactFoundations
        touched={overall.touched}
        total={overall.total}
        percent={overall.percent}
        progress={progress}
      />
    );
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Icons.Shield size={20} color="var(--color-gold)" />
          </div>
          <span style={styles.headerLabel}>FOUNDATIONS</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerProgress}>
            {overall.touched} / {overall.total}
          </span>
        </div>
      </div>

      {/* Overall Progress */}
      <div style={styles.overallSection}>
        <div style={styles.overallBar}>
          <div
            style={{
              ...styles.overallFill,
              width: `${overall.percent}%`,
            }}
          />
        </div>
        <span style={styles.overallPercent}>{overall.percent}% touched</span>
      </div>

      {/* Category Breakdown */}
      <div style={styles.categories}>
        {progress.map((category) => (
          <div key={category.category} style={styles.categoryCard}>
            <div style={styles.categoryHeader}>
              <span style={styles.categoryName}>{category.category}</span>
              <span style={styles.categoryProgress}>
                {category.touched}/{category.total}
              </span>
            </div>
            <div style={styles.categoryBar}>
              <div
                style={{
                  ...styles.categoryFill,
                  width: `${(category.touched / category.total) * 100}%`,
                  background:
                    category.touched === category.total
                      ? 'var(--color-positive)'
                      : 'var(--color-gold)',
                }}
              />
            </div>
            <div style={styles.techniqueList}>
              {category.techniques.map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    ...styles.techniqueItem,
                    ...(tech.touched ? styles.techniqueTouched : {}),
                  }}
                >
                  {tech.touched ? (
                    <Icons.Check size={12} color="var(--color-positive)" />
                  ) : (
                    <div style={styles.techniqueCircle} />
                  )}
                  <span
                    style={{
                      ...styles.techniqueName,
                      ...(tech.touched ? styles.techniqueNameTouched : {}),
                    }}
                  >
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recently Touched */}
      {recentlyTouched.length > 0 && (
        <div style={styles.recentSection}>
          <span style={styles.recentLabel}>RECENTLY TOUCHED</span>
          <div style={styles.recentTags}>
            {recentlyTouched.map((tech) => (
              <span key={tech} style={styles.recentTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={styles.insightBox}>
        <Icons.Info size={14} color="var(--color-gray-500)" />
        <p style={styles.insight}>
          {copy?.insights[Math.floor(Math.random() * copy.insights.length)] ||
            'The basics become your superpowers.'}
        </p>
      </div>
    </section>
  );
}

// Compact variant
function CompactFoundations({
  touched,
  total,
  percent,
  progress,
}: {
  touched: number;
  total: number;
  percent: number;
  progress: ReturnType<typeof checkFoundationsTouched>;
}) {
  return (
    <div style={styles.compactContainer}>
      <div style={styles.compactHeader}>
        <div style={styles.compactHeaderLeft}>
          <Icons.Shield size={16} color="var(--color-gold)" />
          <span style={styles.compactLabel}>FOUNDATIONS</span>
        </div>
        <span style={styles.compactProgress}>
          {touched}/{total}
        </span>
      </div>

      <div style={styles.compactBarContainer}>
        <div style={styles.compactBar}>
          <div
            style={{
              ...styles.compactFill,
              width: `${percent}%`,
            }}
          />
        </div>
        <span style={styles.compactPercent}>{percent}%</span>
      </div>

      <div style={styles.compactCategories}>
        {progress.map((cat) => (
          <div key={cat.category} style={styles.compactCategory}>
            <span style={styles.compactCategoryName}>
              {cat.category.slice(0, 3).toUpperCase()}
            </span>
            <span
              style={{
                ...styles.compactCategoryValue,
                color:
                  cat.touched === cat.total
                    ? 'var(--color-positive)'
                    : 'var(--color-gray-400)',
              }}
            >
              {cat.touched}/{cat.total}
            </span>
          </div>
        ))}
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
  headerProgress: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
  },
  overallSection: {
    marginBottom: 'var(--space-lg)',
  },
  overallBar: {
    height: '8px',
    background: 'var(--color-gray-700)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: 'var(--space-xs)',
  },
  overallFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-gold), var(--color-positive))',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  overallPercent: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  categories: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-lg)',
  },
  categoryCard: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-md)',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-sm)',
  },
  categoryName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-white)',
    textTransform: 'uppercase' as const,
  },
  categoryProgress: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  categoryBar: {
    height: '4px',
    background: 'var(--color-gray-700)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: 'var(--space-sm)',
  },
  categoryFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  techniqueList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-sm)',
  },
  techniqueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    background: 'var(--color-gray-800)',
    borderRadius: '2px',
  },
  techniqueTouched: {
    background: 'var(--color-positive-dim)',
  },
  techniqueCircle: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '1px solid var(--color-gray-600)',
    background: 'transparent',
  },
  techniqueName: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  techniqueNameTouched: {
    color: 'var(--color-positive)',
  },
  recentSection: {
    marginBottom: 'var(--space-md)',
  },
  recentLabel: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--space-sm)',
  },
  recentTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-xs)',
  },
  recentTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gold)',
    padding: '4px 8px',
    background: 'var(--color-gold-dim)',
    borderRadius: '2px',
  },
  insightBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-sm)',
  },
  compactHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  compactLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wider)',
    color: 'var(--color-gray-500)',
  },
  compactProgress: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gold)',
  },
  compactBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-sm)',
  },
  compactBar: {
    flex: 1,
    height: '6px',
    background: 'var(--color-gray-700)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  compactFill: {
    height: '100%',
    background: 'var(--color-gold)',
    borderRadius: '3px',
  },
  compactPercent: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    minWidth: '32px',
  },
  compactCategories: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  compactCategory: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
  },
  compactCategoryName: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)',
    color: 'var(--color-gray-600)',
  },
  compactCategoryValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
  },
};

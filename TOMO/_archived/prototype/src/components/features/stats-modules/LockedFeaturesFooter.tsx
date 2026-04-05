/**
 * LockedFeaturesFooter - Greyed-out locked feature cards
 *
 * Shows features that are coming soon with unlock criteria.
 * Creates healthy aspiration without FOMO.
 */

import { Icons } from '../../ui/Icons';

export interface LockedFeature {
  id: string;
  name: string;
  description: string;
  unlockCriteria: string;
  progress?: {
    current: number;
    target: number;
  };
  unlockType: 'belt' | 'sessions' | 'both';
}

interface LockedFeaturesFooterProps {
  lockedFeatures: LockedFeature[];
  onFeatureTap?: (featureId: string) => void;
}

export function LockedFeaturesFooter({
  lockedFeatures,
  onFeatureTap,
}: LockedFeaturesFooterProps) {
  if (lockedFeatures.length === 0) {
    return null;
  }

  return (
    <section style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <span style={styles.headerLabel}>COMING SOON</span>
      </div>

      {/* Feature Cards */}
      <div style={styles.cards}>
        {lockedFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onFeatureTap?.(feature.id)}
            style={styles.card}
          >
            {/* Lock Icon */}
            <div style={styles.lockIcon}>
              <Icons.Lock size={16} color="var(--color-gray-500)" />
            </div>

            {/* Content */}
            <div style={styles.cardContent}>
              <div style={styles.featureName}>{feature.name}</div>
              <div style={styles.unlockCriteria}>{feature.unlockCriteria}</div>

              {/* Progress Bar (if applicable) */}
              {feature.progress && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${Math.min(100, (feature.progress.current / feature.progress.target) * 100)}%`,
                      }}
                    />
                  </div>
                  <span style={styles.progressLabel}>
                    {feature.progress.current}/{feature.progress.target}
                  </span>
                </div>
              )}

              {/* Description */}
              <p style={styles.description}>{feature.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Text */}
      <p style={styles.footerText}>
        Keep training—these features unlock as you grow.
      </p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    borderTop: '1px solid var(--color-gray-800)',
  },
  header: {
    marginBottom: '16px',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: 'var(--color-gray-900)',
    border: '1px solid var(--color-gray-800)',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    opacity: 0.5,
    filter: 'saturate(0.3)',
    transition: 'all 0.15s ease',
  },
  lockIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--color-gray-800)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  featureName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-gray-300)',
    marginBottom: '4px',
  },
  unlockCriteria: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    marginBottom: '8px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  progressTrack: {
    flex: 1,
    height: '4px',
    background: 'var(--color-gray-800)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--color-gray-600)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-gray-600)',
    minWidth: '40px',
    textAlign: 'right',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    lineHeight: 1.4,
    margin: 0,
  },
  footerText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontStyle: 'italic',
    color: 'var(--color-gray-500)',
    textAlign: 'center',
    margin: '16px 0 0 0',
  },
};

export default LockedFeaturesFooter;

/**
 * BreakthroughPills - Compact breakthrough badges for hero section
 *
 * Shows 1-2 recent breakthroughs as small horizontal pills.
 * Positioned between month label and hero number in Dashboard.
 */

import { useMemo } from 'react';
import type { Breakthrough } from '../../utils/breakthrough-detection';
import { Icons } from './Icons';

interface BreakthroughPillsProps {
  breakthroughs: Breakthrough[];
  maxVisible?: number;
  onTap?: (breakthrough: Breakthrough) => void;
}

// Icon mapping for breakthrough types
const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  trophy: Icons.Trophy,
  flame: Icons.Flame,
  target: Icons.Target,
  shield: Icons.Shield,
  zap: Icons.Zap,
  'trending-up': Icons.TrendUp,
  award: Icons.Award,
  'check-circle': Icons.CheckCircle,
};

// Filter out streak-related breakthroughs
function filterBreakthroughs(breakthroughs: Breakthrough[]): Breakthrough[] {
  return breakthroughs.filter((b) => {
    // Exclude streak-related breakthroughs
    const title = b.title.toLowerCase();
    const type = b.type.toLowerCase();
    return !title.includes('streak') && type !== 'streak_record';
  });
}

// Shorten title for pill display
function shortenTitle(title: string): string {
  // Remove common prefixes
  const shortened = title
    .replace(/^First\s+/i, '')
    .replace(/^New\s+/i, '')
    .replace(/\s+Earned$/i, '')
    .replace(/\s+Working$/i, '');

  // Truncate if still too long
  if (shortened.length > 16) {
    return shortened.slice(0, 14) + '...';
  }
  return shortened;
}

export function BreakthroughPills({
  breakthroughs,
  maxVisible = 2,
  onTap,
}: BreakthroughPillsProps) {
  const visibleBreakthroughs = useMemo(() => {
    const filtered = filterBreakthroughs(breakthroughs);
    // Sort by date (newest first) and take maxVisible
    return filtered
      .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
      .slice(0, maxVisible);
  }, [breakthroughs, maxVisible]);

  const remainingCount = useMemo(() => {
    const filtered = filterBreakthroughs(breakthroughs);
    return Math.max(0, filtered.length - maxVisible);
  }, [breakthroughs, maxVisible]);

  if (visibleBreakthroughs.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      {visibleBreakthroughs.map((breakthrough) => {
        const IconComponent = ICON_MAP[breakthrough.icon || 'trophy'] || Icons.Trophy;
        const iconColor = breakthrough.confidence === 'high'
          ? 'var(--color-gold)'
          : breakthrough.confidence === 'medium'
            ? 'var(--color-positive)'
            : 'var(--color-gray-400)';

        return (
          <button
            key={breakthrough.id}
            onClick={() => onTap?.(breakthrough)}
            style={styles.pill}
          >
            <div style={{ ...styles.iconBox, background: `${iconColor}20` }}>
              <IconComponent size={12} color={iconColor} />
            </div>
            <span style={styles.title}>{shortenTitle(breakthrough.title)}</span>
          </button>
        );
      })}

      {remainingCount > 0 && (
        <div style={styles.moreIndicator}>
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    justifyContent: 'flex-start',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px 6px 8px',
    background: 'var(--color-gray-900)',
    border: '1px solid var(--color-gray-700)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  iconBox: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-300)',
    whiteSpace: 'nowrap',
  },
  moreIndicator: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    padding: '6px 0',
  },
};

export default BreakthroughPills;

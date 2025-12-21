/**
 * TrainingBadge Component
 * Visual indicator for training type (gi, no-gi, open mat, etc.)
 */

import type { TrainingType } from '../../data/journal';

interface TrainingBadgeProps {
  type: TrainingType;
  size?: 'sm' | 'md';
}

const typeLabels: Record<TrainingType, string> = {
  gi: 'GI',
  nogi: 'NO-GI',
  openmat: 'OPEN MAT',
  private: 'PRIVATE',
  competition: 'COMP',
};

const typeColors: Record<TrainingType, string> = {
  gi: 'var(--color-training-gi)',
  nogi: 'var(--color-training-nogi)',
  openmat: 'var(--color-training-openmat)',
  private: 'var(--color-training-private)',
  competition: 'var(--color-training-competition)',
};

export function TrainingBadge({ type, size = 'md' }: TrainingBadgeProps) {
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-xs)';

  return (
    <span
      style={{
        display: 'inline-block',
        padding,
        borderRadius: 'var(--radius-sm)',
        fontSize,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-white)',
        backgroundColor: typeColors[type],
        whiteSpace: 'nowrap',
      }}
    >
      {typeLabels[type]}
    </span>
  );
}

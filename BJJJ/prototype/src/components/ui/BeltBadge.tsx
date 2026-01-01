/**
 * BeltBadge Component
 * Visual representation of a BJJ belt with stripes
 */

import type { BeltColor } from '../../types/database';

interface BeltBadgeProps {
  belt: BeltColor;
  stripes?: 0 | 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 48, height: 12, stripeWidth: 2, stripeHeight: 8 },
  md: { width: 60, height: 16, stripeWidth: 3, stripeHeight: 10 },
  lg: { width: 80, height: 20, stripeWidth: 4, stripeHeight: 14 },
};

const beltColors: Record<BeltColor, string> = {
  white: 'var(--color-belt-white)',
  blue: 'var(--color-belt-blue)',
  purple: 'var(--color-belt-purple)',
  brown: 'var(--color-belt-brown)',
  black: 'var(--color-belt-black)',
};

export function BeltBadge({ belt, stripes = 0, size = 'md' }: BeltBadgeProps) {
  const dimensions = sizeMap[size];
  const stripeColor = belt === 'white' ? 'var(--color-primary)' : 'var(--color-white)';

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: beltColors[belt],
        borderRadius: 2,
        border: belt === 'white' ? '1px solid var(--color-gray-300)' : 'none',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 4,
        gap: 2,
      }}
      role="img"
      aria-label={`${belt} belt with ${stripes} stripe${stripes !== 1 ? 's' : ''}`}
    >
      {Array.from({ length: stripes }).map((_, i) => (
        <div
          key={i}
          style={{
            width: dimensions.stripeWidth,
            height: dimensions.stripeHeight,
            backgroundColor: stripeColor,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * AchillesHeelCard Component
 *
 * Displays the user's biggest vulnerability (most common submission received).
 * Only visible for white and blue belts - higher belts "shouldn't have weaknesses"
 * Features a heel with arrow line art icon.
 */

interface AchillesHeelCardProps {
  technique: string;
  count: number;
}

// Downward arrow icon (simple and bold)
function DownArrowIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Arrow shaft */}
      <line x1="24" y1="8" x2="24" y2="36" />
      {/* Arrow head */}
      <path d="M14 26L24 36L34 26" />
    </svg>
  );
}

export function AchillesHeelCard({ technique, count }: AchillesHeelCardProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, var(--color-black) 100%)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Icon */}
      <div style={{ color: 'var(--color-negative)' }}>
        <DownArrowIcon size={48} />
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-negative)',
        }}
      >
        Achilles Heel
      </div>

      {/* Technique name */}
      <div
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          lineHeight: 1.2,
          textTransform: 'capitalize',
        }}
      >
        {technique}
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
        }}
      >
        caught {count} times
      </div>
    </div>
  );
}

export default AchillesHeelCard;

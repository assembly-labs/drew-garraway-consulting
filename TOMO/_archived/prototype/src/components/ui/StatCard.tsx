/**
 * StatCard Component
 * Display key metrics with label, value, and optional trend
 *
 * DESIGN SYSTEM:
 * - Dark theme (black/gray backgrounds)
 * - Gold accents
 * - GREEN = positive, RED = negative
 * - SVG lineart icons (no emoji arrows)
 */

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'positive' | 'negative';
}

// SVG trend icons (lineart, no emojis)
const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'neutral' }) => {
  if (direction === 'up') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
};

export function StatCard({
  label,
  value,
  subtitle,
  trend,
  trendValue,
  variant = 'default',
}: StatCardProps) {
  const trendColors = {
    up: 'var(--color-positive)',
    down: 'var(--color-negative)',
    neutral: 'var(--color-gray-400)',
  };

  const valueColors = {
    default: 'var(--color-white)',
    positive: 'var(--color-positive)',
    negative: 'var(--color-negative)',
  };

  const bgColors = {
    default: 'var(--color-gray-900)',
    positive: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, var(--color-gray-900) 100%)',
    negative: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, var(--color-gray-900) 100%)',
  };

  return (
    <div
      className="stat-card"
      style={{
        background: bgColors[variant],
        padding: '20px',
      }}
    >
      <div
        className="stat-label"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: variant === 'default' ? 'var(--color-gray-400)' : valueColors[variant],
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div
        className="stat-value"
        style={{
          fontSize: '36px',
          fontWeight: 700,
          color: valueColors[variant],
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        {value}
      </div>
      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          {subtitle && (
            <span
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-400)',
              }}
            >
              {subtitle}
            </span>
          )}
          {trend && trendValue && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--text-sm)',
                color: trendColors[trend],
                fontWeight: 600,
              }}
            >
              <TrendIcon direction={trend} />
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

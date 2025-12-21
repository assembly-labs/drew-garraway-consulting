/**
 * StatCard Component
 * Display key metrics with label, value, and optional trend
 */

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent?: boolean;
}

export function StatCard({
  label,
  value,
  subtitle,
  trend,
  trendValue,
  accent = false,
}: StatCardProps) {
  const trendColors = {
    up: 'var(--color-success)',
    down: 'var(--color-error)',
    neutral: 'var(--color-gray-500)',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div
      className="stat-card"
      style={{
        backgroundColor: accent ? 'var(--color-primary)' : 'var(--color-white)',
        color: accent ? 'var(--color-white)' : 'inherit',
      }}
    >
      <div
        className="stat-label"
        style={{
          color: accent ? 'var(--color-gray-300)' : 'var(--color-gray-500)',
        }}
      >
        {label}
      </div>
      <div
        className="stat-value"
        style={{
          color: accent ? 'var(--color-accent)' : 'var(--color-accent-text)',
        }}
      >
        {value}
      </div>
      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-xs)',
          }}
        >
          {subtitle && (
            <span
              className="text-small"
              style={{
                color: accent ? 'var(--color-gray-300)' : 'var(--color-gray-500)',
              }}
            >
              {subtitle}
            </span>
          )}
          {trend && trendValue && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: trendColors[trend],
                fontWeight: 600,
              }}
            >
              {trendIcons[trend]} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

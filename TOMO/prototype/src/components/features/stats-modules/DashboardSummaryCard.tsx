/**
 * Dashboard Summary Card - Universal Stats Module
 *
 * At-a-glance overview showing key metrics in a 2x2 grid layout.
 * Entry point to deeper analytics. Shows the essentials without
 * overwhelming exhausted post-training users.
 *
 * Design: 4 metric cells with large numbers and context
 * Data: totalSessions, totalHours, currentStreak, belt/stripes
 */

interface DashboardSummaryCardProps {
  /** Total sessions logged */
  totalSessions: number;
  /** Total hours on the mat */
  totalHours: number;
  /** Current training streak in days */
  currentStreak: number;
  /** Best streak ever */
  bestStreak: number;
  /** Current belt level */
  belt: string;
  /** Number of stripes */
  stripes: number;
  /** When user started training */
  trainingStartDate?: string;
}

export function DashboardSummaryCard({
  totalSessions,
  totalHours,
  currentStreak,
  bestStreak,
  belt,
  stripes,
  trainingStartDate,
}: DashboardSummaryCardProps) {
  // Format time since start
  const timeSinceStart = trainingStartDate
    ? formatTimeSince(trainingStartDate)
    : null;

  // Belt display with stripes
  const beltDisplay = stripes > 0 ? `${stripes} stripe${stripes > 1 ? 's' : ''}` : 'No stripes';

  return (
    <section style={styles.container}>
      {/* 2x2 Grid */}
      <div style={styles.grid}>
        {/* Total Sessions */}
        <div style={styles.metric}>
          <div style={{ ...styles.metricValue, color: 'var(--color-gold)' }}>
            {totalSessions}
          </div>
          <div style={styles.metricLabel}>Total Sessions</div>
          {timeSinceStart && (
            <div style={styles.metricContext}>Since {timeSinceStart}</div>
          )}
        </div>

        {/* Hours on Mat */}
        <div style={styles.metric}>
          <div style={styles.metricValue}>{totalHours}</div>
          <div style={styles.metricLabel}>Hours on Mat</div>
          <div style={styles.metricContext}>
            Avg {Math.round((totalHours / Math.max(totalSessions, 1)) * 60)} min/session
          </div>
        </div>

        {/* Current Streak */}
        <div style={styles.metric}>
          <div style={{ ...styles.metricValue, color: 'var(--color-positive)' }}>
            {currentStreak}
          </div>
          <div style={styles.metricLabel}>Day Streak</div>
          <div style={styles.metricContext}>Best: {bestStreak} days</div>
        </div>

        {/* Belt Status */}
        <div style={styles.metric}>
          <div style={styles.beltContainer}>
            <div
              style={{
                ...styles.beltIndicator,
                background: getBeltColor(belt),
              }}
            />
            <div style={styles.beltText}>
              <span style={styles.beltName}>{capitalize(belt)}</span>
              <span style={styles.stripeText}>{beltDisplay}</span>
            </div>
          </div>
          <div style={styles.metricLabel}>Current Belt</div>
        </div>
      </div>
    </section>
  );
}

// Helper to format time since training start
function formatTimeSince(dateStr: string): string {
  const start = new Date(dateStr);
  const now = new Date();
  const months = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (months < 1) return 'this month';
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  if (years === 1) return '1 year ago';
  return `${years} years ago`;
}

// Helper to get belt color
function getBeltColor(belt: string): string {
  const colors: Record<string, string> = {
    white: '#FFFFFF',
    blue: '#0033A0',
    purple: '#4B0082',
    brown: '#8B4513',
    black: '#000000',
  };
  return colors[belt.toLowerCase()] || '#FFFFFF';
}

// Helper to capitalize
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--space-lg)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  metricValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '42px',
    fontWeight: 800,
    lineHeight: 1,
    color: 'var(--color-white)',
  },
  metricLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--color-gray-400)',
    marginTop: '8px',
  },
  metricContext: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    marginTop: '4px',
  },
  beltContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  beltIndicator: {
    width: '48px',
    height: '12px',
    borderRadius: '2px',
    border: '1px solid var(--color-gray-700)',
  },
  beltText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  beltName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-white)',
    lineHeight: 1.2,
  },
  stripeText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
};

export default DashboardSummaryCard;

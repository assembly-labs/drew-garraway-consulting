/**
 * Achievement Timeline - Blue/Purple Belt Stats Module
 *
 * Vertical timeline showing key training milestones.
 * Celebrates progress without creating comparison pressure.
 * Focus on personal journey, not competition.
 *
 * Design: Vertical timeline with icons and dates
 * Data: Milestone events (promotions, sessions, techniques, competitions)
 */

interface Achievement {
  id: string;
  type: 'promotion' | 'session' | 'technique' | 'competition' | 'streak' | 'milestone';
  title: string;
  description?: string;
  date: string;
  highlight?: boolean;
}

interface AchievementTimelineProps {
  /** List of achievements to display */
  achievements: Achievement[];
  /** Maximum items to show */
  maxItems?: number;
  /** Title for the section */
  title?: string;
}

// Icons for each achievement type
const ACHIEVEMENT_ICONS: Record<string, React.ReactNode> = {
  promotion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
  session: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  technique: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  competition: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  milestone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
};

// Colors for each achievement type
const ACHIEVEMENT_COLORS: Record<string, string> = {
  promotion: 'var(--color-gold)',
  session: 'var(--color-positive)',
  technique: '#3B82F6',
  competition: '#A855F7',
  streak: '#F97316',
  milestone: 'var(--color-gold)',
};

export function AchievementTimeline({
  achievements,
  maxItems = 6,
  title = 'YOUR JOURNEY',
}: AchievementTimelineProps) {
  // Sort by date descending and take top N
  const sortedAchievements = [...achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  if (sortedAchievements.length === 0) {
    return null;
  }

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerLabel}>{title}</span>
        <span style={styles.headerCount}>{achievements.length} milestones</span>
      </div>

      {/* Timeline */}
      <div style={styles.timeline}>
        {sortedAchievements.map((achievement, index) => {
          const isFirst = index === 0;
          const isLast = index === sortedAchievements.length - 1;
          const color = ACHIEVEMENT_COLORS[achievement.type] || 'var(--color-gray-500)';
          const icon = ACHIEVEMENT_ICONS[achievement.type];

          return (
            <div
              key={achievement.id}
              style={{
                ...styles.timelineItem,
                ...(achievement.highlight ? styles.timelineItemHighlight : {}),
              }}
            >
              {/* Timeline line */}
              <div style={styles.timelineLine}>
                {!isFirst && <div style={styles.lineTop} />}
                <div
                  style={{
                    ...styles.iconContainer,
                    borderColor: color,
                    background: achievement.highlight ? color : 'var(--color-gray-900)',
                  }}
                >
                  <span
                    style={{
                      ...styles.icon,
                      color: achievement.highlight ? 'var(--color-black)' : color,
                    }}
                  >
                    {icon}
                  </span>
                </div>
                {!isLast && <div style={styles.lineBottom} />}
              </div>

              {/* Content */}
              <div style={styles.content}>
                <div style={styles.contentHeader}>
                  <span
                    style={{
                      ...styles.title,
                      color: achievement.highlight ? 'var(--color-gold)' : 'var(--color-white)',
                    }}
                  >
                    {achievement.title}
                  </span>
                  <span style={styles.date}>{formatDate(achievement.date)}</span>
                </div>
                {achievement.description && (
                  <p style={styles.description}>{achievement.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more indicator if there are more achievements */}
      {achievements.length > maxItems && (
        <div style={styles.moreIndicator}>
          <span style={styles.moreText}>
            +{achievements.length - maxItems} more milestones
          </span>
        </div>
      )}
    </section>
  );
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-lg)',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-widest)',
    color: 'var(--color-gold)',
    textTransform: 'uppercase' as const,
  },
  headerCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  timelineItem: {
    display: 'flex',
    gap: 'var(--space-md)',
    minHeight: '64px',
  },
  timelineItemHighlight: {
    background: 'linear-gradient(90deg, rgba(245,166,35,0.1) 0%, transparent 100%)',
    marginLeft: '-16px',
    marginRight: '-16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '4px',
  },
  timelineLine: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '32px',
    flexShrink: 0,
  },
  lineTop: {
    width: '2px',
    height: '12px',
    background: 'var(--color-gray-700)',
  },
  lineBottom: {
    width: '2px',
    flex: 1,
    background: 'var(--color-gray-700)',
    minHeight: '12px',
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 'var(--space-md)',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    flex: 1,
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
    flexShrink: 0,
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    marginTop: '4px',
    lineHeight: 1.4,
  },
  moreIndicator: {
    textAlign: 'center' as const,
    paddingTop: 'var(--space-md)',
    borderTop: '1px solid var(--color-gray-800)',
    marginTop: 'var(--space-sm)',
  },
  moreText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
};

export default AchievementTimeline;

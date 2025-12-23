/**
 * EmptyState Component
 *
 * Displays empty states with:
 * - Contextual illustration/icon (SVG lineart)
 * - Encouraging message
 * - Primary action to populate data
 *
 * DESIGN SYSTEM:
 * - Dark theme (gray-900 backgrounds)
 * - Gold accents
 * - No emojis - SVG lineart only
 * Follows brand voice: warm, supportive, direct
 */

interface EmptyStateProps {
  /** Type of empty state */
  variant?: 'sessions' | 'techniques' | 'goals' | 'search' | 'generic';
  /** Main title */
  title?: string;
  /** Descriptive message */
  message?: string;
  /** Primary action handler */
  onAction?: () => void;
  /** Action button text */
  actionText?: string;
  /** Compact mode for inline empty states */
  compact?: boolean;
}

const EMPTY_VARIANTS = {
  sessions: {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "No Sessions Yet",
    message: "Log your first training session to start tracking your journey.",
    actionText: "Log Training",
  },
  techniques: {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="12" y1="6" x2="12" y2="12" />
        <line x1="9" y1="9" x2="15" y2="9" />
      </svg>
    ),
    title: "No Techniques",
    message: "Start building your personal technique library.",
    actionText: "Browse Techniques",
  },
  goals: {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "No Goals Set",
    message: "Set training goals to keep yourself motivated.",
    actionText: "Set a Goal",
  },
  search: {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "No Results",
    message: "Try adjusting your search or filters.",
    actionText: "Clear Filters",
  },
  generic: {
    icon: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: "Nothing Here",
    message: "Get started by adding your first item.",
    actionText: "Get Started",
  },
};

export function EmptyState({
  variant = 'generic',
  title,
  message,
  onAction,
  actionText,
  compact = false,
}: EmptyStateProps) {
  const config = EMPTY_VARIANTS[variant];

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-xs)',
          transform: 'scale(0.6)',
        }}>
          {config.icon}
        </div>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-500)',
          marginBottom: onAction ? 'var(--space-md)' : 0,
        }}>
          {message || config.message}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="btn btn-primary btn-sm"
          >
            {actionText || config.actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-3xl)',
      textAlign: 'center',
      minHeight: 400,
    }}>
      {/* Illustration */}
      <div style={{
        color: 'var(--color-gray-400)',
        marginBottom: 'var(--space-2xl)',
      }}>
        {config.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--color-white)',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {title || config.title}
      </h3>

      {/* Message */}
      <p style={{
        fontSize: '15px',
        color: 'var(--color-gray-400)',
        marginBottom: '32px',
        maxWidth: 280,
        lineHeight: 1.6,
      }}>
        {message || config.message}
      </p>

      {/* Action */}
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary btn-lg"
          style={{
            minWidth: 200,
            gap: 'var(--space-xs)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {actionText || config.actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

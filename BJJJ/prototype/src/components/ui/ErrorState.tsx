/**
 * ErrorState Component
 *
 * Displays error states with:
 * - Error icon and message
 * - Optional retry action
 * - Different variants for error types
 *
 * Designed for exhausted users - large touch targets, clear messaging
 */

interface ErrorStateProps {
  /** Type of error to display */
  variant?: 'network' | 'validation' | 'permission' | 'generic';
  /** Main error title */
  title?: string;
  /** Descriptive message */
  message?: string;
  /** Retry action handler */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
  /** Secondary action handler */
  onSecondaryAction?: () => void;
  /** Secondary action text */
  secondaryActionText?: string;
}

const ERROR_VARIANTS = {
  network: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 1l22 22" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    title: "No Connection",
    message: "Check your internet connection and try again.",
  },
  validation: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Invalid Input",
    message: "Please check your input and try again.",
  },
  permission: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Permission Required",
    message: "This feature requires additional permissions.",
  },
  generic: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
  },
};

export function ErrorState({
  variant = 'generic',
  title,
  message,
  onRetry,
  retryText = 'Try Again',
  onSecondaryAction,
  secondaryActionText,
}: ErrorStateProps) {
  const config = ERROR_VARIANTS[variant];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-3xl)',
      textAlign: 'center',
      minHeight: 300,
    }}>
      {/* Error Icon */}
      <div style={{
        color: 'var(--color-error)',
        marginBottom: 'var(--space-lg)',
        opacity: 0.9,
      }}>
        {config.icon}
      </div>

      {/* Error Title */}
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: 'var(--space-xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
      }}>
        {title || config.title}
      </h3>

      {/* Error Message */}
      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-600)',
        marginBottom: 'var(--space-2xl)',
        maxWidth: 280,
        lineHeight: 'var(--leading-normal)',
      }}>
        {message || config.message}
      </p>

      {/* Actions */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
        width: '100%',
        maxWidth: 240,
      }}>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              gap: 'var(--space-xs)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {retryText}
          </button>
        )}

        {onSecondaryAction && secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            className="btn btn-secondary"
            style={{
              width: '100%',
            }}
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;

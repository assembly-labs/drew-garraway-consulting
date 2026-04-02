/**
 * NotFound Component
 *
 * Displayed when user navigates to an invalid route or view.
 * Provides a clear message and navigation back to safety.
 */

interface NotFoundProps {
  /** Custom title (default: "Page Not Found") */
  title?: string;
  /** Custom message */
  message?: string;
  /** Callback to navigate home */
  onGoHome?: () => void;
}

export function NotFound({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  onGoHome,
}: NotFoundProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}
    >
      {/* 404 Display */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 900,
          color: 'var(--color-accent-text)',
          marginBottom: 'var(--space-md)',
          textShadow: '0 0 20px rgba(252, 211, 77, 0.3)',
        }}
      >
        404
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        {title}
      </h1>

      {/* Message */}
      <p
        style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-gray-600)',
          maxWidth: '400px',
          marginBottom: 'var(--space-lg)',
        }}
      >
        {message}
      </p>

      {/* Action Button */}
      {onGoHome && (
        <button
          onClick={onGoHome}
          aria-label="Return to dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            padding: 'var(--space-sm) var(--space-lg)',
            background: 'var(--color-accent-button)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '48px',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go to Dashboard
        </button>
      )}
    </div>
  );
}

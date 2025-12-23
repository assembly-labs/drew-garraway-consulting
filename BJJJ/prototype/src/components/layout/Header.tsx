/**
 * Header Component
 * App header with title and optional actions
 */

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({
  title = 'ALLY',
  showBackButton = false,
  onBack,
  rightAction
}: HeaderProps) {
  return (
    <header style={{
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      padding: 'var(--space-md) var(--space-lg)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {showBackButton && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-white)',
              cursor: 'pointer',
              padding: 'var(--space-xs)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 style={{
          fontSize: 'var(--text-xl)',
          margin: 0,
          letterSpacing: 'var(--tracking-wider)',
          fontWeight: 700,
        }}>
          {title}
        </h1>
      </div>
      {rightAction && (
        <div>{rightAction}</div>
      )}
    </header>
  );
}

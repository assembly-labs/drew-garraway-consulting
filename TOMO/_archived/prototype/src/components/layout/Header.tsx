/**
 * Header Component
 * App header with title and optional actions
 * Includes profile avatar in top-right for navigation to Profile screen
 * Shows demo mode indicator when viewing mock profiles
 */

import { useUserProfile } from '../../context/UserProfileContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  userInitial?: string;
  onProfileClick?: () => void;
}

// Map belt level to border color (black belt uses red per design system)
const getBeltBorderColor = (belt: string): string => {
  const colors: Record<string, string> = {
    white: 'var(--color-belt-white)',
    blue: 'var(--color-belt-blue)',
    purple: 'var(--color-belt-purple)',
    brown: 'var(--color-belt-brown)',
    black: 'var(--color-negative)', // Red for black belt (stands out on dark UI)
  };
  return colors[belt] || 'var(--color-gray-600)';
};

export function Header({
  title = 'TOMO',
  showBackButton = false,
  onBack,
  rightAction,
  userInitial,
  onProfileClick,
}: HeaderProps) {
  // Get profile and demo mode status
  const { profile, isDemoMode, activeDemoProfile, cycleToNextPersona } = useUserProfile();

  // Get belt color for avatar border
  const beltBorderColor = getBeltBorderColor(profile.belt);
  // Format persona key for display: "white-excelling" -> "W-EXCEL"
  const formatPersonaLabel = (key: string): string => {
    const [belt, status] = key.split('-');
    const beltLetter = belt.charAt(0).toUpperCase();
    const statusLabel = status === 'excelling' ? 'EXCEL'
      : status === 'at-risk' ? 'RISK'
      : status === 'average' ? 'AVG'
      : status.toUpperCase().slice(0, 5);
    return `${beltLetter}-${statusLabel}`;
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      paddingTop: 'calc(var(--space-md) + env(safe-area-inset-top))',
      paddingBottom: 'var(--space-md)',
      paddingLeft: 'var(--space-lg)',
      paddingRight: 'var(--space-lg)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: Back button or Demo button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minWidth: 80 }}>
        {showBackButton ? (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-white)',
              cursor: 'pointer',
              padding: '12px',
              margin: '-12px',
              marginRight: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: 'var(--radius-md)',
            }}
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={cycleToNextPersona}
            style={{
              backgroundColor: isDemoMode ? 'var(--color-accent)' : 'var(--color-gray-700)',
              color: isDemoMode ? 'var(--color-primary)' : 'var(--color-gray-300)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              minHeight: '32px',
              transition: 'background-color 0.15s ease',
            }}
            aria-label={isDemoMode ? `Current persona: ${activeDemoProfile?.key}. Tap to cycle to next persona.` : 'Enter demo mode'}
          >
            {isDemoMode && activeDemoProfile
              ? formatPersonaLabel(activeDemoProfile.key)
              : 'Demo'
            }
          </button>
        )}
      </div>

      {/* Center: TOMO logo */}
      <h1 style={{
        fontFamily: 'var(--font-logo)',
        fontSize: 'var(--text-xl)',
        margin: 0,
        letterSpacing: '0.05em',
        fontWeight: 'normal',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {title}
      </h1>

      {/* Right: Avatar and actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', minWidth: 80, justifyContent: 'flex-end' }}>
        {rightAction && (
          <div>{rightAction}</div>
        )}
        {userInitial && onProfileClick && (
          <button
            onClick={onProfileClick}
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-gray-800)',
              border: `3px solid ${beltBorderColor}`,
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              overflow: 'hidden',
              padding: 0,
            }}
            aria-label="Open profile"
          >
            {activeDemoProfile && 'avatarUrl' in activeDemoProfile && activeDemoProfile.avatarUrl ? (
              <img
                src={activeDemoProfile.avatarUrl}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              userInitial
            )}
          </button>
        )}
      </div>
    </header>
  );
}

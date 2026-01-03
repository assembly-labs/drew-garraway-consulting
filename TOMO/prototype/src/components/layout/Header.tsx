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
  title = 'ALLY',
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
              padding: '12px', /* Increased for 48px touch target */
              margin: '-12px', /* Offset to maintain visual position */
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
        )}
        <h1 style={{
          fontSize: 'var(--text-xl)',
          margin: 0,
          letterSpacing: 'var(--tracking-wider)',
          fontWeight: 700,
        }}>
          {title}
        </h1>
        {/* Demo Mode Badge - Tap to cycle through personas */}
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
            marginLeft: 'var(--space-sm)',
            border: 'none',
            cursor: 'pointer',
            minHeight: '32px',
            transition: 'background-color 0.15s ease',
          }}
          aria-label={isDemoMode ? `Current persona: ${activeDemoProfile?.key}. Tap to cycle to next persona.` : 'Enter demo mode'}
        >
          {isDemoMode && activeDemoProfile
            ? `Demo: ${activeDemoProfile.key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
            : 'Demo'
          }
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {rightAction && (
          <div>{rightAction}</div>
        )}
        {userInitial && onProfileClick && (
          <button
            onClick={onProfileClick}
            style={{
              width: 44, /* Minimum touch target */
              height: 44, /* Minimum touch target */
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
            {/* Show avatar image if available (from Persona), otherwise show initial */}
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

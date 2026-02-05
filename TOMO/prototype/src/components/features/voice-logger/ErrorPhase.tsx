/**
 * ErrorPhase - Save failure with retry
 *
 * Shown when session save fails. Offers retry and cancel actions.
 * User's data is preserved in parent state.
 */

import type { ErrorPhaseProps } from './types';

export function ErrorPhase({ onRetry, onCancel }: ErrorPhaseProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-negative)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        boxShadow: '0 0 0 15px rgba(239, 68, 68, 0.2), 0 0 0 30px rgba(239, 68, 68, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-white)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Couldn't Save
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-xl)',
      }}>
        Something went wrong. Your data is still here—try again.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button
          onClick={onRetry}
          style={{
            padding: 'var(--space-md) var(--space-xl)',
            backgroundColor: 'var(--color-gold)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-black)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: 'var(--space-md) var(--space-xl)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-gray-600)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-gray-400)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

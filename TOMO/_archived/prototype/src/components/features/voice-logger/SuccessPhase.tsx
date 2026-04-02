/**
 * SuccessPhase - Session saved confirmation
 *
 * Shows checkmark animation, session count, and belt-personalized message.
 * Auto-dismisses after 2 seconds (handled by parent).
 */

import type { SuccessPhaseProps } from './types';

export function SuccessPhase({ sessionCount, postSessionMessage }: SuccessPhaseProps) {
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
        backgroundColor: 'var(--color-positive)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        animation: 'scaleIn 0.3s ease-out',
        boxShadow: '0 0 0 15px rgba(34, 197, 94, 0.2), 0 0 0 30px rgba(34, 197, 94, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
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
        Session #{sessionCount} Logged
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
      }}>
        {postSessionMessage || "Keep showing up. Consistency compounds."}
      </p>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

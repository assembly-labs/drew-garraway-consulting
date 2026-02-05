/**
 * ProcessingPhase - AI extraction spinner
 *
 * Shown while voice recording is being processed.
 * Simple spinner with "Got It" / "Pulling out the details..." messaging.
 */

export function ProcessingPhase() {
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
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-full)',
        border: '3px solid var(--color-gray-700)',
        borderTopColor: 'var(--color-gold)',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 'var(--space-xl)',
      }} />

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        color: 'var(--color-white)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Got It
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
      }}>
        Pulling out the details...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

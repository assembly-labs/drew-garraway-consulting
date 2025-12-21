/**
 * SessionCard Component
 * Compact card showing session summary in history list
 */

export interface Session {
  id: string;
  date: string;
  time: string;
  trainingType: 'gi' | 'nogi' | 'openmat' | 'private' | 'competition';
  durationMinutes: number;
  techniques: string[];
  submissionsGiven: number;
  submissionsReceived: number;
  struggles: string[];
  injuries: { bodyPart: string; notes: string }[];
}

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
  isHighlighted?: boolean;
}

const trainingTypeLabels: Record<Session['trainingType'], string> = {
  gi: 'Gi',
  nogi: 'No-Gi',
  openmat: 'Open Mat',
  private: 'Private',
  competition: 'Competition',
};

export function SessionCard({ session, onClick, isHighlighted }: SessionCardProps) {
  const hasInjury = session.injuries.length > 0;
  const techniquePreview = session.techniques.length > 0
    ? session.techniques[0]
    : session.struggles.length > 0
    ? `Worked on: ${session.struggles[0]}`
    : 'Training session';

  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        width: '100%',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: isHighlighted ? '4px solid var(--color-accent)' : '4px solid transparent',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        padding: 'var(--space-md)',
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-gray-700)',
          }}>
            {session.time}
          </span>
          <span className={`training-badge training-${session.trainingType}`}>
            {trainingTypeLabels[session.trainingType]}
          </span>
        </div>
        <span style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-500)',
        }}>
          {session.durationMinutes} min
        </span>
      </div>

      {/* Technique Preview */}
      <div style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-800)',
        marginBottom: 'var(--space-sm)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {techniquePreview}
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        fontSize: 'var(--text-sm)',
      }}>
        {/* Submissions Given */}
        {session.submissionsGiven > 0 && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--color-success)',
          }}>
            <span style={{ fontWeight: 600 }}>✓</span>
            <span>{session.submissionsGiven}</span>
          </span>
        )}

        {/* Submissions Received */}
        {session.submissionsReceived > 0 && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--color-error)',
          }}>
            <span style={{ fontWeight: 600 }}>✗</span>
            <span>{session.submissionsReceived}</span>
          </span>
        )}

        {/* Injury indicator */}
        {hasInjury && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            color: 'var(--color-warning)',
            marginLeft: 'auto',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{session.injuries[0].bodyPart}</span>
          </span>
        )}

        {/* Chevron */}
        {onClick && (
          <span style={{
            marginLeft: hasInjury ? 0 : 'auto',
            color: 'var(--color-gray-400)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}

export default SessionCard;

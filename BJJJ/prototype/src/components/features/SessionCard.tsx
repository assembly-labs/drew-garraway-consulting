/**
 * SessionCard Component
 * Compact card showing session summary in history list
 *
 * Terminology (per Data Science Audit Dec 2024):
 * - "Subs given" = user tapped someone (positive)
 * - "Submitted by" = user got tapped (negative)
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
  workedWell?: string[];  // Things that went well
  sparringRounds?: number; // Number of sparring rounds
  lessonTopic?: string; // What did the coach teach?
  techniquesDrilled?: string[]; // What techniques were practiced?
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

// Tally mark component for session cards
function TallyMark({ count, color }: { count: number; color: string }) {
  if (count === 0) return null;

  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {/* Full groups of 5 */}
      {Array.from({ length: fullGroups }).map((_, i) => (
        <svg key={`g-${i}`} width="20" height="16" viewBox="0 0 20 16">
          <line x1="2" y1="2" x2="2" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="2" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="2" x2="10" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="2" x2="14" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="12" x2="16" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ))}
      {/* Remaining lines */}
      {remainder > 0 && (
        <svg width={remainder * 4 + 2} height="16" viewBox={`0 0 ${remainder * 4 + 2} 16`}>
          {Array.from({ length: remainder }).map((_, i) => (
            <line
              key={`l-${i}`}
              x1={2 + i * 4}
              y1="2"
              x2={2 + i * 4}
              y2="14"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </div>
  );
}

export function SessionCard({ session, onClick, isHighlighted }: SessionCardProps) {
  // Prefer lessonTopic, fallback to techniques/struggles
  const techniquePreview = session.lessonTopic
    ? session.lessonTopic
    : session.techniquesDrilled && session.techniquesDrilled.length > 0
    ? session.techniquesDrilled[0]
    : session.techniques.length > 0
    ? session.techniques[0]
    : session.struggles.length > 0
    ? `Worked on: ${session.struggles[0]}`
    : 'Training session';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: isHighlighted ? '4px solid var(--color-accent)' : '4px solid transparent',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-gray-900)',
        border: '1px solid var(--color-gray-800)',
        borderRadius: 'var(--radius-md)',
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.backgroundColor = 'var(--color-gray-900)';
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
            color: 'var(--color-gray-300)',
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
        color: 'var(--color-gray-200)',
        marginBottom: 'var(--space-sm)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {techniquePreview}
      </div>

      {/* Stats Row - Tally Marks */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        fontSize: 'var(--text-sm)',
      }}>
        {/* Subs Given - Tally */}
        {session.submissionsGiven > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}>
            <TallyMark count={session.submissionsGiven} color="var(--color-positive)" />
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              subs given
            </span>
          </div>
        )}

        {/* Submitted By - Tally */}
        {session.submissionsReceived > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}>
            <TallyMark count={session.submissionsReceived} color="var(--color-negative)" />
            <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
              caught
            </span>
          </div>
        )}

        {/* Chevron */}
        {onClick && (
          <span style={{
            marginLeft: 'auto',
            color: 'var(--color-gray-500)',
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

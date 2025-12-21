/**
 * SessionHistory Component
 * Displays list of past training sessions with ability to log new
 */

import { SessionCard, type Session } from './SessionCard';

// Mock session data
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    date: 'Today',
    time: '10:30 AM',
    trainingType: 'gi',
    durationMinutes: 90,
    techniques: ['Knee slice pass (far arm control)'],
    submissionsGiven: 1,
    submissionsReceived: 1,
    struggles: ['Half guard top — losing underhook'],
    injuries: [{ bodyPart: 'Left knee', notes: 'minor tightness' }],
  },
  {
    id: '2',
    date: 'Yesterday',
    time: '7:00 PM',
    trainingType: 'nogi',
    durationMinutes: 60,
    techniques: ['Single leg defense', 'Guillotine counters'],
    submissionsGiven: 2,
    submissionsReceived: 0,
    struggles: [],
    injuries: [],
  },
  {
    id: '3',
    date: 'Fri, Dec 19',
    time: '12:00 PM',
    trainingType: 'openmat',
    durationMinutes: 120,
    techniques: [],
    submissionsGiven: 3,
    submissionsReceived: 2,
    struggles: ['Mount escapes'],
    injuries: [],
  },
  {
    id: '4',
    date: 'Thu, Dec 18',
    time: '6:30 PM',
    trainingType: 'gi',
    durationMinutes: 90,
    techniques: ['Collar sleeve guard', 'Triangle setups'],
    submissionsGiven: 1,
    submissionsReceived: 1,
    struggles: [],
    injuries: [],
  },
  {
    id: '5',
    date: 'Tue, Dec 16',
    time: '7:00 PM',
    trainingType: 'nogi',
    durationMinutes: 75,
    techniques: ['Arm drag series', 'Back takes'],
    submissionsGiven: 2,
    submissionsReceived: 0,
    struggles: ['Maintaining back control'],
    injuries: [],
  },
];

interface SessionHistoryProps {
  onLogNew: () => void;
  onSelectSession?: (session: Session) => void;
}

export function SessionHistory({ onLogNew, onSelectSession }: SessionHistoryProps) {
  // Group sessions by date category
  const today = MOCK_SESSIONS.filter(s => s.date === 'Today');
  const yesterday = MOCK_SESSIONS.filter(s => s.date === 'Yesterday');
  const earlier = MOCK_SESSIONS.filter(s => s.date !== 'Today' && s.date !== 'Yesterday');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
    }}>
      {/* Header with Log Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ marginBottom: 'var(--space-xs)' }}>JOURNAL</h2>
          <p className="text-muted text-small">{MOCK_SESSIONS.length} sessions logged</p>
        </div>
        <button
          onClick={onLogNew}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          Log
        </button>
      </div>

      {/* Today */}
      {today.length > 0 && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            Today
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {today.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => onSelectSession?.(session)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Yesterday */}
      {yesterday.length > 0 && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            Yesterday
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {yesterday.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => onSelectSession?.(session)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Earlier */}
      {earlier.length > 0 && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            Earlier
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {earlier.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => onSelectSession?.(session)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {MOCK_SESSIONS.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-gray-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>No Sessions Yet</h3>
          <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
            Log your first training after class.
          </p>
          <button onClick={onLogNew} className="btn btn-primary">
            Log Training
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionHistory;

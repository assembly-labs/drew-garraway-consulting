/**
 * SessionHistory Component
 * Displays list of past training sessions with ability to log new
 */

import { SessionCard, type Session } from './SessionCard';
import { useBeltPersonalization } from '../../hooks';
import { mockJournalEntries, type JournalEntry } from '../../data/journal';

/**
 * Transform JournalEntry to Session display format
 */
function transformToSession(entry: JournalEntry): Session {
  const entryDate = new Date(entry.date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Format date display
  const isToday = entryDate.toDateString() === today.toDateString();
  const isYesterday = entryDate.toDateString() === yesterday.toDateString();

  let dateDisplay: string;
  if (isToday) {
    dateDisplay = 'Today';
  } else if (isYesterday) {
    dateDisplay = 'Yesterday';
  } else {
    dateDisplay = entryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // Count submissions from sparring rounds
  const submissionsGiven = entry.sparringRounds.filter(
    r => r.outcome === 'submission-win'
  ).length;
  const submissionsReceived = entry.sparringRounds.filter(
    r => r.outcome === 'submission-loss'
  ).length;

  // Extract struggles from notes that mention difficulties
  const struggles: string[] = [];
  if (entry.notes.toLowerCase().includes('caught') ||
      entry.notes.toLowerCase().includes('struggle') ||
      entry.notes.toLowerCase().includes('need to work')) {
    // Extract relevant struggle phrases from sparring rounds
    entry.sparringRounds
      .filter(r => r.outcome === 'submission-loss' && r.submissionType)
      .forEach(r => struggles.push(`Got caught in ${r.submissionType}`));
  }

  return {
    id: entry.id,
    date: dateDisplay,
    time: '7:00 PM', // Default time since JournalEntry doesn't store time
    trainingType: entry.type,
    durationMinutes: entry.duration,
    techniques: entry.techniques.map(t => t.techniqueName),
    submissionsGiven,
    submissionsReceived,
    struggles,
    sparringRounds: entry.sparringRounds.length,
  };
}

// Transform journal entries to sessions - single source of truth
const sessions: Session[] = mockJournalEntries.map(transformToSession);

interface SessionHistoryProps {
  onLogNew: () => void;
  onSelectSession?: (session: Session) => void;
}

export function SessionHistory({ onLogNew, onSelectSession }: SessionHistoryProps) {
  // Belt personalization for empty states
  const { profile: beltProfile } = useBeltPersonalization();

  // Belt-aware empty state messages
  const getEmptyStateMessage = () => {
    switch (beltProfile.belt) {
      case 'white':
        return "Log your first training after class. Every session counts on your journey.";
      case 'blue':
        return "Start building your training history. The patterns you track become the game you build.";
      case 'purple':
      case 'brown':
        return "Begin your session log. Tracking reveals patterns you might otherwise miss.";
      case 'black':
        return "Start your journal. Even at this level, documentation sharpens awareness.";
      default:
        return "Log your first training after class.";
    }
  };

  // Group sessions by date category
  const today = sessions.filter(s => s.date === 'Today');
  const yesterday = sessions.filter(s => s.date === 'Yesterday');
  const earlier = sessions.filter(s => s.date !== 'Today' && s.date !== 'Yesterday');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
      padding: 'var(--space-lg)',
    }}>
      {/* Header with Log Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ marginBottom: 'var(--space-xs)', color: 'var(--color-white)' }}>JOURNAL</h2>
          <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>{sessions.length} sessions logged</p>
        </div>
        <button
          onClick={onLogNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            fontWeight: 600,
            cursor: 'pointer',
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
      {sessions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          backgroundColor: 'var(--color-gray-900)',
          border: '1px solid var(--color-gray-800)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-gray-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-white)' }}>No Sessions Yet</h3>
          <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-400)' }}>
            {getEmptyStateMessage()}
          </p>
          <button
            onClick={onLogNew}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-lg)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Log Training
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionHistory;

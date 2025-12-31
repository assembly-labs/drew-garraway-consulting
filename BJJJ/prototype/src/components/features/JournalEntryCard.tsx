/**
 * JournalEntryCard Component
 *
 * Belt-adaptive card for displaying journal entries in the feed.
 * Shows only the data that was captured, with complexity scaling by belt level:
 *
 * WHITE BELT: date, type, duration, lesson topic, notes
 * BLUE BELT: + techniques drilled, sparring rounds, worked well/struggles
 * PURPLE+: + submissions given/received
 */

import { useBeltPersonalization } from '../../hooks';
import type { BeltLevel } from '../../types/database';

// ===========================================
// TYPES
// ===========================================

export interface JournalEntry {
  id: string;
  date: string;           // ISO date
  time: string | null;    // e.g., "18:30"
  training_type: 'gi' | 'nogi' | 'both';
  duration_minutes: number | null;

  // All belts
  lesson_topic: string | null;
  notes: string | null;

  // Blue+ belts
  techniques_drilled: string[];
  did_spar: boolean;
  sparring_rounds: number | null;
  worked_well: string[];
  struggles: string[];

  // Purple+ belts
  submissions_given: string[];
  submissions_received: string[];

  // Optional: for teaching tracking
  taught_something?: boolean;
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  onClick?: () => void;
}

// ===========================================
// HELPERS
// ===========================================

const trainingTypeLabels: Record<JournalEntry['training_type'], string> = {
  gi: 'Gi',
  nogi: 'No-Gi',
  both: 'Gi + No-Gi',
};

const trainingTypeColors: Record<JournalEntry['training_type'], string> = {
  gi: 'var(--color-blue-500, #3b82f6)',
  nogi: 'var(--color-purple-500, #a855f7)',
  both: 'var(--color-accent)',
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Determine what data level to show based on belt
function getDataLevel(belt: BeltLevel): 'basic' | 'intermediate' | 'advanced' {
  switch (belt) {
    case 'white':
      return 'basic';
    case 'blue':
      return 'intermediate';
    case 'purple':
    case 'brown':
    case 'black':
      return 'advanced';
    default:
      return 'basic';
  }
}

// ===========================================
// COMPONENT
// ===========================================

export function JournalEntryCard({ entry, onClick }: JournalEntryCardProps) {
  const { profile } = useBeltPersonalization();
  const dataLevel = getDataLevel(profile.belt);

  // Build headline: prefer lesson topic, fallback to first technique, fallback to "Training session"
  const headline = entry.lesson_topic
    || (entry.techniques_drilled.length > 0 ? entry.techniques_drilled[0] : null)
    || 'Training session';

  // For intermediate+, show additional techniques as count
  const additionalTechniques = entry.techniques_drilled.length > 1
    ? entry.techniques_drilled.length - 1
    : 0;

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-gray-900)',
        border: '1px solid var(--color-gray-800)',
        borderRadius: 'var(--radius-md)',
        transition: 'background-color 0.15s ease',
      }}
      onMouseOver={(e) => {
        if (onClick) e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-gray-900)';
      }}
    >
      {/* Row 1: Date + Type Badge + Duration */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xs)',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-gray-400)',
        }}>
          {formatDate(entry.date)}
        </span>

        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: `${trainingTypeColors[entry.training_type]}20`,
          color: trainingTypeColors[entry.training_type],
        }}>
          {trainingTypeLabels[entry.training_type]}
        </span>

        {entry.duration_minutes && (
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-gray-500)',
            marginLeft: 'auto',
          }}>
            {formatDuration(entry.duration_minutes)}
          </span>
        )}
      </div>

      {/* Row 2: Headline (lesson topic or technique) */}
      <div style={{
        fontSize: 'var(--text-base)',
        fontWeight: 500,
        color: 'var(--color-gray-100)',
        marginBottom: 'var(--space-xs)',
        lineHeight: 1.4,
      }}>
        {headline}
        {dataLevel !== 'basic' && additionalTechniques > 0 && (
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>
            {' '}+{additionalTechniques} more
          </span>
        )}
      </div>

      {/* Row 3: Sparring info (Blue+ only) */}
      {dataLevel !== 'basic' && entry.did_spar && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xs)',
        }}>
          {entry.sparring_rounds && (
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-400)',
            }}>
              {entry.sparring_rounds} round{entry.sparring_rounds !== 1 ? 's' : ''}
            </span>
          )}

          {/* Submissions (Purple+ only) */}
          {dataLevel === 'advanced' && (
            <>
              {entry.submissions_given.length > 0 && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-positive)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  {entry.submissions_given.length}
                </span>
              )}
              {entry.submissions_received.length > 0 && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-negative)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {entry.submissions_received.length}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Row 4: Worked Well / Struggles chips (Blue+ only) */}
      {dataLevel !== 'basic' && (entry.worked_well.length > 0 || entry.struggles.length > 0) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-xs)',
          marginTop: 'var(--space-sm)',
        }}>
          {entry.worked_well.slice(0, 2).map((item, i) => (
            <span
              key={`w-${i}`}
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: 'var(--color-positive)',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
          ))}
          {entry.struggles.slice(0, 2).map((item, i) => (
            <span
              key={`s-${i}`}
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--color-negative)',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Row 5: Notes preview (White belt, or if no other data shown) */}
      {dataLevel === 'basic' && entry.notes && (
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--color-gray-400)',
          marginTop: 'var(--space-xs)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {entry.notes}
        </div>
      )}

      {/* Chevron for clickable cards */}
      {onClick && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 'var(--space-sm)',
        }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gray-600)"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default JournalEntryCard;

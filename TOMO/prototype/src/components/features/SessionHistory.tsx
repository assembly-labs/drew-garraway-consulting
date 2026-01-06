/**
 * SessionHistory (Journal) Component
 *
 * Scrolling feed of saved journal entries with belt-adaptive cards.
 * Shows only the data that was captured, validated by the user.
 *
 * Card complexity scales by belt level:
 * - WHITE: date, type, duration, lesson topic, notes
 * - BLUE: + techniques drilled, sparring rounds, worked well/struggles
 * - PURPLE+: + submissions given/received
 */

import { useState, useMemo } from 'react';
import { JournalEntryCard, type JournalEntry } from './JournalEntryCard';
import { useBeltPersonalization } from '../../hooks';
import { mockJournalEntriesV2 } from '../../data/journal-entries';
import { Icons } from '../ui/Icons';

// ===========================================
// TYPES
// ===========================================

interface SessionHistoryProps {
  onLogNew: () => void;
  onSelectSession?: (entry: JournalEntry) => void;
}

type FilterType = 'all' | 'gi' | 'nogi';

// Maximum entries to display (prototype limit)
const MAX_VISIBLE_ENTRIES = 6;

// ===========================================
// HELPERS
// ===========================================

function groupEntriesByDate(entries: JournalEntry[]): Map<string, JournalEntry[]> {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groups = new Map<string, JournalEntry[]>();

  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    let groupKey: string;

    if (entryDate.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (entryDate.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else if (entryDate > lastWeek) {
      groupKey = 'This Week';
    } else {
      groupKey = 'Earlier';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(entry);
  });

  return groups;
}

// ===========================================
// COMPONENT
// ===========================================

export function SessionHistory({ onLogNew, onSelectSession }: SessionHistoryProps) {
  const { profile } = useBeltPersonalization();
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter entries by training type, then limit to MAX_VISIBLE_ENTRIES
  const filteredEntries = useMemo(() => {
    let entries = mockJournalEntriesV2;

    // Apply filter
    if (filter !== 'all') {
      entries = entries.filter((entry) => {
        if (filter === 'gi') return entry.training_type === 'gi' || entry.training_type === 'both';
        if (filter === 'nogi') return entry.training_type === 'nogi' || entry.training_type === 'both';
        return true;
      });
    }

    // Limit to 6 most recent (already sorted chronologically)
    return entries.slice(0, MAX_VISIBLE_ENTRIES);
  }, [filter]);

  // Check if there are more entries beyond visible
  const hasMoreEntries = mockJournalEntriesV2.length > MAX_VISIBLE_ENTRIES;

  // Group by date
  const groupedEntries = useMemo(
    () => groupEntriesByDate(filteredEntries),
    [filteredEntries]
  );

  // Belt-aware empty state messages
  const getEmptyStateMessage = () => {
    switch (profile.belt) {
      case 'white':
        return 'Log your first training. Every session counts on your journey.';
      case 'blue':
        return 'Start building your training history. The patterns you track become the game you build.';
      case 'purple':
      case 'brown':
        return 'Begin your session log. Tracking reveals patterns you might otherwise miss.';
      case 'black':
        return 'Start your journal. Even at this level, documentation sharpens awareness.';
      default:
        return 'Log your first training after class.';
    }
  };

  // Total stats
  const totalSessions = mockJournalEntriesV2.length;
  const totalRounds = mockJournalEntriesV2.reduce(
    (sum, e) => sum + (e.sparring_rounds || 0),
    0
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: 'var(--space-lg)',
          paddingBottom: 0,
        }}
      >
        {/* Full-Width Log Button */}
        <button
          onClick={onLogNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            width: '100%',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-black)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg) var(--space-md)',
            minHeight: '64px',
            fontWeight: 700,
            fontSize: 'var(--text-lg)',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Icons.Mic size={24} />
          Log Session
        </button>

        {/* Stats below button */}
        <p
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-gray-500)',
            textAlign: 'center',
            marginTop: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {totalSessions} session{totalSessions !== 1 ? 's' : ''} logged
          {totalRounds > 0 && ` · ${totalRounds} rounds`}
        </p>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          {(['all', 'gi', 'nogi'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor:
                  filter === f ? 'var(--color-white)' : 'var(--color-gray-800)',
                color:
                  filter === f ? 'var(--color-black)' : 'var(--color-gray-400)',
              }}
            >
              {f === 'all' ? 'All' : f === 'gi' ? 'Gi' : 'No-Gi'}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Feed */}
      <div
        style={{
          flex: 1,
          padding: '0 var(--space-lg)',
          paddingBottom: 'var(--space-2xl)',
        }}
      >
        {filteredEntries.length === 0 ? (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-2xl)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-gray-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-lg)',
              }}
            >
              <Icons.Mic size={28} color="var(--color-gray-500)" />
            </div>
            <h3
              style={{
                marginBottom: 'var(--space-sm)',
                color: 'var(--color-white)',
                fontWeight: 600,
              }}
            >
              No Sessions Yet
            </h3>
            <p
              style={{
                marginBottom: 'var(--space-lg)',
                color: 'var(--color-gray-400)',
                fontWeight: 500,
                fontSize: 'var(--text-sm)',
                lineHeight: 1.5,
              }}
            >
              {getEmptyStateMessage()}
            </p>
            <button
              onClick={onLogNew}
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-black)',
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
        ) : (
          /* Grouped Entries */
          <>
            {Array.from(groupedEntries.entries()).map(([groupName, entries]) => (
              <div key={groupName} style={{ marginBottom: 'var(--space-xl)' }}>
                {/* Group Label */}
                <h3
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-gray-500)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {groupName}
                </h3>

                {/* Entry Cards */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)',
                  }}
                >
                  {entries.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      entry={entry}
                      onClick={onSelectSession ? () => onSelectSession(entry) : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* See More Button (non-functional prototype affordance) */}
            {hasMoreEntries && (
              <button
                onClick={() => {
                  // Intentionally does nothing in prototype
                }}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  backgroundColor: 'var(--color-gray-900)',
                  border: '1px solid var(--color-gray-800)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  transition: 'all 0.15s ease',
                  marginTop: 'var(--space-md)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
                  e.currentTarget.style.borderColor = 'var(--color-gray-700)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-gray-900)';
                  e.currentTarget.style.borderColor = 'var(--color-gray-800)';
                }}
              >
                See More
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SessionHistory;

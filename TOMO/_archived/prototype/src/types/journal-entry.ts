/**
 * JournalEntry Type - V2 (CANONICAL)
 *
 * This is the canonical JournalEntry type for new development.
 * Belt-adaptive: complexity scales with user's belt level.
 *
 * WHITE BELT: date, type, duration, lesson_topic, notes
 * BLUE BELT: + techniques_drilled, sparring_rounds, worked_well, struggles
 * PURPLE+: + submissions_given, submissions_received
 *
 * USED BY:
 * - JournalEntryCard.tsx (display)
 * - SessionHistory.tsx (list view)
 * - journal-entries.ts (mock data)
 */

export interface JournalEntry {
  id: string;
  date: string;           // ISO date (YYYY-MM-DD)
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

/**
 * Type guard for checking if an object is a valid JournalEntry
 */
export function isJournalEntry(obj: unknown): obj is JournalEntry {
  if (!obj || typeof obj !== 'object') return false;
  const entry = obj as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    ['gi', 'nogi', 'both'].includes(entry.training_type as string) &&
    Array.isArray(entry.techniques_drilled) &&
    Array.isArray(entry.worked_well) &&
    Array.isArray(entry.struggles) &&
    Array.isArray(entry.submissions_given) &&
    Array.isArray(entry.submissions_received)
  );
}

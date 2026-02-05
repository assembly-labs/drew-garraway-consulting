/**
 * @deprecated Legacy journal types - DO NOT USE for new development.
 *
 * Use instead:
 * - JournalEntry from './journal-entry' (V2 canonical format)
 * - BeltColor, TrainingType from './database'
 * - UserProfile types from './database'
 *
 * This file is retained only for backward compatibility with components
 * that haven't migrated yet. All types here are re-exported from
 * types/index.ts with 'Legacy' prefix (e.g., LegacyJournalEntry).
 *
 * Migration: Replace imports from '@/types/journal' with '@/types/journal-entry'
 * and update field names (e.g., type → training_type, duration → duration_minutes).
 */

// Re-export from database.ts for backwards compatibility
export type { BeltColor, TrainingType } from './database';
import type { BeltColor, TrainingType } from './database';

export interface Technique {
  id: string;
  name: string;
  category: string;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  date: string; // ISO date string
  type: TrainingType;
  duration: number; // minutes
  techniques: Technique[];
  sparringRounds?: number;
  notes?: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  sessions: TrainingSession[];
  dailyReflection?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  belt: BeltColor;
  stripes: 0 | 1 | 2 | 3 | 4;
  startDate: string;
  academy?: string;
}

export interface JournalData {
  profile: UserProfile | null;
  entries: Record<string, JournalEntry>; // keyed by date
}

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

/**
 * Types Index
 *
 * Central export for all TypeScript types.
 * Import from '@/types' for clean access.
 */

// Database types (Supabase-ready) - primary types
export * from './database';

// Authentication types
export * from './auth';

// Technique video and recommendation types
export * from './techniqueVideos';

// Journal entry type (V2 - canonical)
export * from './journal-entry';

// Legacy journal types (for backward compatibility)
// Note: Some types have been superseded by database.ts and journal-entry.ts
// Use explicit imports if you need legacy types:
// import { TrainingSession, JournalData } from '@/types/journal';
export {
  // Renamed to avoid conflict with journal-entry.ts JournalEntry
  type JournalEntry as LegacyJournalEntry,
  type TrainingSession,
  type JournalData,
  // Renamed exports to avoid conflicts with database.ts
  type BeltColor as LegacyBeltColor,
  type TrainingType as LegacyTrainingType,
  type Technique as LegacyTechnique,
  type UserProfile as LegacyUserProfile,
} from './journal';

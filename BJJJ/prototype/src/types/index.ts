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

// Legacy journal types (for backward compatibility)
// Note: Some types have been superseded by database.ts
// Use explicit imports if you need legacy types:
// import { JournalEntry, TrainingSession } from '@/types/journal';
export {
  type JournalEntry,
  type TrainingSession,
  type JournalData,
  // Renamed exports to avoid conflicts with database.ts
  type BeltColor as LegacyBeltColor,
  type TrainingType as LegacyTrainingType,
  type Technique as LegacyTechnique,
  type UserProfile as LegacyUserProfile,
} from './journal';

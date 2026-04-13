/**
 * Session Logger — Shared Types
 *
 * Extracted from SessionLoggerScreen.tsx lines 103-144.
 * Shared by all phase components.
 */

import type { ViewStyle } from 'react-native';
import type { Submission } from '../../types/mvp-types';

// Re-export Submission so phase components only need to import from ./types
export type { Submission };

export type Phase = 'entry' | 'recording' | 'processing' | 'review' | 'success';

export interface EntryFields {
  trainingMode: 'gi' | 'nogi' | 'other';
  sessionKind: 'class' | 'open_mat' | 'competition_training' | 'other';
  durationMinutes: number;
  didSpar: boolean | null;
}

export interface ReviewFields {
  trainingMode: string;
  sessionKind: string;
  durationMinutes: number;
  didSpar: boolean;
  sparringRounds: number;
  techniquesDrilled: string[];
  lessonTopic: string;
  notes: string;
  instructor: string;
  warmedUp: boolean | null;
  submissionsGiven: Submission[];
  submissionsReceived: Submission[];
  injuries: string[];
}

// Pipeline timeout — bail out and fall through to manual review
export const PIPELINE_TIMEOUT_MS = 150_000; // 150 seconds

// ============================================
// PROMPTS (rotate above record button)
// ============================================

export const RECORDING_PROMPTS = [
  'What did you work on today?',
  'How was training?',
  'Any breakthroughs or struggles?',
  'What techniques did you drill?',
];

// Inline chip style override — 'auto' width is valid in RN flex layout but not
// in the StyleSheet type definitions, so we type it explicitly here once.
export const autoWidthChip: ViewStyle = { width: 'auto' as ViewStyle['width'], paddingHorizontal: 16 };

/**
 * Voice Logger - Shared Constants
 *
 * Constants used across voice logger phase components.
 */

import type { TrainingType, SubmissionCount } from '../../../types/database';

export const DURATION_OPTIONS = [
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '2 hrs' },
];

export const TRAINING_TYPE_OPTIONS: { value: TrainingType; label: string }[] = [
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
  { value: 'openmat', label: 'Open Mat' },
];

// Recent techniques (would come from user history in production)
export const RECENT_TECHNIQUES = [
  'Half guard',
  'Armbar',
  'Sweeps',
  'Guard passing',
  'Back takes',
  'Escapes',
];

// Mock extracted data (simulates AI processing)
// Uses SubmissionCount format: { name: string, count: number }
export const MOCK_EXTRACTED_DATA = {
  techniquesDrilled: ['Knee slice pass (far arm control)'],
  struggles: ['Half guard top - losing underhook'],
  sparringRounds: 5,
  submissionsGiven: [
    { name: 'Collar choke', count: 1 },
    { name: 'Armbar', count: 1 },
    { name: 'RNC', count: 1 },
  ] as SubmissionCount[],
  submissionsReceived: [
    { name: 'Triangle', count: 1 },
    { name: 'Kimura', count: 1 },
  ] as SubmissionCount[],
  notes: 'Knee feels a little tight but nothing serious',
};

// Default prompts for recording phase
export const DEFAULT_PROMPT_HINTS = [
  "What'd you work on?",
  "Any techniques click today?",
  "How'd rolling go?",
  "Tap to anything?",
  "Tap anyone out?",
  "What gave you trouble?",
];

// Mock session count
export const MOCK_SESSION_COUNT = 48;

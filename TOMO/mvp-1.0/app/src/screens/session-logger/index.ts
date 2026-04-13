/**
 * Session Logger — Barrel Export
 *
 * Re-exports all phase components, their prop interfaces, and shared types.
 */

export { EntryPhase } from './EntryPhase';
export type { EntryPhaseProps } from './EntryPhase';

export { RecordingPhase } from './RecordingPhase';
export type { RecordingPhaseProps } from './RecordingPhase';

export { ProcessingPhase } from './ProcessingPhase';
export type { ProcessingPhaseProps } from './ProcessingPhase';

export { ReviewPhase } from './ReviewPhase';
export type { ReviewPhaseProps } from './ReviewPhase';

export { SuccessPhase } from './SuccessPhase';
export type { SuccessPhaseProps } from './SuccessPhase';

export type { Phase, EntryFields, ReviewFields, Submission } from './types';
export { PIPELINE_TIMEOUT_MS, RECORDING_PROMPTS, autoWidthChip } from './types';

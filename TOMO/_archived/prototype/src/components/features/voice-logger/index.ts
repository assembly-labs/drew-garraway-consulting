/**
 * Voice Logger - Barrel Exports
 *
 * Phase components and shared types/constants for the voice-first session logger.
 */

export { EntryPhase } from './EntryPhase';
export { RecordingPhase } from './RecordingPhase';
export { ProcessingPhase } from './ProcessingPhase';
export { ReviewPhase } from './ReviewPhase';
export { SuccessPhase } from './SuccessPhase';
export { ErrorPhase } from './ErrorPhase';

export type { Phase, EntryPhaseProps, RecordingPhaseProps, ReviewPhaseProps, SuccessPhaseProps, ErrorPhaseProps } from './types';
export { DURATION_OPTIONS, TRAINING_TYPE_OPTIONS, RECENT_TECHNIQUES, MOCK_EXTRACTED_DATA, DEFAULT_PROMPT_HINTS, MOCK_SESSION_COUNT } from './constants';

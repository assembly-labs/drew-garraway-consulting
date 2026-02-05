/**
 * Voice Logger - Shared Types
 *
 * Type definitions shared across all voice logger phase components.
 */

import type { SessionData } from '../../../types/database';

export type Phase = 'entry' | 'recording' | 'processing' | 'review' | 'success' | 'error';

export interface EntryPhaseProps {
  sessionData: SessionData;
  updateField: <K extends keyof SessionData>(field: K, value: SessionData[K]) => void;
  sparringSelected: boolean | null;
  setSparringSelected: (value: boolean | null) => void;
  onRecord: () => void;
  onCancel?: () => void;
  onSave: () => void;
  isValid: boolean;
}

export interface RecordingPhaseProps {
  recordingTime: number;
  formatTime: (s: number) => string;
  onStop: () => void;
  onCancel: () => void;
  prompts: string[];
}

export interface ReviewPhaseProps {
  sessionData: SessionData;
  updateField: <K extends keyof SessionData>(field: K, value: SessionData[K]) => void;
  onSave: () => void;
  onReRecord: () => void;
  onCancel?: () => void;
  isValid: boolean;
}

export interface SuccessPhaseProps {
  sessionCount: number;
  postSessionMessage?: string;
}

export interface ErrorPhaseProps {
  onRetry: () => void;
  onCancel?: () => void;
}

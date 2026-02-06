export interface Transcription {
  id: string;
  text: string;
  timestamp: number;
  duration: number;
  copied: boolean;
}

export type RecordingState = 'idle' | 'recording' | 'processing';

export interface AudioRecorderHook {
  state: RecordingState;
  duration: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isSupported: boolean;
  permissionStatus: PermissionState | 'unknown';
  requestPermission: () => Promise<boolean>;
}

export interface TranscriptionResponse {
  text: string;
  error?: string;
}

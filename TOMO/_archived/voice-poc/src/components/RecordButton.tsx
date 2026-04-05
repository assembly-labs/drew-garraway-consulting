import type { RecordingState } from '../types';
import { MicrophoneIcon, StopIcon, SpinnerIcon } from './Icons';

interface RecordButtonProps {
  state: RecordingState;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function RecordButton({
  state,
  duration,
  onStart,
  onStop,
  disabled = false,
}: RecordButtonProps) {
  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const isIdle = state === 'idle';

  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else if (isIdle) {
      onStart();
    }
  };

  const buttonClass = `record-btn record-btn--${state}${isRecording ? ' animate-recording-glow' : ''}`;

  return (
    <section className="record-section">
      {isRecording && (
        <>
          <div className="record-timer animate-recording-pulse">
            {formatDuration(duration)}
          </div>
          <div className="record-status">Recording...</div>
        </>
      )}

      {isProcessing && (
        <div className="record-status">Transcribing...</div>
      )}

      <button
        className={buttonClass}
        onClick={handleClick}
        disabled={disabled || isProcessing}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isIdle && <MicrophoneIcon className="record-btn-icon" />}
        {isRecording && <StopIcon className="record-btn-icon" />}
        {isProcessing && <SpinnerIcon className="record-btn-icon animate-spin" />}
      </button>

      {isIdle && !isProcessing && (
        <span className="record-btn-label">Tap to record</span>
      )}
    </section>
  );
}

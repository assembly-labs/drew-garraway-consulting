import { MicrophoneOffIcon } from './Icons';

interface PermissionScreenProps {
  status: PermissionState | 'unknown';
  onRequest: () => void;
}

export function PermissionScreen({ status, onRequest }: PermissionScreenProps) {
  const isDenied = status === 'denied';

  return (
    <div className="permission-screen">
      <MicrophoneOffIcon className="permission-icon" />

      <h2 className="permission-title">
        {isDenied ? 'Microphone Access Blocked' : 'Microphone Access Needed'}
      </h2>

      <p className="permission-text">
        {isDenied
          ? 'Please enable microphone access in your browser settings to use voice recording.'
          : 'TOMO Voice needs microphone access to transcribe your training notes.'}
      </p>

      {!isDenied && (
        <button className="permission-btn" onClick={onRequest}>
          Enable Microphone
        </button>
      )}
    </div>
  );
}

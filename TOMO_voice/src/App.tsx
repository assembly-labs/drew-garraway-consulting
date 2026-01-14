import { useState, useCallback } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTranscriptions } from './hooks/useTranscriptions';
import { transcribeAudio } from './services/transcription';
import { RecordButton } from './components/RecordButton';
import { TranscriptionCard } from './components/TranscriptionCard';
import { Toast } from './components/Toast';
import { PermissionScreen } from './components/PermissionScreen';
import { MicrophoneIcon } from './components/Icons';
import type { RecordingState } from './types';

function App() {
  const {
    state: recorderState,
    duration,
    error: recorderError,
    startRecording,
    stopRecording,
    isSupported,
    permissionStatus,
    requestPermission,
  } = useAudioRecorder();

  const {
    transcriptions,
    addTranscription,
    markAsCopied,
  } = useTranscriptions();

  const [appState, setAppState] = useState<RecordingState>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [newestId, setNewestId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleStart = useCallback(async () => {
    await startRecording();
  }, [startRecording]);

  const handleStop = useCallback(async () => {
    setAppState('processing');

    const audioBlob = await stopRecording();

    if (!audioBlob) {
      setAppState('idle');
      showToast('No audio recorded');
      return;
    }

    try {
      const result = await transcribeAudio(audioBlob);

      if (result.error) {
        showToast(result.error);
        setAppState('idle');
        return;
      }

      if (!result.text || result.text.trim() === '') {
        showToast('No speech detected');
        setAppState('idle');
        return;
      }

      const id = addTranscription(result.text, duration);
      setNewestId(id);

      // Clear "new" highlight after a few seconds
      setTimeout(() => {
        setNewestId(null);
      }, 3000);
    } catch {
      showToast('Transcription failed. Please try again.');
    }

    setAppState('idle');
  }, [stopRecording, duration, addTranscription, showToast]);

  // Combine recorder state with app state (processing)
  const currentState: RecordingState =
    appState === 'processing' ? 'processing' : recorderState;

  // Show error toast from recorder
  if (recorderError && !toast) {
    showToast(recorderError);
  }

  // Not supported
  if (!isSupported) {
    return (
      <main className="app">
        <header className="app-header">
          <h1 className="app-title">TOMO Voice</h1>
        </header>
        <div className="permission-screen">
          <p className="permission-text">
            Audio recording is not supported in this browser.
            Please use a modern browser like Chrome, Safari, or Firefox.
          </p>
        </div>
      </main>
    );
  }

  // Permission not granted yet
  if (permissionStatus === 'denied' || permissionStatus === 'prompt') {
    return (
      <main className="app">
        <header className="app-header">
          <h1 className="app-title">TOMO Voice</h1>
        </header>
        <PermissionScreen status={permissionStatus} onRequest={requestPermission} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        )}
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">TOMO Voice</h1>
      </header>

      <section className="history-section">
        {transcriptions.length > 0 ? (
          <>
            <h2 className="history-label">History</h2>
            <div className="history-list">
              {transcriptions.map((t) => (
                <TranscriptionCard
                  key={t.id}
                  transcription={t}
                  isNew={t.id === newestId}
                  onCopy={markAsCopied}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="history-empty">
            <MicrophoneIcon className="history-empty-icon" />
            <p className="history-empty-text">
              Tap the button below to start recording your training notes
            </p>
          </div>
        )}
      </section>

      <RecordButton
        state={currentState}
        duration={duration}
        onStart={handleStart}
        onStop={handleStop}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </main>
  );
}

export default App;

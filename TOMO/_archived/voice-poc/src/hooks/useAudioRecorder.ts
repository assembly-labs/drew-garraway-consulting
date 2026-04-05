import { useState, useRef, useCallback, useEffect } from 'react';
import type { RecordingState } from '../types';

interface UseAudioRecorderReturn {
  state: RecordingState;
  duration: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isSupported: boolean;
  permissionStatus: PermissionState | 'unknown';
  requestPermission: () => Promise<boolean>;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'unknown'>('unknown');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const isSupported = typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices;

  // Check permission status on mount
  useEffect(() => {
    if (!isSupported) return;

    const checkPermission = async () => {
      try {
        // Try to query permission status (not supported in all browsers)
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionStatus(result.state);

          result.addEventListener('change', () => {
            setPermissionStatus(result.state);
          });
        }
      } catch {
        // Permission API not supported, will check on first use
        setPermissionStatus('unknown');
      }
    };

    checkPermission();
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just wanted to get permission
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setPermissionStatus('denied');
          setError('Microphone permission denied');
        } else {
          setError(`Microphone error: ${err.message}`);
        }
      }
      return false;
    }
  }, [isSupported]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser');
      return;
    }

    try {
      setError(null);

      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      streamRef.current = stream;
      setPermissionStatus('granted');

      // Determine best mime type (Safari uses mp4, others use webm)
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose
          }
        }
      }

      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        setError('Recording error occurred');
        setState('idle');
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();
      setState('recording');
      setDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
      }, 100);

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setPermissionStatus('denied');
          setError('Microphone permission denied');
        } else {
          setError(`Failed to start recording: ${err.message}`);
        }
      }
      setState('idle');
    }
  }, [isSupported]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        setState('idle');
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Create blob from chunks
        const chunks = chunksRef.current;
        if (chunks.length === 0) {
          setState('idle');
          resolve(null);
          return;
        }

        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: mimeType });

        chunksRef.current = [];
        setState('idle');
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  return {
    state,
    duration,
    error,
    startRecording,
    stopRecording,
    isSupported,
    permissionStatus,
    requestPermission,
  };
}

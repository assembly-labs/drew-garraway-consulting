/**
 * TOMO — Voice Recording Hook
 *
 * Wraps expo-audio for voice recording with BJJ-specific features:
 * - 90-second auto-stop (users are exhausted, keep it short)
 * - Microphone permission handling
 * - Recording state management
 * - Save to device file system
 *
 * USAGE:
 *   const {
 *     isRecording,
 *     isPaused,
 *     duration,
 *     permissionStatus,
 *     startRecording,
 *     stopRecording,
 *     cancelRecording,
 *     requestPermission,
 *     recordingUri,
 *   } = useVoiceRecorder();
 *
 * NOTES:
 * - Uses expo-audio (preferred). If expo-audio doesn't work at implementation
 *   time, swap to expo-av and update the imports.
 * - MUST be tested on a physical iPhone — simulator audio is unreliable.
 * - Recording format is AAC (smaller files than WAV).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
// expo-audio is the preferred library. If it doesn't work, swap to expo-av.
// See SHIP_PLAN.md Phase 2 notes.
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';

// ===========================================
// CONFIGURATION
// ===========================================

const MAX_DURATION_SECONDS = 90; // Auto-stop after 90 seconds
const TIMER_INTERVAL_MS = 100; // Update duration every 100ms

// ===========================================
// TYPES
// ===========================================

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface VoiceRecorderReturn {
  /** Whether the recorder is currently capturing audio */
  isRecording: boolean;
  /** Elapsed recording time in seconds (updates every 100ms) */
  duration: number;
  /** Duration formatted as "M:SS" */
  durationFormatted: string;
  /** Microphone permission status */
  permissionStatus: PermissionStatus;
  /** URI of the saved recording file (null until recording stops) */
  recordingUri: string | null;
  /** Whether the max duration was reached (auto-stopped) */
  wasAutoStopped: boolean;
  /** Start recording. Returns false if permission denied. */
  startRecording: () => Promise<boolean>;
  /** Stop recording and save the file. Returns the file URI. */
  stopRecording: () => Promise<string | null>;
  /** Cancel recording without saving */
  cancelRecording: () => Promise<void>;
  /** Request microphone permission (call before first recording) */
  requestPermission: () => Promise<PermissionStatus>;
  /** Reset state for a new recording */
  reset: () => void;
}

// ===========================================
// HOOK
// ===========================================

export function useVoiceRecorder(): VoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [wasAutoStopped, setWasAutoStopped] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // --- Permission ---

  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      const result: PermissionStatus = status.granted ? 'granted' : 'denied';
      setPermissionStatus(result);

      if (result === 'denied') {
        Alert.alert(
          'Microphone Access Needed',
          'TOMO needs microphone access to record your session notes. You can enable it in Settings.',
          [{ text: 'OK' }]
        );
      }

      return result;
    } catch (err) {
      console.error('Permission request failed:', err);
      setPermissionStatus('denied');
      return 'denied';
    }
  }, []);

  // Check permission on mount
  useEffect(() => {
    async function checkPermission() {
      try {
        const status = await AudioModule.getRecordingPermissionsAsync();
        setPermissionStatus(status.granted ? 'granted' : 'undetermined');
      } catch {
        // Permission check failed — will ask when user taps record
      }
    }
    checkPermission();
  }, []);

  // --- Timer ---

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setDuration(elapsed);

      // Auto-stop at max duration
      if (elapsed >= MAX_DURATION_SECONDS) {
        setWasAutoStopped(true);
        stopRecording();
      }
    }, TIMER_INTERVAL_MS);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // --- Recording Controls ---

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      // Check/request permission
      let perm = permissionStatus;
      if (perm !== 'granted') {
        perm = await requestPermission();
        if (perm !== 'granted') return false;
      }

      // Reset state
      setRecordingUri(null);
      setWasAutoStopped(false);
      setDuration(0);

      // Start recording
      await recorder.record();
      setIsRecording(true);
      startTimer();

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      setIsRecording(false);
      return false;
    }
  }, [permissionStatus, requestPermission, recorder, startTimer]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      stopTimer();

      const uri = await recorder.stop();
      setIsRecording(false);
      setRecordingUri(uri);

      return uri;
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsRecording(false);
      return null;
    }
  }, [recorder, stopTimer]);

  const cancelRecording = useCallback(async () => {
    try {
      stopTimer();
      await recorder.stop();
    } catch {
      // Recording may not have been started
    }
    setIsRecording(false);
    setDuration(0);
    setRecordingUri(null);
    setWasAutoStopped(false);
  }, [recorder, stopTimer]);

  const reset = useCallback(() => {
    setRecordingUri(null);
    setDuration(0);
    setWasAutoStopped(false);
    setIsRecording(false);
  }, []);

  // --- Formatted Duration ---

  const durationFormatted = formatTime(Math.floor(duration));

  return {
    isRecording,
    duration,
    durationFormatted,
    permissionStatus,
    recordingUri,
    wasAutoStopped,
    startRecording,
    stopRecording,
    cancelRecording,
    requestPermission,
    reset,
  };
}

// ===========================================
// HELPERS
// ===========================================

/** Format seconds as "M:SS" (e.g. 0:00, 1:23, 1:30) */
function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

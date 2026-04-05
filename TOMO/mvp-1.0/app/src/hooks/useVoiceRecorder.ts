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
 *     duration,
 *     durationFormatted,
 *     permissionStatus,
 *     recordingUri,
 *     wasAutoStopped,
 *     startRecording,
 *     stopRecording,
 *     cancelRecording,
 *     requestPermission,
 *     reset,
 *   } = useVoiceRecorder();
 *
 * NOTES:
 * - Uses expo-audio. MUST call prepareToRecordAsync() before record().
 * - MUST be tested on a physical iPhone — simulator audio is unreliable.
 * - Recording format is AAC (.m4a, smaller files than WAV).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { logger } from '../utils/logger';

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
  /** Delete a recording file after successful save */
  cleanupFile: (fileUri: string) => Promise<void>;
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
  const stopRecordingRef = useRef<() => Promise<string | null>>(async () => null);
  const stoppingRef = useRef(false);
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
        stopRecordingRef.current().catch((err) => {
          console.error('[Recorder] Auto-stop failed:', err);
        });
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
    // Guard: prevent double-start
    if (isRecording) {
      logger.warn('[Recorder] startRecording called while already recording');
      return false;
    }

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

      // Configure audio mode for recording on iOS
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // CRITICAL: Must prepare before recording. Without this, the native
      // AVAudioRecorder stays in "idle" state and record() silently no-ops.
      // The recording file is only created after prepareToRecord() succeeds.
      await recorder.prepareToRecordAsync();

      // Start recording
      recorder.record();

      setIsRecording(true);
      startTimer();
      logger.log('[Recorder] Recording started, URI will be:', recorder.uri);

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      setIsRecording(false);
      try { await AudioModule.setAudioModeAsync({ allowsRecording: false }); } catch {}
      return false;
    }
  }, [isRecording, permissionStatus, requestPermission, recorder, startTimer]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    // Guard: prevent double-stop (rapid taps, auto-stop + manual race)
    if (stoppingRef.current) {
      logger.warn('[Recorder] stopRecording called while already stopping');
      return null;
    }
    stoppingRef.current = true;

    try {
      stopTimer();

      await recorder.stop();
      const uri = recorder.uri ?? null;
      logger.log('[Recorder] Recording stopped, URI:', uri);

      if (!uri) {
        setIsRecording(false);
        return null;
      }

      // Verify the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      logger.log('[Recorder] File exists:', fileInfo.exists, 'size:', fileInfo.exists ? fileInfo.size : 0);

      if (!fileInfo.exists) {
        console.error('[Recorder] Recording file does not exist at:', uri);
        setIsRecording(false);
        return null;
      }

      // Copy to documentDirectory for persistence (cache files can be cleaned up)
      const filename = uri.split('/').pop() ?? `recording-${Date.now()}.m4a`;
      const safeUri = `${FileSystem.documentDirectory}${filename}`;
      try {
        await FileSystem.copyAsync({ from: uri, to: safeUri });
        logger.log('[Recorder] Copied to safe location:', safeUri);
      } catch (copyErr: any) {
        logger.warn('[Recorder] Copy to documents failed, using cache URI:', copyErr?.message);
        // Cache URI is still valid for immediate use
        setIsRecording(false);
        setRecordingUri(uri);
        await AudioModule.setAudioModeAsync({ allowsRecording: false });
        return uri;
      }

      setIsRecording(false);
      setRecordingUri(safeUri);

      // Reset audio mode after recording
      await AudioModule.setAudioModeAsync({
        allowsRecording: false,
      });

      return safeUri;
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsRecording(false);
      // Reset audio mode even on error (Bug 11)
      try { await AudioModule.setAudioModeAsync({ allowsRecording: false }); } catch {}
      return null;
    } finally {
      stoppingRef.current = false;
    }
  }, [recorder, stopTimer]);

  // Keep ref in sync so startTimer's auto-stop always calls the latest version
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  const cancelRecording = useCallback(async () => {
    try {
      stopTimer();
      await recorder.stop();
    } catch {
      // Recording may not have been started
    }
    // Reset audio mode so iOS releases the mic (Bug 11)
    try { await AudioModule.setAudioModeAsync({ allowsRecording: false }); } catch {}
    setIsRecording(false);
    setDuration(0);
    setRecordingUri(null);
    setWasAutoStopped(false);
    stoppingRef.current = false;
  }, [recorder, stopTimer]);

  const reset = useCallback(() => {
    setRecordingUri(null);
    setDuration(0);
    setWasAutoStopped(false);
    setIsRecording(false);
  }, []);

  /** Delete a recording file from documentDirectory after successful save (Bug 12) */
  const cleanupFile = useCallback(async (fileUri: string) => {
    if (!fileUri) return;
    try {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      logger.log('[Recorder] Cleaned up file:', fileUri);
    } catch {
      // Best effort — file may already be gone
    }
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
    cleanupFile,
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

/**
 * Session Logger — Full voice pipeline
 *
 * 5 phases ported from prototype's VoiceFirstLogger.tsx:
 *   Entry → Recording → Processing → Review → Success
 *
 * Entry: Training mode, session kind, duration, sparring toggle
 * Recording: Pulsing mic, timer, stop button
 * Processing: Loading animation while transcribe + extract
 * Review: Editable form with all extracted fields
 * Success: Belt-personalized message, auto-dismiss
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Animated,
  type ViewStyle,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { sessionService, audioService, edgeFunctions, profileService } from '../services/supabase';
import { offlineQueue } from '../services/offline-queue';
import * as Crypto from 'expo-crypto';
import type { ExtractionResult, ExtractionResponse, TrainingMode, SessionKind } from '../types/mvp-types';
import { haptics } from '../utils/haptics';
import { logger } from '../utils/logger';
import { userGymService } from '../services/userGymService';
import { GymPickerSheet } from '../components/GymPickerSheet';
import type { SelectedGym } from '../components/GymSearchInput';
import { maybeTriggerWeeklyInsight } from '../services/insight-trigger';
import { useInsightsBadge } from '../hooks/useInsightsBadge';
import {
  EntryPhase,
  RecordingPhase,
  ProcessingPhase,
  ReviewPhase,
  type Phase,
  type EntryFields,
  type ReviewFields,
  PIPELINE_TIMEOUT_MS,
} from './session-logger';

// ============================================
// MAIN COMPONENT
// ============================================

export function SessionLoggerScreen() {
  const navigation = useNavigation();
  const { profile, refreshProfile } = useAuth();
  const voiceRecorder = useVoiceRecorder();
  const { showToast } = useToast();
  const { checkForUnread } = useInsightsBadge();

  const prefersVoice = profile?.logging_preference === 'voice';
  const [phase, setPhase] = useState<Phase>(prefersVoice ? 'recording' : 'entry');
  const [skippedEntry, setSkippedEntry] = useState(prefersVoice); // Bug 6: track if user actually filled in entry
  const [entry, setEntry] = useState<EntryFields>({
    trainingMode: 'gi',
    sessionKind: 'class',
    durationMinutes: 90,
    didSpar: null,
  });

  // Auto-start recording when voice preference skips entry phase (Bug 14: stable dep)
  const autoStarted = useRef(false);
  const { startRecording: startRec } = voiceRecorder;
  useEffect(() => {
    if (prefersVoice && !autoStarted.current) {
      autoStarted.current = true;
      startRec().then((started) => {
        if (started) {
          haptics.medium();
          setInputMethod('voice');
        } else {
          // Mic permission denied or error — fall back to entry
          setPhase('entry');
        }
      });
    }
  }, [prefersVoice, startRec]);
  const [review, setReview] = useState<ReviewFields>({
    trainingMode: 'gi',
    sessionKind: 'class',
    durationMinutes: 90,
    didSpar: false,
    sparringRounds: 0,
    techniquesDrilled: [],
    lessonTopic: '',
    notes: '',
    instructor: '',
    warmedUp: null,
    submissionsGiven: [],
    submissionsReceived: [],
    injuries: [],
  });
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('voice');
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [voiceSessionId, setVoiceSessionId] = useState<string | null>(null);
  const [pipelineSucceeded, setPipelineSucceeded] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null); // Bug 16
  const [extractionError, setExtractionError] = useState<string | null>(null); // Bug 16
  const [extractionModel, setExtractionModel] = useState<string | null>(null); // Bug 17
  const [schemaVersion, setSchemaVersion] = useState<number | undefined>(undefined); // Bug 17

  // Refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const processingRef = useRef(false); // Bug 2: prevent double pipeline
  const savingRef = useRef(false); // Bug 4: prevent double save
  const rawExtractionRef = useRef<ExtractionResult | null>(null); // Bug 18: track edits
  const needsResetRef = useRef(false); // Set true after save, triggers full reset on next focus
  const primaryGymIdRef = useRef<string | null>(null); // Gym stamp for sessions
  const [primaryGymName, setPrimaryGymName] = useState<string | null>(null);
  const [gymOverride, setGymOverride] = useState<SelectedGym | null>(null);
  const [showGymPicker, setShowGymPicker] = useState(false);

  // Derived gym state for display
  const effectiveGymName = gymOverride?.name ?? primaryGymName ?? profile?.gym_name ?? null;
  const isGymOverridden = gymOverride !== null;

  // Fetch primary gym on mount (non-blocking)
  useEffect(() => {
    userGymService.getPrimary().then((gym) => {
      primaryGymIdRef.current = gym?.id ?? null;
      setPrimaryGymName(gym?.gym_name ?? null);
    }).catch(() => {}); // Non-critical — session saves fine without it
  }, []);


  // Reset form when screen regains focus after a completed session.
  // Uses needsResetRef (set in handleSave) instead of checking phase state,
  // because setPhase('entry') in resetAndGoBack may not flush before
  // the component loses focus during navigation. The ref is synchronous
  // and immune to React's batching, so it's always reliable.
  // Active phases (recording/processing/review) are never affected —
  // needsResetRef is only set after a successful save.
  //
  // IMPORTANT: Always resets to 'entry' phase regardless of voice preference.
  // Previously this set phase to 'recording' for voice users, which caused
  // the recording screen to reappear after save (AUTH-002 regression).
  // Users can tap Record from the entry form when ready for their next session.
  // autoStarted is NOT reset here — it's only reset in resetAndGoBack so the
  // auto-start effect doesn't fire during focus transitions.
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useFocusEffect(
    useCallback(() => {
      if (needsResetRef.current) {
        needsResetRef.current = false;
        // Full state reset — always to 'entry' phase (never 'recording')
        phaseRef.current = 'entry';
        setPhase('entry');
        setSkippedEntry(false);
        setEntry({ trainingMode: 'gi', sessionKind: 'class', durationMinutes: 90, didSpar: null });
        setReview({
          trainingMode: 'gi', sessionKind: 'class', durationMinutes: 90,
          didSpar: false, sparringRounds: 0, techniquesDrilled: [],
          lessonTopic: '', notes: '', instructor: '', warmedUp: null,
          submissionsGiven: [], submissionsReceived: [], injuries: [],
        });
        setTranscript('');
        setAudioPath(null);
        setVoiceSessionId(null);
        setPipelineSucceeded(false);
        setSaving(false);
        savingRef.current = false;
        setTranscriptionError(null);
        setExtractionError(null);
        setExtractionModel(null);
        setSchemaVersion(undefined);
        setGymOverride(null);
        setShowGymPicker(false);
        rawExtractionRef.current = null;
        processingRef.current = false;
        voiceRecorder.reset();
      }
    }, [voiceRecorder])
  );

  useEffect(() => {
    if (phase === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [phase, pulseAnim]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleStartRecording = useCallback(async () => {
    setSkippedEntry(false); // Bug 6: user went through entry phase
    const started = await voiceRecorder.startRecording();
    if (started) {
      haptics.medium();
      setPhase('recording');
      setInputMethod('voice');
    }
  }, [voiceRecorder]);

  const handleStopRecording = useCallback(async () => {
    // Bug 2: prevent double pipeline from rapid stop taps
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      haptics.medium();
      const uri = await voiceRecorder.stopRecording();
      if (!uri) {
        showToast('Recording failed. Try typing instead.', 'error');
        setPhase('entry');
        return;
      }
      setPhase('processing');

      const sessionId = Crypto.randomUUID();
      setVoiceSessionId(sessionId);

      // Bug 9: wrap pipeline in a timeout so the user isn't stuck forever
      const pipelineWork = async () => {
        logger.log('[Pipeline] Recording URI:', uri);

        // Upload audio to private bucket
        logger.log('[Pipeline] Uploading audio...');
        const uploadedPath = await audioService.upload(sessionId, uri);
        logger.log('[Pipeline] Audio uploaded:', uploadedPath);

        // Transcribe via Edge Function
        if (!uploadedPath) throw new Error('Audio upload failed');
        setAudioPath(uploadedPath);
        logger.log('[Pipeline] Step 2: Transcribing audio...');
        const transcriptionResult = await edgeFunctions.transcribe(uploadedPath);
        logger.log('[Pipeline] Step 2 done. Success:', transcriptionResult?.success, 'Has transcript:', !!transcriptionResult?.transcript);
        if (transcriptionResult?.error) {
          setTranscriptionError(transcriptionResult.error); // Bug 16
          console.error('[Pipeline] Transcription error detail:', transcriptionResult.error);
        }
        if (!transcriptionResult?.transcript) {
          throw new Error(`Transcription returned empty: ${transcriptionResult?.error || 'no error detail'}`);
        }
        setTranscript(transcriptionResult.transcript);

        // Bug 6: only pass pre-selected values if user actually filled in the entry form
        const preSelected = skippedEntry ? undefined : {
          mode: entry.trainingMode,
          kind: entry.sessionKind,
          duration: entry.durationMinutes,
          spar: entry.didSpar ?? undefined,
        };

        // Extract structured data via Edge Function
        logger.log('[Pipeline] Step 3: Extracting...');
        const extractionResult = await edgeFunctions.extract(
          transcriptionResult.transcript,
          preSelected,
        );
        logger.log('[Pipeline] Step 3 done. Success:', extractionResult?.success);
        if (extractionResult?.error) {
          setExtractionError(extractionResult.error); // Bug 16
          console.error('[Pipeline] Extraction error:', extractionResult.error);
        }
        // Bug 17: capture extraction metadata
        if (extractionResult?.metadata) {
          setExtractionModel(extractionResult.metadata.model);
          setSchemaVersion(extractionResult.metadata.schema_version);
        }

        // Merge extraction with entry fields
        const didExtract = extractionResult?.success && extractionResult?.data;
        setPipelineSucceeded(!!didExtract);
        applyExtraction(extractionResult?.data ?? null);
        if (!didExtract) {
          showToast('AI extraction failed — fill in fields manually.', 'warning');
        }
        setPhase('review');
      };

      // Bug 9: race the pipeline against a timeout
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Pipeline timed out after 150 seconds')), PIPELINE_TIMEOUT_MS);
      });

      try {
        await Promise.race([pipelineWork(), timeoutPromise]);
      } catch (error: any) {
        const msg = error?.message ?? String(error);
        console.error('[Pipeline] Error:', msg);
        setPipelineSucceeded(false);
        // Capture error metadata for the stage that failed
        if (msg.includes('upload')) {
          setTranscriptionError(`Upload failed: ${msg}`);
        } else if (msg.includes('Transcription') || msg.includes('transcri')) {
          setTranscriptionError(msg);
        } else if (msg.includes('Extract') || msg.includes('extract')) {
          setExtractionError(msg);
        } else {
          setTranscriptionError(msg); // default to transcription stage
        }
        showToast(`Voice processing failed: ${msg.slice(0, 80)}`, 'warning');
        applyExtraction(null);
        setPhase('review');
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    } finally {
      processingRef.current = false;
    }
  }, [voiceRecorder, entry, skippedEntry, showToast]);

  const handleTextOnly = useCallback(() => {
    setInputMethod('text');
    setReview((prev) => ({
      ...prev,
      trainingMode: entry.trainingMode,
      sessionKind: entry.sessionKind,
      durationMinutes: entry.durationMinutes,
      didSpar: entry.didSpar ?? false,
      injuries: ['None'], // Default "None" for text-only flow too
    }));
    setPhase('review');
  }, [entry]);

  const applyExtraction = (data: ExtractionResult | null) => {
    rawExtractionRef.current = data; // Bug 18: store for edited_after_ai comparison
    setReview({
      trainingMode: data?.trainingMode ?? entry.trainingMode,
      sessionKind: data?.sessionKind ?? entry.sessionKind,
      durationMinutes: data?.durationMinutes ?? entry.durationMinutes,
      didSpar: data?.didSpar ?? entry.didSpar ?? false,
      sparringRounds: data?.sparringRounds ?? 0,
      techniquesDrilled: data?.techniquesDrilled ?? [],
      lessonTopic: data?.lessonTopic ?? '',
      notes: data?.rawNotes ?? '',
      instructor: data?.instructor ?? '',
      warmedUp: data?.warmedUp ?? null,
      submissionsGiven: data?.submissionsGiven ?? [], // Bug 7
      submissionsReceived: data?.submissionsReceived ?? [], // Bug 7
      injuries: (data?.injuries && data.injuries.length > 0) ? data.injuries : ['None'], // Default "None" when no injuries detected
    });
  };

  const handleSave = useCallback(async () => {
    // Bug 4: synchronous guard against double-tap
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    try {
      const now = new Date();
      // Bug 19: clamp duration to reasonable range
      const clampedDuration = Math.max(1, Math.min(480, review.durationMinutes));

      // Bug 18: detect if user edited AI extraction
      const raw = rawExtractionRef.current;
      const wasEdited = raw ? (
        review.trainingMode !== (raw.trainingMode ?? entry.trainingMode) ||
        review.sessionKind !== (raw.sessionKind ?? entry.sessionKind) ||
        review.durationMinutes !== (raw.durationMinutes ?? entry.durationMinutes) ||
        review.notes !== (raw.rawNotes ?? '') ||
        review.lessonTopic !== (raw.lessonTopic ?? '')
      ) : false;

      const sessionInsert: any = {
        date: now.toISOString().split('T')[0],
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        training_mode: review.trainingMode as TrainingMode,
        session_kind: review.sessionKind as SessionKind,
        duration_minutes: clampedDuration, // Bug 19
        did_spar: review.didSpar,
        sparring_rounds: review.sparringRounds ?? null,
        techniques_drilled: review.techniquesDrilled,
        submissions_given: review.submissionsGiven, // Bug 7
        submissions_received: review.submissionsReceived, // Bug 7
        injuries: review.injuries.filter((inj) => inj.toLowerCase() !== 'none'), // Strip "None" placeholder before save
        instructor: review.instructor || null,
        warmed_up: review.warmedUp,
        lesson_topic: review.lessonTopic || null,
        notes: review.notes || null,
        transcript: transcript || null,
        input_method: inputMethod,
        transcription_status: inputMethod === 'voice'
          ? (pipelineSucceeded ? 'completed' : 'failed')
          : 'skipped',
        extraction_status: inputMethod === 'voice'
          ? (pipelineSucceeded ? 'completed' : 'failed')
          : 'skipped',
        audio_path: audioPath || null,
        transcription_error: transcriptionError, // Bug 16
        extraction_error: extractionError, // Bug 16
        extraction_model: extractionModel, // Bug 17
        schema_version: schemaVersion, // Bug 17
        edited_after_ai: wasEdited, // Bug 18
        user_gym_id: primaryGymIdRef.current, // Gym history stamp — may be overridden below
      };

      // If gym was overridden (drop-in), create user_gyms entry and use its ID
      if (gymOverride) {
        try {
          const dropIn = await userGymService.addDropIn(gymOverride);
          if (dropIn) sessionInsert.user_gym_id = dropIn.id;
        } catch {
          // Non-critical — session still saves with primary gym or null
        }
      }
      // Use the same session ID that was used for audio upload
      if (voiceSessionId) {
        sessionInsert.id = voiceSessionId;
      }
      const created = await sessionService.create(sessionInsert);
      if (!created) throw new Error('Failed to save session');

      // P2-010: if voice pipeline failed and local file still exists, queue for retry.
      // The session record now exists, so processQueue() can update it when connectivity returns.
      const shouldQueueRetry = inputMethod === 'voice' && !pipelineSucceeded && !!voiceRecorder.recordingUri;
      if (shouldQueueRetry) {
        await offlineQueue.enqueue({
          sessionId: created.id,
          fileUri: voiceRecorder.recordingUri!,
          entry: {
            trainingMode: review.trainingMode,
            sessionKind: review.sessionKind,
            durationMinutes: clampedDuration,
            didSpar: review.didSpar,
          },
        });
        // Do NOT clean up the local file — the queue needs it for retry
      } else if (voiceRecorder.recordingUri) {
        // Bug 12: clean up local audio file after successful pipeline save
        voiceRecorder.cleanupFile(voiceRecorder.recordingUri);
      }

      // Update session count on profile (best-effort, don't block save)
      try {
        const count = await sessionService.getCount();
        if (count > 0) {
          await profileService.update({ session_count: count });
        }
      } catch {
        // Non-critical — count will be stale until next refresh
      }
      await refreshProfile();
      haptics.success();

      // Fire-and-forget: check if eligible for weekly insight generation,
      // then update the badge dot when the insight row lands
      maybeTriggerWeeklyInsight(profile)
        .then(() => checkForUnread())
        .catch(() => {});

      resetAndGoBack();
    } catch (error) {
      console.error('Save error:', error);
      haptics.error();
      showToast('Could not save your session. Please try again.', 'error');
      setSaving(false);
      savingRef.current = false; // Allow retry after error
    }
  }, [review, transcript, inputMethod, audioPath, voiceSessionId, pipelineSucceeded,
      transcriptionError, extractionError, extractionModel, schemaVersion,
      entry, voiceRecorder, refreshProfile, showToast, checkForUnread]);

  const resetAndGoBack = () => {
    // Clear the reset flag — we're handling the reset right here
    needsResetRef.current = false;
    phaseRef.current = 'entry';
    setPhase('entry');
    setSkippedEntry(false);
    setEntry({ trainingMode: 'gi', sessionKind: 'class', durationMinutes: 90, didSpar: null });
    setReview({
      trainingMode: 'gi', sessionKind: 'class', durationMinutes: 90,
      didSpar: false, sparringRounds: 0, techniquesDrilled: [],
      lessonTopic: '', notes: '', instructor: '', warmedUp: null,
      submissionsGiven: [], submissionsReceived: [], injuries: [],
    });
    setTranscript('');
    setAudioPath(null);
    setVoiceSessionId(null);
    setPipelineSucceeded(false);
    setSaving(false);
    savingRef.current = false;
    setTranscriptionError(null);
    setExtractionError(null);
    setExtractionModel(null);
    setSchemaVersion(undefined);
    setGymOverride(null);
    setShowGymPicker(false);
    rawExtractionRef.current = null;
    processingRef.current = false;
    voiceRecorder.reset();
    // Re-enable voice auto-start for next LogTab visit
    autoStarted.current = false;
    // Navigate to JournalList explicitly — without { screen: 'JournalList' },
    // the JournalStack might still show a SessionDetail from a previous view,
    // which makes it look like you can't log a new session.
    (navigation as any).navigate('JournalTab', { screen: 'JournalList' });
  };

  const handleCancelRecording = useCallback(async () => {
    // Use cancelRecording() — NOT stopRecording() + reset().
    // cancelRecording() skips file copy/persistence, resets audio mode,
    // and calls recorder.stop() directly (bypasses stoppingRef guard,
    // so it works even if auto-stop is racing).
    await voiceRecorder.cancelRecording();
    // Reset to entry phase
    setPhase('entry');
    setSkippedEntry(false);
    // Re-enable voice auto-start so it works if they re-enter recording
    autoStarted.current = false;
  }, [voiceRecorder]);

  // ============================================
  // RENDER PHASES
  // ============================================

  if (phase === 'entry') {
    return (
      <>
        <EntryPhase
          entry={entry}
          setEntry={setEntry}
          onRecord={handleStartRecording}
          onTextOnly={handleTextOnly}
          onCancel={() => (navigation as any).navigate('JournalTab', { screen: 'JournalList' })}
          gymName={effectiveGymName}
          isGymOverridden={isGymOverridden}
          onGymPress={() => setShowGymPicker(true)}
          onGymReset={() => setGymOverride(null)}
        />
        <GymPickerSheet
          visible={showGymPicker}
          onSelect={(gym) => { setGymOverride(gym); setShowGymPicker(false); }}
          onClose={() => setShowGymPicker(false)}
        />
      </>
    );
  }

  if (phase === 'recording') {
    return (
      <RecordingPhase
        duration={voiceRecorder.durationFormatted}
        pulseAnim={pulseAnim}
        onStop={handleStopRecording}
        onCancel={handleCancelRecording}
        gymName={effectiveGymName}
      />
    );
  }

  if (phase === 'processing') {
    return <ProcessingPhase onCancel={() => {
      setPipelineSucceeded(false);
      applyExtraction(null);
      setPhase('review');
    }} />;
  }

  if (phase === 'review') {
    return (
      <>
        <ReviewPhase
          review={review}
          setReview={setReview}
          transcript={transcript}
          saving={saving}
          onSave={handleSave}
          onCancel={resetAndGoBack}
          gymName={effectiveGymName}
          isGymOverridden={isGymOverridden}
          onGymPress={() => setShowGymPicker(true)}
          onGymReset={() => setGymOverride(null)}
        />
        <GymPickerSheet
          visible={showGymPicker}
          onSelect={(gym) => { setGymOverride(gym); setShowGymPicker(false); }}
          onClose={() => setShowGymPicker(false)}
        />
      </>
    );
  }

  return null;
}

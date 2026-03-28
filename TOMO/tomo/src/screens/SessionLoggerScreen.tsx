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
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, touchTargets, fontSizes } from '../config/design-tokens';
import { Icons } from '../components/Icons';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { sessionService, audioService, edgeFunctions, profileService } from '../services/supabase';
import { offlineQueue } from '../services/offline-queue';
import * as Crypto from 'expo-crypto';
import type { ExtractionResult, ExtractionResponse, TrainingMode, SessionKind, Submission } from '../types/mvp-types';
import { haptics } from '../utils/haptics';
import { logger } from '../utils/logger';
import { TECHNIQUE_SUGGESTIONS, SUBMISSION_SUGGESTIONS } from '../data/bjj-dictionary';
import { userGymService } from '../services/userGymService';
import { GymChip, GymLabel } from '../components/GymChip';
import { GymPickerSheet } from '../components/GymPickerSheet';
import type { SelectedGym } from '../components/GymSearchInput';

// ============================================
// TYPES
// ============================================

type Phase = 'entry' | 'recording' | 'processing' | 'review' | 'success';

interface EntryFields {
  trainingMode: 'gi' | 'nogi' | 'other';
  sessionKind: 'class' | 'open_mat' | 'competition_training' | 'other';
  durationMinutes: number;
  didSpar: boolean | null;
}

interface ReviewFields {
  trainingMode: string;
  sessionKind: string;
  durationMinutes: number;
  didSpar: boolean;
  sparringRounds: number;
  techniquesDrilled: string[];
  lessonTopic: string;
  notes: string;
  instructor: string;
  warmedUp: boolean | null;
  submissionsGiven: Submission[];
  submissionsReceived: Submission[];
  injuries: string[];
}

// Pipeline timeout — bail out and fall through to manual review
const PIPELINE_TIMEOUT_MS = 150_000; // 150 seconds

// ============================================
// PROMPTS (rotate above record button)
// ============================================

const RECORDING_PROMPTS = [
  'What did you work on today?',
  'How was training?',
  'Any breakthroughs or struggles?',
  'What techniques did you drill?',
];

// Inline chip style override — 'auto' width is valid in RN flex layout but not
// in the StyleSheet type definitions, so we type it explicitly here once.
const autoWidthChip: ViewStyle = { width: 'auto' as ViewStyle['width'], paddingHorizontal: 16 };

// ============================================
// MAIN COMPONENT
// ============================================

export function SessionLoggerScreen() {
  const navigation = useNavigation();
  const { profile, refreshProfile } = useAuth();
  const voiceRecorder = useVoiceRecorder();
  const { showToast } = useToast();

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
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingRef = useRef(false); // Bug 2: prevent double pipeline
  const savingRef = useRef(false); // Bug 4: prevent double save
  const rawExtractionRef = useRef<ExtractionResult | null>(null); // Bug 18: track edits
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

  // Clean up dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  // Reset form when screen regains focus — but only if the previous session
  // is done (success phase). Active phases (recording/processing/review) are
  // left alone so an accidental tab switch doesn't wipe in-progress work.
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useFocusEffect(
    useCallback(() => {
      if (phaseRef.current === 'success') {
        // Kill the auto-dismiss timer so it doesn't navigate us away later
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }
        // Full state reset — same as resetAndGoBack but without the navigate
        setPhase(prefersVoice ? 'recording' : 'entry');
        setSkippedEntry(prefersVoice);
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
        voiceRecorder.reset();
        // Re-enable voice auto-start for next session
        autoStarted.current = false;
      }
    }, [prefersVoice, voiceRecorder])
  );

  useEffect(() => {
    if (phase === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
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
      setPhase('success');

      // Auto-dismiss after 5 seconds (matches spec)
      dismissTimerRef.current = setTimeout(() => {
        resetAndGoBack();
      }, 5000);
    } catch (error) {
      console.error('Save error:', error);
      haptics.error();
      showToast('Could not save your session. Please try again.', 'error');
      setSaving(false);
      savingRef.current = false; // Allow retry after error
    }
  }, [review, transcript, inputMethod, audioPath, voiceSessionId, pipelineSucceeded,
      transcriptionError, extractionError, extractionModel, schemaVersion,
      entry, voiceRecorder, refreshProfile, showToast]);

  const resetAndGoBack = () => {
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
    voiceRecorder.reset();
    (navigation as any).navigate('JournalTab');
  };

  const handleCancelRecording = useCallback(async () => {
    // Stop and discard audio
    await voiceRecorder.stopRecording();
    voiceRecorder.reset();
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

  if (phase === 'success') {
    return <SuccessPhase sessionCount={profile?.session_count ?? 0} />;
  }

  return null;
}

// ============================================
// ENTRY PHASE
// ============================================

function EntryPhase({
  entry,
  setEntry,
  onRecord,
  onTextOnly,
  gymName,
  isGymOverridden,
  onGymPress,
  onGymReset,
}: {
  entry: EntryFields;
  setEntry: React.Dispatch<React.SetStateAction<EntryFields>>;
  onRecord: () => void;
  onTextOnly: () => void;
  gymName: string | null;
  isGymOverridden: boolean;
  onGymPress: () => void;
  onGymReset: () => void;
}) {
  const [promptIndex] = useState(Math.floor(Math.random() * RECORDING_PROMPTS.length));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.entryContent}>
        <Text style={styles.phaseTitle}>Log Your Training</Text>
        <GymChip
          gymName={gymName}
          isOverridden={isGymOverridden}
          onPress={onGymPress}
          onReset={onGymReset}
        />

        {/* Training Mode */}
        <Text style={styles.fieldLabel}>TRAINING MODE</Text>
        <View style={styles.chipRow}>
          {(['gi', 'nogi', 'other'] as const).map((mode) => (
            <Pressable
              key={mode}
              style={({ pressed }) => [styles.entryChip, entry.trainingMode === mode && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, trainingMode: mode })); }}
            >
              <Text style={[styles.entryChipText, entry.trainingMode === mode && styles.entryChipTextSelected]}>
                {mode === 'nogi' ? 'No-Gi' : mode === 'gi' ? 'Gi' : 'Other'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Session Kind */}
        <Text style={styles.fieldLabel}>SESSION TYPE</Text>
        <View style={styles.chipRow}>
          {(['class', 'open_mat', 'competition_training', 'other'] as const).map((kind) => (
            <Pressable
              key={kind}
              style={({ pressed }) => [styles.entryChip, entry.sessionKind === kind && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, sessionKind: kind })); }}
            >
              <Text style={[styles.entryChipText, entry.sessionKind === kind && styles.entryChipTextSelected]}>
                {kind === 'open_mat' ? 'Open Mat' : kind === 'competition_training' ? 'Comp Training' : kind === 'class' ? 'Regular Class' : 'Other'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.fieldLabel}>DURATION</Text>
        <View style={styles.chipRow}>
          {[60, 75, 90, 120].map((min) => (
            <Pressable
              key={min}
              style={({ pressed }) => [styles.entryChip, entry.durationMinutes === min && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, durationMinutes: min })); }}
            >
              <Text style={[styles.entryChipText, entry.durationMinutes === min && styles.entryChipTextSelected]}>
                {min} min
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sparring */}
        <Text style={styles.fieldLabel}>DID YOU SPAR?</Text>
        <View style={styles.chipRow}>
          {([true, false] as const).map((val) => (
            <Pressable
              key={String(val)}
              style={({ pressed }) => [styles.entryChip, entry.didSpar === val && styles.entryChipSelected, pressed && { opacity: 0.7 }]}
              onPress={() => { haptics.light(); setEntry((p) => ({ ...p, didSpar: val })); }}
            >
              <Text style={[styles.entryChipText, entry.didSpar === val && styles.entryChipTextSelected]}>
                {val ? 'Yes' : 'No'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Prompt */}
        <Text style={styles.recordPrompt}>{RECORDING_PROMPTS[promptIndex]}</Text>

        {/* Record Button */}
        <Pressable
          style={({ pressed }) => [styles.recordButton, pressed && { opacity: 0.85 }]}
          onPress={onRecord}
        >
          <Icons.Mic size={36} color={colors.black} />
          <Text style={styles.recordButtonText}>Record</Text>
        </Pressable>

        {/* Text fallback */}
        <Pressable style={({ pressed }) => [styles.textOnlyButton, pressed && { opacity: 0.7 }]} onPress={onTextOnly}>
          <Text style={styles.textOnlyText}>Type instead</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// RECORDING PHASE
// ============================================

function RecordingPhase({
  duration,
  pulseAnim,
  onStop,
  onCancel,
  gymName,
}: {
  duration: string;
  pulseAnim: Animated.Value;
  onStop: () => void;
  onCancel: () => void;
  gymName: string | null;
}) {
  const cancelRef = useRef(false);

  const handleCancel = useCallback(() => {
    // Double-tap guard
    if (cancelRef.current) return;
    cancelRef.current = true;

    // Parse elapsed seconds from "M:SS" format
    const parts = duration.split(':');
    const totalSeconds = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);

    if (totalSeconds < 3) {
      // Under 3 seconds — cancel instantly
      onCancel();
    } else {
      // 3+ seconds — confirm discard
      Alert.alert(
        'Discard this recording?',
        undefined,
        [
          { text: 'Keep Recording', style: 'cancel', onPress: () => { cancelRef.current = false; } },
          { text: 'Discard', style: 'destructive', onPress: onCancel },
        ],
      );
      // Reset guard if alert is dismissed without action
      cancelRef.current = false;
    }
  }, [duration, onCancel]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.recordingCancelRow}>
        <Pressable
          style={({ pressed }) => pressed && { opacity: 0.5 }}
          onPress={handleCancel}
          hitSlop={12}
        >
          <Text style={styles.recordingCancelText}>Cancel</Text>
        </Pressable>
      </View>
      <View style={styles.recordingContent}>
        <GymLabel gymName={gymName} />
        <Animated.View style={[styles.recordingCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Icons.Mic size={48} color={colors.white} />
        </Animated.View>

        <Text style={styles.recordingTimer}>{duration}</Text>
        <Text style={styles.recordingHint}>Describe your session...</Text>

        <Pressable
          style={({ pressed }) => [styles.stopButton, pressed && { opacity: 0.85 }]}
          onPress={onStop}
        >
          <Icons.Stop size={24} color={colors.white} />
          <Text style={styles.stopButtonText}>Stop Recording</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// PROCESSING PHASE
// ============================================

function ProcessingPhase({ onCancel }: { onCancel?: () => void }) {
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.3)).current;
  const bar3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createWave = (bar: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(bar, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(bar, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );

    const a1 = createWave(bar1, 0);
    const a2 = createWave(bar2, 150);
    const a3 = createWave(bar3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [bar1, bar2, bar3]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.processingContent}>
        <View style={styles.processingBars}>
          {[bar1, bar2, bar3].map((bar, i) => (
            <Animated.View
              key={i}
              style={[
                styles.processingBar,
                {
                  opacity: bar,
                  transform: [{
                    scaleY: bar.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.5, 1],
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.processingTitle}>Processing your session...</Text>
        <Text style={styles.processingHint}>
          Transcribing audio and extracting details
        </Text>
        {onCancel && (
          <Pressable
            style={({ pressed }) => [styles.textOnlyButton, { marginTop: spacing.xl }, pressed && { opacity: 0.7 }]}
            onPress={onCancel}
          >
            <Text style={styles.textOnlyText}>Skip to manual entry</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

// ============================================
// REVIEW PHASE
// ============================================

function ReviewPhase({
  review,
  setReview,
  transcript,
  saving,
  onSave,
  onCancel,
  gymName,
  isGymOverridden,
  onGymPress,
  onGymReset,
}: {
  review: ReviewFields;
  setReview: React.Dispatch<React.SetStateAction<ReviewFields>>;
  transcript: string;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  gymName: string | null;
  isGymOverridden: boolean;
  onGymPress: () => void;
  onGymReset: () => void;
}) {

  const [techniqueInput, setTechniqueInput] = useState('');
  const [injuryInput, setInjuryInput] = useState('');
  const [subGivenInput, setSubGivenInput] = useState('');
  const [subReceivedInput, setSubReceivedInput] = useState('');
  const [editingDetail, setEditingDetail] = useState<'mode' | 'duration' | null>(null);
  const [jiggleSection, setJiggleSection] = useState<'submissionsGiven' | 'submissionsReceived' | null>(null);

  // Autocomplete state
  const [userTechHistory, setUserTechHistory] = useState<string[]>([]);
  const [userSubHistory, setUserSubHistory] = useState<string[]>([]);

  useEffect(() => {
    sessionService.getAutocompleteHistory().then(({ techniques, submissions }) => {
      setUserTechHistory(techniques);
      setUserSubHistory(submissions);
    }).catch(() => { /* silent fallback to static-only */ });
  }, []);

  const getSuggestions = (input: string, type: 'technique' | 'submission', alreadyAdded: string[]): string[] => {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    const addedLower = new Set(alreadyAdded.map((a) => a.toLowerCase()));

    // User history first, then static dictionary
    const history = type === 'technique' ? userTechHistory : userSubHistory;
    const staticList = type === 'technique' ? TECHNIQUE_SUGGESTIONS : SUBMISSION_SUGGESTIONS;

    const scored: { term: string; score: number }[] = [];
    const seen = new Set<string>();

    for (const term of [...history, ...staticList]) {
      const termLower = term.toLowerCase();
      if (seen.has(termLower) || addedLower.has(termLower)) continue;
      seen.add(termLower);

      if (termLower.startsWith(lower)) {
        // Prefix match — highest priority; user history terms get extra boost
        scored.push({ term, score: history.includes(term) ? 3 : 2 });
      } else if (termLower.includes(lower)) {
        // Substring match
        scored.push({ term, score: history.includes(term) ? 1.5 : 1 });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.term);
  };
  const jiggleAnim = useRef(new Animated.Value(0)).current;

  const startJiggle = (section: 'submissionsGiven' | 'submissionsReceived') => {
    setJiggleSection(section);
    Animated.loop(
      Animated.sequence([
        Animated.timing(jiggleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopJiggle = () => {
    jiggleAnim.stopAnimation();
    jiggleAnim.setValue(0);
    setJiggleSection(null);
  };

  const jiggleRotation = jiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  const addToList = (field: 'techniquesDrilled' | 'injuries', value: string) => {
    if (!value.trim()) return;
    setReview((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), value.trim()] }));
  };

  const removeFromList = (field: 'techniquesDrilled' | 'injuries', index: number) => {
    setReview((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: string, i: number) => i !== index),
    }));
  };

  const addSubmission = (direction: 'submissionsGiven' | 'submissionsReceived', type: string) => {
    if (!type.trim()) return;
    const existing = review[direction].find((s) => s.type.toLowerCase() === type.trim().toLowerCase());
    if (existing) {
      setReview((prev) => ({
        ...prev,
        [direction]: prev[direction].map((s) =>
          s.type.toLowerCase() === type.trim().toLowerCase() ? { ...s, count: s.count + 1 } : s
        ),
      }));
    } else {
      setReview((prev) => ({
        ...prev,
        [direction]: [...prev[direction], { type: type.trim(), count: 1 }],
      }));
    }
  };

  const removeSubmission = (direction: 'submissionsGiven' | 'submissionsReceived', index: number) => {
    setReview((prev) => ({
      ...prev,
      [direction]: prev[direction].filter((_, i) => i !== index),
    }));
  };

  const updateSubmissionCount = (direction: 'submissionsGiven' | 'submissionsReceived', index: number, delta: number) => {
    setReview((prev) => {
      const updated = prev[direction].map((s, i) =>
        i === index ? { ...s, count: Math.max(1, s.count + delta) } : s
      );
      return { ...prev, [direction]: updated };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.reviewHeader}>
        <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.reviewTitle}>Review Session</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.reviewContent} keyboardShouldPersistTaps="handled">

        {/* Gym chip */}
        <GymChip
          gymName={gymName}
          isOverridden={isGymOverridden}
          onPress={onGymPress}
          onReset={onGymReset}
        />

        {/* 1. Training Mode + Duration badges */}
        <View style={styles.detailsRow}>
          <DetailBadge label={review.trainingMode === 'nogi' ? 'No-Gi' : review.trainingMode === 'gi' ? 'Gi' : 'Other'} onPress={() => setEditingDetail('mode')} />
          <DetailBadge label={`${review.durationMinutes} min`} onPress={() => setEditingDetail('duration')} />
        </View>

        {/* Inline detail editors */}
        {editingDetail === 'mode' && (
          <View style={styles.reviewField}>
            <Text style={styles.fieldLabel}>TRAINING MODE</Text>
            <View style={styles.chipRow}>
              {(['gi', 'nogi', 'other'] as const).map((mode) => (
                <Pressable
                  key={mode}
                  style={({ pressed }) => [styles.smallChip, autoWidthChip, review.trainingMode === mode && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => { setReview((p) => ({ ...p, trainingMode: mode })); setEditingDetail(null); }}
                >
                  <Text style={[styles.smallChipText, review.trainingMode === mode && styles.smallChipTextSelected]}>
                    {mode === 'nogi' ? 'No-Gi' : mode === 'gi' ? 'Gi' : 'Other'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {editingDetail === 'duration' && (
          <View style={styles.reviewField}>
            <Text style={styles.fieldLabel}>DURATION</Text>
            <View style={styles.chipRow}>
              {[30, 45, 60, 75, 90, 120].map((min) => (
                <Pressable
                  key={min}
                  style={({ pressed }) => [styles.smallChip, review.durationMinutes === min && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => { setReview((p) => ({ ...p, durationMinutes: min })); setEditingDetail(null); }}
                >
                  <Text style={[styles.smallChipText, review.durationMinutes === min && styles.smallChipTextSelected]}>
                    {min}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 2. Warm-up */}
        <View style={[styles.reviewField, review.warmedUp === null && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>WARM-UP</Text>
          <View style={styles.chipRow}>
            {([true, false] as const).map((val) => (
              <Pressable
                key={String(val)}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.warmedUp === val && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, warmedUp: val }))}
              >
                <Text style={[styles.smallChipText, review.warmedUp === val && styles.smallChipTextSelected]}>
                  {val ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 3. Techniques Trained / Lesson Topic */}
        <View style={[styles.reviewField, review.techniquesDrilled.length === 0 && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>TECHNIQUES TRAINED / LESSON TOPIC</Text>
          <View style={styles.tagList}>
            {review.techniquesDrilled.map((t, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.tag, pressed && { opacity: 0.7 }]} onPress={() => removeFromList('techniquesDrilled', i)}>
                <Text style={styles.tagText}>{t}</Text>
                <Icons.Close size={14} color={colors.gray400} />
              </Pressable>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.reviewInput, { flex: 1 }]}
              value={techniqueInput}
              onChangeText={setTechniqueInput}
              placeholder="Add technique or topic (e.g. guard passing)"
              placeholderTextColor={colors.gray600}
              returnKeyType="done"
              onSubmitEditing={() => {
                addToList('techniquesDrilled', techniqueInput);
                setTechniqueInput('');
              }}
            />
          </View>
          {getSuggestions(techniqueInput, 'technique', review.techniquesDrilled).length > 0 && (
            <View style={styles.suggestionsDropdown}>
              {getSuggestions(techniqueInput, 'technique', review.techniquesDrilled).map((suggestion) => (
                <Pressable
                  key={suggestion}
                  style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                  onPress={() => {
                    addToList('techniquesDrilled', suggestion);
                    setTechniqueInput('');
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  {userTechHistory.includes(suggestion) && (
                    <Text style={styles.suggestionBadge}>recent</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 4. Did You Spar? */}
        <View style={styles.reviewField}>
          <Text style={styles.fieldLabel}>DID YOU SPAR?</Text>
          <View style={styles.chipRow}>
            {([true, false] as const).map((val) => (
              <Pressable
                key={String(val)}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.didSpar === val && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, didSpar: val, ...(val ? {} : { sparringRounds: 0, submissionsGiven: [], submissionsReceived: [] }) }))}
              >
                <Text style={[styles.smallChipText, review.didSpar === val && styles.smallChipTextSelected]}>
                  {val ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 5. Sparring Rounds (conditional) */}
        {review.didSpar && (
          <View style={[styles.reviewField, review.sparringRounds === 0 && styles.reviewFieldEmpty]}>
            <Text style={styles.fieldLabel}>SPARRING ROUNDS</Text>
            <View style={styles.chipRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <Pressable
                  key={n}
                  style={({ pressed }) => [styles.smallChip, review.sparringRounds === n && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => setReview((p) => ({ ...p, sparringRounds: n }))}
                >
                  <Text style={[styles.smallChipText, review.sparringRounds === n && styles.smallChipTextSelected]}>
                    {n === 7 ? '7+' : n}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 6. Submissions Landed (conditional) */}
        {review.didSpar && (
          <Pressable
            style={[styles.reviewField, review.submissionsGiven.length === 0 && styles.reviewFieldEmpty]}
            onPress={() => jiggleSection === 'submissionsGiven' && stopJiggle()}
          >
            <Text style={[styles.fieldLabel, { color: colors.positive }]}>SUBMISSIONS LANDED</Text>
            <View style={styles.tagList}>
              {review.submissionsGiven.map((s, i) => (
                <Pressable
                  key={i}
                  onLongPress={() => startJiggle('submissionsGiven')}
                  onPress={() => jiggleSection !== 'submissionsGiven' && updateSubmissionCount('submissionsGiven', i, 1)}
                  delayLongPress={400}
                >
                  <Animated.View style={[styles.tag, styles.tagPositive, { gap: 8 }, jiggleSection === 'submissionsGiven' && { transform: [{ rotate: jiggleRotation }] }]}>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsGiven', i, -1)}>
                      <Icons.Minus size={16} color={colors.positive} />
                    </Pressable>
                    <Text style={[styles.tagText, { color: colors.positive }]}>{s.type} ({s.count})</Text>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsGiven', i, 1)}>
                      <Icons.Plus size={16} color={colors.positive} />
                    </Pressable>
                    {jiggleSection === 'submissionsGiven' && (
                      <Pressable
                        style={styles.jiggleDeleteBadge}
                        hitSlop={8}
                        onPress={() => { removeSubmission('submissionsGiven', i); if (review.submissionsGiven.length <= 1) stopJiggle(); }}
                      >
                        <Icons.Minus size={12} color="#fff" />
                      </Pressable>
                    )}
                  </Animated.View>
                </Pressable>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.reviewInput, { flex: 1 }]}
                value={subGivenInput}
                onChangeText={setSubGivenInput}
                placeholder="Add submission (e.g. armbar)"
                placeholderTextColor={colors.gray600}
                returnKeyType="done"
                onSubmitEditing={() => {
                  addSubmission('submissionsGiven', subGivenInput);
                  setSubGivenInput('');
                }}
              />
            </View>
            {getSuggestions(subGivenInput, 'submission', review.submissionsGiven.map((s) => s.type)).length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {getSuggestions(subGivenInput, 'submission', review.submissionsGiven.map((s) => s.type)).map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                    onPress={() => {
                      addSubmission('submissionsGiven', suggestion);
                      setSubGivenInput('');
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    {userSubHistory.includes(suggestion) && (
                      <Text style={styles.suggestionBadge}>recent</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        )}

        {/* 7. Got Caught (conditional) */}
        {review.didSpar && (
          <Pressable
            style={[styles.reviewField, review.submissionsReceived.length === 0 && styles.reviewFieldEmpty]}
            onPress={() => jiggleSection === 'submissionsReceived' && stopJiggle()}
          >
            <Text style={[styles.fieldLabel, { color: colors.negative }]}>GOT CAUGHT</Text>
            <View style={styles.tagList}>
              {review.submissionsReceived.map((s, i) => (
                <Pressable
                  key={i}
                  onLongPress={() => startJiggle('submissionsReceived')}
                  onPress={() => jiggleSection !== 'submissionsReceived' && updateSubmissionCount('submissionsReceived', i, 1)}
                  delayLongPress={400}
                >
                  <Animated.View style={[styles.tag, styles.tagNegative, { gap: 8 }, jiggleSection === 'submissionsReceived' && { transform: [{ rotate: jiggleRotation }] }]}>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsReceived', i, -1)}>
                      <Icons.Minus size={16} color={colors.negative} />
                    </Pressable>
                    <Text style={[styles.tagText, { color: colors.negative }]}>{s.type} ({s.count})</Text>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsReceived', i, 1)}>
                      <Icons.Plus size={16} color={colors.negative} />
                    </Pressable>
                    {jiggleSection === 'submissionsReceived' && (
                      <Pressable
                        style={styles.jiggleDeleteBadge}
                        hitSlop={8}
                        onPress={() => { removeSubmission('submissionsReceived', i); if (review.submissionsReceived.length <= 1) stopJiggle(); }}
                      >
                        <Icons.Minus size={12} color="#fff" />
                      </Pressable>
                    )}
                  </Animated.View>
                </Pressable>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.reviewInput, { flex: 1 }]}
                value={subReceivedInput}
                onChangeText={setSubReceivedInput}
                placeholder="Add submission (e.g. triangle)"
                placeholderTextColor={colors.gray600}
                returnKeyType="done"
                onSubmitEditing={() => {
                  addSubmission('submissionsReceived', subReceivedInput);
                  setSubReceivedInput('');
                }}
              />
            </View>
            {getSuggestions(subReceivedInput, 'submission', review.submissionsReceived.map((s) => s.type)).length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {getSuggestions(subReceivedInput, 'submission', review.submissionsReceived.map((s) => s.type)).map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                    onPress={() => {
                      addSubmission('submissionsReceived', suggestion);
                      setSubReceivedInput('');
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    {userSubHistory.includes(suggestion) && (
                      <Text style={styles.suggestionBadge}>recent</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        )}

        {/* 8. Injuries */}
        <View style={[styles.reviewField, review.injuries.length === 0 && styles.reviewFieldEmpty]}>
          <Text style={[styles.fieldLabel, { color: colors.warning }]}>INJURIES</Text>
          <View style={styles.tagList}>
            {review.injuries.map((injury, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.tag, styles.tagWarning, pressed && { opacity: 0.7 }]} onPress={() => removeFromList('injuries', i)}>
                <Text style={[styles.tagText, { color: colors.warning }]}>{injury}</Text>
                <Icons.Close size={14} color={colors.warning} />
              </Pressable>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.reviewInput, { flex: 1 }]}
              value={injuryInput}
              onChangeText={setInjuryInput}
              placeholder="Add injury (e.g. sore elbow)"
              placeholderTextColor={colors.gray600}
              returnKeyType="done"
              onSubmitEditing={() => {
                addToList('injuries', injuryInput);
                setInjuryInput('');
              }}
            />
          </View>
        </View>

        {/* 9. Instructor */}
        <View style={[styles.reviewField, review.instructor === '' && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>INSTRUCTOR</Text>
          <TextInput
            style={styles.reviewInput}
            value={review.instructor}
            onChangeText={(t) => setReview((p) => ({ ...p, instructor: t }))}
            placeholder="Who taught class?"
            placeholderTextColor={colors.gray600}
          />
        </View>

        {/* 10. Session Type */}
        <View style={styles.reviewField}>
          <Text style={styles.fieldLabel}>SESSION TYPE</Text>
          <View style={styles.chipRow}>
            {(['class', 'open_mat', 'competition_training', 'other'] as const).map((kind) => (
              <Pressable
                key={kind}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.sessionKind === kind && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, sessionKind: kind }))}
              >
                <Text style={[styles.smallChipText, review.sessionKind === kind && styles.smallChipTextSelected]}>
                  {kind === 'open_mat' ? 'Open Mat' : kind === 'competition_training' ? 'Comp Training' : kind === 'class' ? 'Regular Class' : 'Other'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Voice Transcript — full text at bottom */}
        {transcript ? (
          <View style={styles.transcriptCard}>
            <View style={styles.transcriptCardHeader}>
              <Text style={styles.transcriptCardLabel}>VOICE TRANSCRIPT</Text>
            </View>
            <Text style={[styles.transcriptCardText, { maxHeight: 200 }]}>
              {transcript}
            </Text>
          </View>
        ) : null}

        {/* Save button */}
        <Pressable
          style={({ pressed }) => [styles.saveButton, saving && { opacity: 0.7 }, pressed && !saving && { opacity: 0.85 }]}
          onPress={onSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.saveButtonText}>Save Session</Text>
          )}
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DetailBadge({ label, onPress }: { label: string; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.detailBadge, pressed && { opacity: 0.7 }]} onPress={onPress}>
        <Text style={styles.detailBadgeText}>{label}</Text>
        <Icons.Edit size={10} color={colors.gray500} />
      </Pressable>
    );
  }
  return (
    <View style={styles.detailBadge}>
      <Text style={styles.detailBadgeText}>{label}</Text>
    </View>
  );
}

// ============================================
// SUCCESS PHASE
// ============================================

function SuccessPhase({ sessionCount }: { sessionCount: number }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.successContent}>
        <View style={styles.successIcon}>
          <Icons.CheckCircle size={56} color={colors.gold} />
        </View>
        <Text style={styles.successTitle}>Session Logged!</Text>
        <Text style={styles.successSubtitle}>
          You've logged {sessionCount + 1} session{sessionCount !== 0 ? 's' : ''} total.
        </Text>
        <Text style={styles.successHint}>Keep showing up. That's the whole game.</Text>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  // Entry phase
  entryContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  phaseTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  entryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    minHeight: touchTargets.primary,
    justifyContent: 'center',
  },
  entryChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  entryChipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  entryChipTextSelected: {
    color: colors.gold,
  },
  recordPrompt: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray400,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gold,
    paddingVertical: 20,
    borderRadius: radius.xl,
    minHeight: touchTargets.recording,
  },
  recordButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  textOnlyButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  textOnlyText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textDecorationLine: 'underline',
  },

  // Recording phase
  recordingCancelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  recordingCancelText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
  },
  recordingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  recordingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.negative,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  recordingTimer: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  recordingHint: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray400,
    marginBottom: spacing['2xl'],
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.negative,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
    borderRadius: radius.xl,
    minHeight: touchTargets.primary,
  },
  stopButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },

  // Processing phase
  processingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  processingBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    marginBottom: spacing.md,
  },
  processingBar: {
    width: 6,
    height: 32,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  processingTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  processingHint: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },

  // Review phase
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  cancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  reviewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  reviewContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  detailBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray300,
    textTransform: 'capitalize',
  },
  reviewField: {
    marginBottom: spacing.lg,
  },
  reviewFieldEmpty: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: spacing.sm,
    backgroundColor: colors.goldUltraDim,
    borderRadius: radius.sm,
  },
  reviewInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  jiggleDeleteBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.negative,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  suggestionsDropdown: {
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginTop: 4,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray700,
  },
  suggestionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray300,
  },
  suggestionBadge: {
    fontFamily: 'JetBrains Mono',
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagPositive: {
    backgroundColor: colors.positiveDim,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  tagNegative: {
    backgroundColor: colors.negativeDim,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  tagWarning: {
    backgroundColor: colors.warningDim,
    borderColor: colors.warningDimBorder,
  },
  tagText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray300,
  },
  addRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallChip: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  smallChipText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray400,
  },
  smallChipTextSelected: {
    color: colors.gold,
  },
  transcriptText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  transcriptCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    overflow: 'hidden',
  },
  transcriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  transcriptCardLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  transcriptCardText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },

  // Success phase
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray300,
    marginBottom: spacing.md,
  },
  successHint: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    fontStyle: 'italic',
  },
});

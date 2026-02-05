/**
 * VoiceFirstLogger Component
 *
 * Voice-first session logging orchestrator. Manages phase transitions
 * and data flow between extracted phase components.
 *
 * Flow:
 * 1. Entry - Core fields (type, duration, sparring) + RECORD button + optional fields
 * 2. Recording - Voice capture with prompts
 * 3. Processing - AI extraction
 * 4. Review - Same form filled with extracted data, editable
 * 5. Success - Confirmation
 *
 * Phase components live in ./voice-logger/ for maintainability.
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useUserProfile } from '../../context/UserProfileContext';
import { useBeltPersonalization } from '../../hooks/useBeltPersonalization';
import { markSessionLogged } from './TrainingFeedback';
import type { SessionData, SubmissionInsert } from '../../types/database';
import { DEFAULT_SESSION_DATA } from '../../types/database';

import {
  EntryPhase,
  RecordingPhase,
  ProcessingPhase,
  ReviewPhase,
  SuccessPhase,
  ErrorPhase,
  MOCK_EXTRACTED_DATA,
  DEFAULT_PROMPT_HINTS,
  MOCK_SESSION_COUNT,
} from './voice-logger';
import type { Phase } from './voice-logger';

// ===========================================
// PROPS
// ===========================================

interface VoiceFirstLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

// ===========================================
// COMPONENT
// ===========================================

export function VoiceFirstLogger({ onComplete, onCancel }: VoiceFirstLoggerProps) {
  const { profile } = useUserProfile();
  const { getPostSessionMessage, getSuggestedPrompts } = useBeltPersonalization();

  // Phase management
  const [phase, setPhase] = useState<Phase>('entry');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Recording state
  const [recordingTime, setRecordingTime] = useState(0);

  // Form state - pre-filled with smart defaults
  const [sessionData, setSessionData] = useState<SessionData>({
    ...DEFAULT_SESSION_DATA,
    trainingType: 'gi', // Gi pre-selected as default
    durationMinutes: 90, // 90 min typical
  });

  // Track if user has explicitly selected sparring (for UI state)
  const [sparringSelected, setSparringSelected] = useState<boolean | null>(null);

  // Get belt-specific prompts
  const beltPrompts = getSuggestedPrompts();
  const postSessionMessage = getPostSessionMessage();
  const prompts = beltPrompts && beltPrompts.length > 0 ? beltPrompts : DEFAULT_PROMPT_HINTS;

  // Smooth phase transition
  const transitionTo = useCallback((newPhase: Phase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(newPhase);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: number | undefined;
    if (phase === 'recording') {
      interval = window.setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update a field
  const updateField = <K extends keyof SessionData>(field: K, value: SessionData[K]) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  // Start recording
  const handleStartRecording = useCallback(() => {
    setRecordingTime(0);
    transitionTo('recording');
  }, [transitionTo]);

  // Stop recording and process
  const handleStopRecording = useCallback(() => {
    transitionTo('processing');
    // Simulate AI processing delay (3-5 seconds)
    setTimeout(() => {
      // Merge extracted data with existing form data
      setSessionData(prev => ({
        ...prev,
        techniquesDrilled: MOCK_EXTRACTED_DATA.techniquesDrilled || prev.techniquesDrilled,
        sparringRounds: MOCK_EXTRACTED_DATA.sparringRounds ?? prev.sparringRounds,
        submissionsGiven: MOCK_EXTRACTED_DATA.submissionsGiven || prev.submissionsGiven,
        submissionsReceived: MOCK_EXTRACTED_DATA.submissionsReceived || prev.submissionsReceived,
        rawText: MOCK_EXTRACTED_DATA.notes || prev.rawText,
        // If sparring data was extracted, set didSpar to true
        didSpar: (MOCK_EXTRACTED_DATA.sparringRounds ||
                  MOCK_EXTRACTED_DATA.submissionsGiven?.length ||
                  MOCK_EXTRACTED_DATA.submissionsReceived?.length) ? true : prev.didSpar,
      }));
      transitionTo('review');
    }, 3000);
  }, [transitionTo]);

  // Save session
  const handleSave = useCallback(async () => {
    try {
      const userId = profile.userId;
      const sessionDate = new Date().toISOString().split('T')[0];

      const sessionResult = await api.sessions.create({
        user_id: userId,
        date: sessionDate,
        training_type: sessionData.trainingType || 'gi',
        duration_minutes: sessionData.durationMinutes,
        sparring_rounds: sessionData.sparringRounds,
        techniques: sessionData.techniquesDrilled,
        worked_well: [],
        struggles: [],
        voice_transcript: sessionData.rawText || '',
      });

      // Save submissions if we have any
      // SubmissionCount format: { name: string, count: number }
      // Expand each count into individual submission records
      if (sessionResult.data && sessionData.didSpar) {
        const submissionInserts: SubmissionInsert[] = [];

        // Expand submissions given (each count becomes individual records)
        sessionData.submissionsGiven.forEach(sub => {
          for (let i = 0; i < sub.count; i++) {
            submissionInserts.push({
              session_id: sessionResult.data!.id,
              user_id: userId,
              technique_name: sub.name,
              outcome: 'given' as const,
              date: sessionDate,
            });
          }
        });

        // Expand submissions received
        sessionData.submissionsReceived.forEach(sub => {
          for (let i = 0; i < sub.count; i++) {
            submissionInserts.push({
              session_id: sessionResult.data!.id,
              user_id: userId,
              technique_name: sub.name,
              outcome: 'received' as const,
              date: sessionDate,
            });
          }
        });

        if (submissionInserts.length > 0) {
          await api.submissions.createBatch(submissionInserts);
        }
      }

      // Mark session logged for insight generation
      markSessionLogged();

      transitionTo('success');
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (error) {
      console.error('Failed to save session:', error);
      transitionTo('error');
    }
  }, [sessionData, transitionTo, onComplete, profile.userId]);

  // Re-record
  const handleReRecord = useCallback(() => {
    setRecordingTime(0);
    transitionTo('recording');
  }, [transitionTo]);

  // Check if form is valid for saving
  const isValid = () => {
    return (
      sessionData.trainingType !== null &&
      sessionData.durationMinutes !== null
    );
  };

  // Transition style
  const getPhaseStyle = (): React.CSSProperties => ({
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-black)',
      overflow: 'hidden',
      ...getPhaseStyle(),
    }}>
      {phase === 'entry' && (
        <EntryPhase
          sessionData={sessionData}
          updateField={updateField}
          sparringSelected={sparringSelected}
          setSparringSelected={setSparringSelected}
          onRecord={handleStartRecording}
          onCancel={onCancel}
          onSave={handleSave}
          isValid={isValid()}
        />
      )}

      {phase === 'recording' && (
        <RecordingPhase
          recordingTime={recordingTime}
          formatTime={formatTime}
          onStop={handleStopRecording}
          onCancel={() => transitionTo('entry')}
          prompts={prompts}
        />
      )}

      {phase === 'processing' && <ProcessingPhase />}

      {phase === 'review' && (
        <ReviewPhase
          sessionData={sessionData}
          updateField={updateField}
          onSave={handleSave}
          onReRecord={handleReRecord}
          onCancel={onCancel}
          isValid={isValid()}
        />
      )}

      {phase === 'success' && (
        <SuccessPhase
          sessionCount={MOCK_SESSION_COUNT}
          postSessionMessage={postSessionMessage}
        />
      )}

      {phase === 'error' && (
        <ErrorPhase
          onRetry={handleSave}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

export default VoiceFirstLogger;

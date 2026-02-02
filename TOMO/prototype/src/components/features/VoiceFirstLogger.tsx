/**
 * VoiceFirstLogger Component
 *
 * Voice-first session logging with memory-jogging core fields.
 *
 * Flow:
 * 1. Entry - Core fields (type, duration, sparring) + RECORD button + optional fields
 * 2. Recording - Voice capture with prompts
 * 3. Processing - AI extraction
 * 4. Review - Same form filled with extracted data, editable
 * 5. Success - Confirmation
 *
 * Design Philosophy:
 * - Core fields at top jog user's memory
 * - Voice captures details naturally
 * - Review form lets user verify/edit before saving
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useUserProfile } from '../../context/UserProfileContext';
import { useBeltPersonalization } from '../../hooks/useBeltPersonalization';
import { SubmissionPicker } from '../ui';
import { markSessionLogged } from './TrainingFeedback';
import type { TrainingType, SessionData, SubmissionInsert, SubmissionCount } from '../../types/database';
import { DEFAULT_SESSION_DATA } from '../../types/database';

// ===========================================
// TYPES
// ===========================================

type Phase = 'entry' | 'recording' | 'processing' | 'review' | 'success' | 'error';

// ===========================================
// CONSTANTS
// ===========================================

const DURATION_OPTIONS = [
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '2 hrs' },
];

const TRAINING_TYPE_OPTIONS: { value: TrainingType; label: string }[] = [
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
  { value: 'openmat', label: 'Open Mat' },
];

// Recent techniques (would come from user history in production)
const RECENT_TECHNIQUES = [
  'Half guard',
  'Armbar',
  'Sweeps',
  'Guard passing',
  'Back takes',
  'Escapes',
];

// Mock extracted data (simulates AI processing)
// Uses SubmissionCount format: { name: string, count: number }
const MOCK_EXTRACTED_DATA = {
  techniquesDrilled: ['Knee slice pass (far arm control)'],
  struggles: ['Half guard top - losing underhook'],
  sparringRounds: 5,
  submissionsGiven: [
    { name: 'Collar choke', count: 1 },
    { name: 'Armbar', count: 1 },
    { name: 'RNC', count: 1 },
  ] as SubmissionCount[],
  submissionsReceived: [
    { name: 'Triangle', count: 1 },
    { name: 'Kimura', count: 1 },
  ] as SubmissionCount[],
  notes: 'Knee feels a little tight but nothing serious',
};

// Default prompts for recording phase
const DEFAULT_PROMPT_HINTS = [
  "What'd you work on?",
  "Any techniques click today?",
  "How'd rolling go?",
  "Tap to anything?",
  "Tap anyone out?",
  "What gave you trouble?",
];

// Mock session count
const MOCK_SESSION_COUNT = 48;

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

// ===========================================
// ENTRY PHASE - Core fields + Record button
// ===========================================

interface EntryPhaseProps {
  sessionData: SessionData;
  updateField: <K extends keyof SessionData>(field: K, value: SessionData[K]) => void;
  sparringSelected: boolean | null;
  setSparringSelected: (value: boolean | null) => void;
  onRecord: () => void;
  onCancel?: () => void;
  onSave: () => void;
  isValid: boolean;
}

function EntryPhase({
  sessionData,
  updateField,
  sparringSelected,
  setSparringSelected,
  onRecord,
  onCancel,
  onSave,
  isValid,
}: EntryPhaseProps) {
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <div style={{ width: 48 }} />
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
        }}>
          Log Session
        </h1>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            minWidth: '48px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-lg)',
        paddingTop: 0,
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* === RECORD BUTTON (Primary CTA at top) === */}
        <div style={{
          marginBottom: 'var(--space-xl)',
        }}>
          <button
            onClick={onRecord}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-xl)',
              backgroundColor: 'var(--color-gold-dim)',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              minHeight: '120px',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Mic icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-black)" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
            }}>
              Tap to Record
            </span>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: '4px',
            }}>
              Tell me what you worked on
            </span>
          </button>
        </div>

        {/* === CORE FIELDS (Tier 1) === */}

        {/* Training Type */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Training Type
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            {TRAINING_TYPE_OPTIONS.map(opt => {
              const isSelected = sessionData.trainingType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateField('trainingType', opt.value)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '48px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Duration
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            {DURATION_OPTIONS.map(opt => {
              const isSelected = sessionData.durationMinutes === opt.value && !showCustomDuration;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateField('durationMinutes', opt.value);
                    setShowCustomDuration(false);
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '48px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
            <button
              onClick={() => setShowCustomDuration(true)}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: showCustomDuration ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: showCustomDuration ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: showCustomDuration ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              Other
            </button>
          </div>
          {showCustomDuration && (
            <input
              type="number"
              value={customDuration}
              onChange={e => {
                setCustomDuration(e.target.value);
                const mins = parseInt(e.target.value);
                if (!isNaN(mins) && mins > 0) {
                  updateField('durationMinutes', mins);
                }
              }}
              placeholder="Minutes"
              autoFocus
              style={{
                width: '100%',
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                border: '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
            />
          )}
        </div>

        {/* Did You Spar? */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Did You Spar?
          </label>
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}>
            <button
              onClick={() => {
                setSparringSelected(true);
                updateField('didSpar', true);
              }}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sparringSelected === true ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sparringSelected === true ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sparringSelected === true ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setSparringSelected(false);
                updateField('didSpar', false);
                updateField('sparringRounds', null);
                updateField('submissionsGiven', []);
                updateField('submissionsReceived', []);
              }}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sparringSelected === false ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sparringSelected === false ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sparringSelected === false ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.15s ease',
              }}
            >
              No
            </button>
          </div>
        </div>

        {/* Sparring Details (expanded if Yes) */}
        {sparringSelected === true && (
          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderLeft: '3px solid var(--color-positive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
          }}>
            {/* Rounds */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-sm)',
              }}>
                Rounds
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                  const isSelected = sessionData.sparringRounds === n;
                  return (
                    <button
                      key={n}
                      onClick={() => updateField('sparringRounds', n)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                        border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                        borderRadius: 'var(--radius-sm)',
                        color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subs Given */}
            <SubmissionPicker
              label="Subs given"
              selectedSubmissions={sessionData.submissionsGiven}
              onSubmissionsChange={subs => updateField('submissionsGiven', subs)}
              userHistory={[]}
            />

            {/* Submitted By */}
            <SubmissionPicker
              label="Submitted by"
              selectedSubmissions={sessionData.submissionsReceived}
              onSubmissionsChange={subs => updateField('submissionsReceived', subs)}
              userHistory={[]}
            />
          </div>
        )}

        {/* === OPTIONAL FIELDS (Tier 2) === */}

        {/* What You Worked On */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            What You Worked On
            <span style={{
              marginLeft: 'var(--space-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-600)',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}>
              optional
            </span>
          </label>

          {/* Selected techniques */}
          {sessionData.techniquesDrilled.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-sm)',
            }}>
              {sessionData.techniquesDrilled.map(technique => (
                <div
                  key={technique}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-gold-dim)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    color: 'var(--color-gold)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                  }}>
                    {technique}
                  </span>
                  <button
                    onClick={() => {
                      updateField('techniquesDrilled', sessionData.techniquesDrilled.filter(t => t !== technique));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 var(--space-sm)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderLeft: '1px solid var(--color-gold)',
                      color: 'var(--color-gray-400)',
                      cursor: 'pointer',
                      minHeight: '28px',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick add chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
          }}>
            {RECENT_TECHNIQUES.filter(t => !sessionData.techniquesDrilled.includes(t)).map(technique => (
              <button
                key={technique}
                onClick={() => {
                  updateField('techniquesDrilled', [...sessionData.techniquesDrilled, technique]);
                }}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                + {technique}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-sm)',
          }}>
            Notes
            <span style={{
              marginLeft: 'var(--space-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-600)',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}>
              optional
            </span>
          </label>
          <textarea
            value={sessionData.rawText || ''}
            onChange={e => updateField('rawText', e.target.value)}
            placeholder="Anything else you want to remember?"
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Save button (sticky at bottom) */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <button
          onClick={onSave}
          disabled={!isValid}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: isValid ? 'var(--color-gold)' : 'var(--color-gray-800)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: isValid ? 'var(--color-black)' : 'var(--color-gray-500)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            minHeight: '56px',
            transition: 'all 0.2s ease',
          }}
        >
          Save Session
        </button>
      </div>
    </div>
  );
}

// ===========================================
// RECORDING PHASE
// ===========================================

function AudioWaveform() {
  const [bars, setBars] = useState<number[]>(Array(12).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => 15 + Math.random() * 35));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 50,
    }}>
      {bars.map((height, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: `${height}px`,
            backgroundColor: 'var(--color-gold)',
            borderRadius: 2,
            transition: 'height 0.1s ease',
          }}
        />
      ))}
    </div>
  );
}

interface RecordingPhaseProps {
  recordingTime: number;
  formatTime: (s: number) => string;
  onStop: () => void;
  onCancel: () => void;
  prompts: string[];
}

function RecordingPhase({ recordingTime, formatTime, onStop, onCancel, prompts }: RecordingPhaseProps) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % prompts.length);
      setAnimationKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [prompts.length]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-black)',
      zIndex: 100,
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        flexShrink: 0,
      }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            minWidth: '48px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Recording indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--color-negative)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.05em',
            color: 'var(--color-gray-400)',
          }}>
            {formatTime(recordingTime)}
          </span>
        </div>

        <div style={{ width: 48 }} />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        paddingBottom: '160px',
      }}>
        <div style={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 340,
        }}>
          <h2
            key={animationKey}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'center',
              color: 'var(--color-white)',
              margin: 0,
              animation: 'fadeSlideIn 0.4s ease-out',
            }}
          >
            {prompts[currentHintIndex]}
          </h2>
        </div>

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <AudioWaveform />
        </div>
      </div>

      {/* Done button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-xl)',
        paddingBottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-black) 60%, transparent)',
      }}>
        <button
          onClick={onStop}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-black)',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,255,255,0.15)',
          }}
        >
          Done
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ===========================================
// PROCESSING PHASE
// ===========================================

function ProcessingPhase() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-full)',
        border: '3px solid var(--color-gray-700)',
        borderTopColor: 'var(--color-gold)',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 'var(--space-xl)',
      }} />

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        color: 'var(--color-white)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Got It
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
      }}>
        Pulling out the details...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ===========================================
// REVIEW PHASE - Same form, now filled
// ===========================================

interface ReviewPhaseProps {
  sessionData: SessionData;
  updateField: <K extends keyof SessionData>(field: K, value: SessionData[K]) => void;
  onSave: () => void;
  onReRecord: () => void;
  onCancel?: () => void;
  isValid: boolean;
}

function ReviewPhase({ sessionData, updateField, onSave, onReRecord, isValid }: ReviewPhaseProps) {
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-black)',
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--space-xs)',
        }}>
          Review Session
        </h1>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-500)',
          margin: 0,
        }}>
          Edit anything that doesn't look right
        </p>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-lg)',
      }}>
        {/* Training Type */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Training Type
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {TRAINING_TYPE_OPTIONS.map(opt => {
              const isSelected = sessionData.trainingType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateField('trainingType', opt.value)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '48px',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Duration
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {DURATION_OPTIONS.map(opt => {
              const isSelected = sessionData.durationMinutes === opt.value && !showCustomDuration;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateField('durationMinutes', opt.value);
                    setShowCustomDuration(false);
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: '48px',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
            <button
              onClick={() => setShowCustomDuration(true)}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: showCustomDuration ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: showCustomDuration ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: showCustomDuration ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              Other
            </button>
          </div>
          {showCustomDuration && (
            <input
              type="number"
              value={customDuration}
              onChange={e => {
                setCustomDuration(e.target.value);
                const mins = parseInt(e.target.value);
                if (!isNaN(mins) && mins > 0) {
                  updateField('durationMinutes', mins);
                }
              }}
              placeholder="Minutes"
              autoFocus
              style={{
                width: '100%',
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                border: '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-white)',
                fontSize: 'var(--text-base)',
              }}
            />
          )}
        </div>

        {/* Sparring Toggle */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Did You Spar?
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => updateField('didSpar', true)}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sessionData.didSpar === true ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sessionData.didSpar === true ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sessionData.didSpar === true ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                updateField('didSpar', false);
                updateField('sparringRounds', null);
                updateField('submissionsGiven', []);
                updateField('submissionsReceived', []);
              }}
              style={{
                flex: 1,
                padding: 'var(--space-md)',
                backgroundColor: sessionData.didSpar === false ? 'var(--color-gold)' : 'var(--color-gray-800)',
                border: sessionData.didSpar === false ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-md)',
                color: sessionData.didSpar === false ? 'var(--color-black)' : 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              No
            </button>
          </div>
        </div>

        {/* Sparring Details (expanded if Yes) */}
        {sessionData.didSpar && (
          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-800)',
            borderLeft: '3px solid var(--color-positive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            {/* Rounds */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-sm)',
              }}>
                Rounds
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                  const isSelected = sessionData.sparringRounds === n;
                  return (
                    <button
                      key={n}
                      onClick={() => updateField('sparringRounds', n)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-gray-800)',
                        border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-700)',
                        borderRadius: 'var(--radius-sm)',
                        color: isSelected ? 'var(--color-black)' : 'var(--color-gray-300)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subs Given */}
            <SubmissionPicker
              label="Subs given"
              selectedSubmissions={sessionData.submissionsGiven}
              onSubmissionsChange={subs => updateField('submissionsGiven', subs)}
              userHistory={[]}
            />

            {/* Submitted By */}
            <SubmissionPicker
              label="Submitted by"
              selectedSubmissions={sessionData.submissionsReceived}
              onSubmissionsChange={subs => updateField('submissionsReceived', subs)}
              userHistory={[]}
            />
          </div>
        )}

        {/* What You Worked On */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            What You Worked On
          </label>

          {sessionData.techniquesDrilled.length > 0 ? (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
            }}>
              {sessionData.techniquesDrilled.map(technique => (
                <div
                  key={technique}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-gold-dim)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    color: 'var(--color-gold)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                  }}>
                    {technique}
                  </span>
                  <button
                    onClick={() => {
                      updateField('techniquesDrilled', sessionData.techniquesDrilled.filter(t => t !== technique));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 var(--space-sm)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderLeft: '1px solid var(--color-gold)',
                      color: 'var(--color-gray-400)',
                      cursor: 'pointer',
                      minHeight: '28px',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-500)',
              fontStyle: 'italic',
            }}>
              Nothing extracted - add techniques below
            </p>
          )}

          {/* Quick add */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-sm)',
          }}>
            {RECENT_TECHNIQUES.filter(t => !sessionData.techniquesDrilled.includes(t)).slice(0, 4).map(technique => (
              <button
                key={technique}
                onClick={() => {
                  updateField('techniquesDrilled', [...sessionData.techniquesDrilled, technique]);
                }}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                + {technique}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
            marginBottom: 'var(--space-sm)',
          }}>
            Notes
          </label>
          <textarea
            value={sessionData.rawText || ''}
            onChange={e => updateField('rawText', e.target.value)}
            placeholder="Anything else you want to remember?"
            rows={3}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-700)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-base)',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Action buttons (sticky at bottom) */}
      <div style={{
        flexShrink: 0,
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
        display: 'flex',
        gap: 'var(--space-md)',
      }}>
        <button
          onClick={onReRecord}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-400)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            minHeight: '56px',
          }}
        >
          Re-Record
        </button>
        <button
          onClick={onSave}
          disabled={!isValid}
          style={{
            flex: 2,
            padding: 'var(--space-md)',
            backgroundColor: isValid ? 'var(--color-gold)' : 'var(--color-gray-800)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: isValid ? 'var(--color-black)' : 'var(--color-gray-500)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            minHeight: '56px',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ===========================================
// SUCCESS PHASE
// ===========================================

function SuccessPhase({ sessionCount, postSessionMessage }: { sessionCount: number; postSessionMessage?: string }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-positive)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        animation: 'scaleIn 0.3s ease-out',
        boxShadow: '0 0 0 15px rgba(34, 197, 94, 0.2), 0 0 0 30px rgba(34, 197, 94, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-white)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Session #{sessionCount} Logged
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
      }}>
        {postSessionMessage || "Keep showing up. Consistency compounds."}
      </p>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ===========================================
// ERROR PHASE
// ===========================================

function ErrorPhase({ onRetry, onCancel }: { onRetry: () => void; onCancel?: () => void }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-negative)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        boxShadow: '0 0 0 15px rgba(239, 68, 68, 0.2), 0 0 0 30px rgba(239, 68, 68, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-white)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Couldn't Save
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-xl)',
      }}>
        Something went wrong. Your data is still here—try again.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button
          onClick={onRetry}
          style={{
            padding: 'var(--space-md) var(--space-xl)',
            backgroundColor: 'var(--color-gold)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-black)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: 'var(--space-md) var(--space-xl)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-gray-600)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-gray-400)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default VoiceFirstLogger;

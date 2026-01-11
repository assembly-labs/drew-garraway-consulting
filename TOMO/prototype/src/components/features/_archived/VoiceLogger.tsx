/**
 * VoiceLogger Component
 * Voice-first training log capture based on conversation design spec
 *
 * Phases:
 * 1. Idle - Ready to record
 * 2. Recording - User speaks about their session
 * 3. Processing - AI extracts structured data
 * 4. GapFill - Optional single follow-up question
 * 5. Review - User confirms extracted summary
 * 6. Success - Confirmation before close
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useUserProfile } from '../../context/UserProfileContext';
import { useBeltPersonalization } from '../../hooks/useBeltPersonalization';
import { markSessionLogged } from './TrainingFeedback';
import type { SubmissionInsert } from '../../types/database';

// Types for extracted session data
interface SparringResult {
  type: 'submission_given' | 'submission_received';
  technique: string;
  partner?: string;
}

interface SessionData {
  date: string;
  time: string;
  dayOfWeek: string;
  trainingType: 'gi' | 'nogi' | null;
  durationMinutes: number | null;
  sparringRounds: number | null;
  techniques: string[];
  sparringResults: SparringResult[];
  workedWell: string[];
  struggles: string[];
  energyLevel: 'high' | 'medium' | 'low' | null;
}

type Phase = 'idle' | 'recording' | 'processing' | 'gap-fill' | 'review' | 'success' | 'error';

// Mock extracted data (simulates AI processing)
const MOCK_EXTRACTED_DATA: SessionData = {
  date: 'Sat, Dec 21',
  time: '10:30 AM',
  dayOfWeek: 'Saturday',
  trainingType: null, // Intentionally null to trigger gap-fill
  durationMinutes: 90,
  sparringRounds: 5,
  techniques: ['Knee slice pass (far arm control)'],
  sparringResults: [
    { type: 'submission_given', technique: 'Collar choke', partner: 'Jake' },
    { type: 'submission_given', technique: 'Armbar', partner: 'Mike' },
    { type: 'submission_given', technique: 'RNC', partner: 'Tom' },
    { type: 'submission_received', technique: 'Triangle', partner: 'Sarah' },
    { type: 'submission_received', technique: 'Kimura', partner: 'Jake' },
  ],
  workedWell: [],
  struggles: ['Half guard top — losing underhook'],
  energyLevel: 'medium',
};

// Mock session count (would come from user data)
const MOCK_SESSION_COUNT = 48;

interface VoiceLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function VoiceLogger({ onComplete, onCancel }: VoiceLoggerProps) {
  const { profile } = useUserProfile();
  const { getPostSessionMessage, getSuggestedPrompts } = useBeltPersonalization();
  const [phase, setPhase] = useState<Phase>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get belt-specific prompts
  const beltPrompts = getSuggestedPrompts();
  const postSessionMessage = getPostSessionMessage();

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
      const data = { ...MOCK_EXTRACTED_DATA };
      setSessionData(data);
      // If training type is unknown, go to gap-fill
      if (data.trainingType === null) {
        transitionTo('gap-fill');
      } else {
        transitionTo('review');
      }
    }, 3000);
  }, [transitionTo]);

  // Handle gap-fill answer
  const handleGapFillAnswer = useCallback((type: 'gi' | 'nogi') => {
    if (sessionData) {
      setSessionData({ ...sessionData, trainingType: type });
    }
    transitionTo('review');
  }, [sessionData, transitionTo]);

  // Save session and submissions
  const handleSave = useCallback(async () => {
    if (!sessionData) return;

    try {
      // Create session first
      const userId = profile.userId;
      const sessionDate = new Date().toISOString().split('T')[0];

      const sessionResult = await api.sessions.create({
        user_id: userId,
        date: sessionDate,
        training_type: sessionData.trainingType || 'gi',
        time: sessionData.time,
        duration_minutes: sessionData.durationMinutes,
        sparring_rounds: sessionData.sparringRounds,
        techniques: sessionData.techniques,
        worked_well: sessionData.workedWell,
        struggles: sessionData.struggles,
        voice_transcript: 'Voice recording transcript', // TODO: Real transcript
      });

      // Save submissions if we have any
      if (sessionResult.data && sessionData.sparringResults.length > 0) {
        const submissionInserts: SubmissionInsert[] = sessionData.sparringResults.map(result => ({
          session_id: sessionResult.data!.id,
          user_id: userId,
          technique_name: result.technique,
          outcome: result.type === 'submission_given' ? 'given' : 'received',
          date: sessionDate,
        }));

        await api.submissions.createBatch(submissionInserts);
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

  // Cancel/close
  const handleCancel = useCallback(() => {
    setPhase('idle');
    setRecordingTime(0);
    setSessionData(null);
    onCancel?.();
  }, [onCancel]);

  // Transition wrapper style
  const getPhaseStyle = (): React.CSSProperties => ({
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      ...getPhaseStyle(),
    }}>
      {phase === 'idle' && (
        <IdlePhase onStart={handleStartRecording} onCancel={handleCancel} prompts={beltPrompts} />
      )}

      {phase === 'recording' && (
        <RecordingPhase
          recordingTime={recordingTime}
          formatTime={formatTime}
          onStop={handleStopRecording}
          onCancel={handleCancel}
          prompts={beltPrompts}
        />
      )}

      {phase === 'processing' && <ProcessingPhase />}

      {phase === 'gap-fill' && (
        <GapFillPhase onAnswer={handleGapFillAnswer} />
      )}

      {phase === 'review' && sessionData && (
        <ReviewPhase
          data={sessionData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {phase === 'success' && <SuccessPhase sessionCount={MOCK_SESSION_COUNT} postSessionMessage={postSessionMessage} />}

      {phase === 'error' && (
        <ErrorPhase
          onRetry={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

// ============================================
// IDLE PHASE - Call to action to start
// ============================================
// Default prompts (fallback if belt personalization not available)
const DEFAULT_PROMPT_HINTS = [
  "How'd today go?",
  "Tell me about the positions.",
  "Tap to anything?",
  "Tap anyone out?",
  "What went well?",
  "What didn't go well?",
];

function IdlePhase({ onStart, onCancel, prompts }: { onStart: () => void; onCancel?: () => void; prompts?: string[] }) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(true);

  // Use belt-specific prompts or fall back to defaults
  const hintPrompts = prompts && prompts.length > 0 ? prompts : DEFAULT_PROMPT_HINTS;

  // Rotate through hints with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsHintVisible(false);

      // After fade out, change text and fade in
      setTimeout(() => {
        setCurrentHintIndex((prev) => (prev + 1) % hintPrompts.length);
        setIsHintVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [hintPrompts.length]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 'var(--space-xl)',
      paddingTop: '15vh',
      textAlign: 'center',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      position: 'relative',
    }}>
      {/* Close button */}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: 'var(--space-lg)',
            left: 'var(--space-lg)',
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            padding: '12px', /* 48px touch target with 24px icon */
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
      )}

      {/* Mic icon with glow - moved up */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '48px',
        boxShadow: '0 0 0 20px rgba(252, 211, 77, 0.15), 0 0 0 40px rgba(252, 211, 77, 0.08)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wider)',
        marginBottom: 'var(--space-lg)',
      }}>
        Log Training
      </h1>

      {/* Rotating hint prompts */}
      <div style={{
        height: 28,
        marginBottom: 'var(--space-2xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-gray-400)',
          maxWidth: 300,
          lineHeight: 'var(--leading-relaxed)',
          margin: 0,
          opacity: isHintVisible ? 1 : 0,
          transform: isHintVisible ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          {hintPrompts[currentHintIndex]}
        </p>
      </div>

      <button
        onClick={onStart}
        className="btn btn-primary btn-lg"
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '20px var(--space-lg)',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
        }}
      >
        Start Recording
      </button>
    </div>
  );
}

// ============================================
// AUDIO WAVEFORM - Simulated visualization
// ============================================
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
      marginBottom: 'var(--space-lg)',
    }}>
      {bars.map((height, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: `${height}px`,
            backgroundColor: 'var(--color-accent)',
            borderRadius: 2,
            transition: 'height 0.1s ease',
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// TALLY MARKS - Chicken scratch counting
// Classic tally: 4 vertical lines + diagonal strike for 5
// ============================================
function TallyMarks({ count, color = 'currentColor' }: { count: number; color?: string }) {
  if (count === 0) {
    return (
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-600)',
      }}>
        0
      </span>
    );
  }

  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Full groups of 5 (four lines + diagonal strike) */}
      {Array.from({ length: fullGroups }).map((_, groupIndex) => (
        <svg
          key={`group-${groupIndex}`}
          width="28"
          height="24"
          viewBox="0 0 28 24"
          style={{ display: 'block' }}
        >
          {/* Four vertical lines */}
          <line x1="4" y1="4" x2="4" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="4" x2="10" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="4" x2="16" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="4" x2="22" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {/* Diagonal strike through */}
          <line x1="1" y1="18" x2="25" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ))}
      {/* Remaining lines (1-4) */}
      {remainder > 0 && (
        <svg
          width={remainder * 6 + 2}
          height="24"
          viewBox={`0 0 ${remainder * 6 + 2} 24`}
          style={{ display: 'block' }}
        >
          {Array.from({ length: remainder }).map((_, i) => (
            <line
              key={`line-${i}`}
              x1={4 + i * 6}
              y1="4"
              x2={4 + i * 6}
              y2="20"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </div>
  );
}

// ============================================
// RECORDING PHASE - Active recording state
// Bold, typography-forward design with strong motion
// ============================================
function RecordingPhase({
  recordingTime,
  formatTime,
  onStop,
  onCancel,
  prompts,
}: {
  recordingTime: number;
  formatTime: (s: number) => string;
  onStop: () => void;
  onCancel: () => void;
  prompts?: string[];
}) {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'visible' | 'exit' | 'enter'>('visible');

  // Use belt-specific prompts or fall back to defaults
  const hintPrompts = prompts && prompts.length > 0 ? prompts : DEFAULT_PROMPT_HINTS;

  // Rotate through hints with strong motion
  useEffect(() => {
    const interval = setInterval(() => {
      // Start exit animation
      setAnimationPhase('exit');

      // After exit, change text and start enter animation
      setTimeout(() => {
        setCurrentHintIndex((prev) => (prev + 1) % hintPrompts.length);
        setAnimationPhase('enter');
      }, 300);

      // Settle to visible
      setTimeout(() => {
        setAnimationPhase('visible');
      }, 600);
    }, 3500);

    return () => clearInterval(interval);
  }, [hintPrompts.length]);

  // Animation styles based on phase
  const getHintStyle = (): React.CSSProperties => {
    switch (animationPhase) {
      case 'exit':
        return {
          opacity: 0,
          transform: 'translateY(-30px) scale(0.95)',
          filter: 'blur(4px)',
        };
      case 'enter':
        return {
          opacity: 1,
          transform: 'translateY(0) scale(1)',
          filter: 'blur(0px)',
        };
      default:
        return {
          opacity: 1,
          transform: 'translateY(0) scale(1)',
          filter: 'blur(0px)',
        };
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top bar - minimal recording indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-lg)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
      }}>
        {/* Cancel button */}
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
          aria-label="Cancel recording"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Recording indicator - compact */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--color-error)',
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

        {/* Spacer for balance */}
        <div style={{ width: 40 }} />
      </div>

      {/* Main content - centered, typography-forward */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        paddingBottom: '160px',
      }}>
        {/* Large rotating hint text - the hero element */}
        <div style={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 340,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 8vw, 36px)',
            fontWeight: 600,
            lineHeight: 1.2,
            textAlign: 'center',
            color: 'var(--color-white)',
            margin: 0,
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease',
            ...getHintStyle(),
          }}>
            {hintPrompts[currentHintIndex]}
          </h2>
        </div>

        {/* Subtle waveform indicator */}
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <AudioWaveform />
        </div>
      </div>

      {/* Bottom action area - fixed */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-xl)',
        paddingBottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-primary) 60%, transparent)',
      }}>
        <button
          onClick={onStop}
          className="btn btn-lg"
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 8px 32px rgba(255,255,255,0.15)',
          }}
        >
          Done
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// PROCESSING PHASE - AI extraction in progress
// ============================================
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
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    }}>
      {/* Spinner */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-full)',
        border: '3px solid var(--color-gray-700)',
        borderTopColor: 'var(--color-accent)',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 'var(--space-xl)',
      }} />

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
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

// ============================================
// GAP-FILL PHASE - Single follow-up question
// ============================================
function GapFillPhase({ onAnswer }: { onAnswer: (type: 'gi' | 'nogi') => void }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    }}>
      {/* Question icon */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-gray-800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.3-.8 2.4-2 2.8-.4.1-.7.3-.8.6-.1.2-.2.4-.2.6v1" />
          <circle cx="12" cy="17" r="0.5" fill="var(--color-accent)" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        One Quick Thing
      </h2>

      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-400)',
        marginBottom: 'var(--space-2xl)',
        maxWidth: 280,
      }}>
        Was this a Gi or No-Gi session?
      </p>

      {/* Answer buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        width: '100%',
        maxWidth: 320,
      }}>
        <button
          onClick={() => onAnswer('gi')}
          className="btn btn-lg"
          style={{
            flex: 1,
            backgroundColor: 'var(--color-training-gi)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Gi
        </button>
        <button
          onClick={() => onAnswer('nogi')}
          className="btn btn-lg"
          style={{
            flex: 1,
            backgroundColor: 'var(--color-training-nogi)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          No-Gi
        </button>
      </div>
    </div>
  );
}

// ============================================
// REVIEW PHASE - Summary card (dark theme)
// ============================================
function ReviewPhase({
  data,
  onSave,
  onCancel,
}: {
  data: SessionData;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-primary)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingTop: 'var(--space-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--color-white)',
            marginBottom: 'var(--space-xs)',
          }}>
            Look Right?
          </h2>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-500)',
          }}>
            Tap save when ready
          </p>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-500)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
          }}
          aria-label="Cancel"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Summary Card */}
      <div style={{
        flex: 1,
        padding: 'var(--space-lg)',
        paddingTop: 0,
        overflowY: 'auto',
      }}>
        <div style={{
          backgroundColor: 'var(--dark-bg-secondary)',
          border: '1px solid var(--dark-border)',
          borderLeft: '4px solid var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
        }}>
          {/* Date/Time Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-md)',
            paddingBottom: 'var(--space-md)',
            borderBottom: '1px solid var(--dark-border)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--color-white)',
              }}>
                {data.date}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-500)',
              }}>
                {data.time}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}>
              {data.trainingType && (
                <span
                  className={`training-badge training-${data.trainingType}`}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {data.trainingType === 'gi' ? 'Gi' : 'No-Gi'}
                </span>
              )}
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-400)',
              }}>
                ~{data.durationMinutes} min
              </span>
              {data.sparringRounds && (
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-400)',
                }}>
                  • {data.sparringRounds} rounds
                </span>
              )}
            </div>
          </div>

          {/* Worked On */}
          {data.techniques.length > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-xs)',
              }}>
                Worked On
              </div>
              {data.techniques.map((tech, i) => (
                <div key={i} style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-200)',
                }}>
                  {tech}
                </div>
              ))}
            </div>
          )}

          {/* Sparring Results - Tally Style */}
          {data.sparringResults.length > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-sm)',
              }}>
                Sparring
              </div>
              <div style={{
                display: 'flex',
                gap: 'var(--space-xl)',
              }}>
                {/* Taps Given */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <TallyMarks
                    count={data.sparringResults.filter(r => r.type === 'submission_given').length}
                    color="var(--color-positive)"
                  />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    taps dished
                  </span>
                </div>
                {/* Taps Received */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <TallyMarks
                    count={data.sparringResults.filter(r => r.type === 'submission_received').length}
                    color="var(--color-negative)"
                  />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    tapped out
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Struggles */}
          {data.struggles.length > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-500)',
                marginBottom: 'var(--space-xs)',
              }}>
                Struggled With
              </div>
              {data.struggles.map((struggle, i) => (
                <div key={i} style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-200)',
                }}>
                  {struggle}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--dark-bg-secondary)',
        borderTop: '1px solid var(--dark-border)',
        display: 'flex',
        gap: 'var(--space-md)',
      }}>
        <button
          onClick={onCancel}
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
          }}
        >
          Start Over
        </button>
        <button
          onClick={onSave}
          className="btn btn-primary"
          style={{
            flex: 2,
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// SUCCESS PHASE - Confirmation with session count
// ============================================
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
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    }}>
      {/* Success checkmark */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-success)',
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

// ============================================
// ERROR PHASE - Save failed, retry option
// ============================================
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
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    }}>
      {/* Error icon */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-error)',
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
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Couldn't Save Session
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-xl)',
      }}>
        Something went wrong. Your session data is still here—try again.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{ minWidth: 120 }}
        >
          Try Again
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="btn btn-outline"
            style={{ minWidth: 120 }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default VoiceLogger;

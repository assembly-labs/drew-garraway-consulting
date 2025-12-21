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
  injuries: { bodyPart: string; notes: string }[];
  energyLevel: 'high' | 'medium' | 'low' | null;
}

type Phase = 'idle' | 'recording' | 'processing' | 'gap-fill' | 'review' | 'success';

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
    { type: 'submission_received', technique: 'Triangle', partner: 'Sarah' },
  ],
  workedWell: [],
  struggles: ['Half guard top — losing underhook'],
  injuries: [{ bodyPart: 'Left knee', notes: 'minor tightness' }],
  energyLevel: 'medium',
};

// Mock session count (would come from user data)
const MOCK_SESSION_COUNT = 48;

interface VoiceLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function VoiceLogger({ onComplete, onCancel }: VoiceLoggerProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [previousPhase, setPreviousPhase] = useState<Phase | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth phase transition
  const transitionTo = useCallback((newPhase: Phase) => {
    setPreviousPhase(phase);
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(newPhase);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, [phase]);

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

  // Save session
  const handleSave = useCallback(() => {
    transitionTo('success');
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [transitionTo, onComplete]);

  // Cancel/close
  const handleCancel = useCallback(() => {
    setPhase('idle');
    setRecordingTime(0);
    setSessionData(null);
    onCancel?.();
  }, [onCancel]);

  // Transition wrapper style
  const getPhaseStyle = (currentPhase: Phase): React.CSSProperties => ({
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      ...getPhaseStyle(phase),
    }}>
      {phase === 'idle' && (
        <IdlePhase onStart={handleStartRecording} onCancel={handleCancel} />
      )}

      {phase === 'recording' && (
        <RecordingPhase
          recordingTime={recordingTime}
          formatTime={formatTime}
          onStop={handleStopRecording}
          onCancel={handleCancel}
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

      {phase === 'success' && <SuccessPhase sessionCount={MOCK_SESSION_COUNT} />}
    </div>
  );
}

// ============================================
// IDLE PHASE - Call to action to start
// ============================================
function IdlePhase({ onStart, onCancel }: { onStart: () => void; onCancel?: () => void }) {
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
            color: 'var(--color-gray-500)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-full)',
            transition: 'color 0.2s, background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--color-white)';
            e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--color-gray-500)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Mic icon with glow */}
      <div style={{
        width: 120,
        height: 120,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
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
        marginBottom: 'var(--space-md)',
      }}>
        Log Training
      </h1>

      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-400)',
        marginBottom: 'var(--space-2xl)',
        maxWidth: 280,
        lineHeight: 'var(--leading-relaxed)',
      }}>
        How'd training go? Just talk—I'm listening.
      </p>

      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          cursor: 'pointer',
          transition: 'transform 0.2s, background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          e.currentTarget.style.transform = 'translateY(0)';
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
// RECORDING PHASE - Active recording state
// ============================================
function RecordingPhase({
  recordingTime,
  formatTime,
  onStop,
  onCancel,
}: {
  recordingTime: number;
  formatTime: (s: number) => string;
  onStop: () => void;
  onCancel: () => void;
}) {
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
      position: 'relative',
    }}>
      {/* Cancel button */}
      <button
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: 'var(--space-lg)',
          left: 'var(--space-lg)',
          background: 'none',
          border: 'none',
          color: 'var(--color-gray-500)',
          cursor: 'pointer',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-full)',
          transition: 'color 0.2s, background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--color-white)';
          e.currentTarget.style.backgroundColor = 'var(--color-gray-800)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--color-gray-500)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Cancel recording"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Recording indicator dot */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)',
      }}>
        <span style={{
          width: 12,
          height: 12,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-error)',
          animation: 'blink 1s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-sm)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-error)',
        }}>
          Recording
        </span>
      </div>

      {/* Audio waveform visualization */}
      <AudioWaveform />

      {/* Timer */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-4xl)',
        fontWeight: 700,
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-lg)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {formatTime(recordingTime)}
      </div>

      {/* Prompt - conversational */}
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        marginBottom: 'var(--space-2xl)',
        maxWidth: 280,
        lineHeight: 'var(--leading-relaxed)',
      }}>
        What'd you work on? How'd the rolls go?
      </p>

      {/* Stop button - prominent */}
      <button
        onClick={onStop}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,255,255,0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,255,255,0.2)';
        }}
      >
        Done
      </button>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
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
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
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
          style={{
            flex: 1,
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-training-gi)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          Gi
        </button>
        <button
          onClick={() => onAnswer('nogi')}
          style={{
            flex: 1,
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-training-nogi)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '1';
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
            Tap save or edit anything that's off
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

          {/* Sparring Results */}
          {data.sparringResults.length > 0 && (
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
                Sparring
              </div>
              {data.sparringResults.map((result, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  fontSize: 'var(--text-base)',
                  marginBottom: 'var(--space-xs)',
                }}>
                  <span style={{
                    color: result.type === 'submission_given'
                      ? 'var(--color-success)'
                      : 'var(--color-error)',
                    fontWeight: 600,
                    fontSize: 'var(--text-lg)',
                  }}>
                    {result.type === 'submission_given' ? '✓' : '✗'}
                  </span>
                  <span style={{ color: 'var(--color-gray-200)' }}>
                    {result.technique}
                    {result.partner && (
                      <span style={{ color: 'var(--color-gray-500)' }}>
                        {result.type === 'submission_given' ? ' → ' : ' ← '}
                        {result.partner}
                      </span>
                    )}
                  </span>
                </div>
              ))}
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

          {/* Physical/Injuries */}
          {data.injuries.length > 0 && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              marginTop: 'var(--space-md)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-warning)',
                marginBottom: 'var(--space-xs)',
              }}>
                Physical
              </div>
              {data.injuries.map((injury, i) => (
                <div key={i} style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-200)',
                }}>
                  {injury.bodyPart}: {injury.notes}
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
          Edit
        </button>
        <button
          onClick={onSave}
          style={{
            flex: 2,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Save ✓
        </button>
      </div>
    </div>
  );
}

// ============================================
// SUCCESS PHASE - Confirmation with session count
// ============================================
function SuccessPhase({ sessionCount }: { sessionCount: number }) {
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
        Keep showing up. Consistency compounds.
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

export default VoiceLogger;

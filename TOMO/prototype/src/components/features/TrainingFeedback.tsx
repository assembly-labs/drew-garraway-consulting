/**
 * TrainingFeedback Component
 *
 * Auto-generated AI training insights with typewriter effect.
 * Based on user's session history and expert coaching philosophy.
 *
 * UX Rules:
 * - Auto-generates ONE insight per day when tab is opened
 * - Only generates if a new session was logged since last insight
 * - Shows "already generated" message if conditions aren't met
 *
 * Brand Voice: "The Dedicated Training Partner"
 * - Knowledgeable but humble
 * - Warm but direct
 * - Always prompts user to validate with their coach
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useBeltPersonalization } from '../../hooks';

// ===========================================
// INSIGHT TRACKING (localStorage)
// ===========================================

const INSIGHT_STORAGE_KEY = 'bjj-insight-tracking';

interface InsightTracking {
  lastInsightDate: string | null;      // ISO date (YYYY-MM-DD) of last generated insight
  lastSessionDate: string | null;       // ISO date of last logged session
  todaysInsight: TrainingInsight | null; // Cached insight for today
}

function getInsightTracking(): InsightTracking {
  try {
    const stored = localStorage.getItem(INSIGHT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error('Failed to parse insight tracking');
  }
  return { lastInsightDate: null, lastSessionDate: null, todaysInsight: null };
}

function saveInsightTracking(tracking: InsightTracking): void {
  localStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify(tracking));
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Called when a session is logged (export for use in SessionLogger)
export function markSessionLogged(): void {
  const tracking = getInsightTracking();
  tracking.lastSessionDate = getTodayDateString();
  saveInsightTracking(tracking);
}

// ===========================================
// TYPES
// ===========================================

interface TrainingInsight {
  id: string;
  title: string;
  content: string;
  focusAreas: string[];
  recommendedVideos: string[];
  generatedAt: string;
}

// ===========================================
// MOCK DATA
// ===========================================

const MOCK_INSIGHTS: TrainingInsight[] = [
  {
    id: 'insight-1',
    title: 'Guard Retention Focus',
    content: `Based on your last 10 sessions, you've logged guard passing as a struggle 6 times - mostly against pressure passers. Here are some patterns I'm noticing:

Your closed guard work is solid (you're landing triangles consistently), but when the guard gets opened, you're having trouble re-establishing frames before weight settles.

Two fundamentals that typically help with this:

1. **Early hip escape** - Move your hips before their weight fully commits. Even a small escape creates space for knee shields.

2. **Inside position on arms** - When framing, focus on controlling their wrists or inside the elbows. Outside frames are easier to collapse.

John Danaher often emphasizes that guard retention is about "winning the race" - your hips need to move before their pressure arrives. It's timing more than strength.

Consider asking your coach to drill some specific sequences where a partner applies steady pressure while you practice early escapes. This is exactly the kind of position-specific drilling that builds the reflexes you need.`,
    focusAreas: ['Guard Retention', 'Hip Escapes', 'Framing'],
    recommendedVideos: ['gnAhAdE_A90', 'cuXq-k__9lQ'],
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'insight-2',
    title: 'Submission Finishing',
    content: `Looking at your recent sessions, you're getting to submission positions but having trouble finishing. Your notes mention "had the armbar but they escaped" twice this week.

This is actually a common pattern at your level - you've developed the setup skills, but the finishing details need refinement. Here's what often helps:

**For armbars specifically:**
- Check your hip position relative to their shoulder. The closer your hips are to their shoulder, the less escape room they have.
- Are you pinching your knees before lifting your hips? The sequence matters - control first, then pressure.
- Wrist control is often underrated. Controlling their wrist (not just the elbow) gives you better leverage.

**General finishing principle:**
Submissions often fail not because of wrong technique, but wrong timing. If you're rushing to finish before position is fully established, you give them the space they need to escape.

Your coach has seen you roll - they can tell you exactly where in the sequence you're losing control. That observation is more valuable than any video. I'd recommend asking them to watch you specifically attempt armbars in your next sparring session.`,
    focusAreas: ['Armbar Finishing', 'Position Before Submission', 'Wrist Control'],
    recommendedVideos: ['ypi3ie6hKTI', 'tyI3aszI4qo'],
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'insight-3',
    title: 'Training Consistency Win',
    content: `I want to highlight something positive: you've trained 12 times in the last 4 weeks, averaging 3 sessions per week. That's above your target of 2x/week and puts you in the top tier of consistency for practitioners at your level.

**Why this matters:**
Research on skill acquisition shows that consistency beats intensity. Two 3x/week months typically produce more progress than one 6x/week month followed by burnout.

**What I'm seeing in your logs:**
- Your technique variety is good - you're not just drilling the same things
- You're logging struggles honestly (this is how you improve)
- Your sparring rounds are increasing gradually (good for injury prevention)

**One observation:**
Your sessions are mostly in the evening. If you ever feel like you're plateauing, consider occasionally training at different times. Morning sessions often have a different energy and different training partners, which can expose blind spots.

Keep showing up. The consistency you're building now compounds over time. Your coach will notice it too.`,
    focusAreas: ['Consistency', 'Training Habits', 'Long-term Progress'],
    recommendedVideos: ['-zgwLkCoWDw'],
    generatedAt: new Date().toISOString(),
  },
];


// ===========================================
// BIOLUMINESCENCE TYPEWRITER HOOK
// ===========================================

// Track each character with its "age" for the glow fade effect
interface CharState {
  char: string;
  addedAt: number; // timestamp when character was added
}

function useTypewriter(text: string, speed: number = 20, startDelay: number = 500) {
  const [charStates, setCharStates] = useState<CharState[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Derived displayedText for compatibility
  const displayedText = charStates.map(c => c.char).join('');

  useEffect(() => {
    setCharStates([]);
    setIsComplete(false);
    setIsStarted(false);

    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay]);

  useEffect(() => {
    if (!isStarted) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        const now = Date.now();
        setCharStates(prev => [...prev, { char: text[index], addedAt: now }]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isStarted]);

  const skip = useCallback(() => {
    const now = Date.now();
    setCharStates(text.split('').map(char => ({ char, addedAt: now - 1000 })));
    setIsComplete(true);
  }, [text]);

  return { displayedText, charStates, isComplete, isStarted, skip };
}

// Component to render text with bioluminescent glow effect
interface GlowTextProps {
  charStates: CharState[];
  isComplete: boolean;
}

function GlowText({ charStates, isComplete }: GlowTextProps) {
  const [, forceUpdate] = useState(0);

  // Re-render periodically to update glow states while animating
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [isComplete]);

  const now = Date.now();
  const glowDuration = 600; // ms for glow to fade

  // Convert charStates to text with spans for glowing characters
  let result: React.ReactNode[] = [];
  let currentParagraph: React.ReactNode[] = [];
  let paragraphIndex = 0;

  charStates.forEach((charState, i) => {
    const age = now - charState.addedAt;
    const isGlowing = age < glowDuration && !isComplete;

    // Calculate glow intensity (1 = full glow, 0 = no glow)
    const glowIntensity = isGlowing ? Math.max(0, 1 - (age / glowDuration)) : 0;

    // Handle newlines - create paragraph breaks
    if (charState.char === '\n') {
      if (currentParagraph.length > 0) {
        result.push(
          <p key={`p-${paragraphIndex}`} style={{ margin: 0, marginBottom: 'var(--space-md)' }}>
            {currentParagraph}
          </p>
        );
        paragraphIndex++;
        currentParagraph = [];
      }
      return;
    }

    // Check if this char is part of bold text (**)
    // For simplicity, we'll handle bold at the paragraph level below

    if (isGlowing) {
      // Bioluminescent glow - soft gold that fades to white
      const goldOpacity = glowIntensity * 0.9;
      const shadowBlur = 8 + (glowIntensity * 12); // 8-20px blur
      const shadowOpacity = glowIntensity * 0.6;

      currentParagraph.push(
        <span
          key={i}
          style={{
            color: `rgba(245, 166, 35, ${0.3 + goldOpacity * 0.7})`,
            textShadow: `0 0 ${shadowBlur}px rgba(245, 166, 35, ${shadowOpacity})`,
            transition: 'color 0.3s ease-out, text-shadow 0.3s ease-out',
          }}
        >
          {charState.char}
        </span>
      );
    } else {
      // Settled text - white
      currentParagraph.push(
        <span key={i} style={{ color: 'var(--color-gray-200)' }}>
          {charState.char}
        </span>
      );
    }
  });

  // Don't forget the last paragraph
  if (currentParagraph.length > 0) {
    result.push(
      <p key={`p-${paragraphIndex}`} style={{ margin: 0, marginBottom: 'var(--space-md)' }}>
        {currentParagraph}
      </p>
    );
  }

  return <>{result}</>;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

interface TrainingFeedbackProps {
  onClose?: () => void;
  onLogSession?: () => void; // Navigate to session logger
}

// Insight generation status
type InsightStatus =
  | 'loading'           // Checking conditions
  | 'generating'        // Auto-generating insight
  | 'ready'             // Insight available (new or cached)
  | 'already_generated' // Already generated today, no new session
  | 'no_session';       // No session logged yet to analyze

export function TrainingFeedback({ onClose, onLogSession }: TrainingFeedbackProps) {
  const [status, setStatus] = useState<InsightStatus>('loading');
  const [currentInsight, setCurrentInsight] = useState<TrainingInsight | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAutoGenerated = useRef(false);

  // Belt personalization for AI feedback tone
  const { chatbot, profile: beltProfile } = useBeltPersonalization();

  // Check conditions and auto-generate on mount
  useEffect(() => {
    if (hasAutoGenerated.current) return;
    hasAutoGenerated.current = true;

    const tracking = getInsightTracking();
    const today = getTodayDateString();

    // Case 1: Already generated today - show cached insight
    if (tracking.lastInsightDate === today && tracking.todaysInsight) {
      setCurrentInsight(tracking.todaysInsight);
      setStatus('ready');
      return;
    }

    // Case 2: No session logged ever
    if (!tracking.lastSessionDate) {
      setStatus('no_session');
      return;
    }

    // Case 3: Already generated today but no new session since
    if (tracking.lastInsightDate === today) {
      setStatus('already_generated');
      return;
    }

    // Case 4: Generated before, but no new session since last insight
    if (tracking.lastInsightDate && tracking.lastSessionDate) {
      const lastInsightTime = new Date(tracking.lastInsightDate).getTime();
      const lastSessionTime = new Date(tracking.lastSessionDate).getTime();

      if (lastSessionTime <= lastInsightTime) {
        setStatus('already_generated');
        return;
      }
    }

    // Case 5: New session logged - auto-generate!
    setStatus('generating');
    setCurrentInsight(null);

    // Simulate API call delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_INSIGHTS.length);
      const insight = {
        ...MOCK_INSIGHTS[randomIndex],
        id: `insight-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      };

      // Save to tracking
      const todayForSave = getTodayDateString();
      const trackingForSave = getInsightTracking();
      trackingForSave.lastInsightDate = todayForSave;
      trackingForSave.todaysInsight = insight;
      saveInsightTracking(trackingForSave);

      setCurrentInsight(insight);
      setStatus('ready');
    }, 2000);
  }, []);

  const { displayedText, charStates, isComplete, isStarted, skip } = useTypewriter(
    currentInsight?.content || '',
    2,
    800
  );

  // Scroll to bottom as text appears
  useEffect(() => {
    if (contentRef.current && isStarted) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedText, isStarted]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--color-black)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: '1px solid var(--color-gray-800)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: 0,
          }}>
            AI Feedback
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
            margin: 0,
            marginTop: '2px',
          }}>
            {chatbot.toneProfile.primary} insights on your training
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-sm)',
              cursor: 'pointer',
              color: 'var(--color-gray-400)',
            }}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 'var(--space-lg)',
        }}
      >
        {/* Loading State */}
        {status === 'loading' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '3px solid var(--color-gray-800)',
              borderTopColor: 'var(--color-gold)',
              animation: 'spin 1s linear infinite',
              marginBottom: 'var(--space-lg)',
            }} />
            <p style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
            }}>
              Checking for new insights...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* No Session State - User needs to log a session first */}
        {status === 'no_session' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--color-gray-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-lg)',
            }}>
              {/* Journal/Book icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}>
              Log Your First Session
            </h3>

            <p style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              maxWidth: '280px',
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 'var(--space-lg)',
            }}>
              Once you log a training session, I can analyze your patterns and provide personalized feedback.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              justifyContent: 'center',
              maxWidth: '280px',
              marginBottom: 'var(--space-xl)',
            }}>
              {chatbot.emphasizeTopics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--color-gray-900)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-500)',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>

            {onLogSession && (
              <button
                onClick={onLogSession}
                className="btn btn-primary"
                style={{
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Log Session
              </button>
            )}
          </div>
        )}

        {/* Already Generated State */}
        {status === 'already_generated' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--color-gray-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-lg)',
            }}>
              {/* Check circle icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
            }}>
              Insight Already Generated
            </h3>

            <p style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              maxWidth: '300px',
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 'var(--space-lg)',
            }}>
              You've already received today's insight. Log a new training session to unlock your next one.
            </p>

            {onLogSession && (
              <button
                onClick={onLogSession}
                className="btn btn-primary"
                style={{
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Log Session
              </button>
            )}

            <div style={{
              padding: 'var(--space-md) var(--space-lg)',
              backgroundColor: 'var(--color-gray-900)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--color-info)',
              maxWidth: '300px',
            }}>
              <p style={{
                color: 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                New insights are generated once per day after you log a session.
              </p>
            </div>
          </div>
        )}

        {/* Generating State */}
        {status === 'generating' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '3px solid var(--color-gray-800)',
              borderTopColor: 'var(--color-gold)',
              animation: 'spin 1s linear infinite',
              marginBottom: 'var(--space-lg)',
            }} />

            <p style={{
              color: 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
            }}>
              Analyzing your training history...
            </p>

            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Insight Display */}
        {status === 'ready' && currentInsight && (
          <div>
            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-gold)',
              margin: 0,
              marginBottom: 'var(--space-lg)',
            }}>
              {currentInsight.title}
            </h3>

            {/* Bioluminescent Typewriter Content */}
            <div style={{
              fontSize: 'var(--text-base)',
              lineHeight: 1.7,
            }}>
              <GlowText charStates={charStates} isComplete={isComplete} />
              {/* Cursor - soft glow */}
              {!isComplete && isStarted && (
                <span style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '1.1em',
                  backgroundColor: 'rgba(245, 166, 35, 0.8)',
                  marginLeft: '2px',
                  borderRadius: '1px',
                  boxShadow: '0 0 8px rgba(245, 166, 35, 0.6), 0 0 16px rgba(245, 166, 35, 0.3)',
                  animation: 'pulse-glow 1.5s ease-in-out infinite',
                }} />
              )}
            </div>

            {/* Skip button */}
            {!isComplete && isStarted && (
              <button
                onClick={skip}
                style={{
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                }}
              >
                Skip to end
              </button>
            )}

            {/* Focus Areas - shown when complete */}
            {isComplete && currentInsight.focusAreas.length > 0 && (
              <div style={{
                marginTop: 'var(--space-xl)',
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-gray-900)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--color-gold)',
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--color-gold)',
                  marginBottom: 'var(--space-md)',
                }}>
                  Focus Areas
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)',
                }}>
                  {currentInsight.focusAreas.map((area, i) => (
                    <span
                      key={i}
                      style={{
                        padding: 'var(--space-xs) var(--space-md)',
                        backgroundColor: 'var(--color-gold-dim)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-gold)',
                        fontWeight: 500,
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Coach Reminder - Belt-Aware Messaging */}
            {isComplete && (
              <div style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--color-info)',
              }}>
                <p style={{
                  color: 'var(--color-gray-300)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {beltProfile.belt === 'white' || beltProfile.belt === 'blue'
                    ? "These insights are based on patterns in your training logs. Your coach can provide personalized guidance based on observing your actual technique. Always validate recommendations with them."
                    : beltProfile.belt === 'black'
                    ? "These patterns come from your training data. You likely already know what needs work—consider this a reminder to stay intentional about areas you've identified."
                    : "These insights highlight patterns from your logs. Your experience helps you filter what applies. Your coach remains a valuable sounding board for technique refinement."
                  }
                </p>
              </div>
            )}

            {/* Next Insight Prompt - shown when complete */}
            {isComplete && (
              <div style={{
                marginTop: 'var(--space-xl)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-900)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}>
                <p style={{
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--text-sm)',
                  margin: 0,
                }}>
                  Log another session to unlock your next insight
                </p>
              </div>
            )}

            <style>{`
              @keyframes blink {
                50% { opacity: 0; }
              }
              @keyframes pulse-glow {
                0%, 100% {
                  opacity: 0.8;
                  box-shadow: 0 0 8px rgba(245, 166, 35, 0.6), 0 0 16px rgba(245, 166, 35, 0.3);
                }
                50% {
                  opacity: 0.4;
                  box-shadow: 0 0 4px rgba(245, 166, 35, 0.3), 0 0 8px rgba(245, 166, 35, 0.15);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingFeedback;

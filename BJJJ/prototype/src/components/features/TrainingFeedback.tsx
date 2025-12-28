/**
 * TrainingFeedback Component
 *
 * On-request AI-generated training insights with typewriter effect.
 * Based on user's session history and expert coaching philosophy.
 *
 * Brand Voice: "The Dedicated Training Partner"
 * - Knowledgeable but humble
 * - Warm but direct
 * - Always prompts user to validate with their coach
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useBeltPersonalization } from '../../hooks';

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
// TYPEWRITER HOOK
// ===========================================

function useTypewriter(text: string, speed: number = 20, startDelay: number = 500) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    setDisplayedText('');
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
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isStarted]);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
  }, [text]);

  return { displayedText, isComplete, isStarted, skip };
}

// ===========================================
// MAIN COMPONENT
// ===========================================

interface TrainingFeedbackProps {
  onClose?: () => void;
}

export function TrainingFeedback({ onClose }: TrainingFeedbackProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<TrainingInsight | null>(null);
  const [insightHistory, setInsightHistory] = useState<TrainingInsight[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Belt personalization for AI feedback tone
  const { chatbot, profile: beltProfile } = useBeltPersonalization();

  const { displayedText, isComplete, isStarted, skip } = useTypewriter(
    currentInsight?.content || '',
    15,
    800
  );

  // Scroll to bottom as text appears
  useEffect(() => {
    if (contentRef.current && isStarted) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedText, isStarted]);

  const generateInsight = useCallback(() => {
    setIsGenerating(true);
    setCurrentInsight(null);

    // Simulate API call delay
    setTimeout(() => {
      // Pick a random insight from mock data
      const randomIndex = Math.floor(Math.random() * MOCK_INSIGHTS.length);
      const insight = {
        ...MOCK_INSIGHTS[randomIndex],
        id: `insight-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      };

      setCurrentInsight(insight);
      setInsightHistory(prev => [insight, ...prev]);
      setIsGenerating(false);
    }, 2000);
  }, []);

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
            Training Feedback
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
            margin: 0,
            marginTop: '2px',
          }}>
            {chatbot.toneProfile.primary} feedback on your training
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
        {/* Empty State - Request Insight */}
        {!currentInsight && !isGenerating && (
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
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
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
              Get Personalized Feedback
            </h3>

            <p style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              maxWidth: '280px',
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}>
              Based on your training history, I'll analyze patterns and suggest areas to focus on.
            </p>

            {/* Belt-specific focus areas */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              justifyContent: 'center',
              marginBottom: 'var(--space-xl)',
              maxWidth: '280px',
            }}>
              {chatbot.emphasizeTopics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--color-gray-900)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-400)',
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>

            <button
              onClick={generateInsight}
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
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Generate Insight
            </button>

            {/* History */}
            {insightHistory.length > 0 && (
              <div style={{
                marginTop: 'var(--space-2xl)',
                width: '100%',
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--space-md)',
                }}>
                  Previous Insights
                </h4>
                {insightHistory.slice(0, 3).map(insight => (
                  <button
                    key={insight.id}
                    onClick={() => setCurrentInsight(insight)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      marginBottom: 'var(--space-sm)',
                      backgroundColor: 'var(--color-gray-900)',
                      border: '1px solid var(--color-gray-800)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      color: 'var(--color-white)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}>
                      {insight.title}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gray-500)',
                    }}>
                      {new Date(insight.generatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
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
        {currentInsight && !isGenerating && (
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

            {/* Typewriter Content */}
            <div style={{
              color: 'var(--color-gray-200)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {displayedText.split('\n').map((paragraph, i) => {
                // Parse bold text (wrapped in **)
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={i} style={{ margin: 0, marginBottom: 'var(--space-md)' }}>
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={j} style={{ color: 'var(--color-white)', fontWeight: 600 }}>
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              })}
              {/* Cursor */}
              {!isComplete && isStarted && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  backgroundColor: 'var(--color-gold)',
                  marginLeft: '2px',
                  animation: 'blink 1s step-end infinite',
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

            {/* Actions - shown when complete */}
            {isComplete && (
              <div style={{
                marginTop: 'var(--space-xl)',
                display: 'flex',
                gap: 'var(--space-md)',
              }}>
                <button
                  onClick={generateInsight}
                  className="btn"
                  style={{ flex: 1 }}
                >
                  Generate New Insight
                </button>
                <button
                  onClick={() => setCurrentInsight(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
              </div>
            )}

            <style>{`
              @keyframes blink {
                50% { opacity: 0; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainingFeedback;

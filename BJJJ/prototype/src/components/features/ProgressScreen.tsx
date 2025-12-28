/**
 * ProgressScreen - Bold Dark Design
 *
 * A comprehensive progress dashboard with editorial feel.
 * Dark, immersive, athletic - like a premium sports documentary about YOU.
 */

import {
  IconFlame,
  IconTrophy,
  IconMedal,
  IconTarget,
  IconBelt,
  IconCalendar,
  IconAward,
  IconZap,
  IconMessage,
  IconStarFilled,
} from '../ui/Icons';

// ============================================
// MOCK DATA
// ============================================

const mockProgressData = {
  user: {
    name: 'Marcus',
    belt: 'blue' as const,
    stripes: 2,
    trainingStartDate: '2022-06-15',
    currentBeltDate: '2023-09-01',
  },

  narrative: {
    greeting: "Solid month, Marcus.",
    mainInsight: "You've been showing up consistently—12 sessions this month puts you above your 3-month average. I'm seeing real development in your guard game. Your sweep attempts are up 40% and you're finishing more triangles than ever.",
    strengthNote: "Your closed guard is becoming a problem for people. Three different training partners mentioned getting caught in your hip bump to triangle combo. That's your game emerging.",
    growthArea: "One thing I'd watch: your escape work has dropped off. You've logged zero mount escape drills in 3 weeks. When's the last time you started a round from bottom mount? Might be worth 10 minutes before your next roll.",
    closingThought: "Keep this pace. You're building something.",
  },

  streak: {
    current: 14,
    longest: 23,
    consistencyScore: 87,
    weeklyTarget: 3,
    weeksHitTarget: 11,
    totalWeeksTracked: 13,
  },

  matTime: {
    thisMonth: { sessions: 12, hours: 18 },
    lastMonth: { sessions: 10, hours: 15 },
    allTime: { sessions: 127, hours: 190 },
    trend: 'up' as const,
    trendPercentage: 20,
  },

  sparring: {
    thisMonth: {
      submissionsLanded: 18,
      timesTapped: 24,
      sweeps: 31,
      passes: 22,
      escapes: 15,
    },
    lastMonth: {
      submissionsLanded: 14,
      timesTapped: 28,
    },
    submissionBreakdown: [
      { name: 'Triangle', count: 8 },
      { name: 'Armbar', count: 5 },
      { name: 'RNC', count: 3 },
      { name: 'Guillotine', count: 2 },
    ],
  },

  techniques: {
    totalLogged: 47,
    categories: {
      guards: { count: 14, trend: 'up' as const },
      passes: { count: 9, trend: 'stable' as const },
      submissions: { count: 12, trend: 'up' as const },
      escapes: { count: 6, trend: 'down' as const },
      takedowns: { count: 6, trend: 'stable' as const },
    },
    signatureMoves: [
      { name: 'Hip Bump Sweep', drillCount: 45, proficiency: 'advanced' },
      { name: 'Triangle from Guard', drillCount: 38, proficiency: 'advanced' },
      { name: 'Scissor Sweep', drillCount: 32, proficiency: 'intermediate' },
    ],
    newThisMonth: ['Berimbolo Entry', 'Worm Guard Basics', 'Leg Drag Pass'],
  },

  positionMastery: {
    closedGuard: 85,
    openGuard: 72,
    halfGuard: 65,
    mount: 58,
    backControl: 70,
    sideControl: 62,
    escapes: 45,
    takedowns: 40,
  },

  beltJourney: [
    {
      belt: 'white' as const,
      startDate: '2022-06-15',
      endDate: '2023-09-01',
      duration: '15 months',
      sessions: 78,
      milestones: ['First submission', 'First competition'],
    },
    {
      belt: 'blue' as const,
      startDate: '2023-09-01',
      endDate: null,
      duration: '15 months (current)',
      sessions: 49,
      milestones: ['100th session', 'First medal'],
    },
  ],

  records: {
    achievements: [
      { id: 1, title: '100 Sessions', earnedDate: '2024-08-15', icon: 'hundred' },
      { id: 2, title: 'Year One', earnedDate: '2023-06-15', icon: 'calendar' },
      { id: 3, title: 'First Comp', earnedDate: '2023-11-20', icon: 'trophy' },
      { id: 4, title: '50 Subs', earnedDate: '2024-07-01', icon: 'target' },
      { id: 5, title: 'Iron Will', earnedDate: '2024-03-10', icon: 'flame' },
      { id: 6, title: 'Blue Belt', earnedDate: '2023-09-01', icon: 'belt' },
    ],
    personalBests: [
      { label: 'Longest Streak', value: '23 weeks', date: 'March 2024' },
      { label: 'Most Sessions (Month)', value: '16 sessions', date: 'January 2024' },
      { label: 'Most Mat Hours (Week)', value: '8.5 hours', date: 'February 2024' },
    ],
    recentUnlocks: [{ title: '100 Sessions', date: '2024-08-15' }],
  },
};

// ============================================
// HELPER COMPONENTS
// ============================================

function AchievementIcon({ type, size = 24 }: { type: string; size?: number }) {
  const iconProps = { size, strokeWidth: 1.5 };
  switch (type) {
    case 'hundred': return <IconAward {...iconProps} />;
    case 'calendar': return <IconCalendar {...iconProps} />;
    case 'trophy': return <IconTrophy {...iconProps} />;
    case 'target': return <IconTarget {...iconProps} />;
    case 'flame': return <IconFlame {...iconProps} />;
    case 'belt': return <IconBelt {...iconProps} />;
    case 'medal': return <IconMedal {...iconProps} />;
    case 'zap': return <IconZap {...iconProps} />;
    default: return <IconAward {...iconProps} />;
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

interface ProgressScreenProps {
  onNavigate?: (view: string) => void;
}

export function ProgressScreen(_props: ProgressScreenProps) {
  const data = mockProgressData;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black)' }}>

      {/* ========================================
          HERO - Full screen stat
          ======================================== */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'var(--space-lg)',
        paddingBottom: 'var(--space-2xl)',
        position: 'relative',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-gold)',
          marginBottom: 'var(--space-sm)',
        }}>
          December 2024
        </div>

        <div className="hero-stat" style={{
          fontSize: '120px',
          lineHeight: 0.85,
        }}>
          {data.matTime.allTime.sessions}
        </div>

        <div style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 300,
          color: 'var(--color-gray-400)',
          marginTop: 'var(--space-xs)',
          marginBottom: 'var(--space-lg)',
        }}>
          sessions logged
        </div>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-400)',
          maxWidth: '280px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          That's <strong style={{ color: 'var(--color-white)' }}>{data.matTime.allTime.hours} hours</strong> on the mat since you started. You're showing up.
        </p>
      </section>

      {/* ========================================
          NARRATIVE - Editorial quote
          ======================================== */}
      <section style={{
        padding: 'var(--space-2xl) var(--space-lg)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '12px',
          fontSize: '160px',
          fontWeight: 700,
          color: 'var(--color-gray-800)',
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          "
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-gold)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}>
          <IconMessage size={16} />
          Your Debrief
        </div>

        <p style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'var(--color-gray-100)',
          position: 'relative',
          margin: 0,
        }}>
          {data.narrative.mainInsight.split('40%').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<em style={{ fontStyle: 'normal', color: 'var(--color-gold)' }}>40%</em></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </section>

      {/* ========================================
          CALLOUTS - Strength & Watch
          ======================================== */}
      <div className="callout callout-success" style={{ margin: '0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-success)',
          marginBottom: 'var(--space-sm)',
        }}>
          What's Working
        </div>
        <p style={{
          fontSize: 'var(--text-base)',
          lineHeight: 1.6,
          color: 'var(--color-gray-100)',
          margin: 0,
        }}>
          {data.narrative.strengthNote}
        </p>
      </div>

      <div className="callout callout-warning" style={{ margin: '0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-warning)',
          marginBottom: 'var(--space-sm)',
        }}>
          Area to Watch
        </div>
        <p style={{
          fontSize: 'var(--text-base)',
          lineHeight: 1.6,
          color: 'var(--color-gray-100)',
          margin: 0,
        }}>
          {data.narrative.growthArea}
        </p>
      </div>

      {/* ========================================
          SPARRING SPLIT - Two-cell grid
          ======================================== */}
      <div className="insight-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="insight-cell">
          <div className="stat-label">Submissions</div>
          <div className="stat-value stat-value-success">{data.sparring.thisMonth.submissionsLanded}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-xs)' }}>
            +{data.sparring.thisMonth.submissionsLanded - data.sparring.lastMonth.submissionsLanded} vs last month
          </div>
        </div>
        <div className="insight-cell">
          <div className="stat-label">Times Tapped</div>
          <div className="stat-value stat-value-error">{data.sparring.thisMonth.timesTapped}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-xs)' }}>
            {data.sparring.lastMonth.timesTapped - data.sparring.thisMonth.timesTapped} fewer than last
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid var(--color-gray-800)' }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Your ratio improved from <strong style={{ color: 'var(--color-white)' }}>1:2</strong> to <strong style={{ color: 'var(--color-white)' }}>1:1.3</strong>. Tapping more often usually means rolling with people who challenge you. This is progress.
        </p>
      </div>

      {/* ========================================
          STREAK - Typographic dominance
          ======================================== */}
      <section style={{
        padding: 'var(--space-3xl) var(--space-lg)',
        textAlign: 'center',
        position: 'relative',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '140px',
          fontWeight: 700,
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          color: 'var(--color-white)',
          position: 'relative',
        }}>
          {data.streak.current}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'var(--color-gold)',
          marginTop: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-sm)',
        }}>
          <IconFlame size={16} />
          Week Streak
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2xl)',
          marginTop: 'var(--space-xl)',
          paddingTop: 'var(--space-lg)',
          borderTop: '1px solid var(--color-gray-800)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-white)' }}>
              {data.streak.longest}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
              Best Ever
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-success)' }}>
              {data.streak.consistencyScore}%
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
              Consistency
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          POSITION MAP - Heat map style
          ======================================== */}
      <section style={{
        padding: 'var(--space-xl) var(--space-lg)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-lg)',
        }}>
          <span className="card-title">Position Mastery</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Your shape on the mat</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
        }}>
          {Object.entries(data.positionMastery).map(([key, value]) => {
            const bgOpacity = value >= 70 ? 0.6 : value >= 50 ? 0.3 : 0.15;
            const bgColor = value >= 70 ? 'var(--color-success)' : value >= 50 ? 'var(--color-gold)' : 'var(--color-gray-600)';

            return (
              <div
                key={key}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  background: `linear-gradient(135deg, ${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`,
                }}
              >
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-white)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--color-white)',
                  marginTop: '4px',
                }}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================
          SUBMISSIONS - Ranked bars
          ======================================== */}
      <section style={{
        padding: 'var(--space-xl) var(--space-lg)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-lg)',
        }}>
          <span className="card-title">Submissions</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>This month</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {data.sparring.submissionBreakdown.map((sub, i) => {
            const maxCount = data.sparring.submissionBreakdown[0].count;
            const widthPercent = (sub.count / maxCount) * 100;
            const isTop = i === 0;

            return (
              <div key={sub.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-600)',
                  width: '20px',
                }}>
                  0{i + 1}
                </span>
                <div style={{
                  flex: 1,
                  height: '32px',
                  background: 'var(--color-gray-900)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${widthPercent}%`,
                    background: isTop ? 'var(--color-gold)' : 'var(--color-gray-700)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 'var(--space-sm)',
                  }}>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: isTop ? 'var(--color-black)' : 'var(--color-white)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {sub.name}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-white)',
                  minWidth: '32px',
                  textAlign: 'right',
                }}>
                  {sub.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================
          ARSENAL - Technique inventory
          ======================================== */}
      <section style={{
        padding: 'var(--space-xl) var(--space-lg)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <span className="card-title">Technique Arsenal</span>

        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-md)',
          marginTop: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)',
        }}>
          <span style={{
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-white)',
          }}>
            {data.techniques.totalLogged}
          </span>
          <span style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Techniques<br />Logged
          </span>
        </div>

        <div className="insight-grid" style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          marginBottom: 'var(--space-lg)',
        }}>
          {Object.entries(data.techniques.categories).map(([key, value]) => (
            <div key={key} className="insight-cell" style={{ padding: 'var(--space-md) var(--space-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-white)' }}>
                {value.count}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', marginTop: '4px' }}>
                {key}
              </div>
              {value.trend !== 'stable' && (
                <div style={{ fontSize: 'var(--text-xs)', color: value.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)', marginTop: '2px' }}>
                  {value.trend === 'up' ? '↑' : '↓'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Signature Moves */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-md)',
          }}>
            <IconStarFilled size={14} color="var(--color-gold)" />
            <span className="card-title" style={{ fontSize: '12px' }}>Signature Moves</span>
          </div>

          {data.techniques.signatureMoves.map((move) => (
            <div
              key={move.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-md) 0',
                borderBottom: '1px solid var(--color-gray-800)',
              }}
            >
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-white)' }}>
                  {move.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  {move.drillCount} reps logged
                </div>
              </div>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '6px 12px',
                background: move.proficiency === 'advanced' ? 'var(--color-success)' : 'var(--color-gray-700)',
                color: move.proficiency === 'advanced' ? 'var(--color-black)' : 'var(--color-white)',
              }}>
                {move.proficiency}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================
          BELT JOURNEY - Timeline
          ======================================== */}
      <section style={{
        padding: 'var(--space-xl) var(--space-lg)',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 'var(--space-lg)',
        }}>
          <span className="card-title">Your Journey</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Since June 2022</span>
        </div>

        <div style={{ position: 'relative', paddingLeft: 'var(--space-xl)' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '8px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: `linear-gradient(180deg, var(--color-gold) 0%, var(--color-gold) 60%, var(--color-gray-700) 60%, var(--color-gray-700) 100%)`,
          }} />

          {data.beltJourney.map((belt, i) => {
            const isCurrent = belt.endDate === null;

            return (
              <div key={belt.belt} style={{ position: 'relative', paddingBottom: i < data.beltJourney.length - 1 ? 'var(--space-xl)' : 0 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-26px',
                  top: '4px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: belt.belt === 'white' ? 'var(--color-white)' : `var(--color-belt-${belt.belt})`,
                  border: '2px solid var(--color-black)',
                  boxShadow: isCurrent ? '0 0 0 4px var(--color-gold)' : 'none',
                }} />

                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isCurrent ? 'var(--color-gold)' : 'var(--color-white)',
                }}>
                  {belt.belt} Belt {isCurrent && '— Current'}
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-500)',
                  marginTop: '4px',
                }}>
                  {belt.duration} · {belt.sessions} sessions
                </div>

                {belt.milestones.length > 0 && (
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    {belt.milestones.map((m) => (
                      <span key={m} style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '4px 8px',
                        background: 'var(--color-gray-800)',
                        color: 'var(--color-gray-200)',
                      }}>
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================
          ACHIEVEMENTS
          ======================================== */}
      <section style={{
        padding: 'var(--space-xl) var(--space-lg)',
        paddingBottom: '120px',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <span className="card-title">Achievements</span>

        {/* Recent unlock highlight */}
        {data.records.recentUnlocks.length > 0 && (
          <div style={{
            background: 'var(--color-gold)',
            margin: 'var(--space-lg) calc(-1 * var(--space-lg))',
            padding: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
          }}>
            <IconAward size={32} color="var(--color-black)" strokeWidth={1.5} />
            <div style={{ color: 'var(--color-black)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.7 }}>
                Just Unlocked
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                {data.records.recentUnlocks[0].title}
              </div>
            </div>
          </div>
        )}

        {/* Achievement grid */}
        <div className="insight-grid" style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          marginTop: 'var(--space-lg)',
        }}>
          {data.records.achievements.map((achievement) => (
            <div key={achievement.id} className="insight-cell" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <AchievementIcon type={achievement.icon} size={28} />
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-white)' }}>
                {achievement.title}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                {new Date(achievement.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* Personal Records */}
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <span className="card-title" style={{ fontSize: '12px' }}>Personal Records</span>

          {data.records.personalBests.map((record) => (
            <div
              key={record.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-md) 0',
                borderBottom: '1px solid var(--color-gray-800)',
              }}
            >
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-400)' }}>
                {record.label}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-white)' }}>
                  {record.value}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                  {record.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default ProgressScreen;

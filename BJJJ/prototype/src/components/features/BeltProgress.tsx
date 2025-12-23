/**
 * BeltProgress Component
 *
 * HONEST progress tracking based on REAL data:
 * - Belt history (actual promotions)
 * - Time at belt (calculated from dates)
 * - Session volume (from journal entries)
 * - Logged struggles and techniques (aggregated from sessions)
 *
 * What we DON'T show (because we can't honestly calculate it):
 * - "% to next belt" (only coach knows)
 * - Technique proficiency scores (requires real assessment)
 * - Position mastery heat maps (made-up numbers)
 *
 * Design: Bold, typography-forward, mobile-first, dark theme
 */

import { useMemo } from 'react';
import { mockBeltHistory } from '../../data/progress';
import { mockJournalEntries, mockTrainingStats } from '../../data/journal';

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Calculate months between two dates
 */
function monthsBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

/**
 * Format date to readable string
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Get IBJJF minimum time requirement for next belt
 */
function getIBJJFMinMonths(currentBelt: string): number {
  const requirements: Record<string, number> = {
    white: 0,      // No minimum to stay at white
    blue: 24,      // 2 years minimum at blue before purple
    purple: 18,    // 1.5 years minimum at purple before brown
    brown: 12,     // 1 year minimum at brown before black
    black: 0,
  };
  return requirements[currentBelt] || 0;
}

/**
 * Get belt display color
 */
function getBeltColor(belt: string): string {
  const colors: Record<string, string> = {
    white: 'var(--color-belt-white)',
    blue: 'var(--color-belt-blue)',
    purple: 'var(--color-belt-purple)',
    brown: 'var(--color-belt-brown)',
    black: 'var(--color-belt-black)',
  };
  return colors[belt] || 'var(--color-gray-500)';
}

/**
 * Get next belt name
 */
function getNextBelt(current: string): string | null {
  const progression: Record<string, string> = {
    white: 'Blue',
    blue: 'Purple',
    purple: 'Brown',
    brown: 'Black',
  };
  return progression[current] || null;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function BeltProgress() {
  const stats = mockTrainingStats;

  // Derive current belt info from history (most recent entry)
  const currentBeltInfo = useMemo(() => {
    const sorted = [...mockBeltHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  }, []);

  // Find when they got their current belt (not stripe)
  const lastBeltPromotion = useMemo(() => {
    const sorted = [...mockBeltHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.find(p => p.toBelt !== p.fromBelt) || sorted[sorted.length - 1];
  }, []);

  // Calculate time at current belt
  const timeAtBelt = useMemo(() => {
    if (!lastBeltPromotion) return 0;
    return monthsBetween(lastBeltPromotion.date, new Date().toISOString());
  }, [lastBeltPromotion]);

  // IBJJF minimum time
  const ibjjfMinMonths = getIBJJFMinMonths(currentBeltInfo?.toBelt || 'white');
  const monthsRemaining = Math.max(0, ibjjfMinMonths - timeAtBelt);
  const meetsTimeRequirement = timeAtBelt >= ibjjfMinMonths;

  // Build timeline for visualization
  const timeline = useMemo(() => {
    return mockBeltHistory.map((promo, index) => ({
      belt: promo.toBelt,
      stripes: promo.toStripes,
      date: promo.date,
      label: promo.toStripes > 0
        ? `${promo.toBelt.charAt(0).toUpperCase()}${promo.toStripes}`
        : promo.toBelt.charAt(0).toUpperCase(),
      isCurrent: index === mockBeltHistory.length - 1,
    }));
  }, []);

  // Calculate total journey time
  const totalJourneyMonths = useMemo(() => {
    if (mockBeltHistory.length < 2) return 0;
    const first = mockBeltHistory[0];
    const last = mockBeltHistory[mockBeltHistory.length - 1];
    return monthsBetween(first.date, last.date);
  }, []);

  // Aggregate what user is getting caught with (from sparring losses)
  const recentStruggles = useMemo(() => {
    const patterns: string[] = [];
    mockJournalEntries.slice(0, 10).forEach(entry => {
      entry.sparringRounds.forEach(round => {
        if (round.outcome === 'submission-loss' && round.submissionType) {
          patterns.push(`${round.submissionType} defense`);
        }
      });
    });

    // Count and return top patterns
    const counts = new Map<string, number>();
    patterns.forEach(p => counts.set(p, (counts.get(p) || 0) + 1));
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, []);

  // Aggregate frequently drilled techniques
  const frequentTechniques = useMemo(() => {
    const counts = new Map<string, number>();
    mockJournalEntries.forEach(entry => {
      entry.techniques.forEach(t => {
        const name = t.techniqueName;
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Sparring record from recent sessions
  const recentSparringRecord = useMemo(() => {
    let wins = 0, losses = 0, draws = 0;
    mockJournalEntries.slice(0, 10).forEach(entry => {
      entry.sparringRounds.forEach(round => {
        if (round.outcome.includes('win')) wins++;
        else if (round.outcome.includes('loss')) losses++;
        else draws++;
      });
    });
    return { wins, losses, draws, total: wins + losses + draws };
  }, []);

  const nextBelt = getNextBelt(currentBeltInfo?.toBelt || 'white');

  return (
    <div style={{
      background: 'var(--color-black)',
      minHeight: '100vh',
      paddingBottom: '120px',
    }}>

      {/* ============================================
          HERO - Current Belt
          ============================================ */}
      <section style={{
        padding: '48px 24px 32px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        {/* Belt Badge - Large */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '80px',
            height: '16px',
            backgroundColor: getBeltColor(currentBeltInfo?.toBelt || 'white'),
            borderRadius: '2px',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {/* Stripes */}
            {currentBeltInfo && currentBeltInfo.toStripes > 0 && (
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '3px',
              }}>
                {Array.from({ length: currentBeltInfo.toStripes }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: '12px',
                      backgroundColor: 'white',
                      borderRadius: '1px',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          margin: 0,
          marginBottom: '8px',
        }}>
          {currentBeltInfo?.toBelt || 'White'} Belt
        </h1>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          margin: 0,
        }}>
          Since {formatDate(lastBeltPromotion?.date || '')}
        </p>
      </section>

      {/* ============================================
          TIME AT BELT
          ============================================ */}
      <section style={{
        padding: '32px 24px',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'var(--color-white)',
              lineHeight: 1,
            }}>
              {timeAtBelt}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-widest)',
              marginTop: '4px',
            }}>
              Months at {currentBeltInfo?.toBelt || 'white'}
            </div>
          </div>

          {nextBelt && ibjjfMinMonths > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)',
                marginBottom: '4px',
              }}>
                IBJJF Minimum for {nextBelt}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: meetsTimeRequirement ? 'var(--color-positive)' : 'var(--color-gray-300)',
              }}>
                {ibjjfMinMonths} mo
              </div>
            </div>
          )}
        </div>

        {/* Time Progress Bar */}
        {nextBelt && ibjjfMinMonths > 0 && (
          <div>
            <div style={{
              height: '8px',
              backgroundColor: 'var(--color-gray-800)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (timeAtBelt / ibjjfMinMonths) * 100)}%`,
                backgroundColor: meetsTimeRequirement ? 'var(--color-positive)' : 'var(--color-gold)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: meetsTimeRequirement ? 'var(--color-positive)' : 'var(--color-gray-400)',
              marginTop: '8px',
            }}>
              {meetsTimeRequirement
                ? '✓ Time requirement met'
                : `${monthsRemaining} months remaining`
              }
            </div>
          </div>
        )}
      </section>

      {/* ============================================
          TRAINING VOLUME
          ============================================ */}
      <section style={{
        padding: '32px 24px',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-500)',
          marginBottom: '20px',
        }}>
          Training Volume
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
        }}>
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-white)',
            }}>
              {stats.totalSessions}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Total Sessions
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-white)',
            }}>
              {stats.totalHours}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Total Hours
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-gold)',
            }}>
              {stats.currentStreak}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Day Streak
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-white)',
            }}>
              {stats.thisMonth.sessions}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              This Month
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          RECENT SPARRING
          ============================================ */}
      {recentSparringRecord.total > 0 && (
        <section style={{
          padding: '32px 24px',
          borderBottom: '1px solid var(--color-gray-800)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: '20px',
          }}>
            Recent Sparring (Last 10 Sessions)
          </h2>

          <div style={{
            display: 'flex',
            gap: '32px',
          }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-positive)',
              }}>
                {recentSparringRecord.wins}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
              }}>
                Subs Given
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-negative)',
              }}>
                {recentSparringRecord.losses}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
              }}>
                Tapped
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-gray-400)',
              }}>
                {recentSparringRecord.draws}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                textTransform: 'uppercase',
              }}>
                Draws
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          PATTERNS FROM YOUR LOGS
          ============================================ */}
      <section style={{
        padding: '32px 24px',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-500)',
          marginBottom: '20px',
        }}>
          Patterns From Your Logs
        </h2>

        {/* Getting Caught */}
        {recentStruggles.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-negative)',
              marginBottom: '12px',
            }}>
              Getting Caught
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentStruggles.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-gray-900)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--color-negative)',
                }}>
                  <span style={{ color: 'var(--color-gray-200)', fontSize: 'var(--text-sm)' }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-500)',
                  }}>
                    {item.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequently Drilled */}
        {frequentTechniques.length > 0 && (
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-positive)',
              marginBottom: '12px',
            }}>
              Frequently Drilled
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {frequentTechniques.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-gray-900)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--color-positive)',
                }}>
                  <span style={{ color: 'var(--color-gray-200)', fontSize: 'var(--text-sm)' }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-500)',
                  }}>
                    {item.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================
          BELT TIMELINE
          ============================================ */}
      <section style={{
        padding: '32px 24px',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
          }}>
            Your Journey
          </h2>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
          }}>
            {Math.floor(totalJourneyMonths / 12)}y {totalJourneyMonths % 12}m
          </span>
        </div>

        {/* Timeline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          overflowX: 'auto',
          paddingBottom: '16px',
        }}>
          {timeline.map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Node */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '48px',
              }}>
                <div style={{
                  width: entry.isCurrent ? '20px' : '12px',
                  height: entry.isCurrent ? '20px' : '12px',
                  borderRadius: '50%',
                  backgroundColor: getBeltColor(entry.belt),
                  border: entry.isCurrent ? '3px solid var(--color-gold)' : 'none',
                  boxShadow: entry.isCurrent ? '0 0 12px var(--color-gold)' : 'none',
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: entry.isCurrent ? 700 : 400,
                  color: entry.isCurrent ? 'var(--color-white)' : 'var(--color-gray-500)',
                  marginTop: '8px',
                  textTransform: 'uppercase',
                }}>
                  {entry.label}
                </div>
              </div>

              {/* Connector line */}
              {i < timeline.length - 1 && (
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: 'var(--color-gray-700)',
                }} />
              )}
            </div>
          ))}

          {/* Future node */}
          {nextBelt && (
            <>
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: 'var(--color-gray-800)',
              }} />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '48px',
                opacity: 0.4,
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px dashed var(--color-gray-600)',
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-600)',
                  marginTop: '8px',
                }}>
                  {nextBelt.charAt(0)}?
                </div>
              </div>
            </>
          )}
        </div>

        {/* First and current date labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-600)',
          }}>
            {formatDate(mockBeltHistory[0]?.date || '')}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-600)',
          }}>
            {formatDate(mockBeltHistory[mockBeltHistory.length - 1]?.date || '')}
          </span>
        </div>
      </section>

      {/* ============================================
          COACH DISCLAIMER
          ============================================ */}
      <section style={{
        padding: '24px',
        margin: '24px',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '3px solid var(--color-info)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-info)"
            strokeWidth="2"
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <p style={{
              color: 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              This shows your logged training activity. Your coach determines promotion readiness based on technique, understanding, and mat behavior—not just time and volume.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BeltProgress;

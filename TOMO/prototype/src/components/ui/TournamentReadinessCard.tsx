/**
 * Tournament Readiness Card
 *
 * A bold, dark module displaying competition readiness score.
 * Shows overall score, four pillars breakdown, and belt-specific guidance.
 *
 * Design: Matches Dashboard aesthetic - large numbers, gold accents, full-bleed
 */

import { useMemo } from 'react';
import {
  calculateTournamentReadiness,
  readinessLevelConfig,
  type TournamentReadinessInput,
  type TournamentReadinessResult,
} from '../../utils/tournament-readiness';
import { useCountUp } from '../../hooks';

// ===========================================
// TYPES
// ===========================================

interface TournamentReadinessCardProps {
  input: TournamentReadinessInput;
  showFullBreakdown?: boolean;
  onExpand?: () => void;
}

// ===========================================
// PILLAR BAR COMPONENT
// ===========================================

function PillarBar({
  label,
  score,
  weight,
  insight,
  isExpanded,
}: {
  label: string;
  score: number;
  weight: number;
  insight: string;
  isExpanded?: boolean;
}) {
  const barColor =
    score >= 70 ? 'var(--color-success)' :
    score >= 50 ? 'var(--color-gold)' :
    score >= 30 ? 'var(--color-warning)' :
    'var(--color-gray-600)';

  return (
    <div style={{ marginBottom: isExpanded ? '20px' : '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-white)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: barColor,
          }}>
            {score}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
          }}>
            {Math.round(weight * 100)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '6px',
        background: 'var(--color-gray-800)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: barColor,
          borderRadius: '3px',
          transition: 'width 0.5s ease-out',
        }} />
      </div>

      {/* Insight (only when expanded) */}
      {isExpanded && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          margin: '8px 0 0 0',
          lineHeight: 1.5,
        }}>
          {insight}
        </p>
      )}
    </div>
  );
}

// ===========================================
// URGENCY BADGE
// ===========================================

function UrgencyBadge({ level, daysUntil }: { level: string; daysUntil?: number }) {
  if (level === 'none') return null;

  const config = {
    high: { color: 'var(--color-error)', label: 'This Week' },
    medium: { color: 'var(--color-warning)', label: `${daysUntil} Days Out` },
    low: { color: 'var(--color-gold)', label: `${daysUntil} Days Out` },
  }[level] || { color: 'var(--color-gray-500)', label: '' };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: `${config.color}20`,
      borderRadius: '4px',
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: config.color,
        animation: level === 'high' ? 'pulse 1.5s infinite' : undefined,
      }} />
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: config.color,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        {config.label}
      </span>
    </div>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function TournamentReadinessCard({
  input,
  showFullBreakdown = false,
  onExpand,
}: TournamentReadinessCardProps) {
  const result: TournamentReadinessResult = useMemo(
    () => calculateTournamentReadiness(input),
    [input]
  );

  const animatedScore = useCountUp(result.overallScore, { duration: 800, delay: 100 });
  const levelConfig = readinessLevelConfig[result.readinessLevel];

  return (
    <section
      style={{
        background: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow based on readiness */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-30%',
        width: '80%',
        height: '150%',
        background: `radial-gradient(circle, ${levelConfig.color}15 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '24px 24px 0',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'var(--color-gold)',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              Tournament Readiness
            </div>
          </div>
          <UrgencyBadge
            level={result.urgencyLevel}
            daysUntil={input.daysUntilCompetition}
          />
        </div>
      </div>

      {/* Main Score Display */}
      <div style={{
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'clamp(80px, 25vw, 120px)',
          fontWeight: 800, /* Extra Bold for hero numbers */
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          color: levelConfig.color,
          position: 'relative',
        }}>
          {animatedScore}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          letterSpacing: '0.25em',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '12px',
        }}>
          O U T  O F  1 0 0
        </div>

        {/* Readiness Level Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '8px 16px',
          background: `${levelConfig.color}20`,
          borderRadius: '4px',
        }}>
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: levelConfig.color,
          }}>
            {levelConfig.label}
          </span>
        </div>

        {/* Belt Message */}
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-300)',
          maxWidth: '300px',
          margin: '20px auto 0',
          lineHeight: 1.6,
        }}>
          {result.beltMessage}
        </p>
      </div>

      {/* Four Pillars Breakdown */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid var(--color-gray-800)',
      }}>
        <PillarBar
          label={result.pillars.technical.label}
          score={result.pillars.technical.score}
          weight={result.pillars.technical.weight}
          insight={result.pillars.technical.insight}
          isExpanded={showFullBreakdown}
        />
        <PillarBar
          label={result.pillars.sparring.label}
          score={result.pillars.sparring.score}
          weight={result.pillars.sparring.weight}
          insight={result.pillars.sparring.insight}
          isExpanded={showFullBreakdown}
        />
        <PillarBar
          label={result.pillars.consistency.label}
          score={result.pillars.consistency.score}
          weight={result.pillars.consistency.weight}
          insight={result.pillars.consistency.insight}
          isExpanded={showFullBreakdown}
        />
        <PillarBar
          label={result.pillars.experience.label}
          score={result.pillars.experience.score}
          weight={result.pillars.experience.weight}
          insight={result.pillars.experience.insight}
          isExpanded={showFullBreakdown}
        />
      </div>

      {/* Expand Button */}
      {!showFullBreakdown && onExpand && (
        <button
          onClick={onExpand}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid var(--color-gray-800)',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          View Full Breakdown
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      {/* Pulse animation for urgency */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

export default TournamentReadinessCard;

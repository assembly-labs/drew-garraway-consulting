/**
 * StyleFingerprint Component
 *
 * A radar chart visualization showing a practitioner's game style
 * across 6 key dimensions. Derives style archetype from the shape.
 *
 * Dimensions:
 * - Guard Game: Bottom position offense (sweeps, guard subs)
 * - Passing: Ability to get past guards
 * - Top Control: Mount, side control dominance
 * - Back Attacks: Back takes and finishes
 * - Takedowns: Standing game proficiency
 * - Leg Locks: Modern leg attack game
 */

import { useMemo } from 'react';

// ===========================================
// TYPES
// ===========================================

export interface StyleDimension {
  id: string;
  label: string;
  shortLabel: string;
  value: number; // 0-100
  description: string;
}

export interface StyleArchetype {
  name: string;
  description: string;
  icon: 'guard' | 'pressure' | 'back' | 'legs' | 'wrestler' | 'balanced' | 'finisher';
  famousExamples?: string[];
}

export interface StyleFingerprintData {
  dimensions: StyleDimension[];
  archetype: StyleArchetype;
  dominantStyle: string;
  weakestArea: string;
  balanceScore: number; // 0-100, higher = more balanced
}

interface StyleFingerprintProps {
  data: StyleFingerprintData;
  size?: number;
  showLabels?: boolean;
  showArchetype?: boolean;
  animated?: boolean;
}

// ===========================================
// STYLE CALCULATION UTILITIES
// ===========================================

/**
 * Calculate style dimensions from training data
 */
export function calculateStyleFingerprint(
  positionMastery: { position: string; attackScore: number; defenseScore: number }[],
  submissionsMade: Record<string, number>,
  _submissionsReceived: Record<string, number>, // Reserved for future defense analysis
  techniqueProgress: { techniqueId: string; proficiency: string; timesDrilled: number }[],
  trainingStats: { byType: { gi: number; nogi: number } }
): StyleFingerprintData {
  // Helper to get position score
  const getPositionScore = (positions: string[]) => {
    const matches = positionMastery.filter(p =>
      positions.some(pos => p.position.toLowerCase().includes(pos.toLowerCase()))
    );
    if (matches.length === 0) return 50;
    return Math.round(matches.reduce((sum, m) => sum + m.attackScore, 0) / matches.length);
  };

  // Helper to count submissions by category
  const countSubmissions = (keywords: string[]) => {
    return Object.entries(submissionsMade)
      .filter(([key]) => keywords.some(kw => key.toLowerCase().includes(kw.toLowerCase())))
      .reduce((sum, [, count]) => sum + count, 0);
  };

  // Calculate total submissions for percentages
  const totalSubmissions = Object.values(submissionsMade).reduce((a, b) => a + b, 0);

  // 1. GUARD GAME
  // Based on: guard position mastery, sweeps, guard submissions (triangle, armbar from guard, omoplata)
  const guardPositions = getPositionScore(['closed guard', 'open guard', 'half guard']);
  const guardSubs = countSubmissions(['triangle', 'omoplata', 'armbar']) / Math.max(totalSubmissions, 1) * 100;
  const guardScore = Math.round((guardPositions * 0.6 + Math.min(guardSubs * 2, 100) * 0.4));

  // 2. PASSING
  // Based on: inverse of opponent's guard retention, passing techniques drilled
  const passingTechniques = techniqueProgress.filter(t =>
    t.techniqueId.includes('020') || t.techniqueId.includes('021') || t.techniqueId.includes('022') || t.techniqueId.includes('023')
  );
  const passingDrillScore = passingTechniques.length > 0
    ? Math.min(passingTechniques.reduce((sum, t) => sum + t.timesDrilled, 0) / 3, 100)
    : 30;
  const passingScore = Math.round(passingDrillScore);

  // 3. TOP CONTROL
  // Based on: mount, side control, knee on belly attack scores
  const topPositions = getPositionScore(['mount', 'side control', 'knee']);
  const topSubs = countSubmissions(['americana', 'kimura', 'cross choke', 'ezekiel']) / Math.max(totalSubmissions, 1) * 100;
  const topScore = Math.round((topPositions * 0.7 + Math.min(topSubs * 2, 100) * 0.3));

  // 4. BACK ATTACKS
  // Based on: back position mastery, RNC/bow and arrow success
  const backPosition = getPositionScore(['back']);
  const backSubs = countSubmissions(['rnc', 'rear naked', 'bow and arrow']) / Math.max(totalSubmissions, 1) * 100;
  const backScore = Math.round((backPosition * 0.5 + Math.min(backSubs * 3, 100) * 0.5));

  // 5. TAKEDOWNS
  // Based on: standing position, takedown techniques
  const standingPosition = getPositionScore(['standing']);
  const takedownTechniques = techniqueProgress.filter(t =>
    t.techniqueId.includes('017') || t.techniqueId.includes('018') || t.techniqueId.includes('019')
  );
  const takedownDrillScore = takedownTechniques.length > 0
    ? Math.min(takedownTechniques.reduce((sum, t) => sum + t.timesDrilled, 0) / 2, 100)
    : 25;
  const takedownScore = Math.round((standingPosition * 0.4 + takedownDrillScore * 0.6));

  // 6. LEG LOCKS
  // Based on: leg lock submissions, nogi ratio (leg locks more common in nogi)
  const legSubs = countSubmissions(['heel hook', 'ankle', 'knee bar', 'toe hold']) / Math.max(totalSubmissions, 1) * 100;
  const nogiRatio = trainingStats.byType.nogi / Math.max(trainingStats.byType.gi + trainingStats.byType.nogi, 1);
  const legLockScore = Math.round(Math.min(legSubs * 4, 80) + nogiRatio * 20);

  const dimensions: StyleDimension[] = [
    {
      id: 'guard',
      label: 'Guard Game',
      shortLabel: 'Guard',
      value: Math.min(guardScore, 100),
      description: 'Bottom position offense - sweeps and submissions from guard',
    },
    {
      id: 'passing',
      label: 'Passing',
      shortLabel: 'Pass',
      value: Math.min(passingScore, 100),
      description: 'Ability to navigate and pass opponent\'s guard',
    },
    {
      id: 'top',
      label: 'Top Control',
      shortLabel: 'Top',
      value: Math.min(topScore, 100),
      description: 'Dominance from mount, side control, and knee on belly',
    },
    {
      id: 'back',
      label: 'Back Attacks',
      shortLabel: 'Back',
      value: Math.min(backScore, 100),
      description: 'Taking the back and finishing from back control',
    },
    {
      id: 'takedowns',
      label: 'Takedowns',
      shortLabel: 'TD',
      value: Math.min(takedownScore, 100),
      description: 'Standing game - wrestling, judo, and guard pulls',
    },
    {
      id: 'leglocks',
      label: 'Leg Locks',
      shortLabel: 'Legs',
      value: Math.min(legLockScore, 100),
      description: 'Modern leg attack game - heel hooks, knee bars, ankle locks',
    },
  ];

  // Calculate archetype
  const archetype = deriveArchetype(dimensions);

  // Find dominant and weakest
  const sorted = [...dimensions].sort((a, b) => b.value - a.value);
  const dominantStyle = sorted[0].label;
  const weakestArea = sorted[sorted.length - 1].label;

  // Calculate balance score (inverse of standard deviation)
  const mean = dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length;
  const variance = dimensions.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0) / dimensions.length;
  const stdDev = Math.sqrt(variance);
  const balanceScore = Math.round(Math.max(0, 100 - stdDev * 2));

  return {
    dimensions,
    archetype,
    dominantStyle,
    weakestArea,
    balanceScore,
  };
}

/**
 * Derive style archetype from dimension values
 */
function deriveArchetype(dimensions: StyleDimension[]): StyleArchetype {
  const getVal = (id: string) => dimensions.find(d => d.id === id)?.value || 0;

  const guard = getVal('guard');
  const passing = getVal('passing');
  const top = getVal('top');
  const back = getVal('back');
  const takedowns = getVal('takedowns');
  const leglocks = getVal('leglocks');

  // Check for dominant styles
  const max = Math.max(guard, passing, top, back, takedowns, leglocks);
  const min = Math.min(guard, passing, top, back, takedowns, leglocks);
  const range = max - min;

  // Well-rounded if range is small
  if (range < 20) {
    return {
      name: 'WELL-ROUNDED',
      description: 'Balanced game with no major weaknesses. Adaptable to any situation.',
      icon: 'balanced',
      famousExamples: ['Roger Gracie', 'Andre Galvao'],
    };
  }

  // Check specific archetypes
  if (guard >= 70 && guard === max) {
    return {
      name: 'GUARD PLAYER',
      description: 'Dangerous from bottom. Sweeps and submits from guard with precision.',
      icon: 'guard',
      famousExamples: ['Marcelo Garcia', 'Keenan Cornelius', 'Romulo Barral'],
    };
  }

  if (passing >= 70 && top >= 60 && passing === max) {
    return {
      name: 'PRESSURE PASSER',
      description: 'Relentless top game. Smashes through guards and dominates on top.',
      icon: 'pressure',
      famousExamples: ['Bernardo Faria', 'Lucas Lepri', 'Rodolfo Vieira'],
    };
  }

  if (back >= 70 && back === max) {
    return {
      name: 'BACK HUNTER',
      description: 'Constantly seeking the back. Once there, the finish is inevitable.',
      icon: 'back',
      famousExamples: ['Marcelo Garcia', 'Rubens Charles (Cobrinha)'],
    };
  }

  if (leglocks >= 65 && leglocks === max) {
    return {
      name: 'LEG LOCKER',
      description: 'Modern leg attack specialist. Dangerous entries and tight finishes.',
      icon: 'legs',
      famousExamples: ['Gordon Ryan', 'Craig Jones', 'Lachlan Giles'],
    };
  }

  if (takedowns >= 65 && takedowns === max) {
    return {
      name: 'WRESTLER',
      description: 'Dominates on the feet. Controls where the fight goes.',
      icon: 'wrestler',
      famousExamples: ['Buchecha', 'Yuri Simoes'],
    };
  }

  if (top >= 70 && top === max) {
    return {
      name: 'TOP SPECIALIST',
      description: 'Crushing top control. Submissions rain from mount and side control.',
      icon: 'pressure',
      famousExamples: ['Roger Gracie', 'Xande Ribeiro'],
    };
  }

  // Default: submission hunter (high finish rate across multiple areas)
  const highScores = dimensions.filter(d => d.value >= 60).length;
  if (highScores >= 3) {
    return {
      name: 'SUBMISSION HUNTER',
      description: 'Always attacking. Finishes from everywhere on the mat.',
      icon: 'finisher',
      famousExamples: ['Nicky Ryan', 'Geo Martinez'],
    };
  }

  // Fallback
  return {
    name: 'DEVELOPING',
    description: 'Game still taking shape. Keep training and patterns will emerge.',
    icon: 'balanced',
  };
}

// ===========================================
// RADAR CHART COMPONENT
// ===========================================

export function StyleFingerprint({
  data,
  size = 280,
  showLabels = true,
  showArchetype = true,
  animated = true,
}: StyleFingerprintProps) {
  const { dimensions, archetype, dominantStyle, weakestArea, balanceScore } = data;

  // Calculate polygon points for the radar
  const radarPoints = useMemo(() => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 40; // Leave room for labels

    return dimensions.map((dim, i) => {
      const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2; // Start from top
      const value = dim.value / 100;
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      return { x, y, angle, dim };
    });
  }, [dimensions, size]);

  // Generate SVG path for the radar shape
  const radarPath = useMemo(() => {
    return radarPoints
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z';
  }, [radarPoints]);

  // Generate background grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1];
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 40;

  // Generate axis lines
  const axisLines = dimensions.map((_, i) => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
    return {
      x2: centerX + Math.cos(angle) * maxRadius,
      y2: centerY + Math.sin(angle) * maxRadius,
    };
  });

  // Label positions (slightly outside the chart)
  const labelPositions = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    return {
      x: centerX + Math.cos(angle) * labelRadius,
      y: centerY + Math.sin(angle) * labelRadius,
      anchor: angle > Math.PI / 2 && angle < Math.PI * 1.5 ? 'end' : angle === Math.PI / 2 || angle === -Math.PI / 2 ? 'middle' : 'start',
      dim,
    };
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Archetype Header */}
      {showArchetype && (
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-lg)',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-accent)',
            letterSpacing: '0.1em',
            marginBottom: 'var(--space-xs)',
          }}>
            {archetype.name}
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-400)',
            maxWidth: 300,
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            {archetype.description}
          </div>
          {archetype.famousExamples && archetype.famousExamples.length > 0 && (
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              marginTop: 'var(--space-sm)',
            }}>
              Similar to: {archetype.famousExamples.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Radar Chart */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 'var(--space-lg)',
      }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            overflow: 'visible',
          }}
        >
          {/* Background grid circles */}
          {gridCircles.map((scale, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={maxRadius * scale}
              fill="none"
              stroke="var(--color-gray-800)"
              strokeWidth="1"
              strokeDasharray={i < gridCircles.length - 1 ? "4 4" : "0"}
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--color-gray-700)"
              strokeWidth="1"
            />
          ))}

          {/* Radar shape fill */}
          <path
            d={radarPath}
            fill="rgba(252, 211, 77, 0.15)"
            stroke="var(--color-accent)"
            strokeWidth="2"
            style={{
              transition: animated ? 'all 0.5s ease-out' : 'none',
            }}
          />

          {/* Data points */}
          {radarPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="var(--color-accent)"
              stroke="var(--color-black)"
              strokeWidth="2"
              style={{
                transition: animated ? 'all 0.5s ease-out' : 'none',
              }}
            />
          ))}

          {/* Labels */}
          {showLabels && labelPositions.map((pos, i) => (
            <g key={i}>
              <text
                x={pos.x}
                y={pos.y - 8}
                textAnchor={pos.anchor as 'start' | 'middle' | 'end'}
                fill="var(--color-white)"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-body)"
              >
                {pos.dim.shortLabel}
              </text>
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor={pos.anchor as 'start' | 'middle' | 'end'}
                fill="var(--color-gray-400)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {pos.dim.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)',
      }}>
        {/* Strongest */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--color-positive)',
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-positive)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 'var(--space-xs)',
          }}>
            Strongest
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-white)',
            fontWeight: 600,
          }}>
            {dominantStyle}
          </div>
        </div>

        {/* Balance */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-gray-900)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 'var(--space-xs)',
          }}>
            Balance
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: balanceScore >= 70 ? 'var(--color-positive)' : balanceScore >= 40 ? 'var(--color-accent)' : 'var(--color-gray-300)',
            fontWeight: 600,
          }}>
            {balanceScore}%
          </div>
        </div>

        {/* Weakest */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-md)',
          borderRight: '3px solid var(--color-negative)',
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-negative)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 'var(--space-xs)',
          }}>
            Focus Area
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-white)',
            fontWeight: 600,
          }}>
            {weakestArea}
          </div>
        </div>
      </div>

      {/* Dimension Details (expandable in future) */}
      <div style={{
        marginTop: 'var(--space-lg)',
        padding: 'var(--space-md)',
      }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gray-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 'var(--space-md)',
        }}>
          Dimension Breakdown
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          {dimensions
            .sort((a, b) => b.value - a.value)
            .map((dim) => (
            <div key={dim.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}>
              <div style={{
                width: 70,
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-400)',
              }}>
                {dim.shortLabel}
              </div>
              <div style={{
                flex: 1,
                height: 8,
                backgroundColor: 'var(--color-gray-800)',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${dim.value}%`,
                  height: '100%',
                  backgroundColor: dim.value >= 70
                    ? 'var(--color-positive)'
                    : dim.value >= 40
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-500)',
                  borderRadius: 4,
                  transition: 'width 0.5s ease-out',
                }} />
              </div>
              <div style={{
                width: 35,
                fontSize: 'var(--text-xs)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-mono)',
                textAlign: 'right',
              }}>
                {dim.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StyleFingerprint;

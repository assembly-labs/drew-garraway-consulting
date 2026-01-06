/**
 * Attack Profile / Submission Story
 *
 * A comprehensive visualization of a user's submission game:
 * - Treemap showing attack distribution by body region
 * - Top 5 attacks given (your weapons)
 * - Top 5 attacks received (your vulnerabilities)
 * - Specialist nickname based on dominant style
 * - Witty opponent quotes based on signature move
 */

import { useMemo } from 'react';
import type { BodyRegion } from '../../types/database';

// ===========================================
// TYPES
// ===========================================

interface TechniqueCount {
  technique: string;
  count: number;
}

// Simplified 3-region type for display (aggregates granular regions)
type DisplayRegion = 'neck' | 'arms' | 'legs';

// Helper to aggregate granular body regions into display regions
function aggregateBodyRegions(
  granular: Record<BodyRegion, number>
): Record<DisplayRegion, number> {
  return {
    neck: granular.neck,
    arms: granular.shoulders + granular.elbows + granular.wrists,
    legs: granular.knees + granular.ankles,
  };
}

interface AttackProfileProps {
  /** Submission data */
  submissionStats: {
    totalGiven: number;
    totalReceived: number;
    bodyHeatMap: {
      given: Record<BodyRegion, number>;
      received: Record<BodyRegion, number>;
    };
    techniqueBreakdown: {
      given: TechniqueCount[];
      received: TechniqueCount[];
    };
  };
  /** User's belt level for personalization */
  belt?: 'white' | 'blue' | 'purple' | 'brown' | 'black';
}

// ===========================================
// SPECIALIST NICKNAMES
// ===========================================

interface SpecialistProfile {
  nickname: string;
  icon: 'skull' | 'arm' | 'leg' | 'hand' | 'lightning' | 'balanced';
  color: string;
  description: string;
}

const SPECIALIST_PROFILES: Record<string, SpecialistProfile> = {
  HEAD_HUNTER: {
    nickname: 'HEAD HUNTER',
    icon: 'skull',
    color: '#ef4444', // red
    description: 'Your opponents go to sleep.',
  },
  CHOKE_ARTIST: {
    nickname: 'CHOKE ARTIST',
    icon: 'skull',
    color: '#8b5cf6', // purple
    description: 'The gentle art of making people nap.',
  },
  ARM_COLLECTOR: {
    nickname: 'ARM COLLECTOR',
    icon: 'arm',
    color: '#f59e0b', // amber
    description: 'Elbows bend both ways, apparently.',
  },
  LEG_LOCKER: {
    nickname: 'LEG LOCKER',
    icon: 'leg',
    color: '#06b6d4', // cyan
    description: 'Knees are just suggestions.',
  },
  WRIST_BREAKER: {
    nickname: 'WRIST WRECKER',
    icon: 'hand',
    color: '#ec4899', // pink
    description: 'The most disrespectful submission.',
  },
  THE_COMPLETE_GAME: {
    nickname: 'THE COMPLETE GAME',
    icon: 'balanced',
    color: '#22c55e', // green
    description: 'Dangerous everywhere.',
  },
  THE_BACK_TAKER: {
    nickname: 'THE BACKPACK',
    icon: 'skull',
    color: '#ef4444',
    description: "Once you're on the back, it's over.",
  },
  THE_GUILLOTINE_SPECIALIST: {
    nickname: 'THE GUILLOTINE',
    icon: 'skull',
    color: '#dc2626',
    description: 'Heads will roll.',
  },
  TRIANGLE_MASTER: {
    nickname: 'HUMAN SCISSORS',
    icon: 'skull',
    color: '#7c3aed',
    description: 'Your legs are more dangerous than most arms.',
  },
};

// ===========================================
// WITTY OPPONENT QUOTES
// ===========================================

const OPPONENT_QUOTES: Record<string, string[]> = {
  // Arm attacks
  'Armbar': [
    "I can't wave down a taxi anymore.",
    "My elbow has trust issues now.",
    "I sleep with my arm under my pillow... for protection.",
  ],
  'Kimura': [
    "My shoulder makes sounds it never used to.",
    "I rotate my arm the other way now, thanks.",
    "Reaching for the top shelf is a trigger.",
  ],
  'Americana': [
    "I sleep on my stomach exclusively now.",
    "That shoulder never felt right again.",
    "Painting ceilings? Not in this lifetime.",
  ],
  'Omoplata': [
    "My shoulder did a 360 it wasn't supposed to.",
    "I'm stuck in that position forever now.",
    "My arm thinks it's a pretzel.",
  ],
  'Wristlock': [
    "My handshake hasn't been the same.",
    "Typing is an extreme sport now.",
    "I wear wrist guards to work.",
  ],

  // Neck attacks
  'RNC': [
    "I took an unexpected nap mid-roll.",
    "That arm felt like a python.",
    "I saw my ancestors.",
  ],
  'Rear Naked Choke': [
    "I took an unexpected nap mid-roll.",
    "That arm felt like a python.",
    "I saw my ancestors.",
  ],
  'Triangle': [
    "Those legs are basically a vice grip.",
    "I saw colors I've never seen before.",
    "My neck still has the shape of their thigh.",
  ],
  'Guillotine': [
    "My neck has trust issues.",
    "Hugging feels dangerous now.",
    "I check under beds for guillotines.",
  ],
  'Darce': [
    "I don't like hugs anymore.",
    "That squeeze was personal.",
    "Breathing is a privilege, not a right.",
  ],
  'Anaconda': [
    "Snake-like accuracy.",
    "I got squeezed like a python's lunch.",
    "Turtling is no longer safe.",
  ],
  'Bow and Arrow': [
    "I was folded like laundry.",
    "My spine remembers.",
    "I became a human pretzel.",
  ],
  'Ezekiel': [
    "Got choked by a hug. A HUG.",
    "Mount is scarier than it looks.",
    "Gi sleeves are weapons.",
  ],
  'Cross Collar Choke': [
    "Those grips were like steel.",
    "I respect the collar now.",
    "Gi chokes hit different.",
  ],

  // Leg attacks
  'Heel Hook': [
    "My knee sounds like a bag of chips now.",
    "I limp with character.",
    "Walking is a privilege.",
  ],
  'Inside Heel Hook': [
    "My MCL has left the chat.",
    "Rotation? Never heard of it.",
    "My knee went directions it shouldn't.",
  ],
  'Outside Heel Hook': [
    "I felt all my ligaments individually.",
    "That knee is decorative now.",
    "Stairs are my nemesis.",
  ],
  'Kneebar': [
    "My leg went the wrong direction.",
    "I bend at the knee... both ways now.",
    "Hyperextension is a lifestyle.",
  ],
  'Ankle Lock': [
    "I limp with style now.",
    "My foot decided to leave my leg.",
    "Ankle mobility? Optional.",
  ],
  'Toe Hold': [
    "My foot said goodbye to my ankle.",
    "I spin the other direction now.",
    "Toes are overrated anyway.",
  ],
  'Calf Slicer': [
    "That pain was DEEP.",
    "My calf muscle is traumatized.",
    "I learned muscles can be sliced.",
  ],
};

// Get random quote for a technique
function getOpponentQuote(technique: string): string {
  const quotes = OPPONENT_QUOTES[technique];
  if (!quotes || quotes.length === 0) {
    return "I need to work on my defense.";
  }
  // Use a seeded random for consistent display (based on technique name)
  const index = technique.length % quotes.length;
  return quotes[index];
}

// ===========================================
// SPECIALIST DETECTION
// ===========================================

function getSpecialistProfile(
  bodyStats: Record<DisplayRegion, number>,
  techniqueBreakdown: TechniqueCount[]
): SpecialistProfile {
  const total = bodyStats.neck + bodyStats.arms + bodyStats.legs;
  if (total < 10) {
    return {
      nickname: 'THE STUDENT',
      icon: 'balanced',
      color: '#94a3b8',
      description: 'Building your arsenal...',
    };
  }

  const neckPercent = (bodyStats.neck / total) * 100;
  const armsPercent = (bodyStats.arms / total) * 100;
  const legsPercent = (bodyStats.legs / total) * 100;

  // Check for specific technique dominance
  const topTechnique = techniqueBreakdown[0];
  if (topTechnique) {
    const topPercent = (topTechnique.count / total) * 100;

    if (topPercent >= 30) {
      // RNC specialist
      if (topTechnique.technique.toLowerCase().includes('rnc') ||
          topTechnique.technique.toLowerCase().includes('rear naked')) {
        return SPECIALIST_PROFILES.THE_BACK_TAKER;
      }
      // Guillotine specialist
      if (topTechnique.technique.toLowerCase().includes('guillotine')) {
        return SPECIALIST_PROFILES.THE_GUILLOTINE_SPECIALIST;
      }
      // Triangle specialist
      if (topTechnique.technique.toLowerCase().includes('triangle')) {
        return SPECIALIST_PROFILES.TRIANGLE_MASTER;
      }
    }
  }

  // Check for wristlock specialist
  const wristCount = techniqueBreakdown
    .filter(t => t.technique.toLowerCase().includes('wrist'))
    .reduce((sum, t) => sum + t.count, 0);
  if ((wristCount / total) * 100 >= 25) {
    return SPECIALIST_PROFILES.WRIST_BREAKER;
  }

  // Body region dominance
  if (neckPercent >= 70) {
    return SPECIALIST_PROFILES.HEAD_HUNTER;
  }
  if (neckPercent >= 55) {
    return SPECIALIST_PROFILES.CHOKE_ARTIST;
  }
  if (legsPercent >= 45) {
    return SPECIALIST_PROFILES.LEG_LOCKER;
  }
  if (armsPercent >= 45) {
    return SPECIALIST_PROFILES.ARM_COLLECTOR;
  }

  // Balanced game
  const max = Math.max(neckPercent, armsPercent, legsPercent);
  const min = Math.min(neckPercent, armsPercent, legsPercent);
  if (max - min < 30) {
    return SPECIALIST_PROFILES.THE_COMPLETE_GAME;
  }

  // Default to highest category
  if (neckPercent >= armsPercent && neckPercent >= legsPercent) {
    return SPECIALIST_PROFILES.CHOKE_ARTIST;
  }
  if (armsPercent >= legsPercent) {
    return SPECIALIST_PROFILES.ARM_COLLECTOR;
  }
  return SPECIALIST_PROFILES.LEG_LOCKER;
}

// ===========================================
// ICON COMPONENTS
// ===========================================

function SkullIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="7" />
      <circle cx="9" cy="9" r="1.5" fill={color} />
      <circle cx="15" cy="9" r="1.5" fill={color} />
      <path d="M12 14v4M10 21l2-3 2 3M8 18h8" />
    </svg>
  );
}

function ArmIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16l-4-4 4-4" />
      <path d="M2 12h14a4 4 0 0 1 4 4v4" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  );
}

function LegIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6.5a3.5 3.5 0 0 1-3.5 3.5H5a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h1" />
      <path d="M16 22v-3a3 3 0 0 1 3-3h2" />
      <circle cx="8" cy="21" r="1" fill={color} />
    </svg>
  );
}

function HandIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function BalancedIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

function getSpecialistIcon(icon: string, color: string) {
  switch (icon) {
    case 'skull': return <SkullIcon color={color} />;
    case 'arm': return <ArmIcon color={color} />;
    case 'leg': return <LegIcon color={color} />;
    case 'hand': return <HandIcon color={color} />;
    default: return <BalancedIcon color={color} />;
  }
}

// ===========================================
// TREEMAP COMPONENT
// ===========================================

interface TreemapBlock {
  label: string;
  value: number;
  percent: number;
  color: string;
  techniques: TechniqueCount[];
}

function SubmissionTreemap({
  bodyStats,
  techniqueBreakdown
}: {
  bodyStats: Record<DisplayRegion, number>;
  techniqueBreakdown: TechniqueCount[];
}) {
  const total = bodyStats.neck + bodyStats.arms + bodyStats.legs;
  if (total === 0) return null;

  // Group techniques by body region
  const neckTechniques = techniqueBreakdown.filter(t => {
    const name = t.technique.toLowerCase();
    return name.includes('rnc') || name.includes('rear naked') ||
           name.includes('triangle') || name.includes('guillotine') ||
           name.includes('choke') || name.includes('darce') ||
           name.includes('anaconda') || name.includes('ezekiel') ||
           name.includes('bow and arrow') || name.includes('collar');
  });

  const armTechniques = techniqueBreakdown.filter(t => {
    const name = t.technique.toLowerCase();
    return name.includes('armbar') || name.includes('arm bar') ||
           name.includes('kimura') || name.includes('americana') ||
           name.includes('omoplata') || name.includes('wrist');
  });

  const legTechniques = techniqueBreakdown.filter(t => {
    const name = t.technique.toLowerCase();
    return name.includes('heel') || name.includes('knee') ||
           name.includes('ankle') || name.includes('toe') ||
           name.includes('calf') || name.includes('leg');
  });

  const blocks: TreemapBlock[] = [
    {
      label: 'NECK',
      value: bodyStats.neck,
      percent: Math.round((bodyStats.neck / total) * 100),
      color: '#ef4444', // red
      techniques: neckTechniques,
    },
    {
      label: 'ARMS',
      value: bodyStats.arms,
      percent: Math.round((bodyStats.arms / total) * 100),
      color: '#f59e0b', // amber
      techniques: armTechniques,
    },
    {
      label: 'LEGS',
      value: bodyStats.legs,
      percent: Math.round((bodyStats.legs / total) * 100),
      color: '#06b6d4', // cyan
      techniques: legTechniques,
    },
  ].sort((a, b) => b.value - a.value); // Sort by size descending

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Treemap Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `${blocks[0].percent}fr ${blocks[1].percent + blocks[2].percent}fr`,
          gap: '4px',
          height: '200px',
        }}
      >
        {/* Largest block takes full height on left */}
        <div
          style={{
            background: `linear-gradient(135deg, ${blocks[0].color}22 0%, ${blocks[0].color}11 100%)`,
            border: `2px solid ${blocks[0].color}`,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: blocks[0].color,
              marginBottom: '4px',
            }}>
              {blocks[0].label}
            </div>
            <div style={{
              fontSize: '48px',
              fontWeight: 700,
              color: blocks[0].color,
              lineHeight: 1,
            }}>
              {blocks[0].percent}%
            </div>
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
          }}>
            {blocks[0].value} submissions
          </div>
        </div>

        {/* Two smaller blocks stacked on right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {blocks.slice(1).map((block) => (
            <div
              key={block.label}
              style={{
                flex: block.percent,
                background: `linear-gradient(135deg, ${block.color}22 0%, ${block.color}11 100%)`,
                border: `2px solid ${block.color}`,
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: block.color,
                }}>
                  {block.label}
                </div>
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: block.color,
                lineHeight: 1,
              }}>
                {block.percent}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// TOP 5 LIST COMPONENT
// ===========================================

interface Top5ListProps {
  title: string;
  techniques: TechniqueCount[];
  variant: 'given' | 'received';
}

function Top5List({ title, techniques, variant }: Top5ListProps) {
  const top5 = techniques.slice(0, 5);
  const maxCount = top5[0]?.count || 1;

  const color = variant === 'given' ? 'var(--color-positive)' : 'var(--color-negative)';
  const bgGradient = variant === 'given'
    ? 'rgba(34, 197, 94, 0.1)'
    : 'rgba(239, 68, 68, 0.1)';

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: color,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {variant === 'given' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        )}
        {title}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {top5.map((tech, index) => {
          const barWidth = (tech.count / maxCount) * 100;
          return (
            <div
              key={tech.technique}
              style={{
                position: 'relative',
                padding: '12px 16px',
                background: 'var(--color-gray-900)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* Progress bar background */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${barWidth}%`,
                  background: bgGradient,
                  transition: 'width 0.5s ease-out',
                }}
              />

              {/* Content */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--color-gray-500)',
                    width: '20px',
                  }}>
                    {index + 1}.
                  </span>
                  <span style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 600,
                    color: 'var(--color-white)',
                  }}>
                    {tech.technique}
                  </span>
                </div>
                <span style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: color,
                }}>
                  {tech.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function AttackProfile({ submissionStats, belt = 'blue' }: AttackProfileProps) {
  // Belt used for future personalization (e.g., hiding certain stats for white belts)
  void belt; // Reserved for future belt-specific UI adaptations
  const { totalGiven, totalReceived, bodyHeatMap, techniqueBreakdown } = submissionStats;

  // Aggregate granular regions into display regions
  const displayHeatMap = useMemo(() => ({
    given: aggregateBodyRegions(bodyHeatMap.given),
    received: aggregateBodyRegions(bodyHeatMap.received),
  }), [bodyHeatMap]);

  // Calculate specialist profile
  const specialist = useMemo(() => {
    return getSpecialistProfile(displayHeatMap.given, techniqueBreakdown.given);
  }, [displayHeatMap.given, techniqueBreakdown.given]);

  // Get opponent quote based on top technique
  const topTechnique = techniqueBreakdown.given[0]?.technique || 'Armbar';
  const opponentQuote = getOpponentQuote(topTechnique);

  // Don't show detailed stats for users with few submissions
  const hasEnoughData = totalGiven >= 10;

  return (
    <div style={{ background: 'var(--color-black)', padding: '24px' }}>
      {/* ============================================
          HEADER - Attack Profile Title
          ============================================ */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--color-gray-500)',
          marginBottom: '8px',
        }}>
          Your Submission Game
        </div>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          margin: 0,
        }}>
          Attack Profile
        </h2>
      </div>

      {hasEnoughData ? (
        <>
          {/* ============================================
              TREEMAP VISUALIZATION
              ============================================ */}
          <SubmissionTreemap
            bodyStats={displayHeatMap.given}
            techniqueBreakdown={techniqueBreakdown.given}
          />

          {/* ============================================
              TOP 5 LISTS - Side by side on larger screens
              ============================================ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <Top5List
              title="Your Weapons"
              techniques={techniqueBreakdown.given}
              variant="given"
            />
            <Top5List
              title="Watch Out For"
              techniques={techniqueBreakdown.received}
              variant="received"
            />
          </div>

          {/* ============================================
              SPECIALIST NICKNAME BANNER
              ============================================ */}
          <div
            style={{
              background: `linear-gradient(135deg, ${specialist.color}22 0%, var(--color-gray-900) 100%)`,
              borderLeft: `4px solid ${specialist.color}`,
              borderRadius: '0 12px 12px 0',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '16px',
            }}>
              {/* Icon */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 'var(--radius-full)',
                  background: `${specialist.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getSpecialistIcon(specialist.icon, specialist.color)}
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: specialist.color,
                  letterSpacing: '0.05em',
                  lineHeight: 1.2,
                }}>
                  {specialist.nickname}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-400)',
                  marginTop: '4px',
                }}>
                  {specialist.description}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'var(--color-gray-800)',
              margin: '16px 0',
            }} />

            {/* Opponent Quote */}
            <div>
              <div style={{
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-gray-500)',
                marginBottom: '8px',
              }}>
                Your opponents might be saying...
              </div>
              <div style={{
                fontSize: 'var(--text-lg)',
                fontStyle: 'italic',
                color: 'var(--color-gray-200)',
                lineHeight: 1.5,
                paddingLeft: '16px',
                borderLeft: `2px solid ${specialist.color}44`,
              }}>
                "{opponentQuote}"
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
                marginTop: '8px',
                paddingLeft: '16px',
              }}>
                — Based on your {topTechnique} finishing rate
              </div>
            </div>
          </div>

          {/* ============================================
              STATS FOOTER
              ============================================ */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '20px',
            background: 'var(--color-gray-900)',
            borderRadius: '12px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--color-positive)',
                lineHeight: 1,
              }}>
                {totalGiven}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}>
                Subs Given
              </div>
            </div>
            <div style={{
              width: '1px',
              background: 'var(--color-gray-800)',
            }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--color-negative)',
                lineHeight: 1,
              }}>
                {totalReceived}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}>
                Tapped Out
              </div>
            </div>
            <div style={{
              width: '1px',
              background: 'var(--color-gray-800)',
            }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: 'var(--color-gold)',
                lineHeight: 1,
              }}>
                {totalGiven > 0 ? ((totalGiven / (totalGiven + totalReceived)) * 100).toFixed(0) : 0}%
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}>
                Win Rate
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ============================================
           EMPTY STATE - Not enough data
           ============================================ */
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--color-gray-900)',
          borderRadius: '12px',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.5,
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--color-white)',
            marginBottom: '8px',
          }}>
            Building Your Attack Profile
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-400)',
            maxWidth: '280px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Log {10 - totalGiven} more submissions to unlock your personalized attack analysis and specialist nickname.
          </div>
        </div>
      )}
    </div>
  );
}

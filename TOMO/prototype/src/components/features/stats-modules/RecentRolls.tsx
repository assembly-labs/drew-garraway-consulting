/**
 * Recent Rolls - Vulnerability Alert Module
 *
 * Analyzes recent submissions received to identify patterns
 * and provides defense video + coaching for next session.
 *
 * Design: Simple vulnerability callout with video link
 * Data: Recent submissions received (technique names)
 */

import { useMemo } from 'react';
import { Icons } from '../../ui/Icons';

// ===========================================
// TYPES
// ===========================================

export interface SubmissionReceived {
  technique: string;
  daysAgo: number;
}

interface RecentRollsProps {
  submissionsReceived: SubmissionReceived[];
}

// ===========================================
// DEFENSE DATABASE
// Maps submission techniques to defense content
// ===========================================

interface DefenseContent {
  videoId: string;
  videoTitle: string;
  instructor: string;
  coaching: string; // ~100 words max
  keyDefenses: string[];
}

const DEFENSE_DATABASE: Record<string, DefenseContent> = {
  triangle: {
    videoId: 'LDE0fkzZT6I',
    videoTitle: 'Triangle Defense Fundamentals',
    instructor: 'John Danaher',
    coaching:
      "You're getting caught in triangles. The key moment is when your posture breaks—once your head is pulled down and one arm is isolated, you're in trouble. Focus on posture first: frame on the hip, stack your weight forward, and keep your trapped elbow tight to your body. If locked in, turn toward the trapped arm side and work to clear your elbow across. Don't panic and pull straight back—that tightens the choke.",
    keyDefenses: [
      'Posture up immediately when guard closes',
      'Frame on hip, stack weight forward',
      'Turn toward trapped arm to relieve pressure',
      'Keep elbows tight—never let them isolate one arm',
    ],
  },
  armbar: {
    videoId: 'ypi3ie6hKTI',
    videoTitle: 'Armbar Defense & Escape',
    instructor: 'John Danaher',
    coaching:
      "Armbars are catching you. The escape window is small—once your arm is fully extended with hips elevated, it's over. Your priority: grip your hands together (Gable grip) and turn toward your opponent. Stack into them and work to pull your elbow free. Prevention is better: keep elbows tight in guard, and when you feel the hip rotation for the armbar, immediately posture and pull your arm back before they can secure it.",
    keyDefenses: [
      'Grip hands together immediately',
      'Turn and stack toward opponent',
      'Pull elbow to your hip line',
      'Prevention: never leave arm extended in guard',
    ],
  },
  rnc: {
    videoId: 'k-lCzVAzJpg',
    videoTitle: 'Escaping The Back',
    instructor: 'Lachlan Giles',
    coaching:
      "You're getting choked from the back. The RNC is the highest percentage finish—once the arm is under your chin, survival is difficult. Your focus: chin defense and hand fighting before the choke locks in. Tuck your chin, two hands on the choking arm, and work to slip your head out the back door (toward the floor). Control their top hook and start your escape to the non-choking arm side. Back escapes start with leg work—clear hooks first.",
    keyDefenses: [
      'Chin down, two hands on choking arm',
      'Fight hands before choke is set',
      'Escape toward the floor (back door)',
      'Clear hooks to enable hip escape',
    ],
  },
  guillotine: {
    videoId: 'Zvn--8vW1sI',
    videoTitle: 'Guillotine Choke Escape',
    instructor: 'Gordon Ryan',
    coaching:
      "Guillotines are catching you—likely during takedown attempts or guard passes. The critical detail: get your head to the outside (choking arm side) and drive forward into them. Never pull back—that tightens the choke. If caught standing, sit through to guard immediately. On the ground, turn into them, get your head free, and either pass or return to a neutral position. Prevention: keep your head up during passes and shots.",
    keyDefenses: [
      'Drive head to choking arm side (not away)',
      'Never pull backward—drive forward',
      'Sit through if caught standing',
      'Prevention: head position during shots/passes',
    ],
  },
  kimura: {
    videoId: 'i-GjsFQbziE',
    videoTitle: 'Kimura Defense',
    instructor: 'Craig Jones',
    coaching:
      "You're getting caught in kimuras. The defense starts before they isolate your arm—once both their hands control your wrist and elbow, you're in danger. Grip your own belt or shorts, turn into your opponent, and work to free your elbow. The key is to prevent the figure-four grip: keep your elbow tight and turn your thumb up (supinate). If caught, roll toward your trapped arm—sometimes you can reverse the position.",
    keyDefenses: [
      'Grip your belt/shorts to prevent isolation',
      'Turn toward opponent to reduce leverage',
      'Prevent figure-four: elbow tight, thumb up',
      'Rolling escape toward trapped arm',
    ],
  },
  'heel hook': {
    videoId: 'CFTLb8iywJg',
    videoTitle: 'Defending The Saddle & Heel Hooks',
    instructor: 'Lachlan Giles',
    coaching:
      "Heel hooks are catching you—this is the most dangerous submission in modern grappling. The key: never let them control your knee line. If they have inside position on your leg, your priority is boot (hide your heel) and fight to clear the knee line before they can finish. Don't try to pull out—roll with the rotation to relieve pressure. Prevention matters most: recognize the entries (50/50, saddle, SLX) and defend before you're entangled.",
    keyDefenses: [
      "Boot your heel (point toes, hide the heel)",
      'Fight to clear the knee line first',
      'Roll with the twist—never pull straight out',
      'Recognize entries: 50/50, saddle, SLX',
    ],
  },
  darce: {
    videoId: 'JX0HL0WpYPs',
    videoTitle: 'Front Headlock Escapes',
    instructor: 'Gordon Ryan',
    coaching:
      "Darces are catching you—usually when you're on bottom and reach under your opponent. The choke tightens as they sprawl and circle. Your escape: get your trapped arm out by turning toward them and ducking your head under. If the choke is locked, your only option is to roll through and hope they lose the grip. Prevention: when in bottom turtle or half guard, don't reach under with your inside arm—it creates the opening they need.",
    keyDefenses: [
      'Turn toward opponent, duck head under',
      'Fight the grip before it locks',
      'Roll through as a last resort',
      "Don't underhook with inside arm from bottom",
    ],
  },
  'ankle lock': {
    videoId: 'DrjbaXt-nTo',
    videoTitle: 'Ankle Lock Defense',
    instructor: 'Lachlan Giles',
    coaching:
      "You're getting caught in ankle locks. The defense is straightforward but requires quick action: boot your foot (point toes, turn foot inward) and immediately sit up to relieve the breaking pressure. Fight to clear your knee to the outside of their body—once your knee is free, you can disengage. Prevention: when someone grabs your foot, don't panic and pull straight back—that often makes it worse. Engage and work to clear.",
    keyDefenses: [
      'Boot your foot immediately (point toes in)',
      'Sit up toward them to relieve pressure',
      'Clear knee to outside of their body',
      "Don't panic-pull—engage and clear",
    ],
  },
  kneebar: {
    videoId: 'CFTLb8iywJg',
    videoTitle: 'Leg Lock Defense Fundamentals',
    instructor: 'Lachlan Giles',
    coaching:
      "Kneebars are catching you. The defense mirrors armbar defense: bend your knee and turn toward your opponent. Your priority is preventing them from extending your leg—grab your own foot/heel if possible. The danger position is when they have hip control and your leg is extended. Turn in, bend, and work to free your leg by pulling your heel toward your butt. Prevention: when in leg entanglements, never straighten your leg.",
    keyDefenses: [
      'Bend your knee immediately',
      'Turn toward opponent',
      'Grab your own foot to prevent extension',
      'Pull heel toward your butt to escape',
    ],
  },
};

// Normalize technique names for lookup
function normalizeTechnique(technique: string): string {
  const t = technique.toLowerCase().trim();
  // Handle common variations
  if (t.includes('rear naked') || t === 'rnc') return 'rnc';
  if (t.includes('triangle')) return 'triangle';
  if (t.includes('armbar') || t.includes('arm bar')) return 'armbar';
  if (t.includes('guillotine')) return 'guillotine';
  if (t.includes('kimura')) return 'kimura';
  if (t.includes('heel hook') || t.includes('heelhook')) return 'heel hook';
  if (t.includes('darce') || t.includes("d'arce")) return 'darce';
  if (t.includes('ankle lock') || t.includes('straight ankle')) return 'ankle lock';
  if (t.includes('kneebar') || t.includes('knee bar')) return 'kneebar';
  return t;
}

// Get defense content for a technique
function getDefenseContent(technique: string): DefenseContent | null {
  const normalized = normalizeTechnique(technique);
  return DEFENSE_DATABASE[normalized] || null;
}

// ===========================================
// COMPONENT
// ===========================================

export function RecentRolls({ submissionsReceived }: RecentRollsProps) {
  // Analyze recent submissions to find the most common
  const analysis = useMemo(() => {
    if (submissionsReceived.length === 0) return null;

    // Count techniques
    const counts: Record<string, number> = {};
    submissionsReceived.forEach((sub) => {
      const normalized = normalizeTechnique(sub.technique);
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    // Find most common
    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const [topTechnique, topCount] = sorted[0];

    // Get defense content
    const defense = getDefenseContent(topTechnique);

    return {
      topTechnique,
      topCount,
      totalTaps: submissionsReceived.length,
      defense,
      recentTechniques: sorted.slice(0, 3).map(([t]) => t),
    };
  }, [submissionsReceived]);

  // Empty state - no submissions received
  if (!analysis || submissionsReceived.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.header}>
          <Icons.Shield size={20} color="var(--color-positive)" />
          <span style={styles.headerLabel}>DEFENSE CHECK</span>
        </div>
        <div style={styles.emptyState}>
          <Icons.CheckCircle size={32} color="var(--color-positive)" />
          <p style={styles.emptyText}>
            No submissions received recently. Keep up the defense.
          </p>
        </div>
      </section>
    );
  }

  const { topTechnique, topCount, totalTaps, defense } = analysis;

  // Format technique name for display
  const displayTechnique = topTechnique.charAt(0).toUpperCase() + topTechnique.slice(1);

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Icons.AlertCircle size={20} color="var(--color-negative)" />
          <span style={styles.headerLabel}>WATCH OUT</span>
        </div>
        <span style={styles.headerCount}>{totalTaps} taps this week</span>
      </div>

      {/* Vulnerability Callout */}
      <div style={styles.vulnerabilityBox}>
        <div style={styles.techniqueRow}>
          <span style={styles.techniqueLabel}>Most caught by:</span>
          <span style={styles.techniqueName}>{displayTechnique}</span>
          <span style={styles.techniqueCount}>({topCount}x)</span>
        </div>
      </div>

      {/* Defense Content */}
      {defense && (
        <>
          {/* Video Link */}
          <a
            href={`https://youtube.com/watch?v=${defense.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.videoLink}
          >
            <div style={styles.videoThumbnail}>
              <Icons.Play size={24} color="var(--color-white)" />
            </div>
            <div style={styles.videoInfo}>
              <span style={styles.videoTitle}>{defense.videoTitle}</span>
              <span style={styles.videoInstructor}>{defense.instructor}</span>
            </div>
            <Icons.ExternalLink size={16} color="var(--color-gray-500)" />
          </a>

          {/* Coaching Text */}
          <div style={styles.coachingSection}>
            <div style={styles.coachingHeader}>
              <Icons.Message size={16} color="var(--color-gold)" />
              <span style={styles.coachingTitle}>NEXT SESSION</span>
            </div>
            <p style={styles.coachingText}>{defense.coaching}</p>

            {/* Key Defenses */}
            <div style={styles.keyDefenses}>
              <span style={styles.keyDefensesLabel}>Key defenses:</span>
              <ul style={styles.defenseList}>
                {defense.keyDefenses.map((def, i) => (
                  <li key={i} style={styles.defenseItem}>
                    {def}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Fallback if no defense content */}
      {!defense && (
        <div style={styles.coachingSection}>
          <p style={styles.coachingText}>
            You've been caught with {displayTechnique} {topCount} times recently.
            Ask your coach to drill defenses from this position before your next
            sparring session.
          </p>
        </div>
      )}
    </section>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    border: '1px solid var(--color-gray-800)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--color-negative)',
    textTransform: 'uppercase' as const,
  },
  headerCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
  },
  emptyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    textAlign: 'center' as const,
    margin: 0,
  },
  vulnerabilityBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderLeft: '3px solid var(--color-negative)',
    padding: '14px 16px',
    marginBottom: '16px',
  },
  techniqueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  techniqueLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
  },
  techniqueName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-negative)',
  },
  techniqueCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  videoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    textDecoration: 'none',
    marginBottom: '16px',
    transition: 'background 0.15s',
  },
  videoThumbnail: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, var(--color-negative) 0%, #b91c1c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  videoInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    minWidth: 0,
  },
  videoTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-white)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  videoInstructor: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-gray-500)',
  },
  coachingSection: {
    background: 'rgba(245, 166, 35, 0.08)',
    borderLeft: '3px solid var(--color-gold)',
    padding: '16px',
    borderRadius: '0 8px 8px 0',
  },
  coachingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '10px',
  },
  coachingTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'var(--color-gold)',
    textTransform: 'uppercase' as const,
  },
  coachingText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-300)',
    lineHeight: 1.6,
    margin: 0,
    marginBottom: '14px',
  },
  keyDefenses: {
    borderTop: '1px solid rgba(245, 166, 35, 0.2)',
    paddingTop: '12px',
  },
  keyDefensesLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    display: 'block',
    marginBottom: '8px',
  },
  defenseList: {
    margin: 0,
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  defenseItem: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-gray-400)',
    lineHeight: 1.4,
  },
};

// ===========================================
// EXPORTS
// ===========================================

// Legacy export for backwards compatibility
export type RollRecord = {
  id: string;
  partnerBelt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  outcome: 'sub_given' | 'sub_received' | 'positional' | 'draw';
  technique?: string;
  daysAgo: number;
};

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export default RecentRolls;

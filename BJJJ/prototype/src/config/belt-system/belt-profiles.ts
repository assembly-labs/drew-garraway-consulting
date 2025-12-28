/**
 * Belt Psychology Profiles
 *
 * Comprehensive profiles for each belt level based on practitioner journey research.
 * These profiles capture the psychological experience, common struggles, motivation
 * patterns, and learning curves at each stage.
 *
 * Research sources:
 * - research-practioner-journey.md (primary)
 * - BJJ educator content (Roy Dean, Jiu Jitsu Brotherhood, Heavy BJJ)
 * - Reddit r/bjj community discussions
 * - Gold BJJ Survey data (n=1,948, 2024-2025)
 */

import type { BeltPsychologyProfile } from './types';

// ===========================================
// WHITE BELT PROFILE
// ===========================================

export const whiteBeltProfile: BeltPsychologyProfile = {
  belt: 'white',
  stageName: 'Survival Mode',
  stageDescription:
    'The white belt journey is characterized by "survival mode" - holding breath, gripping everything, and burning out within minutes. Around month 4-5, a critical shift occurs: practitioners begin recognizing positions and understanding why they are being tapped rather than experiencing random chaos.',

  typicalDurationMonths: { min: 12, max: 24 },
  dropoutRiskLevel: 'critical',
  dropoutPeakWindow: { startMonth: 3, endMonth: 6 },

  primaryFocus: 'Survival, escapes, basic positions, learning to relax under pressure',
  mindsetShift:
    'From "I need to win every roll" to "I need to survive and learn". The concept of ego death - accepting that smaller, less athletic partners will submit you - is the defining white belt experience.',
  identityMarkers: [
    'Constant soreness and mat burn',
    'Holding breath during rolls',
    'Cannot remember techniques during live training',
    'Gripping everything with maximum effort',
    'Getting caught in the same submissions repeatedly',
  ],
  commonStruggles: [
    'Reality shock - physical discomfort exceeding expectations',
    'Ego death - getting submitted by smaller/less athletic partners',
    'Analysis paralysis - overwhelmed by technique volume',
    'Techniques not translating to live rolling',
    'Finger sprains, rib pain, neck strain from stacking',
    'Social anxiety before class',
    'Novelty fading while competence remains invisible',
  ],

  dominantMotivations: ['survival', 'self_defense', 'fitness'],
  motivationTrajectory: 'external_to_internal',

  learningCurveShape: 'steep',
  plateauPatterns: [
    {
      timing: '2-3 months',
      description: 'Novelty wears off, techniques still feel random',
      breakthroughTrigger: 'First successful escape or sweep in live rolling',
    },
    {
      timing: '6-9 months',
      description: 'Techniques not working against resisting partners',
      breakthroughTrigger: 'Understanding position before submission principle',
    },
    {
      timing: 'Pre-blue belt',
      description: 'Analysis paralysis, wondering if ready for promotion',
      breakthroughTrigger: 'Recognition from coach or consistent performance',
    },
  ],

  coachRelationship: 'complete_novice',
  peerDynamics:
    'High comparison to peers (harmful but common). Training partners become accountability system. Upper belts as mentors provide guidance and aspirational models.',
};

// ===========================================
// BLUE BELT PROFILE
// ===========================================

export const blueBeltProfile: BeltPsychologyProfile = {
  belt: 'blue',
  stageName: 'Identity Crisis & The Blues',
  stageDescription:
    '"Blue Belt Blues" refers to negative feelings including frustration, anxiety, and loss of motivation after receiving blue belt. The phenomenon results from post-goal emptiness, unrealistic expectations, plateau experience, and pressure from all directions. Approximately 50% of blue belts quit before reaching purple.',

  typicalDurationMonths: { min: 24, max: 48 },
  dropoutRiskLevel: 'high',
  dropoutPeakWindow: { startMonth: 0, endMonth: 12 }, // First year after promotion

  primaryFocus: 'Technical breadth, defense proficiency, developing personal style',
  mindsetShift:
    'From "just survive" to "develop my own game". The focus shifts from learning vocabulary (move names) to learning grammar (putting techniques together). Blue belt marks the end of beginner status.',
  identityMarkers: [
    'Expected to tap every white belt (unrealistic pressure)',
    'Imposter syndrome - "Am I truly a blue belt?"',
    'Beginning to develop preferred positions',
    'Competition motivation peaks',
    'Starting to chain attacks together',
  ],
  commonStruggles: [
    'Post-goal emptiness - primary motivational target (blue belt) achieved',
    'Imposter syndrome - feeling undeserving of rank',
    'Getting tapped by white belts (normal but feels like failure)',
    'Hydraulic press effect - pressure from above and below',
    'Accumulated injuries (recurring knee, shoulder, finger problems)',
    'The 2-4 year timeline feels endless',
    'Loss of fun - training becomes obligation',
    'Financial constraints - $150-200/month ongoing',
  ],

  dominantMotivations: ['competence', 'competition', 'identity'],
  motivationTrajectory: 'building',

  learningCurveShape: 'logarithmic',
  plateauPatterns: [
    {
      timing: 'First 6 months post-promotion',
      description: 'Skill did not change overnight with belt color',
      breakthroughTrigger: 'Accepting that promotion is recognition of journey, not destination',
    },
    {
      timing: 'Mid-blue belt',
      description: 'Plateau - learning curve flattens dramatically',
      breakthroughTrigger: 'Teaching others (deepens understanding, redirects focus)',
    },
    {
      timing: 'Pre-purple consideration',
      description: 'Wondering if will ever progress further',
      breakthroughTrigger: 'Developing identifiable "A-game" techniques',
    },
  ],

  coachRelationship: 'beginning_ownership',
  peerDynamics:
    'Upper belts stop "going easy", white belts hunt aggressively to prove themselves. This creates pressure from both above and below. Blue belt is the most competitive division in BJJ by volume.',
};

// ===========================================
// PURPLE BELT PROFILE
// ===========================================

export const purpleBeltProfile: BeltPsychologyProfile = {
  belt: 'purple',
  stageName: 'Systems Thinking & Teaching',
  stageDescription:
    'Purple belt represents the gateway to advanced play. As Roy Dean notes: "At Blue Belt you learned WORDS, at Purple Belt you start making SENTENCES." The shift moves from viewing BJJ as a collection of individual techniques to understanding interconnected systems. Purple belts are "generally qualified to help instruct lower-ranked students."',

  typicalDurationMonths: { min: 36, max: 48 },
  dropoutRiskLevel: 'moderate',
  dropoutPeakWindow: null, // No specific window - life circumstances dominate

  primaryFocus: 'Combination attacks, guard specialization, teaching ability, systems thinking',
  mindsetShift:
    'From "I need more techniques" to "I need to refine what I know and chain techniques together reflexively". A single technique like the triangle evolves from 3-4 movements to over twenty subtle moving parts.',
  identityMarkers: [
    'Developing "BJJ identity" - known for specific techniques',
    'Running warm-ups, teaching kids and adult classes',
    'Attacks require more finesse - "bazooka" no longer blasts through defenses',
    'Can articulate why techniques work, not just how',
    'Relaxed learning - caring less about who taps them out',
  ],
  commonStruggles: [
    'The "loneliest belt" - pressure from white/blue (fear/admiration) and brown/black (you are dangerous)',
    'Balancing "teaching rolls" vs getting pushed by higher belts',
    'Life circumstances - marriage, children, career demands',
    'Injury accumulation after 4-7+ years',
    'Burnout from overtraining or competing too frequently',
    'Contentment plateau - some are happy to stay at purple',
  ],

  dominantMotivations: ['mastery', 'teaching', 'identity'],
  motivationTrajectory: 'stable',

  learningCurveShape: 'flat_with_spikes',
  plateauPatterns: [
    {
      timing: 'Early purple',
      description: 'Techniques that worked at blue no longer work against peers',
      breakthroughTrigger: 'Understanding momentum and combinations',
    },
    {
      timing: 'Mid-purple',
      description: 'Game feels scattered - no clear identity',
      breakthroughTrigger: 'Committing to 1-2 guard systems for specialization',
    },
    {
      timing: 'Late purple',
      description: 'Wondering if ready for brown belt responsibilities',
      breakthroughTrigger: 'Feedback from black belts that "you gave me problems"',
    },
  ],

  coachRelationship: 'teaching_introduction',
  peerDynamics:
    'Mutual learning begins with coach. Teaching becomes motivating. Creates "more connected, cohesive culture" in the academy. Keith Owen\'s advice: "If you decide to consider quitting BJJ, you should at least wait until you\'re a purple belt."',
};

// ===========================================
// BROWN BELT PROFILE
// ===========================================

export const brownBeltProfile: BeltPsychologyProfile = {
  belt: 'brown',
  stageName: 'Refinement & The Final Approach',
  stageDescription:
    'Brown belt represents "almost-black-belt status." As Xande Ribeiro noted: "When you get a brown belt, you should be, in theory, ready to receive your black belt the day after." The focus shifts decisively from learning new techniques to quality of execution. Brown belt is "the belt of pressure and the belt of completion."',

  typicalDurationMonths: { min: 12, max: 24 },
  dropoutRiskLevel: 'low',
  dropoutPeakWindow: null, // Practitioners at this level rarely quit

  primaryFocus: 'Signature techniques, closing gaps, economy of motion, teaching excellence',
  mindsetShift:
    'From acquisition to refinement. Weaknesses become bigger liabilities; B and C games can no longer suffer. Some brown belts "pump the brakes" - recognizing the huge responsibility and expectations of black belt.',
  identityMarkers: [
    'Signature techniques that can catch black belts',
    'Nearly seamless transitions between top and bottom',
    'Can submit anyone given the opportunity',
    'Teaching regularly, often as assistant instructor',
    'Developing own teaching philosophy',
  ],
  commonStruggles: [
    'The "almost there" psychology - finish line visible but not crossed',
    'Recognizing the responsibility that comes with black belt',
    'Eliminating remaining weak points in game',
    'Balancing personal training with teaching responsibilities',
    'Physical wear after 6-10+ years of training',
  ],

  dominantMotivations: ['legacy', 'mastery', 'teaching'],
  motivationTrajectory: 'legacy',

  learningCurveShape: 'marginal',
  plateauPatterns: [
    {
      timing: 'Early brown',
      description: 'Overwhelming focus on closing gaps in game',
      breakthroughTrigger: 'Accepting that perfection is not required for black belt',
    },
    {
      timing: 'Throughout',
      description: 'Diminishing returns on new technique acquisition',
      breakthroughTrigger: 'Focusing on timing, precision, and efficiency instead',
    },
  ],

  coachRelationship: 'near_peer',
  peerDynamics:
    'Often functions as assistant instructor. Develops potential passion for coaching as career path. If a student reaches brown belt, they will "almost certainly reach the coveted black belt." Community role is established, intrinsic motivation is deep and sustained.',
};

// ===========================================
// BLACK BELT PROFILE (for reference completeness)
// ===========================================

export const blackBeltProfile: BeltPsychologyProfile = {
  belt: 'black',
  stageName: 'Mastery & Contribution',
  stageDescription:
    'Black belt signifies true mastery - economy of motion, knowing when to move and when not to move, and technique that "looks good." Beyond technical proficiency, black belts carry responsibility for teaching, mentorship, and contributing to the art\'s development. Average time to reach: 13.3 years.',

  typicalDurationMonths: { min: 0, max: 0 }, // Lifetime journey
  dropoutRiskLevel: 'low',
  dropoutPeakWindow: null,

  primaryFocus: 'Economy of motion, refined fundamentals, art contribution, mentorship',
  mindsetShift:
    'The journey becomes about giving back - teaching, developing students, and advancing the art itself. "A black belt is a white belt who didn\'t quit."',
  identityMarkers: [
    'Technique appears effortless',
    'Can adapt game to any opponent or situation',
    'Creates and innovates within the art',
    'Excellent teacher and communicator',
    'Represents the art with integrity and humility',
  ],
  commonStruggles: [
    'Balancing personal training with teaching load',
    'Managing physical limitations with accumulated wear',
    'Responsibility of representing the art',
    'Transitioning identity from competitor to teacher',
  ],

  dominantMotivations: ['legacy', 'teaching', 'community', 'mastery'],
  motivationTrajectory: 'legacy',

  learningCurveShape: 'marginal',
  plateauPatterns: [],

  coachRelationship: 'near_peer',
  peerDynamics:
    'Peer with other black belts. Mentor to all lower belts. Contributes to the growth of BJJ community.',
};

// ===========================================
// EXPORTS
// ===========================================

export const beltProfiles: Record<string, BeltPsychologyProfile> = {
  white: whiteBeltProfile,
  blue: blueBeltProfile,
  purple: purpleBeltProfile,
  brown: brownBeltProfile,
  black: blackBeltProfile,
};

/**
 * Get profile for a specific belt
 */
export function getBeltProfile(belt: string): BeltPsychologyProfile {
  return beltProfiles[belt] || whiteBeltProfile;
}

/**
 * Check if user is in a dropout risk window
 */
export function isInDropoutRiskWindow(
  belt: string,
  monthsAtBelt: number
): boolean {
  const profile = getBeltProfile(belt);
  if (!profile.dropoutPeakWindow) return false;

  return (
    monthsAtBelt >= profile.dropoutPeakWindow.startMonth &&
    monthsAtBelt <= profile.dropoutPeakWindow.endMonth
  );
}

/**
 * Get the current plateau pattern a user might be experiencing
 */
export function getCurrentPlateauPattern(
  belt: string,
  monthsAtBelt: number
): BeltPsychologyProfile['plateauPatterns'][0] | null {
  const profile = getBeltProfile(belt);

  // Simple heuristic based on timing descriptions
  for (const pattern of profile.plateauPatterns) {
    const timing = pattern.timing.toLowerCase();

    if (timing.includes('early') && monthsAtBelt <= 6) {
      return pattern;
    }
    if (timing.includes('mid') && monthsAtBelt > 6 && monthsAtBelt <= 18) {
      return pattern;
    }
    if (
      (timing.includes('late') || timing.includes('pre-')) &&
      monthsAtBelt > 18
    ) {
      return pattern;
    }
    if (timing.includes('throughout')) {
      return pattern;
    }
  }

  return null;
}

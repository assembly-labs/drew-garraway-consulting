/**
 * BJJ Belt Ranking Criteria
 * Based on IBJJF Standards (v2 - December 2024)
 *
 * This module contains the complete belt progression system including:
 * - Three curriculum pillars (sport, self-defense, conceptual)
 * - Adult belt requirements (White through Black with degrees)
 * - Youth belt system (Grey, Yellow, Orange, Green)
 * - Technical requirements by category
 * - Guard systems with belt-level progression
 * - Passing systems (pressure vs speed)
 * - Leg lock curriculum with ashi positions
 * - Conceptual principles (frames, levers, wedges)
 * - Subjective criteria for promotion
 * - Major academy curriculum references
 */

import type { BeltColor } from './users';

// ===========================================
// TYPE DEFINITIONS
// ===========================================

export type AdultBelt = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type YouthBelt = 'grey' | 'yellow' | 'orange' | 'green';
export type YouthBeltTier = 'white-stripe' | 'solid' | 'black-stripe';

export type RequirementCategory =
  | 'positional-knowledge'
  | 'escapes'
  | 'guard'
  | 'guard-passing'
  | 'submissions'
  | 'takedowns'
  | 'movement'
  | 'combinations'
  | 'conceptual';

export type SubjectiveCategory =
  | 'character'
  | 'training-attitude'
  | 'community'
  | 'competition';

export interface BeltDefinition {
  belt: BeltColor;
  displayName: string;
  minAge: number | null;
  minTimeAtBeltMonths: number | null;
  maxStripes: number;
  philosophy: string;
  focus: string;
  canPromoteTo: BeltColor[];
  worldChampionException: boolean;
}

export interface TechnicalRequirement {
  id: string;
  belt: BeltColor;
  category: RequirementCategory;
  name: string;
  description: string;
  subItems?: string[];
  relatedTechniqueIds?: string[];
  isRequired: boolean;
}

export interface SubjectiveCriterion {
  id: string;
  belt: BeltColor;
  category: SubjectiveCategory;
  description: string;
}

export interface BlackBeltDegree {
  degree: number;
  title: string;
  yearsRequired: number;
  beltColor: string;
  notes?: string;
}

export interface YouthBeltDefinition {
  belt: YouthBelt;
  displayName: string;
  minAge: number;
  maxAge: number;
  tiers: YouthBeltTier[];
  transitionToAdult: {
    possibleBelts: BeltColor[];
    notes: string;
  };
}

export interface UserBeltProgress {
  odId: string;
  belt: BeltColor;
  completedRequirements: string[];
  partialRequirements: { id: string; notes: string }[];
  subjectiveCriteriaMet: string[];
  coachNotes?: string;
  lastReviewDate?: string;
}

// ===========================================
// CURRICULUM PILLARS
// ===========================================

/**
 * The BJJ curriculum divides into three interconnected pillars
 */
export type CurriculumPillar = 'sport' | 'self-defense' | 'conceptual';

export interface CurriculumPillarDefinition {
  pillar: CurriculumPillar;
  name: string;
  description: string;
  focus: string[];
}

export const curriculumPillars: CurriculumPillarDefinition[] = [
  {
    pillar: 'sport',
    name: 'Sport Jiu-Jitsu',
    description: 'Techniques optimized for competition under IBJJF, ADCC, and submission-only rulesets',
    focus: [
      'Guard systems and retention',
      'Passing systems (pressure and speed)',
      'Positional scoring awareness',
      'Leg lock systems (belt-appropriate)',
      'Competition strategy and pacing',
    ],
  },
  {
    pillar: 'self-defense',
    name: 'Self-Defense',
    description: 'Techniques for real-world confrontations where strikes are involved',
    focus: [
      'Distance management and clinch entry',
      'Punch block series from guard',
      'Headlock escapes (standing and ground)',
      'Mount survival with strikes',
      'Standing self-defense techniques',
    ],
  },
  {
    pillar: 'conceptual',
    name: 'Conceptual Understanding',
    description: 'Principles that enable adaptation beyond memorized techniques',
    focus: [
      'Frames for defense',
      'Levers for offense (three-joint rule)',
      'Wedges for blocking and prying',
      'Posture and base principles',
      'Position before submission',
    ],
  },
];

// ===========================================
// CONCEPTUAL PRINCIPLES
// ===========================================

export interface ConceptualPrinciple {
  id: string;
  name: string;
  description: string;
  application: string;
  relatedPositions: string[];
}

export const conceptualPrinciples: ConceptualPrinciple[] = [
  {
    id: 'concept-frames',
    name: 'Frames',
    description: 'Create shields using the skeletal system—forearms, shins, and knees form barriers preventing the opponent from closing in.',
    application: 'Effective frames rely on bone alignment rather than muscle strength, with elbows and knees kept close to the body for maximum structural integrity.',
    relatedPositions: ['guard-bottom', 'side-control-bottom', 'mount-bottom'],
  },
  {
    id: 'concept-levers',
    name: 'Levers',
    description: 'Force multiplication for attacks using the three-joint rule: arms (shoulder, elbow, wrist) and legs (hip, knee, ankle).',
    application: 'Controlling at least two of three joints enables effective submission attacks. Body lever hierarchy: legs → arms → head.',
    relatedPositions: ['all'],
  },
  {
    id: 'concept-wedges',
    name: 'Wedges',
    description: 'Block and restrict opponent movement through blocking wedges (immobilize) and prying wedges (force open).',
    application: 'Blocking wedges: hand beside hip preventing re-guarding. Prying wedges: knee cutting through guard.',
    relatedPositions: ['guard-passing', 'side-control-top', 'mount-top'],
  },
  {
    id: 'concept-posture-base',
    name: 'Posture and Base',
    description: 'Foundation for all techniques. When center of gravity moves beyond base of support, they will fall.',
    application: 'Attacking the head primarily attacks posture; attacking arms and legs primarily attacks structure. This drives all sweeps and takedowns.',
    relatedPositions: ['standing', 'guard-top', 'all'],
  },
  {
    id: 'concept-position-hierarchy',
    name: 'Positional Hierarchy',
    description: 'From most dominant to most vulnerable: Back control → Mount → Knee on belly → Side control → Half guard top → Guard → Side control bottom → Mount bottom → Back taken.',
    application: 'Core strategic principle: position before submission—achieve dominant position before attempting to finish.',
    relatedPositions: ['all'],
  },
  {
    id: 'concept-chain-attacks',
    name: 'Chain Attacks',
    description: 'Advanced play where each technique sets up the next based on opponent\'s defensive reactions.',
    application: 'Classic sequences: armbar → triangle → omoplata from guard; hip bump → kimura → guillotine; cross choke → armbar from mount.',
    relatedPositions: ['guard-bottom', 'mount-top', 'back-control'],
  },
];

// ===========================================
// GUARD SYSTEMS BY BELT LEVEL
// ===========================================

export type GuardType =
  | 'closed-guard'
  | 'half-guard'
  | 'butterfly-guard'
  | 'de-la-riva'
  | 'spider-guard'
  | 'lasso-guard'
  | 'x-guard'
  | 'single-leg-x'
  | 'reverse-de-la-riva'
  | 'deep-half'
  | 'knee-shield'
  | 'lockdown'
  | 'rubber-guard';

export interface GuardSystem {
  id: string;
  name: string;
  type: GuardType;
  beltLevel: BeltColor;
  description: string;
  keySweeps: string[];
  keySubmissions: string[];
  relatedTechniqueIds?: string[];
}

export const guardSystems: GuardSystem[] = [
  // White Belt Guards
  {
    id: 'guard-closed',
    name: 'Closed Guard',
    type: 'closed-guard',
    beltLevel: 'white',
    description: 'First guard every practitioner learns, functioning as both offensive and defensive platform.',
    keySweeps: ['Scissor sweep', 'Hip bump sweep', 'Flower/pendulum sweep'],
    keySubmissions: ['Armbar', 'Triangle choke', 'Kimura', 'Guillotine'],
    relatedTechniqueIds: ['tech-001', 'tech-002', 'tech-003', 'tech-005', 'tech-006'],
  },
  {
    id: 'guard-half-basic',
    name: 'Basic Half Guard',
    type: 'half-guard',
    beltLevel: 'white',
    description: 'Fundamental recovery position introducing the critical concept of the underhook battle.',
    keySweeps: ['Old school sweep', 'Plan B sweep'],
    keySubmissions: ['Kimura', 'Guillotine'],
    relatedTechniqueIds: ['tech-022'],
  },
  // Blue Belt Guards
  {
    id: 'guard-knee-shield',
    name: 'Knee Shield (Z-Guard)',
    type: 'knee-shield',
    beltLevel: 'blue',
    description: 'Frame creation across opponent\'s torso using the shin as a barrier.',
    keySweeps: ['Hip bump from Z', 'Underhook sweep'],
    keySubmissions: ['Loop choke', 'Kimura'],
  },
  {
    id: 'guard-lockdown',
    name: 'Lockdown',
    type: 'lockdown',
    beltLevel: 'blue',
    description: '10th Planet system; control through leg entanglement in half guard.',
    keySweeps: ['Electric chair sweep', 'Old school from lockdown'],
    keySubmissions: ['Electric chair', 'Banana split'],
  },
  {
    id: 'guard-butterfly',
    name: 'Butterfly Guard',
    type: 'butterfly-guard',
    beltLevel: 'blue',
    description: 'Made famous by Marcelo Garcia; relies on strong hooks inside opponent\'s thighs combined with upper body control.',
    keySweeps: ['Hook sweep', 'Arm drag to back'],
    keySubmissions: ['Guillotine', 'Armbar'],
    relatedTechniqueIds: ['tech-023'],
  },
  {
    id: 'guard-dlr',
    name: 'De La Riva Guard',
    type: 'de-la-riva',
    beltLevel: 'blue',
    description: 'Developed by Ricardo De La Riva in the 1980s; hooks opponent\'s lead leg from outside while maintaining collar and ankle control.',
    keySweeps: ['DLR sweep', 'Berimbolo entry'],
    keySubmissions: ['Triangle', 'Omoplata'],
    relatedTechniqueIds: ['tech-021'],
  },
  {
    id: 'guard-spider',
    name: 'Spider Guard',
    type: 'spider-guard',
    beltLevel: 'blue',
    description: 'Both feet on opponent\'s biceps with sleeve grips, creating constant tension.',
    keySweeps: ['Spider sweep', 'Balloon sweep'],
    keySubmissions: ['Triangle', 'Omoplata', 'Armbar'],
    relatedTechniqueIds: ['tech-020'],
  },
  // Purple Belt Guards
  {
    id: 'guard-x',
    name: 'X-Guard',
    type: 'x-guard',
    beltLevel: 'purple',
    description: 'Hooks behind the knee while pushing the hip; essential for modern leg lock systems.',
    keySweeps: ['Technical standup sweep', 'Overhead sweep'],
    keySubmissions: ['Ankle lock entries', 'Back take'],
    relatedTechniqueIds: ['tech-024'],
  },
  {
    id: 'guard-slx',
    name: 'Single Leg X (Ashi Garami)',
    type: 'single-leg-x',
    beltLevel: 'purple',
    description: 'Primary entry point for straight ankle locks, toe holds, and heel hooks.',
    keySweeps: ['Sweep to top', 'Back take'],
    keySubmissions: ['Straight ankle lock', 'Toe hold', 'Heel hook'],
    relatedTechniqueIds: ['tech-012', 'tech-013'],
  },
  {
    id: 'guard-deep-half',
    name: 'Deep Half Guard',
    type: 'deep-half',
    beltLevel: 'purple',
    description: 'Complete body positioning under opponent for sweeps and back takes.',
    keySweeps: ['Waiter sweep', 'Homer Simpson sweep', 'Back take'],
    keySubmissions: ['Toe hold', 'Kneebar'],
  },
  {
    id: 'guard-rdlr',
    name: 'Reverse De La Riva',
    type: 'reverse-de-la-riva',
    beltLevel: 'purple',
    description: 'Hook behind opponent\'s lead leg from inside; excellent for back takes.',
    keySweeps: ['Kiss of the dragon', 'RDLR sweep'],
    keySubmissions: ['Back take to RNC'],
  },
];

/**
 * Guard retention principles apply across all guards
 */
export const guardRetentionPrinciples = [
  'Maintain frames using arms and shins to prevent chest-to-chest contact',
  'Keep four points of contact with the opponent at all times',
  'Hide the hip-to-armpit gap that passers exploit',
  'Use hip movement as primary defense, not strength',
  'Recover to knees or closed guard when guard is passed',
];

// ===========================================
// PASSING SYSTEMS
// ===========================================

export type PassingStyle = 'pressure' | 'speed' | 'hybrid';

export interface PassingTechnique {
  id: string;
  name: string;
  style: PassingStyle;
  beltLevel: BeltColor;
  description: string;
  successRate?: string;
  relatedTechniqueIds?: string[];
}

export const passingTechniques: PassingTechnique[] = [
  // Pressure Passing
  {
    id: 'pass-body-lock',
    name: 'Body Lock Pass',
    style: 'pressure',
    beltLevel: 'blue',
    description: 'Wrap arms around opponent\'s torso with double underhooks, tripod up on feet and head, work past half guard.',
  },
  {
    id: 'pass-over-under',
    name: 'Over-Under Pass',
    style: 'pressure',
    beltLevel: 'blue',
    description: 'One arm under opponent\'s leg near hip, one over opposite leg, shoulders controlling hips.',
  },
  {
    id: 'pass-stack',
    name: 'Stack Pass',
    style: 'pressure',
    beltLevel: 'white',
    description: 'Both arms under opponent\'s legs, stack hips above shoulders, walk around to side control.',
  },
  {
    id: 'pass-smash',
    name: 'Smash Pass',
    style: 'pressure',
    beltLevel: 'blue',
    description: 'Use chest weight to collapse opponent\'s legs together before passing.',
  },
  // Speed Passing
  {
    id: 'pass-toreando',
    name: 'Toreando (Bullfighter) Pass',
    style: 'speed',
    beltLevel: 'white',
    description: 'Control inside of knees, redirect legs while sprawling hips back, hop around to side control.',
    relatedTechniqueIds: ['tech-007'],
  },
  {
    id: 'pass-leg-drag',
    name: 'Leg Drag Pass',
    style: 'speed',
    beltLevel: 'blue',
    description: 'Redirect opponent\'s leg across their centerline, maintain ankle control while passing.',
  },
  {
    id: 'pass-x-pass',
    name: 'X-Pass',
    style: 'speed',
    beltLevel: 'blue',
    description: 'Move your body out of the way rather than manipulating opponent\'s body.',
  },
  {
    id: 'pass-long-step',
    name: 'Long Step Pass',
    style: 'speed',
    beltLevel: 'blue',
    description: 'Large step around opponent\'s guard from headquarters position.',
  },
  // Fundamental
  {
    id: 'pass-knee-slice',
    name: 'Knee Slice/Cut Pass',
    style: 'hybrid',
    beltLevel: 'white',
    description: 'From combat base, position forward knee on opponent\'s thigh, establish underhook, slide knee across while controlling head and arm.',
    successRate: '45% beginner, 75% advanced',
    relatedTechniqueIds: ['tech-008'],
  },
  {
    id: 'pass-headquarters',
    name: 'Headquarters Position',
    style: 'hybrid',
    beltLevel: 'blue',
    description: 'Modern passing stance on top of opponent\'s shin, bypassing feet (first line of defense), neutralizing DLR, lasso, and spider.',
  },
];

/**
 * Situation-based passing recommendations
 */
export const passingRecommendations = [
  { situation: 'Legs elevated high', approach: 'Speed passing (toreando, leg drag)' },
  { situation: 'Legs at mid-level', approach: 'Either style / Headquarters' },
  { situation: 'Legs positioned low', approach: 'Pressure passing (body lock, stack)' },
  { situation: 'Athletic opponents', approach: 'Pressure passing wears them down' },
  { situation: 'Flexible guard players', approach: 'Pressure neutralizes flexibility' },
  { situation: 'Running low on time', approach: 'Speed passing for quick advancement' },
];

// ===========================================
// TAKEDOWN CURRICULUM
// ===========================================

export type TakedownStyle = 'wrestling' | 'judo' | 'clinch' | 'guard-pull';

export interface TakedownTechnique {
  id: string;
  name: string;
  style: TakedownStyle;
  japaneseName?: string;
  beltLevel: BeltColor;
  description: string;
  relatedTechniqueIds?: string[];
}

export const takedownTechniques: TakedownTechnique[] = [
  // Wrestling
  {
    id: 'td-high-single',
    name: 'High Single Leg',
    style: 'wrestling',
    beltLevel: 'white',
    description: 'Grab behind opponent\'s knee with head positioned inside (reducing guillotine risk). Finish through quarter turns, lifts, or running the pipe.',
    relatedTechniqueIds: ['tech-015'],
  },
  {
    id: 'td-blast-double',
    name: 'Blast Double Leg',
    style: 'wrestling',
    beltLevel: 'white',
    description: 'Explosive penetration between legs, wrapping both legs behind knees while driving at 45-degree angle with head tight to opponent\'s side.',
    relatedTechniqueIds: ['tech-014'],
  },
  {
    id: 'td-arm-drag',
    name: 'Arm Drag',
    style: 'wrestling',
    beltLevel: 'blue',
    description: 'Pull opponent\'s arm across their body, opening back takes, single legs, inside trips, and go-behinds.',
  },
  // Judo
  {
    id: 'td-osoto-gari',
    name: 'Osoto Gari',
    style: 'judo',
    japaneseName: '大外刈',
    beltLevel: 'white',
    description: 'Major outer reap - break balance to rear corner, reap outside leg.',
  },
  {
    id: 'td-ouchi-gari',
    name: 'Ouchi Gari',
    style: 'judo',
    japaneseName: '大内刈',
    beltLevel: 'blue',
    description: 'Attack inside of far leg, works with push/pull motion.',
  },
  {
    id: 'td-seoi-nage',
    name: 'Seoi Nage',
    style: 'judo',
    japaneseName: '背負投',
    beltLevel: 'blue',
    description: 'Shoulder throw - grip lapel, turn 180°, throw over shoulder.',
  },
  {
    id: 'td-harai-goshi',
    name: 'Harai Goshi',
    style: 'judo',
    japaneseName: '払腰',
    beltLevel: 'purple',
    description: 'Load opponent on hip, sweep far leg with rotating motion.',
  },
  {
    id: 'td-uchi-mata',
    name: 'Uchi Mata',
    style: 'judo',
    japaneseName: '内股',
    beltLevel: 'purple',
    description: 'Sweep between legs against inner thigh - highest-scoring judo throw.',
  },
  // Clinch
  {
    id: 'td-body-lock-takedown',
    name: 'Body Lock Takedown',
    style: 'clinch',
    beltLevel: 'blue',
    description: 'Wrap arms around opponent\'s torso, finish through angling, breaking posture, and twisting to trip.',
  },
  {
    id: 'td-double-underhooks',
    name: 'Double Underhooks',
    style: 'clinch',
    beltLevel: 'blue',
    description: 'Most dominant clinch position - gable grip behind back enables takedowns, throws, and trips.',
  },
  // Guard Pull
  {
    id: 'td-guard-pull',
    name: 'Guard Pull',
    style: 'guard-pull',
    beltLevel: 'white',
    description: 'Establish grips (sleeve/collar gi, 2-on-1 no-gi), place foot on hip, sit back pulling opponent into guard. IBJJF requires at least one grip.',
  },
];

// ===========================================
// LEG LOCK CURRICULUM (IBJJF LEGAL BY BELT)
// ===========================================

export interface LegLockRule {
  beltLevel: BeltColor;
  giLegal: string[];
  noGiLegal: string[];
  notes?: string;
}

export const legLockRules: LegLockRule[] = [
  {
    beltLevel: 'white',
    giLegal: ['Straight ankle lock (turn away from knee)'],
    noGiLegal: ['Straight ankle lock (turn away from knee)'],
  },
  {
    beltLevel: 'blue',
    giLegal: ['Straight ankle lock (turn away from knee)'],
    noGiLegal: ['Straight ankle lock (turn away from knee)'],
  },
  {
    beltLevel: 'purple',
    giLegal: ['Straight ankle lock (turn away from knee)'],
    noGiLegal: ['Straight ankle lock (turn away from knee)'],
  },
  {
    beltLevel: 'brown',
    giLegal: ['Ankle lock', 'Toe hold', 'Kneebar', 'Calf slicer'],
    noGiLegal: ['ALL including heel hooks (2021 rule change)'],
  },
  {
    beltLevel: 'black',
    giLegal: ['Ankle lock', 'Toe hold', 'Kneebar', 'Calf slicer'],
    noGiLegal: ['ALL including heel hooks (2021 rule change)'],
  },
];

export type AshiGaramiCategory = 'category-a' | 'category-b' | 'category-c';

export interface AshiGaramiPosition {
  id: string;
  name: string;
  alternateNames: string[];
  category: AshiGaramiCategory;
  description: string;
  primaryAttacks: string[];
  beltLevel: BeltColor;
}

export const ashiGaramiPositions: AshiGaramiPosition[] = [
  // Category A - Trapped leg outside body
  {
    id: 'ashi-standard',
    name: 'Standard Ashi Garami',
    alternateNames: ['Single Leg X', 'SLX'],
    category: 'category-a',
    description: 'Outside foot on hip, inside leg hooks thigh - primary position for straight ankle locks.',
    primaryAttacks: ['Straight ankle lock'],
    beltLevel: 'white',
  },
  {
    id: 'ashi-outside',
    name: 'Outside Ashi Garami',
    alternateNames: ['Outside Heel Hook Position'],
    category: 'category-a',
    description: 'Inside leg crosses to outside of opponent\'s hips, ankles crossed - excellent heel hook control.',
    primaryAttacks: ['Outside heel hook'],
    beltLevel: 'brown',
  },
  {
    id: 'ashi-cross',
    name: 'Cross Ashi Garami',
    alternateNames: [],
    category: 'category-a',
    description: 'Both legs hook inside opponent\'s opposite thigh.',
    primaryAttacks: ['Heel hook', 'Ankle lock'],
    beltLevel: 'purple',
  },
  // Category B - Trapped leg inside (Saddle/411)
  {
    id: 'ashi-saddle',
    name: 'Inside Sankaku',
    alternateNames: ['Saddle', 'Honey Hole', '4-11', '411'],
    category: 'category-b',
    description: 'Front leg laced over opponent\'s leg, back leg behind thigh, triangled configuration - primary position for inside heel hooks.',
    primaryAttacks: ['Inside heel hook', 'Kneebar'],
    beltLevel: 'brown',
  },
  {
    id: 'ashi-kneebar',
    name: 'Lateral Kneebar Position',
    alternateNames: [],
    category: 'category-b',
    description: 'Derived from saddle, optimal for kneebar attacks.',
    primaryAttacks: ['Kneebar'],
    beltLevel: 'brown',
  },
  // Category C - 50/50 variations
  {
    id: 'ashi-5050',
    name: '50/50 Guard',
    alternateNames: ['Fifty-Fifty'],
    category: 'category-c',
    description: 'Both practitioners have inside legs laced together - equal attack/defense (leg lock shootout).',
    primaryAttacks: ['Heel hook', 'Ankle lock', 'Toe hold'],
    beltLevel: 'purple',
  },
  {
    id: 'ashi-8020',
    name: '80/20 Position',
    alternateNames: ['90/10'],
    category: 'category-c',
    description: 'Improved control variations with better attacking angles than 50/50.',
    primaryAttacks: ['Heel hook'],
    beltLevel: 'brown',
  },
];

/**
 * Heel hook mechanics and safety
 */
export const heelHookMechanics = {
  insideHeelHook: {
    target: 'ACL (more dangerous - damage before pain)',
    direction: 'Heel rotating inward toward opponent\'s body',
    position: 'From saddle/inside sankaku',
  },
  outsideHeelHook: {
    target: 'Lateral knee ligaments (MCL, LCL)',
    direction: 'Heel rotating outward',
    position: 'From standard ashi positions',
  },
  defense: [
    'Boot - point toes toward own body, straighten leg to flex ankle',
    'Clear the knee line - if your knee is past their knees toward their head, you\'re in danger',
    'Hip elevation - reduces opponent control since leg locks work best when both hips are grounded',
  ],
};

// ===========================================
// GRACIE COMBATIVES (SELF-DEFENSE CURRICULUM)
// ===========================================

export interface SelfDefenseTechnique {
  id: string;
  name: string;
  category: 'standing' | 'ground' | 'mount' | 'guard' | 'side-mount';
  description: string;
  beltLevel: BeltColor;
}

export const gracieCombatives = {
  overview: {
    totalTechniques: 36,
    totalLessons: 23,
    origin: 'Originally developed for the U.S. Army',
    positions: ['Mount', 'Guard', 'Side Mount', 'Standing'],
  },
  punchBlockSeries: [
    { stage: 1, description: 'Opponent in guard not actively striking - control posture' },
    { stage: 2, description: 'Opponent posturing up - maintain wrist/sleeve control' },
    { stage: 3, description: 'Opponent throwing punches - block and redirect' },
    { stage: 4, description: 'Opponent leaning forward - sweep opportunities' },
    { stage: 5, description: 'Opponent standing in guard - leg control, stand-up, or sweep' },
  ],
  standingSelfDefense: [
    'Clinch establishment against aggressive and conservative opponents',
    'Haymaker punch defense (slip underneath, get behind, rear clinch)',
    'Headlock escapes for standing and ground',
    'Guillotine choke when tackled or shot upon',
    'Standing armbar as counter to chest pushing',
  ],
  requirements: {
    lessonsRequired: 'Each lesson three times',
    reflexClasses: 12,
    evaluationMinutes: 25,
    passingScore: '90%',
    belt: 'Combatives Belt (white belt with navy blue center)',
  },
};

// ===========================================
// MAJOR ACADEMY CURRICULA
// ===========================================

export interface AcademyCurriculum {
  name: string;
  founder: string;
  emphasis: string;
  structure: string[];
  uniqueElements: string[];
}

export const majorAcademyCurricula: AcademyCurriculum[] = [
  {
    name: 'Gracie University',
    founder: 'Rener and Ryron Gracie',
    emphasis: 'Self-defense orientation',
    structure: [
      'Gracie Combatives (36 techniques, 23 lessons)',
      'Master Cycle: Mount, Side Mount, Guard, Half Guard, Back Mount, Leg Locks, Standing',
    ],
    uniqueElements: [
      'Fight simulation sparring with strikes',
      'Online testing available',
      'Combatives Belt intermediate rank',
    ],
  },
  {
    name: 'Gracie Barra',
    founder: 'Carlos Gracie Jr.',
    emphasis: 'Structured curriculum',
    structure: [
      'GB1 Fundamentals (16-week cycle, 96 technique videos)',
      'GB2 Advanced (requires 3 stripes, introduces no-gi and live sparring)',
      'GB3 Black Belt (blue belt prerequisite, competition focus)',
    ],
    uniqueElements: [
      'Standardized curriculum worldwide',
      'Uniform requirements',
      'Structured class format',
    ],
  },
  {
    name: 'Alliance BJJ',
    founder: 'Romero Cavalcanti, Jacare, Fabio Gurgel',
    emphasis: 'Competition success',
    structure: [
      'Modules organized by belt level',
      'IBJJF time-in-grade requirements',
      'Competition team integration',
    ],
    uniqueElements: [
      'Six World Team Championships',
      '50+ individual black belt world titles',
      'Strong competition culture',
    ],
  },
  {
    name: '10th Planet Jiu-Jitsu',
    founder: 'Eddie Bravo',
    emphasis: 'No-gi with MMA applicability',
    structure: [
      'Warmup series A through H (four flows each)',
      'Position-specific attack and defense flows',
    ],
    uniqueElements: [
      'Rubber Guard (high flexible closed guard)',
      'Lockdown (half-guard leg entanglement)',
      'The Truck (alternate back control for Twister)',
      'Comprehensive leg locks',
      'No-gi only training',
    ],
  },
  {
    name: 'Pedro Sauer BJJ Association',
    founder: 'Pedro Sauer (Rickson Gracie lineage)',
    emphasis: 'Structured technique counts',
    structure: [
      'Blue to Purple: 85 techniques (2025 curriculum)',
      'Purple to Brown: 59 techniques',
      'Black Belt test: 72 techniques (complete self-defense curriculum)',
    ],
    uniqueElements: [
      'Helio Gracie lineage emphasis',
      'Detailed testing requirements',
      'Self-defense integration',
    ],
  },
];

/**
 * Roy Dean's conceptual insight on belt progression
 */
export const royDeanInsight = {
  quote: 'At Blue Belt you learned WORDS, at Purple Belt you start making SENTENCES.',
  meaning: 'Emphasizes multi-technique combinations over isolated techniques as the key development from blue to purple.',
};

// ===========================================
// ADULT BELT DEFINITIONS
// ===========================================

export const adultBeltDefinitions: BeltDefinition[] = [
  {
    belt: 'white',
    displayName: 'White Belt',
    minAge: null,
    minTimeAtBeltMonths: null,
    maxStripes: 4,
    philosophy: 'White belt (1-2 years typical) focuses on survival, learning approximately 30-40 fundamental techniques while developing a frame of reference for future learning. Priority skills include relaxation under pressure, controlling ego, learning position names and feels, and mastering basic movements (shrimping, bridging, technical stand-up).',
    focus: 'Survival, escapes, basic positions, relaxation under pressure',
    canPromoteTo: [],
    worldChampionException: false,
  },
  {
    belt: 'blue',
    displayName: 'Blue Belt',
    minAge: 16,
    minTimeAtBeltMonths: 24,
    maxStripes: 4,
    philosophy: 'Blue belt (2+ years at rank before purple) requires defense proficiency: at least two solid escapes from mount, back mount, and side control, plus two techniques for passing guard. As Roger Gracie emphasized: "I first made it almost impossible for anybody to tap me out" before focusing on offensive development. Blue belts should have at least one viable technique from all major positions.',
    focus: 'Technical breadth, defense proficiency, fundamentals mastery',
    canPromoteTo: [],
    worldChampionException: true,
  },
  {
    belt: 'purple',
    displayName: 'Purple Belt',
    minAge: 16,
    minTimeAtBeltMonths: 18,
    maxStripes: 4,
    philosophy: 'Purple belt (18+ months before brown) represents the gateway to advanced play. As Roy Dean notes: "At Blue Belt you learned WORDS, at Purple Belt you start making SENTENCES"—emphasizing multi-technique combinations over isolated techniques. Key development: three combination attacks from guard, three submissions from side mount/mount/back mount, and familiarity with all guard variants while specializing in at least one or two. Purple belts typically begin teaching fundamentals classes.',
    focus: 'Combination attacks, guard specialization, teaching ability',
    canPromoteTo: ['white', 'blue'],
    worldChampionException: true,
  },
  {
    belt: 'brown',
    displayName: 'Brown Belt',
    minAge: 18,
    minTimeAtBeltMonths: 12,
    maxStripes: 4,
    philosophy: 'Brown belt (12+ months before black) demands a complete game with signature techniques that work on almost everybody. Very few positions or situations should be unfamiliar. Brown belts often serve as the bridge between beginners and professors, teaching regularly while eliminating remaining weak points in their game.',
    focus: 'Signature techniques, complete game, teaching bridge',
    canPromoteTo: ['white', 'blue', 'purple'],
    worldChampionException: true,
  },
  {
    belt: 'black',
    displayName: 'Black Belt',
    minAge: 19,
    minTimeAtBeltMonths: 12,
    maxStripes: 6,
    philosophy: 'Black belt (typically 8-15 years total training) signifies true mastery—economy of motion, knowing when to move and when not to move, and technique that "looks good." The black belt\'s game is built on refined fundamentals rather than flash. Beyond technical proficiency, black belts carry responsibility for teaching, mentorship, and contributing to the art\'s development.',
    focus: 'Economy of motion, refined fundamentals, art contribution',
    canPromoteTo: ['white', 'blue', 'purple', 'brown'],
    worldChampionException: true,
  },
];

// ===========================================
// BLACK BELT DEGREES
// ===========================================

export const blackBeltDegrees: BlackBeltDegree[] = [
  { degree: 1, title: 'Black Belt', yearsRequired: 3, beltColor: 'black', notes: 'First official degree' },
  { degree: 2, title: 'Black Belt', yearsRequired: 3, beltColor: 'black', notes: 'Can certify black belt promotions' },
  { degree: 3, title: 'Black Belt', yearsRequired: 3, beltColor: 'black' },
  { degree: 4, title: 'Black Belt', yearsRequired: 5, beltColor: 'black' },
  { degree: 5, title: 'Black Belt', yearsRequired: 5, beltColor: 'black' },
  { degree: 6, title: 'Black Belt', yearsRequired: 5, beltColor: 'black' },
  { degree: 7, title: 'Coral Belt (Red/Black)', yearsRequired: 7, beltColor: 'coral-red-black', notes: 'Master' },
  { degree: 8, title: 'Coral Belt (Red/White)', yearsRequired: 7, beltColor: 'coral-red-white' },
  { degree: 9, title: 'Red Belt', yearsRequired: 10, beltColor: 'red', notes: 'Grandmaster' },
  { degree: 10, title: 'Red Belt', yearsRequired: 0, beltColor: 'red', notes: 'Reserved - Only awarded to Gracie brothers' },
];

// ===========================================
// WHITE BELT TECHNICAL REQUIREMENTS
// ===========================================

export const whiteBeltRequirements: TechnicalRequirement[] = [
  // Positional Knowledge
  {
    id: 'wb-pos-001',
    belt: 'white',
    category: 'positional-knowledge',
    name: 'Position Hierarchy',
    description: 'Must be able to identify and understand the hierarchy of positions',
    subItems: [
      'Mount (full mount, S-mount)',
      'Back control (rear mount with hooks)',
      'Side control (side mount, 100 kilos)',
      'Knee on belly',
      'Closed guard (full guard)',
      'Half guard',
      'Turtle position',
    ],
    isRequired: true,
  },

  // Escapes
  {
    id: 'wb-esc-001',
    belt: 'white',
    category: 'escapes',
    name: 'Elbow-Knee Escape from Mount',
    description: 'Hip escape (shrimp) technique to recover guard from mount position',
    relatedTechniqueIds: ['tech-010'],
    isRequired: true,
  },
  {
    id: 'wb-esc-002',
    belt: 'white',
    category: 'escapes',
    name: 'Bridge and Roll from Mount',
    description: 'Trap arm and leg, bridge to reverse mount position (upa)',
    relatedTechniqueIds: ['tech-009'],
    isRequired: true,
  },
  {
    id: 'wb-esc-003',
    belt: 'white',
    category: 'escapes',
    name: 'Hip Escape from Side Control',
    description: 'Create frames and shrimp to recover guard',
    relatedTechniqueIds: ['tech-011'],
    isRequired: true,
  },
  {
    id: 'wb-esc-004',
    belt: 'white',
    category: 'escapes',
    name: 'Guard Replacement from Side Control',
    description: 'Use frames to create space and replace closed or half guard',
    isRequired: true,
  },
  {
    id: 'wb-esc-005',
    belt: 'white',
    category: 'escapes',
    name: 'Basic Back Escape',
    description: 'Defend the choke, create space, escape hips to safety',
    isRequired: true,
  },

  // Guard Fundamentals
  {
    id: 'wb-guard-001',
    belt: 'white',
    category: 'guard',
    name: 'Posture Control and Breaking',
    description: 'Control opponent in closed guard, break their posture for attacks',
    isRequired: true,
  },
  {
    id: 'wb-guard-002',
    belt: 'white',
    category: 'guard',
    name: 'Hip Bump Sweep',
    description: 'Use momentum to sweep opponent when they posture in guard',
    relatedTechniqueIds: ['tech-006'],
    isRequired: true,
  },
  {
    id: 'wb-guard-003',
    belt: 'white',
    category: 'guard',
    name: 'Scissor Sweep',
    description: 'Control sleeve and collar, use leg scissors motion to sweep',
    relatedTechniqueIds: ['tech-005'],
    isRequired: true,
  },
  {
    id: 'wb-guard-004',
    belt: 'white',
    category: 'guard',
    name: 'Armbar from Guard',
    description: 'Fundamental armbar attack from closed guard position',
    relatedTechniqueIds: ['tech-001'],
    isRequired: true,
  },
  {
    id: 'wb-guard-005',
    belt: 'white',
    category: 'guard',
    name: 'Triangle Choke Setup',
    description: 'Basic triangle choke entry and setup from closed guard',
    relatedTechniqueIds: ['tech-002'],
    isRequired: true,
  },
  {
    id: 'wb-guard-006',
    belt: 'white',
    category: 'guard',
    name: 'Kimura Grip and Attack',
    description: 'Figure-four grip on arm for shoulder lock submission',
    relatedTechniqueIds: ['tech-003'],
    isRequired: true,
  },
  {
    id: 'wb-guard-007',
    belt: 'white',
    category: 'guard',
    name: 'Guillotine Defense',
    description: 'Recognize and defend guillotine choke attempts',
    isRequired: true,
  },

  // Guard Passing
  {
    id: 'wb-pass-001',
    belt: 'white',
    category: 'guard-passing',
    name: 'Posture in Closed Guard',
    description: 'Maintain proper posture to prevent sweeps and submissions',
    isRequired: true,
  },
  {
    id: 'wb-pass-002',
    belt: 'white',
    category: 'guard-passing',
    name: 'Standing Guard Break',
    description: 'Stand to break closed guard safely',
    isRequired: true,
  },
  {
    id: 'wb-pass-003',
    belt: 'white',
    category: 'guard-passing',
    name: 'Knee Slice Pass Concept',
    description: 'Basic understanding of knee cut/slice passing mechanics',
    relatedTechniqueIds: ['tech-008'],
    isRequired: true,
  },
  {
    id: 'wb-pass-004',
    belt: 'white',
    category: 'guard-passing',
    name: 'Toreando Pass Concept',
    description: 'Bullfighter pass - control legs and pass around',
    relatedTechniqueIds: ['tech-007'],
    isRequired: true,
  },
  {
    id: 'wb-pass-005',
    belt: 'white',
    category: 'guard-passing',
    name: 'Stack Pass Concept',
    description: 'Stack opponent and pass over their legs',
    isRequired: true,
  },

  // Takedowns
  {
    id: 'wb-td-001',
    belt: 'white',
    category: 'takedowns',
    name: 'Wrestling Stance and Movement',
    description: 'Basic stance, level changes, and footwork',
    isRequired: true,
  },
  {
    id: 'wb-td-002',
    belt: 'white',
    category: 'takedowns',
    name: 'Double Leg Takedown',
    description: 'Penetration step, level change, drive through opponent',
    relatedTechniqueIds: ['tech-014'],
    isRequired: true,
  },
  {
    id: 'wb-td-003',
    belt: 'white',
    category: 'takedowns',
    name: 'Single Leg Takedown',
    description: 'Secure single leg, finish with trip or drive',
    relatedTechniqueIds: ['tech-015'],
    isRequired: true,
  },
  {
    id: 'wb-td-004',
    belt: 'white',
    category: 'takedowns',
    name: 'O-Soto-Gari',
    description: 'Major outer reap - judo throw',
    isRequired: true,
  },
  {
    id: 'wb-td-005',
    belt: 'white',
    category: 'takedowns',
    name: 'Basic Hip Throw (O-Goshi)',
    description: 'Fundamental judo hip throw',
    isRequired: true,
  },
  {
    id: 'wb-td-006',
    belt: 'white',
    category: 'takedowns',
    name: 'Sprawl Defense',
    description: 'Defend takedown attempts by sprawling hips back',
    isRequired: true,
  },
  {
    id: 'wb-td-007',
    belt: 'white',
    category: 'takedowns',
    name: 'Guard Pull',
    description: 'Basic closed guard pull technique',
    isRequired: true,
  },

  // Movement Skills
  {
    id: 'wb-move-001',
    belt: 'white',
    category: 'movement',
    name: 'Shrimping (Hip Escape)',
    description: 'Fundamental escape movement - hip escape motion',
    isRequired: true,
  },
  {
    id: 'wb-move-002',
    belt: 'white',
    category: 'movement',
    name: 'Bridging',
    description: 'Hip bridge movement for escapes and sweeps',
    isRequired: true,
  },
  {
    id: 'wb-move-003',
    belt: 'white',
    category: 'movement',
    name: 'Technical Stand-Up',
    description: 'Stand up safely from ground while maintaining defense',
    isRequired: true,
  },
  {
    id: 'wb-move-004',
    belt: 'white',
    category: 'movement',
    name: 'Breakfalls',
    description: 'Forward, backward, and side breakfalls',
    isRequired: true,
  },
  {
    id: 'wb-move-005',
    belt: 'white',
    category: 'movement',
    name: 'Forward and Backward Rolls',
    description: 'Safe rolling techniques for transitions and recovery',
    isRequired: true,
  },
];

// ===========================================
// BLUE BELT TECHNICAL REQUIREMENTS
// ===========================================

export const blueBeltRequirements: TechnicalRequirement[] = [
  // Submissions - Chokes
  {
    id: 'bb-sub-001',
    belt: 'blue',
    category: 'submissions',
    name: 'Rear Naked Choke',
    description: 'Mata leão - primary submission from back control',
    relatedTechniqueIds: ['tech-004'],
    isRequired: true,
  },
  {
    id: 'bb-sub-002',
    belt: 'blue',
    category: 'submissions',
    name: 'Cross-Collar Choke',
    description: 'From mount and guard positions',
    isRequired: true,
  },
  {
    id: 'bb-sub-003',
    belt: 'blue',
    category: 'submissions',
    name: 'Triangle Choke Variations',
    description: 'From guard, mount, and back positions',
    relatedTechniqueIds: ['tech-002'],
    isRequired: true,
  },
  {
    id: 'bb-sub-004',
    belt: 'blue',
    category: 'submissions',
    name: 'Guillotine Variations',
    description: 'Arm-in and standard guillotine chokes',
    isRequired: true,
  },
  {
    id: 'bb-sub-005',
    belt: 'blue',
    category: 'submissions',
    name: 'Ezekiel Choke',
    description: 'Sleeve choke from mount and other positions',
    isRequired: true,
  },
  {
    id: 'bb-sub-006',
    belt: 'blue',
    category: 'submissions',
    name: "D'arce/Brabo Choke Introduction",
    description: 'Arm triangle variation from side control',
    isRequired: true,
  },

  // Submissions - Arms
  {
    id: 'bb-sub-007',
    belt: 'blue',
    category: 'submissions',
    name: 'Armbar from Multiple Positions',
    description: 'Guard, mount, side control, and back',
    relatedTechniqueIds: ['tech-001'],
    isRequired: true,
  },
  {
    id: 'bb-sub-008',
    belt: 'blue',
    category: 'submissions',
    name: 'Kimura from Multiple Positions',
    description: 'Guard, side control, north-south',
    relatedTechniqueIds: ['tech-003'],
    isRequired: true,
  },
  {
    id: 'bb-sub-009',
    belt: 'blue',
    category: 'submissions',
    name: 'Americana',
    description: 'From mount and side control',
    isRequired: true,
  },
  {
    id: 'bb-sub-010',
    belt: 'blue',
    category: 'submissions',
    name: 'Omoplata',
    description: 'Shoulder lock using legs from guard',
    isRequired: true,
  },

  // Submissions - Legs
  {
    id: 'bb-sub-011',
    belt: 'blue',
    category: 'submissions',
    name: 'Straight Ankle Lock',
    description: 'Achilles lock - fundamental leg attack',
    relatedTechniqueIds: ['tech-012'],
    isRequired: true,
  },
  {
    id: 'bb-sub-012',
    belt: 'blue',
    category: 'submissions',
    name: 'Kneebar Introduction',
    description: 'Understanding mechanics and legality rules',
    isRequired: true,
  },

  // Guard Systems
  {
    id: 'bb-guard-001',
    belt: 'blue',
    category: 'guard',
    name: 'Closed Guard Mastery',
    description: 'Sweeps, submissions, and retention',
    isRequired: true,
  },
  {
    id: 'bb-guard-002',
    belt: 'blue',
    category: 'guard',
    name: 'Half Guard Competency',
    description: 'Underhook recovery, sweeps, leg attacks',
    relatedTechniqueIds: ['tech-022'],
    isRequired: true,
  },
  {
    id: 'bb-guard-003',
    belt: 'blue',
    category: 'guard',
    name: 'Butterfly Guard Basics',
    description: 'Hook placement, elevator sweeps',
    relatedTechniqueIds: ['tech-023'],
    isRequired: true,
  },
  {
    id: 'bb-guard-004',
    belt: 'blue',
    category: 'guard',
    name: 'Open Guard Fundamentals',
    description: 'Grips, distance management, basic De La Riva concepts',
    relatedTechniqueIds: ['tech-021'],
    isRequired: true,
  },
  {
    id: 'bb-guard-005',
    belt: 'blue',
    category: 'guard',
    name: 'Guard Retention',
    description: 'Hip movement, frames, recovering guard',
    isRequired: true,
  },

  // Passing
  {
    id: 'bb-pass-001',
    belt: 'blue',
    category: 'guard-passing',
    name: 'Pressure Passing',
    description: 'Knee slice, over-under, stack pass',
    relatedTechniqueIds: ['tech-008'],
    isRequired: true,
  },
  {
    id: 'bb-pass-002',
    belt: 'blue',
    category: 'guard-passing',
    name: 'Speed Passing',
    description: 'Toreando, leg drag techniques',
    relatedTechniqueIds: ['tech-007'],
    isRequired: true,
  },
  {
    id: 'bb-pass-003',
    belt: 'blue',
    category: 'guard-passing',
    name: 'Half Guard Passes',
    description: 'Knee cut, backstep, smash pass',
    isRequired: true,
  },
  {
    id: 'bb-pass-004',
    belt: 'blue',
    category: 'guard-passing',
    name: 'Passing Different Guards',
    description: 'Butterfly, De La Riva, spider - basic concepts',
    isRequired: true,
  },

  // Top Position
  {
    id: 'bb-top-001',
    belt: 'blue',
    category: 'positional-knowledge',
    name: 'Side Control Mastery',
    description: 'Maintenance, transitions, submissions',
    isRequired: true,
  },
  {
    id: 'bb-top-002',
    belt: 'blue',
    category: 'positional-knowledge',
    name: 'Mount Variations',
    description: 'High mount, low mount, S-mount, grapevine',
    isRequired: true,
  },
  {
    id: 'bb-top-003',
    belt: 'blue',
    category: 'positional-knowledge',
    name: 'Knee on Belly',
    description: 'Pressure, transitions, attacks',
    isRequired: true,
  },
  {
    id: 'bb-top-004',
    belt: 'blue',
    category: 'positional-knowledge',
    name: 'Back Control',
    description: 'Seatbelt grip, hook fighting, maintaining position',
    isRequired: true,
  },
  {
    id: 'bb-top-005',
    belt: 'blue',
    category: 'positional-knowledge',
    name: 'North-South Position',
    description: 'Control and attacks from north-south',
    isRequired: true,
  },

  // Escapes - Comprehensive
  {
    id: 'bb-esc-001',
    belt: 'blue',
    category: 'escapes',
    name: 'Multiple Mount Escapes',
    description: 'Elbow-knee, trap-and-roll, heel drag variations',
    relatedTechniqueIds: ['tech-009', 'tech-010'],
    isRequired: true,
  },
  {
    id: 'bb-esc-002',
    belt: 'blue',
    category: 'escapes',
    name: 'Multiple Side Control Escapes',
    description: 'Frame, hip escape, ghost escape variations',
    relatedTechniqueIds: ['tech-011'],
    isRequired: true,
  },
  {
    id: 'bb-esc-003',
    belt: 'blue',
    category: 'escapes',
    name: 'Back Escape Variations',
    description: 'Fighting hands, turning into opponent techniques',
    isRequired: true,
  },
  {
    id: 'bb-esc-004',
    belt: 'blue',
    category: 'escapes',
    name: 'Knee on Belly Escapes',
    description: 'Multiple methods to escape knee on belly',
    isRequired: true,
  },
  {
    id: 'bb-esc-005',
    belt: 'blue',
    category: 'escapes',
    name: 'North-South Escapes',
    description: 'Escape techniques from north-south position',
    isRequired: true,
  },
  {
    id: 'bb-esc-006',
    belt: 'blue',
    category: 'escapes',
    name: 'Turtle Escapes',
    description: 'Escapes, rolls, guard recovery from turtle',
    isRequired: true,
  },

  // Takedowns - Expanded
  {
    id: 'bb-td-001',
    belt: 'blue',
    category: 'takedowns',
    name: 'Single Leg Variations',
    description: 'Running the pipe, dump, cut the corner',
    relatedTechniqueIds: ['tech-015'],
    isRequired: true,
  },
  {
    id: 'bb-td-002',
    belt: 'blue',
    category: 'takedowns',
    name: 'Double Leg Variations',
    description: 'Blast double, penetration step techniques',
    relatedTechniqueIds: ['tech-014'],
    isRequired: true,
  },
  {
    id: 'bb-td-003',
    belt: 'blue',
    category: 'takedowns',
    name: 'Foot Sweeps',
    description: 'Kouchi gari, ouchi gari',
    isRequired: true,
  },
  {
    id: 'bb-td-004',
    belt: 'blue',
    category: 'takedowns',
    name: 'Arm Drags to Takedowns',
    description: 'Use arm drag to set up takedown entries',
    isRequired: true,
  },
  {
    id: 'bb-td-005',
    belt: 'blue',
    category: 'takedowns',
    name: 'Strategic Guard Pulling',
    description: 'When and how to pull guard effectively',
    isRequired: true,
  },
  {
    id: 'bb-td-006',
    belt: 'blue',
    category: 'takedowns',
    name: 'Takedown Defense',
    description: 'Sprawl, underhooks, pummeling',
    isRequired: true,
  },
];

// ===========================================
// PURPLE BELT TECHNICAL REQUIREMENTS
// ===========================================

export const purpleBeltRequirements: TechnicalRequirement[] = [
  // Combination Attacks
  {
    id: 'pb-combo-001',
    belt: 'purple',
    category: 'combinations',
    name: 'Closed Guard Combinations',
    description: '3+ combination attacks (e.g., armbar → triangle → omoplata)',
    isRequired: true,
  },
  {
    id: 'pb-combo-002',
    belt: 'purple',
    category: 'combinations',
    name: 'Mount Attack Chains',
    description: '3+ submissions from mount with transitions between them',
    isRequired: true,
  },
  {
    id: 'pb-combo-003',
    belt: 'purple',
    category: 'combinations',
    name: 'Back Attack Chains',
    description: '3+ submissions from back control with chain attacks',
    isRequired: true,
  },
  {
    id: 'pb-combo-004',
    belt: 'purple',
    category: 'combinations',
    name: 'Sweep to Submit Sequences',
    description: 'Sweep → pass → submission sequences',
    isRequired: true,
  },
  {
    id: 'pb-combo-005',
    belt: 'purple',
    category: 'combinations',
    name: 'Defensive Counters',
    description: 'Submission → sweep when opponent defends',
    isRequired: true,
  },

  // Guard Specialization
  {
    id: 'pb-guard-001',
    belt: 'purple',
    category: 'guard',
    name: 'Guard Specialization',
    description: 'At least one specialized open guard with depth',
    subItems: [
      'De La Riva: sweeps, back takes, berimbolo introduction',
      'Spider guard: sweeps, triangle setups, omoplata',
      'Lasso guard: sweeps, submissions, transitions',
      'X-guard: sweeps, leg attacks, transitions',
      'Single leg X / Ashi garami: positional control, leg entries',
      'Reverse De La Riva: back takes, sweeps',
    ],
    relatedTechniqueIds: ['tech-020', 'tech-021', 'tech-024', 'tech-034'],
    isRequired: true,
  },

  // Advanced Submissions
  {
    id: 'pb-sub-001',
    belt: 'purple',
    category: 'submissions',
    name: 'Leg Lock Progression',
    description: 'Ankle lock → knee bar → toe hold (intro to heel hooks for no-gi)',
    relatedTechniqueIds: ['tech-012', 'tech-013'],
    isRequired: true,
  },
  {
    id: 'pb-sub-002',
    belt: 'purple',
    category: 'submissions',
    name: 'Advanced Choke Variations',
    description: 'Loop choke, baseball bat choke, bow and arrow',
    isRequired: true,
  },
  {
    id: 'pb-sub-003',
    belt: 'purple',
    category: 'submissions',
    name: 'North-South Choke',
    description: 'Choke from north-south position',
    isRequired: true,
  },
  {
    id: 'pb-sub-004',
    belt: 'purple',
    category: 'submissions',
    name: 'Arm-In Guillotine Variations',
    description: 'Arm-in guillotine and related techniques',
    isRequired: true,
  },
  {
    id: 'pb-sub-005',
    belt: 'purple',
    category: 'submissions',
    name: 'Wrist Locks Introduction',
    description: 'Basic wrist lock techniques',
    isRequired: true,
  },
  {
    id: 'pb-sub-006',
    belt: 'purple',
    category: 'submissions',
    name: 'Clock Choke and Crucifix',
    description: 'Attacks from turtle control',
    isRequired: true,
  },

  // Passing Systems
  {
    id: 'pb-pass-001',
    belt: 'purple',
    category: 'guard-passing',
    name: 'Systematic Passing',
    description: 'Systematic approach to passing different guards',
    isRequired: true,
  },
  {
    id: 'pb-pass-002',
    belt: 'purple',
    category: 'guard-passing',
    name: 'Headquarters Position',
    description: 'Headquarters position and transitions',
    isRequired: true,
  },
  {
    id: 'pb-pass-003',
    belt: 'purple',
    category: 'guard-passing',
    name: 'Leg Weave and Body Lock',
    description: 'Leg weave and body lock passing techniques',
    isRequired: true,
  },
  {
    id: 'pb-pass-004',
    belt: 'purple',
    category: 'guard-passing',
    name: 'Float Passing',
    description: 'Float passing concepts and execution',
    isRequired: true,
  },
  {
    id: 'pb-pass-005',
    belt: 'purple',
    category: 'guard-passing',
    name: 'Pass to Submission Chains',
    description: 'Pass → immediate submission connections',
    isRequired: true,
  },

  // Takedowns
  {
    id: 'pb-td-001',
    belt: 'purple',
    category: 'takedowns',
    name: 'Reliable Takedown Game',
    description: '3+ reliable takedown techniques',
    isRequired: true,
  },
  {
    id: 'pb-td-002',
    belt: 'purple',
    category: 'takedowns',
    name: 'Strategic Guard Pull',
    description: 'Guard pull with immediate attack follow-up',
    isRequired: true,
  },
  {
    id: 'pb-td-003',
    belt: 'purple',
    category: 'takedowns',
    name: 'Snap Downs and Front Headlock',
    description: 'Snap down attacks and front headlock series',
    isRequired: true,
  },
  {
    id: 'pb-td-004',
    belt: 'purple',
    category: 'takedowns',
    name: 'Counter Wrestling',
    description: 'Counter wrestling techniques and strategies',
    isRequired: true,
  },

  // Conceptual Requirements
  {
    id: 'pb-concept-001',
    belt: 'purple',
    category: 'conceptual',
    name: 'Weight Distribution Principles',
    description: 'Understands weight distribution and pressure principles',
    isRequired: true,
  },
  {
    id: 'pb-concept-002',
    belt: 'purple',
    category: 'conceptual',
    name: 'Technical Articulation',
    description: 'Can articulate why techniques work (not just how)',
    isRequired: true,
  },
  {
    id: 'pb-concept-003',
    belt: 'purple',
    category: 'conceptual',
    name: 'Mistake Recognition',
    description: 'Recognizes and can exploit common mistakes',
    isRequired: true,
  },
  {
    id: 'pb-concept-004',
    belt: 'purple',
    category: 'conceptual',
    name: 'Game Planning',
    description: 'Develops game plans based on opponent type',
    isRequired: true,
  },
  {
    id: 'pb-concept-005',
    belt: 'purple',
    category: 'conceptual',
    name: 'Timing and Momentum',
    description: 'Understands timing and momentum in grappling',
    isRequired: true,
  },
];

// ===========================================
// BROWN BELT TECHNICAL REQUIREMENTS
// ===========================================

export const brownBeltRequirements: TechnicalRequirement[] = [
  // Complete Positional Competency
  {
    id: 'brb-pos-001',
    belt: 'brown',
    category: 'positional-knowledge',
    name: 'Complete Positional Competency',
    description: 'From EVERY major position, must demonstrate: multiple attack options, multiple escape options, transition options, counter-attack options',
    isRequired: true,
  },

  // Balanced Game
  {
    id: 'brb-game-001',
    belt: 'brown',
    category: 'conceptual',
    name: 'Balanced Top and Bottom Game',
    description: 'Equally competent passing and playing guard',
    isRequired: true,
  },
  {
    id: 'brb-game-002',
    belt: 'brown',
    category: 'guard-passing',
    name: 'Multiple Passing Styles',
    description: 'Pressure, float, and leg-based passing systems',
    isRequired: true,
  },
  {
    id: 'brb-game-003',
    belt: 'brown',
    category: 'guard',
    name: 'Multiple Guard Systems',
    description: 'Multiple guard systems with deep knowledge',
    isRequired: true,
  },
  {
    id: 'brb-game-004',
    belt: 'brown',
    category: 'conceptual',
    name: 'Seamless Transitions',
    description: 'Seamless transitions between top and bottom',
    isRequired: true,
  },

  // Advanced Submission Game
  {
    id: 'brb-sub-001',
    belt: 'brown',
    category: 'submissions',
    name: 'Complete Leg Lock Game',
    description: 'Complete leg lock game (gi-legal and no-gi legal techniques)',
    relatedTechniqueIds: ['tech-012', 'tech-013'],
    isRequired: true,
  },
  {
    id: 'brb-sub-002',
    belt: 'brown',
    category: 'escapes',
    name: 'Submission Defense Mastery',
    description: 'Defense at level where finishing is extremely difficult',
    isRequired: true,
  },
  {
    id: 'brb-sub-003',
    belt: 'brown',
    category: 'escapes',
    name: 'Late-Stage Escapes',
    description: 'Ability to escape submissions at late stages',
    isRequired: true,
  },
  {
    id: 'brb-sub-004',
    belt: 'brown',
    category: 'submissions',
    name: 'Signature Techniques',
    description: 'Signature techniques that can catch black belts',
    isRequired: true,
  },

  // Counter-Attacking
  {
    id: 'brb-counter-001',
    belt: 'brown',
    category: 'conceptual',
    name: 'Counter Sweeps with Passes',
    description: 'Can counter common sweeps with passes',
    isRequired: true,
  },
  {
    id: 'brb-counter-002',
    belt: 'brown',
    category: 'conceptual',
    name: 'Counter Passes with Attacks',
    description: 'Can counter common passes with sweeps or submissions',
    isRequired: true,
  },
  {
    id: 'brb-counter-003',
    belt: 'brown',
    category: 'conceptual',
    name: 'Anticipation',
    description: 'Anticipates opponent techniques and has ready responses',
    isRequired: true,
  },
  {
    id: 'brb-counter-004',
    belt: 'brown',
    category: 'conceptual',
    name: 'Momentum Usage',
    description: 'Uses opponent momentum and reactions strategically',
    isRequired: true,
  },

  // Conceptual Mastery
  {
    id: 'brb-concept-001',
    belt: 'brown',
    category: 'conceptual',
    name: 'Biomechanics Understanding',
    description: 'Understands biomechanics underlying all techniques',
    isRequired: true,
  },
  {
    id: 'brb-concept-002',
    belt: 'brown',
    category: 'conceptual',
    name: 'Technique Creation',
    description: 'Can create new techniques or variations based on principles',
    isRequired: true,
  },
  {
    id: 'brb-concept-003',
    belt: 'brown',
    category: 'conceptual',
    name: 'Pattern Recognition',
    description: 'Recognizes universal patterns across different positions',
    isRequired: true,
  },
  {
    id: 'brb-concept-004',
    belt: 'brown',
    category: 'conceptual',
    name: 'Game Adaptation',
    description: 'Can adapt game on the fly based on opponent',
    isRequired: true,
  },
  {
    id: 'brb-concept-005',
    belt: 'brown',
    category: 'conceptual',
    name: 'Energy Management',
    description: 'Understands energy management and pacing',
    isRequired: true,
  },
];

// ===========================================
// BLACK BELT CHARACTERISTICS
// ===========================================

export const blackBeltCharacteristics: TechnicalRequirement[] = [
  {
    id: 'blk-char-001',
    belt: 'black',
    category: 'conceptual',
    name: 'Complete Technical Knowledge',
    description: 'Complete technical knowledge across all positions',
    isRequired: true,
  },
  {
    id: 'blk-char-002',
    belt: 'black',
    category: 'conceptual',
    name: 'Deep Understanding',
    description: 'Understands the "why" behind every technique',
    isRequired: true,
  },
  {
    id: 'blk-char-003',
    belt: 'black',
    category: 'conceptual',
    name: 'Effortless Timing',
    description: 'Timing and anticipation appear effortless',
    isRequired: true,
  },
  {
    id: 'blk-char-004',
    belt: 'black',
    category: 'conceptual',
    name: 'Maximum Efficiency',
    description: 'Maximum efficiency with minimum effort',
    isRequired: true,
  },
  {
    id: 'blk-char-005',
    belt: 'black',
    category: 'conceptual',
    name: 'Adaptability',
    description: 'Can adapt to any opponent or situation',
    isRequired: true,
  },
  {
    id: 'blk-char-006',
    belt: 'black',
    category: 'conceptual',
    name: 'Innovation',
    description: 'Creates and innovates within the art',
    isRequired: true,
  },
  {
    id: 'blk-char-007',
    belt: 'black',
    category: 'conceptual',
    name: 'Teaching Excellence',
    description: 'Excellent teacher and communicator',
    isRequired: true,
  },
  {
    id: 'blk-char-008',
    belt: 'black',
    category: 'conceptual',
    name: 'Integrity',
    description: 'Represents the art with integrity and humility',
    isRequired: true,
  },
  {
    id: 'blk-char-009',
    belt: 'black',
    category: 'conceptual',
    name: 'Community Contribution',
    description: 'Contributes to the growth of BJJ community',
    isRequired: true,
  },
];

// ===========================================
// SUBJECTIVE CRITERIA BY BELT
// ===========================================

export const whiteBeltSubjectiveCriteria: SubjectiveCriterion[] = [
  { id: 'wb-subj-001', belt: 'white', category: 'character', description: 'Demonstrates ability to remain calm when in bad positions' },
  { id: 'wb-subj-002', belt: 'white', category: 'character', description: 'Shows understanding of positional hierarchy' },
  { id: 'wb-subj-003', belt: 'white', category: 'character', description: 'Respects training partners and taps appropriately' },
  { id: 'wb-subj-004', belt: 'white', category: 'character', description: 'Maintains proper hygiene and mat etiquette' },
  { id: 'wb-subj-005', belt: 'white', category: 'training-attitude', description: 'Attends class consistently' },
  { id: 'wb-subj-006', belt: 'white', category: 'training-attitude', description: 'Learns to control ego and accept learning process' },
];

export const blueBeltSubjectiveCriteria: SubjectiveCriterion[] = [
  { id: 'bb-subj-001', belt: 'blue', category: 'character', description: 'Can defend against common submissions from training partners' },
  { id: 'bb-subj-002', belt: 'blue', category: 'character', description: 'Has at least one viable attack from every major position' },
  { id: 'bb-subj-003', belt: 'blue', category: 'character', description: 'Demonstrates good movement and transitions between positions' },
  { id: 'bb-subj-004', belt: 'blue', category: 'training-attitude', description: 'Understands competition scoring and positional hierarchy' },
  { id: 'bb-subj-005', belt: 'blue', category: 'training-attitude', description: 'Can submit newer white belts consistently' },
  { id: 'bb-subj-006', belt: 'blue', category: 'community', description: 'Shows leadership qualities and helps newer students' },
  { id: 'bb-subj-007', belt: 'blue', category: 'character', description: 'Maintains composure in chaotic scrambles' },
  { id: 'bb-subj-008', belt: 'blue', category: 'training-attitude', description: 'Beginning to develop personal preferences and game direction' },
];

export const purpleBeltSubjectiveCriteria: SubjectiveCriterion[] = [
  { id: 'pb-subj-001', belt: 'purple', category: 'character', description: 'Has developed identifiable "A-game" techniques' },
  { id: 'pb-subj-002', belt: 'purple', category: 'training-attitude', description: 'Can give effective rolls to brown and black belts' },
  { id: 'pb-subj-003', belt: 'purple', category: 'community', description: 'Capable of teaching fundamentals to lower belts' },
  { id: 'pb-subj-004', belt: 'purple', category: 'community', description: 'Shows maturity and leadership on the mat' },
  { id: 'pb-subj-005', belt: 'purple', category: 'character', description: 'Has no major holes that athletic white belts can exploit' },
  { id: 'pb-subj-006', belt: 'purple', category: 'character', description: 'Demonstrates composure in scrambles and adverse positions' },
  { id: 'pb-subj-007', belt: 'purple', category: 'community', description: 'Contributes to gym culture and community' },
];

export const brownBeltSubjectiveCriteria: SubjectiveCriterion[] = [
  { id: 'brb-subj-001', belt: 'brown', category: 'character', description: 'Extremely difficult to submit, even for black belts' },
  { id: 'brb-subj-002', belt: 'brown', category: 'training-attitude', description: 'Gives tough rolls to black belts consistently' },
  { id: 'brb-subj-003', belt: 'brown', category: 'community', description: 'Can teach all belt levels effectively' },
  { id: 'brb-subj-004', belt: 'brown', category: 'character', description: 'Has identifiable personal style' },
  { id: 'brb-subj-005', belt: 'brown', category: 'character', description: 'Demonstrates maturity and even temperament' },
  { id: 'brb-subj-006', belt: 'brown', category: 'community', description: 'Contributes to development of other students' },
  { id: 'brb-subj-007', belt: 'brown', category: 'character', description: 'Represents the art with integrity' },
];

export const allBeltSubjectiveCriteria: SubjectiveCriterion[] = [
  // Character & Conduct (applies to all belts)
  { id: 'all-subj-001', belt: 'white', category: 'character', description: 'Respects training partners regardless of rank or size' },
  { id: 'all-subj-002', belt: 'white', category: 'character', description: 'Taps early and doesn\'t endanger partners' },
  { id: 'all-subj-003', belt: 'white', category: 'character', description: 'Maintains hygiene: clean gi, trimmed nails, no skin infections' },
  { id: 'all-subj-004', belt: 'white', category: 'character', description: 'Controls ego—can learn from anyone' },
  { id: 'all-subj-005', belt: 'white', category: 'character', description: 'Demonstrates integrity on and off the mat' },
  { id: 'all-subj-006', belt: 'white', category: 'community', description: 'Represents the academy positively' },

  // Training Attitude (applies to all belts)
  { id: 'all-subj-007', belt: 'white', category: 'training-attitude', description: 'Consistent attendance' },
  { id: 'all-subj-008', belt: 'white', category: 'training-attitude', description: 'Perseverance through plateaus and setbacks' },
  { id: 'all-subj-009', belt: 'white', category: 'training-attitude', description: 'Openness to feedback and correction' },
  { id: 'all-subj-010', belt: 'white', category: 'training-attitude', description: 'Active learning—asks questions, takes notes' },
  { id: 'all-subj-011', belt: 'white', category: 'training-attitude', description: 'Willing to drill, not just spar' },
  { id: 'all-subj-012', belt: 'white', category: 'training-attitude', description: 'Studies the art outside of class' },

  // Community Contribution (applies to all belts)
  { id: 'all-subj-013', belt: 'white', category: 'community', description: 'Helps newer students when appropriate' },
  { id: 'all-subj-014', belt: 'white', category: 'community', description: 'Supports teammates in competition' },
  { id: 'all-subj-015', belt: 'white', category: 'community', description: 'Contributes to positive gym culture' },
  { id: 'all-subj-016', belt: 'blue', category: 'community', description: 'Takes on responsibilities as rank increases' },
  { id: 'all-subj-017', belt: 'purple', category: 'community', description: 'Willing to teach when called upon' },

  // Competition (optional but valued)
  { id: 'all-subj-018', belt: 'white', category: 'competition', description: 'Demonstrates ability to perform under pressure' },
  { id: 'all-subj-019', belt: 'white', category: 'competition', description: 'Shows true understanding of technique against resistance' },
  { id: 'all-subj-020', belt: 'white', category: 'competition', description: 'Displays mental toughness and composure' },
];

// ===========================================
// YOUTH BELT SYSTEM
// ===========================================

export const youthBeltDefinitions: YouthBeltDefinition[] = [
  {
    belt: 'grey',
    displayName: 'Grey Belt',
    minAge: 4,
    maxAge: 15,
    tiers: ['white-stripe', 'solid', 'black-stripe'],
    transitionToAdult: {
      possibleBelts: ['white', 'blue'],
      notes: 'At age 16, may receive White Belt or Blue Belt at professor\'s discretion',
    },
  },
  {
    belt: 'yellow',
    displayName: 'Yellow Belt',
    minAge: 7,
    maxAge: 15,
    tiers: ['white-stripe', 'solid', 'black-stripe'],
    transitionToAdult: {
      possibleBelts: ['white', 'blue'],
      notes: 'At age 16, may receive White Belt or Blue Belt at professor\'s discretion',
    },
  },
  {
    belt: 'orange',
    displayName: 'Orange Belt',
    minAge: 10,
    maxAge: 15,
    tiers: ['white-stripe', 'solid', 'black-stripe'],
    transitionToAdult: {
      possibleBelts: ['white', 'blue'],
      notes: 'At age 16, may receive White Belt or Blue Belt at professor\'s discretion',
    },
  },
  {
    belt: 'green',
    displayName: 'Green Belt',
    minAge: 13,
    maxAge: 15,
    tiers: ['white-stripe', 'solid', 'black-stripe'],
    transitionToAdult: {
      possibleBelts: ['blue', 'purple'],
      notes: 'At age 16, may receive Blue Belt or Purple Belt. Purple requires 2+ years at Green.',
    },
  },
];

export const youthBeltCurriculumFocus: Record<YouthBelt, string[]> = {
  grey: [
    'Basic movement: shrimping, bridging, rolling',
    'Position recognition: guard, mount, side control, back',
    'Basic guard retention',
    'Simple sweeps: hip bump, scissor',
    'Basic submissions: armbar from guard, RNC concept',
    'Mat etiquette, hygiene, respect',
  ],
  yellow: [
    'Expanded guard work: half guard introduction',
    'Multiple sweeps from closed guard',
    'Triangle choke fundamentals',
    'Basic escapes from mount and side control',
    'Introduction to takedowns',
    'Beginning competition awareness',
  ],
  orange: [
    'Open guard development',
    'Guard passing fundamentals',
    'Submissions from multiple positions',
    'Combination attacks',
    'Takedown proficiency',
    'Strategy development',
  ],
  green: [
    'Advanced guard systems',
    'Complete passing game',
    'Leg lock awareness (defensive)',
    'Leadership and helping younger students',
    'Competition experience expected',
    'Preparing for adult belt system transition',
  ],
};

// ===========================================
// AGGREGATED EXPORTS
// ===========================================

export const allTechnicalRequirements: TechnicalRequirement[] = [
  ...whiteBeltRequirements,
  ...blueBeltRequirements,
  ...purpleBeltRequirements,
  ...brownBeltRequirements,
  ...blackBeltCharacteristics,
];

export const allSubjectiveCriteria: SubjectiveCriterion[] = [
  ...whiteBeltSubjectiveCriteria,
  ...blueBeltSubjectiveCriteria,
  ...purpleBeltSubjectiveCriteria,
  ...brownBeltSubjectiveCriteria,
  ...allBeltSubjectiveCriteria,
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export const getBeltDefinition = (belt: BeltColor): BeltDefinition | undefined => {
  return adultBeltDefinitions.find(b => b.belt === belt);
};

export const getRequirementsForBelt = (belt: BeltColor): TechnicalRequirement[] => {
  return allTechnicalRequirements.filter(req => req.belt === belt);
};

export const getRequirementsByCategory = (
  belt: BeltColor,
  category: RequirementCategory
): TechnicalRequirement[] => {
  return allTechnicalRequirements.filter(
    req => req.belt === belt && req.category === category
  );
};

export const getSubjectiveCriteriaForBelt = (belt: BeltColor): SubjectiveCriterion[] => {
  return allSubjectiveCriteria.filter(
    criterion => criterion.belt === belt || criterion.belt === 'white'
  );
};

export const getNextBelt = (currentBelt: BeltColor): BeltColor | null => {
  const order: BeltColor[] = ['white', 'blue', 'purple', 'brown', 'black'];
  const currentIndex = order.indexOf(currentBelt);
  if (currentIndex === -1 || currentIndex === order.length - 1) return null;
  return order[currentIndex + 1];
};

export const calculateTimeAtBelt = (promotionDate: string): number => {
  const promotion = new Date(promotionDate);
  const now = new Date();
  const months = (now.getFullYear() - promotion.getFullYear()) * 12 +
    (now.getMonth() - promotion.getMonth());
  return months;
};

export const meetsTimeRequirement = (
  currentBelt: BeltColor,
  promotionDate: string
): boolean => {
  const nextBelt = getNextBelt(currentBelt);
  if (!nextBelt) return false;

  const nextBeltDef = getBeltDefinition(nextBelt);
  if (!nextBeltDef || !nextBeltDef.minTimeAtBeltMonths) return true;

  const monthsAtBelt = calculateTimeAtBelt(promotionDate);
  return monthsAtBelt >= nextBeltDef.minTimeAtBeltMonths;
};

export const meetsAgeRequirement = (
  targetBelt: BeltColor,
  birthDate: string
): boolean => {
  const beltDef = getBeltDefinition(targetBelt);
  if (!beltDef || !beltDef.minAge) return true;

  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  return age >= beltDef.minAge;
};

// ===========================================
// MOCK USER PROGRESS DATA
// ===========================================

export const mockTonyChenProgress: UserBeltProgress = {
odId: 'user-001',
  belt: 'blue',
  completedRequirements: [
    // Blue belt submissions he's completed
    'bb-sub-001', // RNC
    'bb-sub-002', // Cross collar
    'bb-sub-003', // Triangle variations
    'bb-sub-007', // Armbar multiple positions
    'bb-sub-008', // Kimura multiple positions
    'bb-sub-011', // Straight ankle lock
    // Guard systems
    'bb-guard-001', // Closed guard mastery
    'bb-guard-002', // Half guard competency
    'bb-guard-005', // Guard retention
    // Passing
    'bb-pass-001', // Pressure passing
    'bb-pass-002', // Speed passing
    // Escapes
    'bb-esc-001', // Multiple mount escapes
    'bb-esc-002', // Multiple side control escapes
    // Takedowns
    'bb-td-001', // Single leg variations
    'bb-td-002', // Double leg variations
    'bb-td-006', // Takedown defense
  ],
  partialRequirements: [
    { id: 'bb-guard-003', notes: 'Working on butterfly guard hooks' },
    { id: 'bb-guard-004', notes: 'DLR concepts need more drilling' },
    { id: 'bb-sub-004', notes: 'Guillotine finish rate needs improvement' },
    { id: 'bb-pass-003', notes: 'Half guard passing is inconsistent' },
  ],
  subjectiveCriteriaMet: [
    'bb-subj-001', // Can defend against common submissions
    'bb-subj-002', // Has viable attack from major positions
    'bb-subj-003', // Good movement and transitions
    'bb-subj-005', // Can submit white belts consistently
    'bb-subj-006', // Helps newer students
  ],
  coachNotes: 'Tony has solid fundamentals and is developing a good guard game. Needs to work on open guard systems and leg lock defense before purple belt consideration.',
  lastReviewDate: '2024-11-15',
};

// Requirements for Tony's next belt (Purple)
export const mockTonyChenPurpleRequirements = {
  timeRequirementMet: false, // Needs 18 months at blue, currently has ~15
  ageRequirementMet: true, // Over 16
  technicalProgress: {
    total: purpleBeltRequirements.length,
    completed: 3,
    inProgress: 5,
    notStarted: purpleBeltRequirements.length - 8,
  },
  subjectiveProgress: {
    total: purpleBeltSubjectiveCriteria.length,
    met: 2,
    notMet: purpleBeltSubjectiveCriteria.length - 2,
  },
  coachRecommendation: 'Not ready - needs more time and development in combination attacks and guard specialization',
};

/**
 * Stats Module Mock Data
 *
 * Mock data and configurations for belt-adaptive stats modules.
 * See: /internal-docs/research/STATS_MODULE_IMPLEMENTATION.md
 *
 * Modules Covered:
 * - White Belt: Journey Timeline, Consistency Score, Foundations Progress
 * - Blue Belt: Your Style, Vulnerability Map, Technique Pairings, Blues Detector
 * - Purple Belt: Long Game, Submission Trends, Technique Mastery
 */

import type { BeltLevel } from '../types/database';

// ===========================================
// WHITE BELT: FOUNDATIONS CHECKLIST
// ===========================================

export interface FoundationCategory {
  id: string;
  name: string;
  techniques: string[];
}

export const WHITE_BELT_FOUNDATIONS: FoundationCategory[] = [
  {
    id: 'escapes',
    name: 'Escapes',
    techniques: [
      'Hip Escape',
      'Shrimp',
      'Bridge',
      'Technical Stand-up',
    ],
  },
  {
    id: 'guards',
    name: 'Guards',
    techniques: [
      'Closed Guard',
      'Half Guard',
      'Butterfly Guard',
      'Open Guard',
    ],
  },
  {
    id: 'submissions',
    name: 'Submissions',
    techniques: [
      'Armbar',
      'Triangle',
      'Rear Naked Choke',
      'Kimura',
      'Americana',
      'Guillotine',
    ],
  },
  {
    id: 'positions',
    name: 'Positions',
    techniques: [
      'Mount',
      'Side Control',
      'Back Control',
      'Knee on Belly',
    ],
  },
  {
    id: 'defense',
    name: 'Defense',
    techniques: [
      'Mount Escape',
      'Side Control Escape',
      'Back Escape',
      'Guard Retention',
    ],
  },
];

// Flatten for easy lookup
export const ALL_FOUNDATION_TECHNIQUES = WHITE_BELT_FOUNDATIONS.flatMap(
  (cat) => cat.techniques
);

// ===========================================
// WHITE BELT: JOURNEY MILESTONES
// ===========================================

export interface JourneyMilestone {
  id: string;
  type: 'sessions' | 'days' | 'streak';
  threshold: number;
  title: string;
  message: string;
  celebrationEmoji?: string; // Only used internally, not displayed
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'first-session',
    type: 'sessions',
    threshold: 1,
    title: 'First Class',
    message: "You started. That's step one.",
  },
  {
    id: 'came-back',
    type: 'sessions',
    threshold: 2,
    title: 'Came Back',
    message: "You came back. That's rare.",
  },
  {
    id: 'first-week',
    type: 'sessions',
    threshold: 5,
    title: 'First Week',
    message: 'A full week of training. The routine is starting.',
  },
  {
    id: 'double-digits',
    type: 'sessions',
    threshold: 10,
    title: 'Double Digits',
    message: '10 sessions. The habit is forming.',
  },
  {
    id: 'quarter-hundred',
    type: 'sessions',
    threshold: 25,
    title: 'Quarter Hundred',
    message: "25 sessions. You're committed.",
  },
  {
    id: 'fifty-sessions',
    type: 'sessions',
    threshold: 50,
    title: 'The 50 Club',
    message: '50 sessions. Most white belts never see this.',
  },
  {
    id: 'triple-digits',
    type: 'sessions',
    threshold: 100,
    title: 'Triple Digits',
    message: '100 sessions. This is who you are now.',
  },
  {
    id: 'two-hundred',
    type: 'sessions',
    threshold: 200,
    title: '200 Sessions',
    message: 'Two hundred sessions. A true practitioner.',
  },
  {
    id: 'three-months',
    type: 'days',
    threshold: 90,
    title: '3 Months In',
    message: "You've survived the first cliff.",
  },
  {
    id: 'six-months',
    type: 'days',
    threshold: 180,
    title: '6 Months In',
    message: "Half a year. You're past the dropout danger zone.",
  },
  {
    id: 'one-year',
    type: 'days',
    threshold: 365,
    title: 'One Year',
    message: "One year. You're not a tourist anymore.",
  },
  {
    id: 'two-years',
    type: 'days',
    threshold: 730,
    title: 'Two Years',
    message: 'Two years. The long game is paying off.',
  },
];

// ===========================================
// WHITE BELT: DROPOUT CLIFF MESSAGING
// ===========================================

export interface DropoutCliffMessage {
  minDays: number;
  maxDays: number;
  message: string;
  severity: 'danger' | 'warning' | 'safe';
}

export const DROPOUT_CLIFF_MESSAGES: DropoutCliffMessage[] = [
  {
    minDays: 0,
    maxDays: 90,
    message: "You're in the danger zone. 70% quit in the first 3 months. Every session counts.",
    severity: 'danger',
  },
  {
    minDays: 91,
    maxDays: 180,
    message: "The hardest part. You're past the initial cliff but the novelty is fading. Stay consistent.",
    severity: 'warning',
  },
  {
    minDays: 181,
    maxDays: 365,
    message: "You're past the cliff. Most white belts don't make it this far. You're in the 30%.",
    severity: 'safe',
  },
  {
    minDays: 366,
    maxDays: Infinity,
    message: 'A full year in. This is a lifestyle now, not just a hobby.',
    severity: 'safe',
  },
];

// ===========================================
// BLUE BELT: BLUES DETECTOR
// ===========================================

export const NEGATIVE_SENTIMENT_KEYWORDS = [
  'frustrated',
  'frustrating',
  'suck',
  'sucked',
  'terrible',
  'awful',
  'quit',
  'quitting',
  'giving up',
  'give up',
  'impostor',
  'imposter',
  'fake',
  "don't belong",
  'dont belong',
  'waste of time',
  'not improving',
  'no progress',
  'stuck',
  'plateau',
  'plateaued',
  'pointless',
  'discouraged',
  'demoralized',
  'embarrassed',
  'humiliated',
  'destroyed',
  'crushed',
  'demolished',
];

export const POSITIVE_SENTIMENT_KEYWORDS = [
  'breakthrough',
  'clicked',
  'finally',
  'got it',
  'nailed it',
  'improving',
  'progress',
  'proud',
  'excited',
  'love',
  'amazing',
  'great',
  'awesome',
  'best',
  'confident',
  'leveling up',
  'flow state',
  'in the zone',
];

export interface BluesInterventionTemplate {
  id: string;
  trigger: 'attendance_drop' | 'extended_gap' | 'negative_sentiment' | 'imposter_syndrome' | 'post_promotion';
  title: string;
  message: string;
  primaryAction: string;
  secondaryAction?: string;
}

export const BLUES_INTERVENTIONS: BluesInterventionTemplate[] = [
  {
    id: 'attendance-drop',
    trigger: 'attendance_drop',
    title: "Your training has slowed this month.",
    message: "That's normal at blue belt. The motivation dip is real. The plateau passes. Most blue belts experience this.",
    primaryAction: "I'm fine, hide this",
    secondaryAction: 'Tell me more about plateaus',
  },
  {
    id: 'extended-gap',
    trigger: 'extended_gap',
    title: "It's been a while since your last session.",
    message: "Life happens. One session can restart the momentum. The mat will be there when you're ready.",
    primaryAction: "I'm planning to go back",
    secondaryAction: "I'm struggling",
  },
  {
    id: 'imposter-syndrome',
    trigger: 'imposter_syndrome',
    title: "Feeling like you don't deserve your blue belt?",
    message: "That's imposter syndrome, and it affects almost every blue belt. Your coach promoted you for a reason. The feeling passes.",
    primaryAction: 'Thanks, I needed that',
    secondaryAction: 'Tell me more',
  },
  {
    id: 'negative-sentiment',
    trigger: 'negative_sentiment',
    title: "Sounds like training has been tough lately.",
    message: "The struggle is part of the journey. Blue belt is when the learning curve flattens and it can feel like you're not improving. You are. It's just harder to see.",
    primaryAction: "I'm okay",
    secondaryAction: 'This is really hard',
  },
  {
    id: 'post-promotion',
    trigger: 'post_promotion',
    title: "First year at blue belt is the hardest.",
    message: "50% of blue belts quit in their first year. The target you worked toward (blue belt) is achieved, and now the path is less clear. That's normal. Find a new focus.",
    primaryAction: 'Got it',
    secondaryAction: 'Help me find focus',
  },
];

// ===========================================
// BLUE BELT: STYLE LABELS
// ===========================================

export interface StyleDefinition {
  id: string;
  label: string;
  description: string;
  ratioMin: number; // given:received ratio minimum
  ratioMax: number; // given:received ratio maximum
}

export const STYLE_DEFINITIONS: StyleDefinition[] = [
  {
    id: 'developing',
    label: 'Developing',
    description: "You're still building your game. Keep drilling and sparring.",
    ratioMin: -Infinity,
    ratioMax: Infinity, // Special case: < 10 total subs
  },
  {
    id: 'defensive',
    label: 'Defensive',
    description: "You're hard to finish. Focus on building offensive threats.",
    ratioMin: 0,
    ratioMax: 0.5,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'A well-rounded game. Attack and defense in harmony.',
    ratioMin: 0.5,
    ratioMax: 2.0,
  },
  {
    id: 'offensive',
    label: 'Offensive',
    description: "You're a finisher. Your attacks are working.",
    ratioMin: 2.0,
    ratioMax: Infinity,
  },
];

// ===========================================
// BODY REGION DEFENSE SUGGESTIONS
// ===========================================

export interface DefenseSuggestion {
  region: 'neck' | 'arms' | 'legs';
  title: string;
  suggestions: string[];
}

export const DEFENSE_SUGGESTIONS: DefenseSuggestion[] = [
  {
    region: 'neck',
    title: "You're getting caught with chokes.",
    suggestions: [
      'Hand fighting before grips lock',
      'Chin tuck and shoulder pressure',
      'Early escape before position consolidates',
      'Posture in closed guard',
    ],
  },
  {
    region: 'arms',
    title: "You're getting caught with armlocks.",
    suggestions: [
      'Keep elbows tight to body',
      'Grip your own lapel or hands together',
      'Posture up immediately when arm is isolated',
      'Turn into the attack, not away',
    ],
  },
  {
    region: 'legs',
    title: "You're getting caught with leg attacks.",
    suggestions: [
      'Keep your knee line defended',
      'Disengage early when legs are entangled',
      'Stay aware of your heel exposure',
      'Use boot and knee shield positioning',
    ],
  },
];

// ===========================================
// MOCK DATA: PERSONA-BASED STATS
// ===========================================

/**
 * Mock stats for different user personas at different belt levels.
 * These power the demo mode and testing.
 */

export interface MockUserStats {
  personaId: string;
  belt: BeltLevel;
  sessionCount: number;
  trainingStartDate: string;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  totalMinutes: number;
  sparringRounds: number;
  submissionsGiven: SubmissionRecord[];
  submissionsReceived: SubmissionRecord[];
  techniquesDrilledHistory: TechniqueSession[];
  yearlySessionCounts: YearlyCount[];
}

export interface SubmissionRecord {
  technique: string;
  date: string;
  bodyRegion: 'neck' | 'arms' | 'legs';
}

export interface TechniqueSession {
  date: string;
  techniques: string[];
}

export interface YearlyCount {
  year: number;
  sessions: number;
  submissionsGiven: number;
  submissionsReceived: number;
}

// -----------------------------------------
// WHITE BELT: David (The Late Starter)
// -----------------------------------------

export const MOCK_WHITE_BELT_STATS: MockUserStats = {
  personaId: 'david-late-starter',
  belt: 'white',
  sessionCount: 47,
  trainingStartDate: '2024-07-15',
  currentStreak: 4,
  longestStreak: 12,
  sessionsThisWeek: 2,
  sessionsThisMonth: 8,
  totalMinutes: 4230,
  sparringRounds: 89,
  submissionsGiven: [
    { technique: 'Americana', date: '2024-12-18', bodyRegion: 'arms' },
    { technique: 'Kimura', date: '2024-12-10', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-11-28', bodyRegion: 'neck' },
  ],
  submissionsReceived: [
    { technique: 'Triangle', date: '2024-12-20', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-20', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-12-18', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-15', bodyRegion: 'neck' },
    { technique: 'Guillotine', date: '2024-12-12', bodyRegion: 'neck' },
    { technique: 'RNC', date: '2024-12-10', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-08', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-12-05', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-12-01', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-11-28', bodyRegion: 'neck' },
    { technique: 'Guillotine', date: '2024-11-25', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-11-20', bodyRegion: 'neck' },
  ],
  techniquesDrilledHistory: [
    { date: '2024-12-20', techniques: ['Armbar', 'Triangle', 'Hip Escape'] },
    { date: '2024-12-18', techniques: ['Mount', 'Americana', 'Bridge'] },
    { date: '2024-12-15', techniques: ['Closed Guard', 'Kimura', 'Shrimp'] },
    { date: '2024-12-12', techniques: ['Side Control Escape', 'Hip Escape'] },
    { date: '2024-12-10', techniques: ['RNC', 'Back Control', 'Seatbelt'] },
    { date: '2024-12-08', techniques: ['Half Guard', 'Underhook', 'Sweep'] },
    { date: '2024-12-05', techniques: ['Closed Guard', 'Armbar', 'Triangle'] },
    { date: '2024-12-01', techniques: ['Mount Escape', 'Bridge', 'Shrimp'] },
  ],
  yearlySessionCounts: [
    { year: 2024, sessions: 47, submissionsGiven: 3, submissionsReceived: 12 },
  ],
};

// -----------------------------------------
// BLUE BELT: Marcus (The Dedicated Hobbyist)
// -----------------------------------------

export const MOCK_BLUE_BELT_STATS: MockUserStats = {
  personaId: 'marcus-hobbyist',
  belt: 'blue',
  sessionCount: 187,
  trainingStartDate: '2022-03-10',
  currentStreak: 8,
  longestStreak: 21,
  sessionsThisWeek: 3,
  sessionsThisMonth: 11,
  totalMinutes: 16830,
  sparringRounds: 412,
  submissionsGiven: [
    { technique: 'Triangle', date: '2024-12-20', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-18', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-18', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-12-15', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-12-12', bodyRegion: 'arms' },
    { technique: 'Guillotine', date: '2024-12-10', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-08', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-05', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-12-01', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-11-28', bodyRegion: 'arms' },
    { technique: 'Omoplata', date: '2024-11-25', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-11-22', bodyRegion: 'neck' },
    { technique: 'Guillotine', date: '2024-11-20', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-11-18', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-11-15', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-11-12', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-11-10', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-11-08', bodyRegion: 'neck' },
    { technique: 'Darce', date: '2024-11-05', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-11-01', bodyRegion: 'arms' },
    { technique: 'Triangle', date: '2024-10-28', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-10-25', bodyRegion: 'arms' },
    { technique: 'Guillotine', date: '2024-10-20', bodyRegion: 'neck' },
  ],
  submissionsReceived: [
    { technique: 'RNC', date: '2024-12-20', bodyRegion: 'neck' },
    { technique: 'Heel Hook', date: '2024-12-18', bodyRegion: 'legs' },
    { technique: 'RNC', date: '2024-12-15', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-10', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-12-05', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-01', bodyRegion: 'neck' },
    { technique: 'RNC', date: '2024-11-28', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-11-22', bodyRegion: 'arms' },
    { technique: 'RNC', date: '2024-11-18', bodyRegion: 'neck' },
    { technique: 'Heel Hook', date: '2024-11-12', bodyRegion: 'legs' },
    { technique: 'RNC', date: '2024-11-05', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-10-28', bodyRegion: 'arms' },
  ],
  techniquesDrilledHistory: [
    { date: '2024-12-20', techniques: ['Triangle', 'Armbar', 'Omoplata', 'Hip Escape'] },
    { date: '2024-12-18', techniques: ['Toreando Pass', 'Knee Cut', 'Mount Control'] },
    { date: '2024-12-15', techniques: ['Closed Guard', 'Triangle', 'Armbar'] },
    { date: '2024-12-12', techniques: ['Half Guard', 'Underhook', 'Sweep', 'Kimura'] },
    { date: '2024-12-10', techniques: ['Spider Guard', 'Lasso', 'Triangle Setup'] },
    { date: '2024-12-08', techniques: ['X-Guard', 'Technical Stand-up', 'Single Leg'] },
    { date: '2024-12-05', techniques: ['Closed Guard', 'Armbar', 'Triangle', 'Omoplata'] },
    { date: '2024-12-01', techniques: ['Back Control', 'RNC', 'Bow and Arrow'] },
  ],
  yearlySessionCounts: [
    { year: 2022, sessions: 32, submissionsGiven: 8, submissionsReceived: 24 },
    { year: 2023, sessions: 78, submissionsGiven: 31, submissionsReceived: 42 },
    { year: 2024, sessions: 77, submissionsGiven: 47, submissionsReceived: 31 },
  ],
};

// -----------------------------------------
// PURPLE BELT: Sofia (The Grinder)
// -----------------------------------------

export const MOCK_PURPLE_BELT_STATS: MockUserStats = {
  personaId: 'sofia-grinder',
  belt: 'purple',
  sessionCount: 532,
  trainingStartDate: '2019-08-20',
  currentStreak: 15,
  longestStreak: 45,
  sessionsThisWeek: 5,
  sessionsThisMonth: 18,
  totalMinutes: 47880,
  sparringRounds: 2340,
  submissionsGiven: [
    { technique: 'Triangle', date: '2024-12-20', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-20', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-19', bodyRegion: 'arms' },
    { technique: 'Darce', date: '2024-12-19', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-18', bodyRegion: 'neck' },
    { technique: 'RNC', date: '2024-12-18', bodyRegion: 'neck' },
    { technique: 'Heel Hook', date: '2024-12-17', bodyRegion: 'legs' },
    { technique: 'Triangle', date: '2024-12-17', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-16', bodyRegion: 'arms' },
    { technique: 'Guillotine', date: '2024-12-16', bodyRegion: 'neck' },
    { technique: 'Triangle', date: '2024-12-15', bodyRegion: 'neck' },
    { technique: 'Kimura', date: '2024-12-15', bodyRegion: 'arms' },
    // ... many more (147 total triangles in career)
  ],
  submissionsReceived: [
    { technique: 'Heel Hook', date: '2024-12-20', bodyRegion: 'legs' },
    { technique: 'RNC', date: '2024-12-18', bodyRegion: 'neck' },
    { technique: 'Armbar', date: '2024-12-15', bodyRegion: 'arms' },
    { technique: 'Heel Hook', date: '2024-12-12', bodyRegion: 'legs' },
    { technique: 'Triangle', date: '2024-12-08', bodyRegion: 'neck' },
  ],
  techniquesDrilledHistory: [
    { date: '2024-12-20', techniques: ['Berimbolo', 'Back Take', 'Triangle', 'RNC'] },
    { date: '2024-12-19', techniques: ['Single Leg X', 'Heel Hook', 'Inside Sankaku'] },
    { date: '2024-12-18', techniques: ['De La Riva', 'Berimbolo', 'Back Take'] },
    { date: '2024-12-17', techniques: ['Closed Guard', 'Triangle', 'Armbar', 'Omoplata'] },
    { date: '2024-12-16', techniques: ['Leg Drag', 'Knee Cut', 'Mount', 'Armbar'] },
    { date: '2024-12-15', techniques: ['Spider Guard', 'Lasso', 'Triangle Setup', 'Sweep'] },
  ],
  yearlySessionCounts: [
    { year: 2019, sessions: 32, submissionsGiven: 12, submissionsReceived: 28 },
    { year: 2020, sessions: 78, submissionsGiven: 35, submissionsReceived: 42 },
    { year: 2021, sessions: 124, submissionsGiven: 67, submissionsReceived: 45 },
    { year: 2022, sessions: 156, submissionsGiven: 89, submissionsReceived: 38 },
    { year: 2023, sessions: 142, submissionsGiven: 112, submissionsReceived: 29 },
    { year: 2024, sessions: 142, submissionsGiven: 98, submissionsReceived: 21 }, // YTD
  ],
};

// ===========================================
// TECHNIQUE MASTERY MOCK DATA
// ===========================================

export interface TechniqueMasteryRecord {
  techniqueId: string;
  techniqueName: string;
  proficiency: 'learning' | 'developing' | 'proficient' | 'advanced';
  timesDrilled: number;
  timesUsedLive: number;
  lastPracticed: string;
}

export const MOCK_PURPLE_TECHNIQUE_MASTERY: TechniqueMasteryRecord[] = [
  // Advanced (3)
  { techniqueId: 't-triangle', techniqueName: 'Triangle', proficiency: 'advanced', timesDrilled: 147, timesUsedLive: 89, lastPracticed: '2024-12-20' },
  { techniqueId: 't-armbar', techniqueName: 'Armbar', proficiency: 'advanced', timesDrilled: 132, timesUsedLive: 67, lastPracticed: '2024-12-19' },
  { techniqueId: 't-rnc', techniqueName: 'Rear Naked Choke', proficiency: 'advanced', timesDrilled: 98, timesUsedLive: 54, lastPracticed: '2024-12-18' },

  // Proficient (8)
  { techniqueId: 't-kimura', techniqueName: 'Kimura', proficiency: 'proficient', timesDrilled: 67, timesUsedLive: 32, lastPracticed: '2024-12-15' },
  { techniqueId: 't-guillotine', techniqueName: 'Guillotine', proficiency: 'proficient', timesDrilled: 54, timesUsedLive: 28, lastPracticed: '2024-12-16' },
  { techniqueId: 't-omoplata', techniqueName: 'Omoplata', proficiency: 'proficient', timesDrilled: 41, timesUsedLive: 19, lastPracticed: '2024-12-17' },
  { techniqueId: 't-berimbolo', techniqueName: 'Berimbolo', proficiency: 'proficient', timesDrilled: 38, timesUsedLive: 22, lastPracticed: '2024-12-20' },
  { techniqueId: 't-dlr', techniqueName: 'De La Riva Guard', proficiency: 'proficient', timesDrilled: 52, timesUsedLive: 0, lastPracticed: '2024-12-18' },
  { techniqueId: 't-backtake', techniqueName: 'Back Take', proficiency: 'proficient', timesDrilled: 45, timesUsedLive: 31, lastPracticed: '2024-12-20' },
  { techniqueId: 't-legdrag', techniqueName: 'Leg Drag', proficiency: 'proficient', timesDrilled: 39, timesUsedLive: 24, lastPracticed: '2024-12-16' },
  { techniqueId: 't-kneecut', techniqueName: 'Knee Cut Pass', proficiency: 'proficient', timesDrilled: 44, timesUsedLive: 28, lastPracticed: '2024-12-16' },

  // Developing (12)
  { techniqueId: 't-darce', techniqueName: 'Darce', proficiency: 'developing', timesDrilled: 23, timesUsedLive: 8, lastPracticed: '2024-12-19' },
  { techniqueId: 't-loopchoke', techniqueName: 'Loop Choke', proficiency: 'developing', timesDrilled: 18, timesUsedLive: 5, lastPracticed: '2024-12-10' },
  { techniqueId: 't-heelhook', techniqueName: 'Heel Hook', proficiency: 'developing', timesDrilled: 28, timesUsedLive: 12, lastPracticed: '2024-12-19' },
  { techniqueId: 't-singlelegx', techniqueName: 'Single Leg X', proficiency: 'developing', timesDrilled: 31, timesUsedLive: 15, lastPracticed: '2024-12-19' },
  { techniqueId: 't-anaconda', techniqueName: 'Anaconda', proficiency: 'developing', timesDrilled: 15, timesUsedLive: 4, lastPracticed: '2024-12-05' },
  { techniqueId: 't-baseball', techniqueName: 'Baseball Bat Choke', proficiency: 'developing', timesDrilled: 12, timesUsedLive: 3, lastPracticed: '2024-11-28' },
  { techniqueId: 't-toehold', techniqueName: 'Toe Hold', proficiency: 'developing', timesDrilled: 19, timesUsedLive: 7, lastPracticed: '2024-12-12' },
  { techniqueId: 't-kneebar', techniqueName: 'Knee Bar', proficiency: 'developing', timesDrilled: 21, timesUsedLive: 6, lastPracticed: '2024-12-08' },
  { techniqueId: 't-wormguard', techniqueName: 'Worm Guard', proficiency: 'developing', timesDrilled: 14, timesUsedLive: 2, lastPracticed: '2024-11-20' },
  { techniqueId: 't-crucifix', techniqueName: 'Crucifix', proficiency: 'developing', timesDrilled: 11, timesUsedLive: 3, lastPracticed: '2024-11-15' },
  { techniqueId: 't-calf', techniqueName: 'Calf Slicer', proficiency: 'developing', timesDrilled: 9, timesUsedLive: 2, lastPracticed: '2024-11-10' },
  { techniqueId: 't-necktie', techniqueName: 'Japanese Necktie', proficiency: 'developing', timesDrilled: 8, timesUsedLive: 1, lastPracticed: '2024-11-05' },
];

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Calculate technique co-occurrence from session history.
 * Returns techniques that are frequently drilled together.
 */
export function calculateTechniqueCoOccurrence(
  history: TechniqueSession[],
  targetTechnique: string,
  limit: number = 5
): Array<{ technique: string; count: number }> {
  const coOccurrence: Record<string, number> = {};

  for (const session of history) {
    if (session.techniques.includes(targetTechnique)) {
      for (const tech of session.techniques) {
        if (tech !== targetTechnique) {
          coOccurrence[tech] = (coOccurrence[tech] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(coOccurrence)
    .map(([technique, count]) => ({ technique, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate body region breakdown from submissions.
 */
export function calculateBodyRegionBreakdown(
  submissions: SubmissionRecord[]
): Record<'neck' | 'arms' | 'legs', number> {
  const breakdown: Record<'neck' | 'arms' | 'legs', number> = {
    neck: 0,
    arms: 0,
    legs: 0,
  };

  for (const sub of submissions) {
    breakdown[sub.bodyRegion]++;
  }

  return breakdown;
}

/**
 * Get top techniques from submission list.
 */
export function getTopTechniques(
  submissions: SubmissionRecord[],
  limit: number = 5
): Array<{ technique: string; count: number }> {
  const counts: Record<string, number> = {};

  for (const sub of submissions) {
    counts[sub.technique] = (counts[sub.technique] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([technique, count]) => ({ technique, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate submission ratio (given:received).
 */
export function calculateSubmissionRatio(
  given: number,
  received: number
): { ratio: number; label: string } {
  if (received === 0) {
    return { ratio: given, label: `${given}:0` };
  }
  const ratio = given / received;
  return {
    ratio,
    label: `${ratio.toFixed(1)}:1`,
  };
}

/**
 * Get style label from submission ratio.
 */
export function getStyleFromRatio(
  givenCount: number,
  receivedCount: number
): StyleDefinition {
  const total = givenCount + receivedCount;

  // Special case: not enough data
  if (total < 10) {
    return STYLE_DEFINITIONS.find((s) => s.id === 'developing')!;
  }

  const ratio = receivedCount === 0 ? givenCount : givenCount / receivedCount;

  if (ratio < 0.5) {
    return STYLE_DEFINITIONS.find((s) => s.id === 'defensive')!;
  } else if (ratio > 2.0) {
    return STYLE_DEFINITIONS.find((s) => s.id === 'offensive')!;
  } else {
    return STYLE_DEFINITIONS.find((s) => s.id === 'balanced')!;
  }
}

/**
 * Check foundation techniques touched.
 */
export function checkFoundationsTouched(
  drillHistory: TechniqueSession[]
): { category: string; total: number; touched: number; techniques: Array<{ name: string; touched: boolean }> }[] {
  // Flatten all techniques ever drilled
  const allDrilled = new Set(
    drillHistory.flatMap((s) => s.techniques.map((t) => t.toLowerCase()))
  );

  return WHITE_BELT_FOUNDATIONS.map((category) => {
    const techniques = category.techniques.map((tech) => ({
      name: tech,
      touched: allDrilled.has(tech.toLowerCase()),
    }));

    return {
      category: category.name,
      total: category.techniques.length,
      touched: techniques.filter((t) => t.touched).length,
      techniques,
    };
  });
}

/**
 * Get milestone status for a user.
 */
export function getMilestoneStatus(
  sessionCount: number,
  daysActive: number
): { achieved: JourneyMilestone[]; next: JourneyMilestone | null } {
  const achieved: JourneyMilestone[] = [];
  let next: JourneyMilestone | null = null;

  for (const milestone of JOURNEY_MILESTONES) {
    const value = milestone.type === 'sessions' ? sessionCount : daysActive;

    if (value >= milestone.threshold) {
      achieved.push(milestone);
    } else if (!next) {
      next = milestone;
    }
  }

  return { achieved, next };
}

/**
 * Get dropout cliff message for days active.
 */
export function getDropoutCliffMessage(daysActive: number): DropoutCliffMessage {
  return (
    DROPOUT_CLIFF_MESSAGES.find(
      (msg) => daysActive >= msg.minDays && daysActive <= msg.maxDays
    ) || DROPOUT_CLIFF_MESSAGES[DROPOUT_CLIFF_MESSAGES.length - 1]
  );
}

/**
 * Simple sentiment check on text.
 */
export function checkSentiment(text: string): {
  score: number; // -1 to 1
  hasNegativeSignals: boolean;
  detectedKeywords: string[];
} {
  const lowerText = text.toLowerCase();
  const detectedNegative: string[] = [];
  const detectedPositive: string[] = [];

  for (const keyword of NEGATIVE_SENTIMENT_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      detectedNegative.push(keyword);
    }
  }

  for (const keyword of POSITIVE_SENTIMENT_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      detectedPositive.push(keyword);
    }
  }

  const negativeWeight = detectedNegative.length * -0.3;
  const positiveWeight = detectedPositive.length * 0.3;
  const score = Math.max(-1, Math.min(1, negativeWeight + positiveWeight));

  return {
    score,
    hasNegativeSignals: detectedNegative.length >= 2,
    detectedKeywords: [...detectedNegative, ...detectedPositive],
  };
}

// ===========================================
// MODULE MESSAGE COPY
// ===========================================

export interface ModuleCopy {
  moduleId: string;
  belt: BeltLevel | 'all';
  title: string;
  emptyState: string;
  insights: string[];
}

export const MODULE_COPY: ModuleCopy[] = [
  // White Belt
  {
    moduleId: 'journey-timeline',
    belt: 'white',
    title: 'Your Journey',
    emptyState: 'Log your first session to start tracking your journey.',
    insights: [
      'Every session counts. Keep showing up.',
      "You're building something most people quit before starting.",
      'Consistency beats intensity. One session at a time.',
    ],
  },
  {
    moduleId: 'consistency-score',
    belt: 'white',
    title: 'Consistency',
    emptyState: "Start training to see your consistency score.",
    insights: [
      '70% of white belts quit before 50 sessions. Prove them wrong.',
      "The mat doesn't care about talent. It rewards those who show up.",
      'Your only competition is the version of you that stayed home.',
    ],
  },
  {
    moduleId: 'foundations-progress',
    belt: 'white',
    title: 'Foundations',
    emptyState: "Start drilling techniques to track your fundamentals.",
    insights: [
      'Survival first. Offense later.',
      'The basics become your superpowers at higher belts.',
      "You're building the vocabulary. Grammar comes later.",
    ],
  },

  // Blue Belt
  {
    moduleId: 'your-style',
    belt: 'blue',
    title: 'Your Style',
    emptyState: 'Log more sparring sessions to see your style emerge.',
    insights: [
      'Blue belt is when your game starts to take shape.',
      'Own what works. Build on your strengths.',
      "Your A-game is forming. Trust the process.",
    ],
  },
  {
    moduleId: 'vulnerability-map',
    belt: 'blue',
    title: 'Where You Get Caught',
    emptyState: 'Track submissions to identify your vulnerabilities.',
    insights: [
      'Every tap is a lesson. Learn what keeps catching you.',
      'Defense is built by understanding your weaknesses.',
      "Knowing where you're vulnerable is the first step to fixing it.",
    ],
  },
  {
    moduleId: 'technique-pairings',
    belt: 'blue',
    title: 'Technique Pairings',
    emptyState: 'Drill more techniques to see patterns emerge.',
    insights: [
      "You're building chains, not just collecting moves.",
      'Techniques that train together work together.',
      'Systems beat random techniques. Keep building connections.',
    ],
  },
  {
    moduleId: 'blues-detector',
    belt: 'blue',
    title: 'The Blues Check',
    emptyState: '',
    insights: [
      'The plateau is normal. It passes.',
      "50% of blue belts quit. You don't have to be one of them.",
      'Imposter syndrome hits everyone. Your coach saw something in you.',
    ],
  },

  // Purple Belt
  {
    moduleId: 'long-game',
    belt: 'purple',
    title: 'The Long Game',
    emptyState: 'Keep training to see your multi-year journey.',
    insights: [
      'This is a lifestyle now.',
      'Look how far you have come.',
      'Years of work compound into mastery.',
    ],
  },
  {
    moduleId: 'submission-trends',
    belt: 'purple',
    title: 'Finishing Trends',
    emptyState: 'Log submissions to see your offensive evolution.',
    insights: [
      'Efficiency over effort. Your finishing rate tells the story.',
      'The bazooka fades. Finesse takes over.',
      "You're refining, not just adding.",
    ],
  },
  {
    moduleId: 'technique-mastery',
    belt: 'purple',
    title: 'Your Mastery',
    emptyState: 'Track technique progress to see your specializations.',
    insights: [
      'Depth over breadth at this stage.',
      'Your signature moves are becoming weapons.',
      "At purple, you're writing sentences, not just learning words.",
    ],
  },
];

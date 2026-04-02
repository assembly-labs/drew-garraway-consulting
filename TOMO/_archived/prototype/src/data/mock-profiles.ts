/**
 * Belt-Specific Mock Profiles
 *
 * Comprehensive mock data for 4 belt levels to preview personalization.
 * Based on research from belt psychology profiles and user personas.
 *
 * Profiles:
 * - WHITE BELT: David Morrison (Late Starter, 52yo, survival mode)
 * - BLUE BELT: Marcus Chen (Dedicated Hobbyist, 34yo, identity crisis)
 * - PURPLE BELT: Sofia Rodriguez (Grinder/Competitor, 28yo, systems thinking)
 * - BROWN BELT: Elena Kim (Veteran, 38yo, refinement mode)
 */

import type { BeltColor } from '../types/database';
import type { UserProfile as UsersUserProfile } from './users';
import type { JournalEntry } from './journal';
import type {
  BeltPromotion,
  BeltRequirement,
  PositionMastery,
  Milestone,
  Goal
} from './progress';
import type { TechniqueProgress } from './techniques';
import type { UserProfile as ContextUserProfile, BeltLevel, TrainingGoal } from '../context/UserProfileContext';
import type { StyleFingerprintData } from '../components/ui/StyleFingerprint';

// ===========================================
// PROFILE TYPE (extends both user types)
// ===========================================

export interface MockProfile {
  // Identity
  id: string;
  key: 'white' | 'blue' | 'purple' | 'brown';
  displayName: string;

  // User data (matches users.ts structure)
  user: UsersUserProfile;

  // Context profile (matches UserProfileContext structure)
  contextProfile: ContextUserProfile;

  // Journal entries (10-15 sessions)
  journalEntries: JournalEntry[];

  // Training statistics
  trainingStats: {
    totalSessions: number;
    totalHours: number;
    currentStreak: number;
    longestStreak: number;
    thisMonth: {
      sessions: number;
      hours: number;
      techniques: number;
      sparringRounds: number;
      targetSessions: number;
    };
    thisYear: {
      sessions: number;
      hours: number;
    };
    byType: {
      gi: number;
      nogi: number;
      openmat: number;
      private: number;
      competition: number;
    };
    sparringRecord: {
      wins: number;
      losses: number;
      draws: number;
    };
    submissionsMade: Record<string, number>;
    submissionsReceived: Record<string, number>;
  };

  // Belt progression history
  beltHistory: BeltPromotion[];

  // Current belt requirements (for next promotion)
  beltRequirements: BeltRequirement[];

  // Position mastery heat map
  positionMastery: PositionMastery[];

  // Earned milestones
  milestones: Milestone[];

  // Active goals
  goals: Goal[];

  // Technique progress
  techniqueProgress: TechniqueProgress[];

  // Progress summary
  progressSummary: {
    currentBelt: BeltColor;
    currentStripes: number;
    timeAtBelt: string;
    nextBelt: BeltColor;
    overallCompletion: number;
    requirementsComplete: number;
    requirementsTotal: number;
    estimatedTimeToPromotion: string;
    strengths: string[];
    weaknesses: string[];
    coachFeedbackCount: number;
    recentFocusAreas: string[];
  };

  // Style fingerprint for radar chart visualization
  styleFingerprint: StyleFingerprintData;
}

// ===========================================
// HELPER: Generate dates relative to today
// ===========================================

const today = new Date();
const formatDate = (date: Date): string => date.toISOString().split('T')[0];
const daysAgo = (days: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};
const monthsAgo = (months: number): string => {
  const d = new Date(today);
  d.setMonth(d.getMonth() - months);
  return formatDate(d);
};
const yearsAgo = (years: number): string => {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - years);
  return formatDate(d);
};

// ===========================================
// WHITE BELT PROFILE: David Morrison
// "The Late Starter" - Survival Mode
// ===========================================

const whiteBeltUser: UsersUserProfile = {
  id: 'user-white-001',
  role: 'practitioner',
  firstName: 'David',
  lastName: 'Morrison',
  email: 'david.m@email.com',
  belt: 'white',
  stripes: 3,
  trainingStartDate: monthsAgo(10),
  homeGymId: 'gym-001',
  affiliatedGymIds: ['gym-001'],
  weightClass: 'Heavy (195-209 lbs)',
  goals: ['Survive to blue belt', 'Learn basic submissions', 'Stay injury-free'],
  isPrivate: false,
};

const whiteBeltContextProfile: ContextUserProfile = {
  userId: 'user-white-001',
  name: 'David Morrison',
  belt: 'white' as BeltLevel,
  stripes: 3,
  trainingStartDate: monthsAgo(10),
  currentBeltDate: monthsAgo(10),
  gym: { gymId: 'alliance-austin', gymName: 'Alliance BJJ Austin', isCustom: false, city: 'Austin', stateOrCountry: 'TX', affiliation: 'Alliance' },
  targetFrequency: 2,
  loggingPreference: 'text',
  trainingGoals: ['fitness', 'self-defense', 'mental'] as TrainingGoal[],
  experienceLevel: 'beginner' as const,
  birthYear: 1972,
  notificationsEnabled: true,
  onboardingComplete: true,
  sessionCount: 78,
  createdAt: monthsAgo(10),
  lastSessionAt: daysAgo(1),
  birthDate: '1972-06-15',
  gender: 'male',
  beltHistory: [],
  notifications: {
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  },
  skipCounts: {
    trainingStartDate: 0,
    currentBeltDate: 0,
    trainingGoals: 0,
    experienceLevel: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

const whiteBeltJournalEntries: JournalEntry[] = [
  {
    id: 'wb-entry-001',
    userId: 'user-white-001',
    date: daysAgo(1),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-011', techniqueName: 'Trap and Roll Escape (Upa)', reps: 25, notes: 'Coach said my bridge is getting better' },
      { techniqueId: 'tech-012', techniqueName: 'Elbow-Knee Escape from Mount', reps: 20, notes: 'Still forgetting to frame first' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Armbar', notes: 'Got caught reaching again' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'draw', notes: 'We both just survived' },
    ],
    notes: 'Escape day. My hips are slowly getting better but I still panic when mounted. At least I remembered to breathe today.',
    privateNotes: 'Got smashed by the blue belt again. Feels like I\'ll never catch up.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'wb-entry-002',
    userId: 'user-white-001',
    date: daysAgo(4),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-015', techniqueName: 'Rear Naked Choke', reps: 15, notes: 'Practiced the squeeze technique' },
      { techniqueId: 'tech-016', techniqueName: 'Back Escape - Clear Hooks', reps: 20, notes: 'Getting better at protecting my neck' },
    ],
    sparringRounds: [
      { partnerId: 'user-005', partnerName: 'New white belt', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'RNC', notes: 'Got my first RNC on a newer guy!' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Bow and Arrow', notes: 'She was going easy but still got me' },
    ],
    notes: 'Back attacks and defense today. Finally got a submission! The new white belt was even more lost than me. It felt good to not be the newest guy.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'wb-entry-003',
    userId: 'user-white-001',
    date: daysAgo(7),
    type: 'openmat',
    duration: 90,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-loss', submissionType: 'Guillotine' },
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Triangle' },
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Armbar' },
      { partnerId: 'user-006', partnerName: 'Mike S.', partnerBelt: 'white', outcome: 'draw' },
    ],
    notes: 'Saturday open mat. Got crushed. 0-3 with one draw. My neck is sore from the guillotine. Need to keep my head up.',
    privateNotes: 'Why do I keep doing this to myself? Everyone younger than me and they\'re all better.',
    energyLevel: 2,
    mood: 2,
    injury: 'Neck is stiff from getting guillotined',
    isPrivate: false,
  },
  {
    id: 'wb-entry-004',
    userId: 'user-white-001',
    date: daysAgo(8),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-013', techniqueName: 'Hip Escape to Guard (Shrimp)', reps: 30, notes: 'Focus on the timing of the shrimp' },
      { techniqueId: 'tech-014', techniqueName: 'Underhook Escape from Side Control', reps: 15, notes: 'Need to be more explosive' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Kimura' },
    ],
    notes: 'Side control escapes. Coach says my shrimp is improving. I actually felt like I almost escaped once today.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'wb-entry-005',
    userId: 'user-white-001',
    date: daysAgo(11),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-001', techniqueName: 'Armbar from Guard', reps: 15, notes: 'My hips are too slow' },
      { techniqueId: 'tech-005', techniqueName: 'Scissor Sweep', reps: 20, notes: 'Timing is everything here' },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'positional', notes: 'Both of us stuck in each other\'s guard' },
    ],
    notes: 'Fundamentals class. Armbar from guard seems impossible when they\'re resisting. Coach said to be patient.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'wb-entry-006',
    userId: 'user-white-001',
    date: daysAgo(14),
    type: 'openmat',
    duration: 90,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Americana', notes: 'Finally caught him!' },
      { partnerId: 'user-006', partnerName: 'Mike S.', partnerBelt: 'white', outcome: 'draw' },
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Cross Choke' },
    ],
    notes: 'Better open mat! Got my first Americana on Jake. He left his arm out and I remembered the technique from last week.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'wb-entry-007',
    userId: 'user-white-001',
    date: daysAgo(15),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-008', techniqueName: 'Americana from Mount', reps: 20 },
      { techniqueId: 'tech-009', techniqueName: 'Armbar from Mount', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-005', partnerName: 'New white belt', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Americana' },
    ],
    notes: 'Mount attacks. Need to remember to squeeze my knees and stay heavy. Got the americana I drilled!',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'wb-entry-008',
    userId: 'user-white-001',
    date: daysAgo(18),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-017', techniqueName: 'Double Leg Takedown', reps: 10, notes: 'My knees don\'t like this' },
      { techniqueId: 'tech-019', techniqueName: 'Guard Pull', reps: 15, notes: 'This feels safer for my old body' },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'draw', notes: 'Pulled guard, survived' },
    ],
    notes: 'Takedown day. My knees are not happy. Think I\'ll stick with guard pulls for now.',
    energyLevel: 2,
    mood: 3,
    injury: 'Left knee slightly tweaked from takedown practice',
    isPrivate: false,
  },
  {
    id: 'wb-entry-009',
    userId: 'user-white-001',
    date: daysAgo(21),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-002', techniqueName: 'Triangle Choke', reps: 15, notes: 'My legs are too short for this' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Armbar' },
    ],
    notes: 'Triangle day. Struggled to lock it properly. My flexibility is the issue. Blue belts make it look easy.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'wb-entry-010',
    userId: 'user-white-001',
    date: daysAgo(25),
    type: 'gi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-003', techniqueName: 'Cross Collar Choke from Guard', reps: 20 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'draw' },
    ],
    notes: 'Collar chokes from guard. Getting better at breaking posture. Small victories.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
];

const whiteBeltTrainingStats = {
  totalSessions: 78,
  totalHours: 82,
  currentStreak: 3,
  longestStreak: 8,
  thisMonth: {
    sessions: 7,
    hours: 7.5,
    techniques: 4,
    sparringRounds: 12,
    targetSessions: 8,
  },
  thisYear: {
    sessions: 78,
    hours: 82,
  },
  byType: {
    gi: 62,
    nogi: 4,
    openmat: 12,
    private: 0,
    competition: 0,
  },
  sparringRecord: {
    wins: 12,
    losses: 58,
    draws: 24,
  },
  submissionsMade: {
    'Americana': 5,
    'RNC': 4,
    'Armbar': 2,
    'Guillotine': 1,
  },
  submissionsReceived: {
    'Armbar': 18,
    'Triangle': 12,
    'RNC': 8,
    'Kimura': 7,
    'Guillotine': 5,
    'Cross Choke': 4,
    'Bow and Arrow': 2,
    'Other': 2,
  },
};

const whiteBeltHistory: BeltPromotion[] = [
  {
    id: 'wb-promo-001',
    userId: 'user-white-001',
    fromBelt: null,
    fromStripes: 0,
    toBelt: 'white',
    toStripes: 0,
    date: monthsAgo(10),
    promotedBy: 'coach-001',
    notes: 'Started training at Alliance BJJ. Better late than never.',
  },
  {
    id: 'wb-promo-002',
    userId: 'user-white-001',
    fromBelt: 'white',
    fromStripes: 0,
    toBelt: 'white',
    toStripes: 1,
    date: monthsAgo(7),
    promotedBy: 'coach-001',
    notes: 'First stripe. Coach said consistency is paying off.',
  },
  {
    id: 'wb-promo-003',
    userId: 'user-white-001',
    fromBelt: 'white',
    fromStripes: 1,
    toBelt: 'white',
    toStripes: 2,
    date: monthsAgo(4),
    promotedBy: 'coach-001',
    notes: 'Second stripe. Escapes improving.',
  },
  {
    id: 'wb-promo-004',
    userId: 'user-white-001',
    fromBelt: 'white',
    fromStripes: 2,
    toBelt: 'white',
    toStripes: 3,
    date: monthsAgo(1),
    promotedBy: 'coach-001',
    notes: 'Third stripe. One more to go before blue belt consideration.',
  },
];

const whiteBeltRequirements: BeltRequirement[] = [
  { id: 'wb-req-001', name: 'Escapes', category: 'technique', description: 'Demonstrate escapes from mount, side control, and back', targetValue: 4, currentValue: 3, isComplete: false, coachVerified: false },
  { id: 'wb-req-002', name: 'Submissions', category: 'technique', description: 'Demonstrate 4 submissions from different positions', targetValue: 4, currentValue: 2, isComplete: false, coachVerified: false },
  { id: 'wb-req-003', name: 'Sweeps', category: 'technique', description: 'Demonstrate 2 sweeps from guard', targetValue: 2, currentValue: 1, isComplete: false, coachVerified: false },
  { id: 'wb-req-004', name: 'Guard Retention', category: 'technique', description: 'Show ability to maintain guard for 2 minutes', targetValue: 1, currentValue: 1, isComplete: true, coachVerified: true },
  { id: 'wb-req-005', name: 'Class Attendance', category: 'attendance', description: 'Attend at least 100 classes', targetValue: 100, currentValue: 78, isComplete: false, coachVerified: false },
  { id: 'wb-req-006', name: 'Time Training', category: 'attendance', description: 'Minimum 12 months of consistent training', targetValue: 12, currentValue: 10, isComplete: false, coachVerified: false },
];

const whiteBeltPositionMastery: PositionMastery[] = [
  { position: 'Closed Guard', attackScore: 25, defenseScore: 45, overallScore: 35 },
  { position: 'Open Guard', attackScore: 15, defenseScore: 30, overallScore: 22 },
  { position: 'Half Guard', attackScore: 20, defenseScore: 35, overallScore: 28 },
  { position: 'Mount', attackScore: 30, defenseScore: 40, overallScore: 35 },
  { position: 'Side Control', attackScore: 25, defenseScore: 38, overallScore: 32 },
  { position: 'Back', attackScore: 35, defenseScore: 25, overallScore: 30 },
  { position: 'Turtle', attackScore: 10, defenseScore: 45, overallScore: 28 },
  { position: 'Standing', attackScore: 15, defenseScore: 25, overallScore: 20 },
];

const whiteBeltMilestones: Milestone[] = [
  { id: 'wb-mile-001', type: 'sessions', name: 'First Month', description: 'Completed first month of training', earnedAt: monthsAgo(9), icon: 'Calendar' },
  { id: 'wb-mile-002', type: 'sessions', name: 'Fifty Sessions', description: 'Logged 50 training sessions', earnedAt: monthsAgo(3), icon: 'Target' },
  { id: 'wb-mile-003', type: 'submission', name: 'First Submission', description: 'Got your first tap in live rolling', earnedAt: monthsAgo(5), icon: 'Award' },
  { id: 'wb-mile-004', type: 'streak', name: 'One Week Warrior', description: 'Trained 7 days in a row', earnedAt: monthsAgo(4), icon: 'Flame' },
];

const whiteBeltGoals: Goal[] = [
  { id: 'wb-goal-001', userId: 'user-white-001', type: 'promotion', title: 'Earn Blue Belt', description: 'Complete requirements and earn blue belt promotion', targetDate: monthsAgo(-6), isComplete: false, createdAt: monthsAgo(10), coachVisible: true },
  { id: 'wb-goal-002', userId: 'user-white-001', type: 'attendance', title: 'Train 2x per Week Consistently', description: 'Maintain 2 sessions per week for 3 months', targetValue: 24, currentValue: 18, isComplete: false, createdAt: monthsAgo(3), coachVisible: true },
  { id: 'wb-goal-003', userId: 'user-white-001', type: 'technique', title: 'Master Escapes', description: 'Be able to escape from all major positions', isComplete: false, createdAt: monthsAgo(6), coachVisible: true },
];

const whiteBeltTechniqueProgress: TechniqueProgress[] = [
  // Escapes - focus area
  { techniqueId: 'tech-011', proficiency: 'developing', timesDrilled: 35, lastDrilled: daysAgo(1), coachEndorsed: false },
  { techniqueId: 'tech-012', proficiency: 'developing', timesDrilled: 28, lastDrilled: daysAgo(1), coachEndorsed: false },
  { techniqueId: 'tech-013', proficiency: 'developing', timesDrilled: 32, lastDrilled: daysAgo(8), coachEndorsed: false },
  { techniqueId: 'tech-014', proficiency: 'learning', timesDrilled: 15, lastDrilled: daysAgo(8), coachEndorsed: false },
  { techniqueId: 'tech-016', proficiency: 'developing', timesDrilled: 22, lastDrilled: daysAgo(4), coachEndorsed: false },

  // Basic submissions - learning
  { techniqueId: 'tech-001', proficiency: 'learning', timesDrilled: 18, lastDrilled: daysAgo(11), coachEndorsed: false },
  { techniqueId: 'tech-002', proficiency: 'learning', timesDrilled: 12, lastDrilled: daysAgo(21), coachEndorsed: false },
  { techniqueId: 'tech-003', proficiency: 'learning', timesDrilled: 15, lastDrilled: daysAgo(25), coachEndorsed: false },
  { techniqueId: 'tech-008', proficiency: 'developing', timesDrilled: 20, lastDrilled: daysAgo(15), coachEndorsed: false },
  { techniqueId: 'tech-015', proficiency: 'developing', timesDrilled: 18, lastDrilled: daysAgo(4), coachEndorsed: false },

  // Sweeps - very basic
  { techniqueId: 'tech-005', proficiency: 'learning', timesDrilled: 20, lastDrilled: daysAgo(11), coachEndorsed: false },
  { techniqueId: 'tech-006', proficiency: 'learning', timesDrilled: 8, lastDrilled: daysAgo(30), coachEndorsed: false },

  // Takedowns - avoiding due to knees
  { techniqueId: 'tech-017', proficiency: 'learning', timesDrilled: 10, lastDrilled: daysAgo(18), coachEndorsed: false },
  { techniqueId: 'tech-019', proficiency: 'learning', timesDrilled: 15, lastDrilled: daysAgo(18), coachEndorsed: false },
];

// ===========================================
// BLUE BELT PROFILE: Marcus Chen
// "The Dedicated Hobbyist" - Identity Crisis
// ===========================================

const blueBeltUser: UsersUserProfile = {
  id: 'user-blue-001',
  role: 'practitioner',
  firstName: 'Marcus',
  lastName: 'Chen',
  email: 'marcus.chen@email.com',
  belt: 'blue',
  stripes: 2,
  trainingStartDate: yearsAgo(2) + '-06-15',
  homeGymId: 'gym-001',
  affiliatedGymIds: ['gym-001'],
  weightClass: 'Medium Heavy (181-195 lbs)',
  goals: ['Make it to purple belt', 'Compete at local tournament', 'Train 3x per week consistently'],
  isPrivate: false,
};

const blueBeltContextProfile: ContextUserProfile = {
  userId: 'user-blue-001',
  name: 'Marcus Chen',
  belt: 'blue' as BeltLevel,
  stripes: 2,
  gym: { gymId: 'alliance-austin', gymName: 'Alliance BJJ Austin', isCustom: false, city: 'Austin', stateOrCountry: 'TX', affiliation: 'Alliance' },
  targetFrequency: 3,
  loggingPreference: 'voice',
  trainingGoals: ['fitness', 'mental', 'community'] as TrainingGoal[],
  experienceLevel: 'intermediate' as const,
  trainingStartDate: yearsAgo(2) + '-06-15',
  currentBeltDate: monthsAgo(14),
  birthYear: 1990,
  notificationsEnabled: true,
  onboardingComplete: true,
  sessionCount: 247,
  createdAt: yearsAgo(2) + '-06-15',
  lastSessionAt: daysAgo(0),
  birthDate: '1990-03-20',
  gender: 'male',
  beltHistory: [],
  notifications: {
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  },
  skipCounts: {
    trainingStartDate: 0,
    currentBeltDate: 0,
    trainingGoals: 0,
    experienceLevel: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

const blueBeltJournalEntries: JournalEntry[] = [
  {
    id: 'bb-entry-001',
    userId: 'user-blue-001',
    date: daysAgo(0),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-020', techniqueName: 'Toreando Pass', reps: 20, notes: 'Focused on hip pressure after the pass' },
      { techniqueId: 'tech-021', techniqueName: 'Knee Cut Pass', reps: 15, notes: 'Getting caught in half guard less often' },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar', notes: 'Smooth transition from mount' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Triangle', notes: 'Lazy posture again' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'draw', notes: 'Competitive roll, close match' },
    ],
    notes: 'Good class. Passing game is coming together but I keep getting triangled by higher belts when I rush.',
    privateNotes: 'Still feel like I should be better after 2+ years. Tommy is about to pass me.',
    energyLevel: 4,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'bb-entry-002',
    userId: 'user-blue-001',
    date: daysAgo(2),
    type: 'nogi',
    duration: 75,
    techniques: [
      { techniqueId: 'tech-038', techniqueName: 'Heel Hook', reps: 10, notes: 'Working outside heel hook from 50/50' },
      { techniqueId: 'tech-015', techniqueName: 'Rear Naked Choke', reps: 12, notes: 'Short choke variation' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Heel Hook', notes: 'Caught in the saddle' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'No-gi with Amanda. Leg locks are fun but dangerous. Sofia\'s leg lock game is scary.',
    energyLevel: 5,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-003',
    userId: 'user-blue-001',
    date: daysAgo(4),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-001', techniqueName: 'Armbar from Guard', reps: 15 },
      { techniqueId: 'tech-024', techniqueName: 'Kimura from Guard', reps: 12 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Kimura' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-loss', submissionType: 'Triangle' },
    ],
    notes: 'Fundamentals class. Good to revisit basics. Jake is improving quickly - he\'s going to catch me soon.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-004',
    userId: 'user-blue-001',
    date: daysAgo(6),
    type: 'openmat',
    duration: 120,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'draw', notes: 'She was teaching me half guard details' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Cross Choke', notes: 'Got to work on my guard though' },
    ],
    notes: 'Sunday open mat. Mixed results. Good talk with Sofia about developing my game.',
    energyLevel: 3,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-005',
    userId: 'user-blue-001',
    date: daysAgo(9),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-002', techniqueName: 'Triangle Choke', reps: 20 },
      { techniqueId: 'tech-025', techniqueName: 'Omoplata', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'draw' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Triangle' },
    ],
    notes: 'Closed guard attacks. Triangle is feeling better. Need to work on the omoplata finish.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-006',
    userId: 'user-blue-001',
    date: daysAgo(11),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-027', techniqueName: 'Old School Sweep from Half Guard', reps: 15 },
      { techniqueId: 'tech-028', techniqueName: 'Deep Half Guard Sweep', reps: 12 },
    ],
    sparringRounds: [
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Armbar', notes: 'Tried to work half guard but she passed' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'Half guard day. Deep half is confusing but I see the potential. Elena showed me where I\'m going wrong.',
    energyLevel: 3,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'bb-entry-007',
    userId: 'user-blue-001',
    date: daysAgo(13),
    type: 'openmat',
    duration: 90,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-006', partnerName: 'Mike S.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Armbar' },
    ],
    notes: 'Felt good today. Beat Tommy cleanly. Sofia still levels above me though.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'bb-entry-008',
    userId: 'user-blue-001',
    date: daysAgo(16),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-029', techniqueName: 'Americana from Side Control', reps: 15 },
      { techniqueId: 'tech-031', techniqueName: 'Paper Cutter Choke', reps: 12 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Americana' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'draw' },
    ],
    notes: 'Side control attacks. Paper cutter is sneaky. Need to work on maintaining the position.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-009',
    userId: 'user-blue-001',
    date: daysAgo(18),
    type: 'nogi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-004', techniqueName: 'Guillotine Choke', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Guillotine' },
    ],
    notes: 'Quick lunch session. Worked guillotine grip attacks.',
    energyLevel: 4,
    mood: 4,
    injury: 'Slight tweak in left elbow',
    isPrivate: false,
  },
  {
    id: 'bb-entry-010',
    userId: 'user-blue-001',
    date: daysAgo(20),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-011', techniqueName: 'Trap and Roll Escape', reps: 25 },
      { techniqueId: 'tech-013', techniqueName: 'Hip Escape to Guard', reps: 30 },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'Escape drills. Coach emphasized framing. Helped some white belts after class.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-011',
    userId: 'user-blue-001',
    date: daysAgo(23),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-026', techniqueName: 'Bow and Arrow Choke', reps: 12 },
      { techniqueId: 'tech-033', techniqueName: 'Seatbelt to Hooks - Back Take', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'RNC' },
    ],
    notes: 'Back attacks. Bow and arrow is becoming a favorite. Elena\'s back control is suffocating.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'bb-entry-012',
    userId: 'user-blue-001',
    date: daysAgo(25),
    type: 'competition',
    duration: 180,
    techniques: [],
    sparringRounds: [
      { partnerId: 'opponent-001', partnerName: 'Competition Opponent 1', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'opponent-002', partnerName: 'Competition Opponent 2', partnerBelt: 'blue', outcome: 'points-loss', notes: '0-4 on points, got swept twice' },
    ],
    notes: 'Local tournament. Won my first match by triangle! Lost in semis on points. Need to work on my top game.',
    energyLevel: 5,
    mood: 4,
    isPrivate: false,
  },
];

const blueBeltTrainingStats = {
  totalSessions: 247,
  totalHours: 312,
  currentStreak: 5,
  longestStreak: 21,
  thisMonth: {
    sessions: 12,
    hours: 15.5,
    techniques: 8,
    sparringRounds: 28,
    targetSessions: 12,
  },
  thisYear: {
    sessions: 156,
    hours: 195,
  },
  byType: {
    gi: 145,
    nogi: 68,
    openmat: 28,
    private: 4,
    competition: 2,
  },
  sparringRecord: {
    wins: 142,
    losses: 98,
    draws: 65,
  },
  submissionsMade: {
    'Armbar': 28,
    'Triangle': 24,
    'RNC': 32,
    'Kimura': 12,
    'Guillotine': 18,
    'Bow and Arrow': 8,
    'Americana': 10,
    'Other': 10,
  },
  submissionsReceived: {
    'Armbar': 22,
    'Triangle': 18,
    'RNC': 12,
    'Heel Hook': 8,
    'Bow and Arrow': 10,
    'Cross Choke': 14,
    'Other': 14,
  },
};

const blueBeltHistory: BeltPromotion[] = [
  { id: 'bb-promo-001', userId: 'user-blue-001', fromBelt: null, fromStripes: 0, toBelt: 'white', toStripes: 0, date: yearsAgo(2) + '-06-15', promotedBy: 'coach-001', notes: 'Started training at Alliance BJJ' },
  { id: 'bb-promo-002', userId: 'user-blue-001', fromBelt: 'white', fromStripes: 0, toBelt: 'white', toStripes: 1, date: yearsAgo(2) + '-09-20', promotedBy: 'coach-001' },
  { id: 'bb-promo-003', userId: 'user-blue-001', fromBelt: 'white', fromStripes: 1, toBelt: 'white', toStripes: 2, date: yearsAgo(2) + '-12-15', promotedBy: 'coach-001' },
  { id: 'bb-promo-004', userId: 'user-blue-001', fromBelt: 'white', fromStripes: 2, toBelt: 'white', toStripes: 3, date: yearsAgo(1) + '-04-10', promotedBy: 'coach-001' },
  { id: 'bb-promo-005', userId: 'user-blue-001', fromBelt: 'white', fromStripes: 3, toBelt: 'white', toStripes: 4, date: yearsAgo(1) + '-08-28', promotedBy: 'coach-001' },
  { id: 'bb-promo-006', userId: 'user-blue-001', fromBelt: 'white', fromStripes: 4, toBelt: 'blue', toStripes: 0, date: monthsAgo(14), promotedBy: 'coach-001', notes: 'Blue belt! Excellent guard work.' },
  { id: 'bb-promo-007', userId: 'user-blue-001', fromBelt: 'blue', fromStripes: 0, toBelt: 'blue', toStripes: 1, date: monthsAgo(8), promotedBy: 'coach-001' },
  { id: 'bb-promo-008', userId: 'user-blue-001', fromBelt: 'blue', fromStripes: 1, toBelt: 'blue', toStripes: 2, date: monthsAgo(2), promotedBy: 'coach-001', notes: 'Showing good passing game development' },
];

const blueBeltRequirements: BeltRequirement[] = [
  { id: 'bb-req-001', name: 'Guard Passes', category: 'technique', description: 'Demonstrate 5 different guard passes', targetValue: 5, currentValue: 3, isComplete: false, coachVerified: false },
  { id: 'bb-req-002', name: 'Submissions', category: 'technique', description: 'Demonstrate 8 submissions from different positions', targetValue: 8, currentValue: 6, isComplete: false, coachVerified: false },
  { id: 'bb-req-003', name: 'Sweeps', category: 'technique', description: 'Demonstrate 4 sweeps from guard', targetValue: 4, currentValue: 4, isComplete: true, coachVerified: true },
  { id: 'bb-req-004', name: 'Escapes', category: 'technique', description: 'Demonstrate escapes from all major positions', targetValue: 5, currentValue: 5, isComplete: true, coachVerified: true },
  { id: 'bb-req-005', name: 'Takedowns', category: 'technique', description: 'Demonstrate 3 takedowns', targetValue: 3, currentValue: 2, isComplete: false, coachVerified: false },
  { id: 'bb-req-006', name: 'Time at Belt', category: 'attendance', description: 'Minimum 18 months at blue belt', targetValue: 18, currentValue: 14, isComplete: false, coachVerified: false },
  { id: 'bb-req-007', name: 'Class Attendance', category: 'attendance', description: 'Attend at least 200 classes at blue belt', targetValue: 200, currentValue: 156, isComplete: false, coachVerified: false },
  { id: 'bb-req-008', name: 'Competition Experience', category: 'competition', description: 'Compete in at least 3 tournaments', targetValue: 3, currentValue: 2, isComplete: false, coachVerified: false },
  { id: 'bb-req-009', name: 'Teaching Ability', category: 'knowledge', description: 'Assist in teaching fundamentals class', targetValue: 1, currentValue: 0, isComplete: false, coachVerified: false },
];

const blueBeltPositionMastery: PositionMastery[] = [
  { position: 'Closed Guard', attackScore: 78, defenseScore: 72, overallScore: 75 },
  { position: 'Open Guard', attackScore: 65, defenseScore: 58, overallScore: 62 },
  { position: 'Half Guard', attackScore: 70, defenseScore: 75, overallScore: 72 },
  { position: 'Mount', attackScore: 82, defenseScore: 60, overallScore: 71 },
  { position: 'Side Control', attackScore: 75, defenseScore: 55, overallScore: 65 },
  { position: 'Back', attackScore: 85, defenseScore: 45, overallScore: 65 },
  { position: 'Turtle', attackScore: 50, defenseScore: 70, overallScore: 60 },
  { position: 'Standing', attackScore: 45, defenseScore: 55, overallScore: 50 },
];

const blueBeltMilestones: Milestone[] = [
  { id: 'bb-mile-001', type: 'promotion', name: 'Blue Belt', description: 'Earned blue belt rank', earnedAt: monthsAgo(14), icon: 'Belt' },
  { id: 'bb-mile-002', type: 'sessions', name: 'Century Club', description: 'Completed 100 training sessions', earnedAt: yearsAgo(1) + '-05-20', icon: 'Hundred' },
  { id: 'bb-mile-003', type: 'sessions', name: 'Double Century', description: 'Completed 200 training sessions', earnedAt: monthsAgo(3), icon: 'Target' },
  { id: 'bb-mile-004', type: 'streak', name: 'Two Week Warrior', description: 'Trained 14 days in a row', earnedAt: monthsAgo(6), icon: 'Flame' },
  { id: 'bb-mile-005', type: 'streak', name: 'Three Week Streak', description: 'Trained 21 days in a row', earnedAt: monthsAgo(4), icon: 'Zap' },
  { id: 'bb-mile-006', type: 'competition', name: 'First Competition', description: 'Competed in first tournament', earnedAt: yearsAgo(1) + '-04-15', icon: 'Trophy' },
  { id: 'bb-mile-007', type: 'competition', name: 'Competition Win', description: 'Won a match in competition', earnedAt: daysAgo(25), icon: 'Medal' },
  { id: 'bb-mile-008', type: 'submission', name: 'Triangle Master', description: 'Landed 20 triangles in sparring', earnedAt: monthsAgo(2), icon: 'Award' },
];

const blueBeltGoals: Goal[] = [
  { id: 'bb-goal-001', userId: 'user-blue-001', type: 'promotion', title: 'Earn Purple Belt', description: 'Complete all purple belt requirements and earn promotion', targetDate: monthsAgo(-8), isComplete: false, createdAt: monthsAgo(12), coachVisible: true },
  { id: 'bb-goal-002', userId: 'user-blue-001', type: 'attendance', title: 'Train 3x per Week', description: 'Maintain consistent 3 sessions per week for 3 months', targetValue: 36, currentValue: 28, isComplete: false, createdAt: monthsAgo(3), coachVisible: true },
  { id: 'bb-goal-003', userId: 'user-blue-001', type: 'technique', title: 'Master Leg Locks', description: 'Become proficient in heel hooks and ankle locks', isComplete: false, createdAt: monthsAgo(2), coachVisible: true },
  { id: 'bb-goal-004', userId: 'user-blue-001', type: 'competition', title: 'Medal at IBJJF Open', description: 'Compete and medal at the next IBJJF Austin Open', targetDate: monthsAgo(-3), isComplete: false, createdAt: monthsAgo(1), coachVisible: true },
];

const blueBeltTechniqueProgress: TechniqueProgress[] = [
  // White belt techniques (proficient)
  { techniqueId: 'tech-001', proficiency: 'proficient', timesDrilled: 45, lastDrilled: daysAgo(4), coachEndorsed: true },
  { techniqueId: 'tech-002', proficiency: 'proficient', timesDrilled: 38, lastDrilled: daysAgo(9), coachEndorsed: true },
  { techniqueId: 'tech-003', proficiency: 'proficient', timesDrilled: 30, lastDrilled: daysAgo(30), coachEndorsed: true },
  { techniqueId: 'tech-004', proficiency: 'proficient', timesDrilled: 25, lastDrilled: daysAgo(18), coachEndorsed: true },
  { techniqueId: 'tech-005', proficiency: 'proficient', timesDrilled: 35, lastDrilled: daysAgo(35), coachEndorsed: true },
  { techniqueId: 'tech-011', proficiency: 'proficient', timesDrilled: 48, lastDrilled: daysAgo(20), coachEndorsed: true },
  { techniqueId: 'tech-013', proficiency: 'proficient', timesDrilled: 44, lastDrilled: daysAgo(20), coachEndorsed: true },
  { techniqueId: 'tech-015', proficiency: 'proficient', timesDrilled: 55, lastDrilled: daysAgo(2), coachEndorsed: true },
  { techniqueId: 'tech-017', proficiency: 'developing', timesDrilled: 18, lastDrilled: daysAgo(30), coachEndorsed: false },
  { techniqueId: 'tech-019', proficiency: 'proficient', timesDrilled: 60, lastDrilled: daysAgo(6), coachEndorsed: true },

  // Blue belt techniques (in progress)
  { techniqueId: 'tech-020', proficiency: 'proficient', timesDrilled: 28, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-021', proficiency: 'developing', timesDrilled: 22, lastDrilled: daysAgo(0), coachEndorsed: false },
  { techniqueId: 'tech-022', proficiency: 'developing', timesDrilled: 16, lastDrilled: daysAgo(14), coachEndorsed: false },
  { techniqueId: 'tech-024', proficiency: 'developing', timesDrilled: 18, lastDrilled: daysAgo(4), coachEndorsed: false },
  { techniqueId: 'tech-025', proficiency: 'learning', timesDrilled: 15, lastDrilled: daysAgo(9), coachEndorsed: false },
  { techniqueId: 'tech-026', proficiency: 'developing', timesDrilled: 12, lastDrilled: daysAgo(23), coachEndorsed: false },
  { techniqueId: 'tech-027', proficiency: 'developing', timesDrilled: 15, lastDrilled: daysAgo(11), coachEndorsed: false },
  { techniqueId: 'tech-028', proficiency: 'learning', timesDrilled: 12, lastDrilled: daysAgo(11), coachEndorsed: false },
  { techniqueId: 'tech-029', proficiency: 'developing', timesDrilled: 15, lastDrilled: daysAgo(16), coachEndorsed: false },
  { techniqueId: 'tech-031', proficiency: 'learning', timesDrilled: 12, lastDrilled: daysAgo(16), coachEndorsed: false },
  { techniqueId: 'tech-033', proficiency: 'developing', timesDrilled: 15, lastDrilled: daysAgo(23), coachEndorsed: false },

  // Purple belt techniques (exploring)
  { techniqueId: 'tech-037', proficiency: 'learning', timesDrilled: 5, lastDrilled: daysAgo(30), coachEndorsed: false },
  { techniqueId: 'tech-038', proficiency: 'learning', timesDrilled: 10, lastDrilled: daysAgo(2), coachEndorsed: false },
];

// ===========================================
// PURPLE BELT PROFILE: Sofia Rodriguez
// "The Grinder/Competitor" - Systems Thinking
// ===========================================

const purpleBeltUser: UsersUserProfile = {
  id: 'user-purple-001',
  role: 'practitioner',
  firstName: 'Sofia',
  lastName: 'Rodriguez',
  email: 'sofia.r@email.com',
  belt: 'purple',
  stripes: 1,
  trainingStartDate: yearsAgo(5) + '-03-10',
  homeGymId: 'gym-001',
  affiliatedGymIds: ['gym-001', 'gym-002'],
  weightClass: 'Feather (129-141 lbs)',
  goals: ['Black belt by 30', 'IBJJF Worlds podium', 'Open my own gym'],
  isPrivate: false,
};

const purpleBeltContextProfile: ContextUserProfile = {
  userId: 'user-purple-001',
  name: 'Sofia Rodriguez',
  belt: 'purple' as BeltLevel,
  stripes: 1,
  gym: { gymId: 'alliance-austin', gymName: 'Alliance BJJ Austin', isCustom: false, city: 'Austin', stateOrCountry: 'TX', affiliation: 'Alliance' },
  targetFrequency: 5,
  loggingPreference: 'voice',
  trainingGoals: ['competition', 'fitness', 'community'] as TrainingGoal[],
  experienceLevel: 'experienced' as const,
  trainingStartDate: yearsAgo(5) + '-03-10',
  currentBeltDate: monthsAgo(16),
  birthYear: 1997,
  notificationsEnabled: true,
  onboardingComplete: true,
  sessionCount: 892,
  createdAt: yearsAgo(5) + '-03-10',
  lastSessionAt: daysAgo(0),
  birthDate: '1997-08-12',
  gender: 'female',
  beltHistory: [],
  notifications: {
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  },
  skipCounts: {
    trainingStartDate: 0,
    currentBeltDate: 0,
    trainingGoals: 0,
    experienceLevel: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

const purpleBeltJournalEntries: JournalEntry[] = [
  {
    id: 'pb-entry-001',
    userId: 'user-purple-001',
    date: daysAgo(0),
    type: 'gi',
    duration: 120,
    techniques: [
      { techniqueId: 'tech-034', techniqueName: 'Berimbolo', reps: 25, notes: 'Working on the inversion timing' },
      { techniqueId: 'tech-035', techniqueName: 'Leg Drag from DLR', reps: 20, notes: 'Connecting it to my passing game' },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar', notes: 'Smooth transition from berimbolo to back to armbar' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'draw', notes: 'We were working positions, she gave me good looks' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Armbar', notes: 'He caught my transition. Need to tighten up.' },
    ],
    notes: 'Good comp prep session. DLR game is coming together. Need to chain the berimbolo to my leg drag better. Ricardo showed me the hole in my transition.',
    energyLevel: 5,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'pb-entry-002',
    userId: 'user-purple-001',
    date: daysAgo(1),
    type: 'nogi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-038', techniqueName: 'Heel Hook', reps: 30, notes: 'Inside and outside variations' },
      { techniqueId: 'tech-039', techniqueName: 'Inside Sankaku', reps: 25, notes: 'Entries from single leg X' },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Heel Hook' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Heel Hook' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'submission-win', submissionType: 'Inside Heel Hook', notes: 'Finally caught her!' },
      { partnerId: 'coach-002', partnerName: 'Amanda F.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Heel Hook', notes: 'She showed me a new entry I need to drill' },
    ],
    notes: 'Leg lock day with Amanda. My saddle control is getting good. 3-1 today. Elena was surprised I caught her.',
    energyLevel: 5,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'pb-entry-003',
    userId: 'user-purple-001',
    date: daysAgo(2),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-036', techniqueName: 'X-Guard Sweep', reps: 20 },
      { techniqueId: 'tech-041', techniqueName: 'Arm Drag to Back', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'RNC', notes: 'Teaching roll - showed him escapes after' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'draw', notes: 'Competitive but neither submitted' },
    ],
    notes: 'Open guard focus. X-guard to SLX is money. Helped Jake with his escapes - he\'s improving fast.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'pb-entry-004',
    userId: 'user-purple-001',
    date: daysAgo(3),
    type: 'openmat',
    duration: 150,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'RNC', notes: 'She got my back clean' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Cross Choke' },
      { partnerId: 'user-006', partnerName: 'Mike S.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-002', partnerName: 'David M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar' },
    ],
    notes: 'Long open mat. 4-2 today. Brown and black belts still expose my holes but I\'m getting closer.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'pb-entry-005',
    userId: 'user-purple-001',
    date: daysAgo(5),
    type: 'gi',
    duration: 120,
    techniques: [
      { techniqueId: 'tech-040', techniqueName: 'Knee Bar', reps: 20 },
      { techniqueId: 'tech-037', techniqueName: 'Straight Ankle Lock', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Knee Bar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Straight Ankle Lock' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'draw' },
    ],
    notes: 'Leg lock finishing day. Need to be more patient on the knee bar. Elena is tough to leg lock.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'pb-entry-006',
    userId: 'user-purple-001',
    date: daysAgo(6),
    type: 'nogi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-042', techniqueName: 'Wrestling Up', reps: 25 },
      { techniqueId: 'tech-017', techniqueName: 'Double Leg Takedown', reps: 20 },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'points-win', notes: '6-2 on points' },
      { partnerId: 'coach-002', partnerName: 'Amanda F.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Armbar' },
    ],
    notes: 'Wrestling focus today. Beat Elena on points! Amanda still crushes me but I lasted longer.',
    energyLevel: 5,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'pb-entry-007',
    userId: 'user-purple-001',
    date: daysAgo(7),
    type: 'gi',
    duration: 120,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Kimura' },
    ],
    notes: 'Taught the fundamentals class today. Jake is getting better - gave him trouble on purpose to work his escapes. Elena caught me being lazy.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'pb-entry-008',
    userId: 'user-purple-001',
    date: daysAgo(9),
    type: 'competition',
    duration: 240,
    techniques: [],
    sparringRounds: [
      { partnerId: 'comp-001', partnerName: 'Opponent 1', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Armbar', notes: 'First match - caught her from closed guard' },
      { partnerId: 'comp-002', partnerName: 'Opponent 2', partnerBelt: 'purple', outcome: 'points-win', notes: 'Semis - 8-2 on points, dominated on top' },
      { partnerId: 'comp-003', partnerName: 'Opponent 3', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Triangle', notes: 'GOLD! Finals - triangle from guard' },
    ],
    notes: 'IBJJF Austin Open - GOLD! Submitted 2 of 3 opponents. Game plan worked perfectly. Time to focus on Pans.',
    energyLevel: 5,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'pb-entry-009',
    userId: 'user-purple-001',
    date: daysAgo(12),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-022', techniqueName: 'Leg Drag Pass', reps: 20 },
      { techniqueId: 'tech-020', techniqueName: 'Toreando Pass', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'Light day before comp. Focused on passing. Feeling sharp.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'pb-entry-010',
    userId: 'user-purple-001',
    date: daysAgo(14),
    type: 'nogi',
    duration: 120,
    techniques: [
      { techniqueId: 'tech-038', techniqueName: 'Heel Hook', reps: 25 },
      { techniqueId: 'tech-039', techniqueName: 'Inside Sankaku', reps: 20 },
    ],
    sparringRounds: [
      { partnerId: 'user-004', partnerName: 'Elena K.', partnerBelt: 'brown', outcome: 'draw' },
      { partnerId: 'coach-002', partnerName: 'Amanda F.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Heel Hook' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Heel Hook' },
    ],
    notes: 'Leg lock intensive with Amanda. She\'s helping me prep for no-gi worlds next year.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
];

const purpleBeltTrainingStats = {
  totalSessions: 892,
  totalHours: 1450,
  currentStreak: 12,
  longestStreak: 45,
  thisMonth: {
    sessions: 22,
    hours: 38,
    techniques: 12,
    sparringRounds: 68,
    targetSessions: 20,
  },
  thisYear: {
    sessions: 285,
    hours: 465,
  },
  byType: {
    gi: 520,
    nogi: 245,
    openmat: 92,
    private: 15,
    competition: 20,
  },
  sparringRecord: {
    wins: 612,
    losses: 245,
    draws: 128,
  },
  submissionsMade: {
    'Armbar': 125,
    'Triangle': 98,
    'RNC': 85,
    'Heel Hook': 72,
    'Bow and Arrow': 45,
    'Kimura': 38,
    'Knee Bar': 28,
    'Guillotine': 42,
    'Straight Ankle': 35,
    'Other': 44,
  },
  submissionsReceived: {
    'Armbar': 48,
    'RNC': 42,
    'Triangle': 35,
    'Heel Hook': 38,
    'Kimura': 22,
    'Choke': 32,
    'Other': 28,
  },
};

const purpleBeltHistory: BeltPromotion[] = [
  { id: 'pb-promo-001', userId: 'user-purple-001', fromBelt: null, fromStripes: 0, toBelt: 'white', toStripes: 0, date: yearsAgo(5) + '-03-10', promotedBy: 'coach-001', notes: 'Started training' },
  { id: 'pb-promo-002', userId: 'user-purple-001', fromBelt: 'white', fromStripes: 0, toBelt: 'white', toStripes: 4, date: yearsAgo(4) + '-02-15', promotedBy: 'coach-001', notes: 'Fast track through white belt' },
  { id: 'pb-promo-003', userId: 'user-purple-001', fromBelt: 'white', fromStripes: 4, toBelt: 'blue', toStripes: 0, date: yearsAgo(4) + '-06-20', promotedBy: 'coach-001', notes: 'Blue belt in 15 months - competitor track' },
  { id: 'pb-promo-004', userId: 'user-purple-001', fromBelt: 'blue', fromStripes: 0, toBelt: 'blue', toStripes: 4, date: yearsAgo(2) + '-04-10', promotedBy: 'coach-001', notes: 'Dominated at blue belt competitions' },
  { id: 'pb-promo-005', userId: 'user-purple-001', fromBelt: 'blue', fromStripes: 4, toBelt: 'purple', toStripes: 0, date: monthsAgo(16), promotedBy: 'coach-001', notes: 'Purple belt - world class competitor' },
  { id: 'pb-promo-006', userId: 'user-purple-001', fromBelt: 'purple', fromStripes: 0, toBelt: 'purple', toStripes: 1, date: monthsAgo(4), promotedBy: 'coach-001', notes: 'Developing coaching abilities' },
];

const purpleBeltRequirements: BeltRequirement[] = [
  { id: 'pb-req-001', name: 'Combination Attacks', category: 'technique', description: 'Demonstrate 5 attack chains from different positions', targetValue: 5, currentValue: 4, isComplete: false, coachVerified: false },
  { id: 'pb-req-002', name: 'Open Guard Mastery', category: 'technique', description: 'Show proficiency in 3 open guard systems', targetValue: 3, currentValue: 3, isComplete: true, coachVerified: true },
  { id: 'pb-req-003', name: 'Leg Lock System', category: 'technique', description: 'Demonstrate complete leg lock attacks and defenses', targetValue: 1, currentValue: 1, isComplete: true, coachVerified: true },
  { id: 'pb-req-004', name: 'Guard Passing System', category: 'technique', description: 'Show systematic approach to passing all guards', targetValue: 1, currentValue: 1, isComplete: true, coachVerified: true },
  { id: 'pb-req-005', name: 'Time at Belt', category: 'attendance', description: 'Minimum 24 months at purple belt', targetValue: 24, currentValue: 16, isComplete: false, coachVerified: false },
  { id: 'pb-req-006', name: 'Teaching Experience', category: 'knowledge', description: 'Teach at least 20 classes', targetValue: 20, currentValue: 15, isComplete: false, coachVerified: false },
  { id: 'pb-req-007', name: 'Competition Record', category: 'competition', description: 'Medal at IBJJF-level event', targetValue: 1, currentValue: 1, isComplete: true, coachVerified: true },
];

const purpleBeltPositionMastery: PositionMastery[] = [
  { position: 'Closed Guard', attackScore: 92, defenseScore: 88, overallScore: 90 },
  { position: 'Open Guard', attackScore: 95, defenseScore: 85, overallScore: 90 },
  { position: 'Half Guard', attackScore: 88, defenseScore: 85, overallScore: 86 },
  { position: 'Mount', attackScore: 90, defenseScore: 82, overallScore: 86 },
  { position: 'Side Control', attackScore: 88, defenseScore: 78, overallScore: 83 },
  { position: 'Back', attackScore: 94, defenseScore: 75, overallScore: 85 },
  { position: 'Turtle', attackScore: 82, defenseScore: 85, overallScore: 84 },
  { position: 'Standing', attackScore: 78, defenseScore: 80, overallScore: 79 },
];

const purpleBeltMilestones: Milestone[] = [
  { id: 'pb-mile-001', type: 'promotion', name: 'Purple Belt', description: 'Earned purple belt rank', earnedAt: monthsAgo(16), icon: 'Belt' },
  { id: 'pb-mile-002', type: 'sessions', name: 'Thousand Hours', description: 'Over 1000 hours on the mat', earnedAt: monthsAgo(8), icon: 'Clock' },
  { id: 'pb-mile-003', type: 'competition', name: 'IBJJF Gold', description: 'Won gold at IBJJF event', earnedAt: daysAgo(9), icon: 'Medal' },
  { id: 'pb-mile-004', type: 'streak', name: 'Month Warrior', description: 'Trained 30 days in a row', earnedAt: monthsAgo(6), icon: 'Flame' },
  { id: 'pb-mile-005', type: 'technique', name: 'Leg Lock Specialist', description: 'Landed 50 leg locks in competition/sparring', earnedAt: monthsAgo(3), icon: 'Award' },
  { id: 'pb-mile-006', type: 'submission', name: 'Submission Hunter', description: '500 total submissions in sparring', earnedAt: monthsAgo(4), icon: 'Target' },
];

const purpleBeltGoals: Goal[] = [
  { id: 'pb-goal-001', userId: 'user-purple-001', type: 'promotion', title: 'Earn Brown Belt', description: 'Complete requirements and earn brown belt', targetDate: monthsAgo(-10), isComplete: false, createdAt: monthsAgo(16), coachVisible: true },
  { id: 'pb-goal-002', userId: 'user-purple-001', type: 'competition', title: 'Pans Podium', description: 'Medal at IBJJF Pan Americans', targetDate: monthsAgo(-3), isComplete: false, createdAt: monthsAgo(6), coachVisible: true },
  { id: 'pb-goal-003', userId: 'user-purple-001', type: 'technique', title: 'Master Berimbolo System', description: 'Complete berimbolo attack chain from all entries', isComplete: false, createdAt: monthsAgo(4), coachVisible: true },
  { id: 'pb-goal-004', userId: 'user-purple-001', type: 'attendance', title: 'Train 5x per Week', description: 'Maintain 5 sessions per week for competition prep', targetValue: 20, currentValue: 18, isComplete: false, createdAt: monthsAgo(1), coachVisible: true },
];

const purpleBeltTechniqueProgress: TechniqueProgress[] = [
  // White belt - all mastered
  { techniqueId: 'tech-001', proficiency: 'advanced', timesDrilled: 180, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-002', proficiency: 'advanced', timesDrilled: 165, lastDrilled: daysAgo(2), coachEndorsed: true },
  { techniqueId: 'tech-015', proficiency: 'advanced', timesDrilled: 200, lastDrilled: daysAgo(4), coachEndorsed: true },
  { techniqueId: 'tech-017', proficiency: 'proficient', timesDrilled: 85, lastDrilled: daysAgo(6), coachEndorsed: true },

  // Blue belt - all proficient/advanced
  { techniqueId: 'tech-020', proficiency: 'advanced', timesDrilled: 120, lastDrilled: daysAgo(12), coachEndorsed: true },
  { techniqueId: 'tech-021', proficiency: 'advanced', timesDrilled: 110, lastDrilled: daysAgo(14), coachEndorsed: true },
  { techniqueId: 'tech-022', proficiency: 'advanced', timesDrilled: 95, lastDrilled: daysAgo(12), coachEndorsed: true },
  { techniqueId: 'tech-026', proficiency: 'advanced', timesDrilled: 88, lastDrilled: daysAgo(7), coachEndorsed: true },
  { techniqueId: 'tech-033', proficiency: 'advanced', timesDrilled: 92, lastDrilled: daysAgo(3), coachEndorsed: true },

  // Purple belt techniques - specialty
  { techniqueId: 'tech-034', proficiency: 'advanced', timesDrilled: 85, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-035', proficiency: 'advanced', timesDrilled: 78, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-036', proficiency: 'proficient', timesDrilled: 65, lastDrilled: daysAgo(2), coachEndorsed: true },
  { techniqueId: 'tech-037', proficiency: 'advanced', timesDrilled: 95, lastDrilled: daysAgo(5), coachEndorsed: true },
  { techniqueId: 'tech-038', proficiency: 'advanced', timesDrilled: 120, lastDrilled: daysAgo(1), coachEndorsed: true },
  { techniqueId: 'tech-039', proficiency: 'advanced', timesDrilled: 105, lastDrilled: daysAgo(1), coachEndorsed: true },
  { techniqueId: 'tech-040', proficiency: 'proficient', timesDrilled: 55, lastDrilled: daysAgo(5), coachEndorsed: true },
  { techniqueId: 'tech-041', proficiency: 'proficient', timesDrilled: 48, lastDrilled: daysAgo(2), coachEndorsed: true },
  { techniqueId: 'tech-042', proficiency: 'proficient', timesDrilled: 52, lastDrilled: daysAgo(6), coachEndorsed: true },

  // Brown belt - exploring
  { techniqueId: 'tech-043', proficiency: 'learning', timesDrilled: 15, lastDrilled: daysAgo(14), coachEndorsed: false },
  { techniqueId: 'tech-044', proficiency: 'learning', timesDrilled: 12, lastDrilled: daysAgo(21), coachEndorsed: false },
];

// ===========================================
// BROWN BELT PROFILE: Elena Kim
// "The Veteran" - Refinement Mode
// ===========================================

const brownBeltUser: UsersUserProfile = {
  id: 'user-brown-001',
  role: 'practitioner',
  firstName: 'Elena',
  lastName: 'Kim',
  email: 'elena.k@email.com',
  belt: 'brown',
  stripes: 2,
  trainingStartDate: yearsAgo(7) + '-08-20',
  homeGymId: 'gym-001',
  affiliatedGymIds: ['gym-001'],
  weightClass: 'Light (141-154 lbs)',
  goals: ['Black belt by next year', 'Develop teaching career', 'Keep competing'],
  isPrivate: false,
};

const brownBeltContextProfile: ContextUserProfile = {
  userId: 'user-brown-001',
  name: 'Elena Kim',
  belt: 'brown' as BeltLevel,
  stripes: 2,
  gym: { gymId: 'alliance-austin', gymName: 'Alliance BJJ Austin', isCustom: false, city: 'Austin', stateOrCountry: 'TX', affiliation: 'Alliance' },
  targetFrequency: 4,
  loggingPreference: 'voice',
  trainingGoals: ['competition', 'mental', 'community'] as TrainingGoal[],
  experienceLevel: 'experienced' as const,
  trainingStartDate: yearsAgo(7) + '-08-20',
  currentBeltDate: monthsAgo(18),
  birthYear: 1987,
  notificationsEnabled: true,
  onboardingComplete: true,
  sessionCount: 1456,
  createdAt: yearsAgo(7) + '-08-20',
  lastSessionAt: daysAgo(0),
  birthDate: '1987-11-05',
  gender: 'female',
  beltHistory: [],
  notifications: {
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  },
  skipCounts: {
    trainingStartDate: 0,
    currentBeltDate: 0,
    trainingGoals: 0,
    experienceLevel: 0,
    birthYear: 0,
  },
  lastAskedSession: {},
};

const brownBeltJournalEntries: JournalEntry[] = [
  {
    id: 'brb-entry-001',
    userId: 'user-brown-001',
    date: daysAgo(0),
    type: 'gi',
    duration: 120,
    techniques: [
      { techniqueId: 'tech-049', techniqueName: 'Pressure Passing System', reps: 0, notes: 'Worked on the chain: knee cut to leg drag to back take' },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Bow and Arrow', notes: 'Showed him the mistake after' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Kimura', notes: 'She almost caught me with a leg lock' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'draw', notes: 'He was testing my passing. Good flow roll.' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'positional', notes: 'Teaching roll - focused on his guard retention' },
    ],
    notes: 'Good training day. Pressure passing is where I need to be. Ricardo gave me good feedback on my weight distribution. Helped Jake with guard retention after.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'brb-entry-002',
    userId: 'user-brown-001',
    date: daysAgo(1),
    type: 'gi',
    duration: 90,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'draw', notes: 'She\'s getting really good' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
    ],
    notes: 'Taught the advanced class today. Topic was back retention and finishes. Sofia gave me a tough round - her leg locks are scary.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-003',
    userId: 'user-brown-001',
    date: daysAgo(3),
    type: 'nogi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-038', techniqueName: 'Heel Hook Defense', reps: 20, notes: 'Working on the 411 escape' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Inside Heel Hook', notes: 'She caught me. Fair play.' },
      { partnerId: 'coach-002', partnerName: 'Amanda F.', partnerBelt: 'black', outcome: 'draw', notes: 'Good exchanges. Learning her system.' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'No-gi with Amanda. Sofia caught me with that heel hook - she\'s getting dangerous. Need to sharpen my leg lock defense.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-004',
    userId: 'user-brown-001',
    date: daysAgo(5),
    type: 'openmat',
    duration: 150,
    techniques: [],
    sparringRounds: [
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Cross Choke', notes: 'He gave me honest rounds today' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar', notes: 'Teaching flow roll' },
      { partnerId: 'user-006', partnerName: 'David M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'RNC', notes: 'Teaching roll - showed him the escape after' },
    ],
    notes: 'Long open mat. Ricardo is still levels above me but I feel closer. 5-1 today. Spent time with the white belts after.',
    energyLevel: 3,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-005',
    userId: 'user-brown-001',
    date: daysAgo(7),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-047', techniqueName: 'Worm Guard', reps: 15, notes: 'Adding this to my lapel game' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'draw', notes: 'Competitive roll' },
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'Lapel guard day. Worm guard is interesting but not my style. Prefer the classic lapel lasso.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-006',
    userId: 'user-brown-001',
    date: daysAgo(8),
    type: 'gi',
    duration: 120,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Bow and Arrow' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Armbar' },
    ],
    notes: 'Taught fundamentals today then trained. Ricardo talked to me about black belt preparation - feels close.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'brb-entry-007',
    userId: 'user-brown-001',
    date: daysAgo(10),
    type: 'nogi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-043', techniqueName: 'Crab Ride to Back', reps: 20, notes: 'Refining the transition' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'RNC' },
      { partnerId: 'coach-002', partnerName: 'Amanda F.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Heel Hook' },
    ],
    notes: 'Crab ride work. Got Sofia with the crab to back transition. Amanda\'s leg locks are on another level.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-008',
    userId: 'user-brown-001',
    date: daysAgo(12),
    type: 'openmat',
    duration: 120,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Kimura' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'draw' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'positional', notes: 'Worked his sweeps with him' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
    ],
    notes: 'Solid open mat. Sofia and I had a great competitive roll. Spent quality time with Jake on his sweeps.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'brb-entry-009',
    userId: 'user-brown-001',
    date: daysAgo(14),
    type: 'competition',
    duration: 180,
    techniques: [],
    sparringRounds: [
      { partnerId: 'comp-001', partnerName: 'Opponent 1', partnerBelt: 'brown', outcome: 'submission-win', submissionType: 'Armbar', notes: 'Caught her from mount' },
      { partnerId: 'comp-002', partnerName: 'Opponent 2', partnerBelt: 'brown', outcome: 'points-win', notes: '6-0, dominated on top' },
      { partnerId: 'comp-003', partnerName: 'Opponent 3', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Bow and Arrow', notes: 'SILVER - she caught me in the last minute' },
    ],
    notes: 'Master Worlds - SILVER. Lost in finals by bow and arrow with 30 seconds left. Heartbreaking but good experience. Next time.',
    energyLevel: 5,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'brb-entry-010',
    userId: 'user-brown-001',
    date: daysAgo(17),
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-050', techniqueName: 'Submission Chains', reps: 0, notes: 'Mount attack flow: americana to armbar to triangle' },
    ],
    sparringRounds: [
      { partnerId: 'user-001', partnerName: 'Marcus C.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-002', partnerName: 'Sofia R.', partnerBelt: 'purple', outcome: 'submission-win', submissionType: 'Triangle' },
    ],
    notes: 'Light comp prep. Focused on chaining submissions from mount. Feeling confident.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
];

const brownBeltTrainingStats = {
  totalSessions: 1456,
  totalHours: 2450,
  currentStreak: 8,
  longestStreak: 60,
  thisMonth: {
    sessions: 16,
    hours: 26,
    techniques: 6,
    sparringRounds: 52,
    targetSessions: 16,
  },
  thisYear: {
    sessions: 210,
    hours: 355,
  },
  byType: {
    gi: 920,
    nogi: 325,
    openmat: 168,
    private: 23,
    competition: 20,
  },
  sparringRecord: {
    wins: 1124,
    losses: 312,
    draws: 185,
  },
  submissionsMade: {
    'Armbar': 245,
    'Triangle': 185,
    'RNC': 165,
    'Bow and Arrow': 125,
    'Kimura': 95,
    'Heel Hook': 45,
    'Cross Choke': 88,
    'Guillotine': 72,
    'Other': 104,
  },
  submissionsReceived: {
    'Armbar': 65,
    'Triangle': 52,
    'RNC': 48,
    'Heel Hook': 42,
    'Bow and Arrow': 38,
    'Cross Choke': 35,
    'Other': 32,
  },
};

const brownBeltHistory: BeltPromotion[] = [
  { id: 'brb-promo-001', userId: 'user-brown-001', fromBelt: null, fromStripes: 0, toBelt: 'white', toStripes: 0, date: yearsAgo(7) + '-08-20', promotedBy: 'coach-001', notes: 'Started training' },
  { id: 'brb-promo-002', userId: 'user-brown-001', fromBelt: 'white', fromStripes: 0, toBelt: 'blue', toStripes: 0, date: yearsAgo(6) + '-02-15', promotedBy: 'coach-001', notes: 'Blue belt in 18 months' },
  { id: 'brb-promo-003', userId: 'user-brown-001', fromBelt: 'blue', fromStripes: 0, toBelt: 'purple', toStripes: 0, date: yearsAgo(4) + '-06-20', promotedBy: 'coach-001', notes: 'Purple belt after 2.5 years at blue' },
  { id: 'brb-promo-004', userId: 'user-brown-001', fromBelt: 'purple', fromStripes: 0, toBelt: 'purple', toStripes: 4, date: yearsAgo(2) + '-04-10', promotedBy: 'coach-001', notes: 'Developed complete game' },
  { id: 'brb-promo-005', userId: 'user-brown-001', fromBelt: 'purple', fromStripes: 4, toBelt: 'brown', toStripes: 0, date: monthsAgo(18), promotedBy: 'coach-001', notes: 'Brown belt - final approach' },
  { id: 'brb-promo-006', userId: 'user-brown-001', fromBelt: 'brown', fromStripes: 0, toBelt: 'brown', toStripes: 1, date: monthsAgo(10), promotedBy: 'coach-001', notes: 'Teaching excellence' },
  { id: 'brb-promo-007', userId: 'user-brown-001', fromBelt: 'brown', fromStripes: 1, toBelt: 'brown', toStripes: 2, date: monthsAgo(3), promotedBy: 'coach-001', notes: 'Competition success at Masters' },
];

const brownBeltRequirements: BeltRequirement[] = [
  { id: 'brb-req-001', name: 'Complete Game', category: 'technique', description: 'Demonstrate proficiency in all major positions', targetValue: 1, currentValue: 1, isComplete: true, coachVerified: true },
  { id: 'brb-req-002', name: 'Signature Techniques', category: 'technique', description: 'Have 3-5 techniques that work at all levels', targetValue: 5, currentValue: 5, isComplete: true, coachVerified: true },
  { id: 'brb-req-003', name: 'Teaching Excellence', category: 'knowledge', description: 'Lead 50+ classes independently', targetValue: 50, currentValue: 45, isComplete: false, coachVerified: false },
  { id: 'brb-req-004', name: 'Time at Belt', category: 'attendance', description: 'Minimum 12 months at brown belt', targetValue: 12, currentValue: 18, isComplete: true, coachVerified: true },
  { id: 'brb-req-005', name: 'Competition at Brown', category: 'competition', description: 'Compete at least 3 times at brown belt', targetValue: 3, currentValue: 4, isComplete: true, coachVerified: true },
  { id: 'brb-req-006', name: 'Student Development', category: 'knowledge', description: 'Help develop at least 2 students to next belt', targetValue: 2, currentValue: 1, isComplete: false, coachVerified: false },
];

const brownBeltPositionMastery: PositionMastery[] = [
  { position: 'Closed Guard', attackScore: 95, defenseScore: 92, overallScore: 94 },
  { position: 'Open Guard', attackScore: 92, defenseScore: 90, overallScore: 91 },
  { position: 'Half Guard', attackScore: 94, defenseScore: 92, overallScore: 93 },
  { position: 'Mount', attackScore: 96, defenseScore: 88, overallScore: 92 },
  { position: 'Side Control', attackScore: 95, defenseScore: 85, overallScore: 90 },
  { position: 'Back', attackScore: 97, defenseScore: 82, overallScore: 90 },
  { position: 'Turtle', attackScore: 90, defenseScore: 92, overallScore: 91 },
  { position: 'Standing', attackScore: 85, defenseScore: 88, overallScore: 86 },
];

const brownBeltMilestones: Milestone[] = [
  { id: 'brb-mile-001', type: 'promotion', name: 'Brown Belt', description: 'Earned brown belt rank', earnedAt: monthsAgo(18), icon: 'Belt' },
  { id: 'brb-mile-002', type: 'sessions', name: 'Thousand Sessions', description: 'Over 1000 training sessions', earnedAt: yearsAgo(1), icon: 'Target' },
  { id: 'brb-mile-003', type: 'competition', name: 'Masters Medal', description: 'Medaled at Master Worlds', earnedAt: daysAgo(14), icon: 'Medal' },
  { id: 'brb-mile-004', type: 'technique', name: 'Complete Game', description: 'Achieved proficiency in all positions', earnedAt: monthsAgo(20), icon: 'Award' },
  { id: 'brb-mile-005', type: 'streak', name: 'Two Month Warrior', description: 'Trained 60 days in a row', earnedAt: yearsAgo(2), icon: 'Flame' },
  { id: 'brb-mile-006', type: 'submission', name: 'Thousand Taps', description: '1000 submissions in sparring', earnedAt: monthsAgo(6), icon: 'Zap' },
];

const brownBeltGoals: Goal[] = [
  { id: 'brb-goal-001', userId: 'user-brown-001', type: 'promotion', title: 'Earn Black Belt', description: 'Complete the journey and earn black belt', targetDate: monthsAgo(-6), isComplete: false, createdAt: monthsAgo(18), coachVisible: true },
  { id: 'brb-goal-002', userId: 'user-brown-001', type: 'technique', title: 'Eliminate Weak Points', description: 'Shore up remaining gaps in game', isComplete: false, createdAt: monthsAgo(12), coachVisible: true },
  { id: 'brb-goal-003', userId: 'user-brown-001', type: 'competition', title: 'Win Masters Worlds', description: 'Gold medal at Master Worlds', targetDate: monthsAgo(-12), isComplete: false, createdAt: monthsAgo(6), coachVisible: true },
  { id: 'brb-goal-004', userId: 'user-brown-001', type: 'attendance', title: 'Teach 50 Classes', description: 'Complete teaching requirement for black belt', targetValue: 50, currentValue: 45, isComplete: false, createdAt: monthsAgo(12), coachVisible: true },
];

const brownBeltTechniqueProgress: TechniqueProgress[] = [
  // All white/blue belt techniques mastered
  { techniqueId: 'tech-001', proficiency: 'advanced', timesDrilled: 320, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-002', proficiency: 'advanced', timesDrilled: 290, lastDrilled: daysAgo(1), coachEndorsed: true },
  { techniqueId: 'tech-015', proficiency: 'advanced', timesDrilled: 350, lastDrilled: daysAgo(4), coachEndorsed: true },
  { techniqueId: 'tech-020', proficiency: 'advanced', timesDrilled: 245, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-026', proficiency: 'advanced', timesDrilled: 185, lastDrilled: daysAgo(5), coachEndorsed: true },

  // Purple belt - all advanced
  { techniqueId: 'tech-034', proficiency: 'proficient', timesDrilled: 85, lastDrilled: daysAgo(14), coachEndorsed: true },
  { techniqueId: 'tech-037', proficiency: 'advanced', timesDrilled: 145, lastDrilled: daysAgo(7), coachEndorsed: true },
  { techniqueId: 'tech-038', proficiency: 'proficient', timesDrilled: 95, lastDrilled: daysAgo(3), coachEndorsed: true },
  { techniqueId: 'tech-040', proficiency: 'advanced', timesDrilled: 110, lastDrilled: daysAgo(10), coachEndorsed: true },

  // Brown belt techniques - specialty
  { techniqueId: 'tech-043', proficiency: 'proficient', timesDrilled: 65, lastDrilled: daysAgo(10), coachEndorsed: true },
  { techniqueId: 'tech-044', proficiency: 'proficient', timesDrilled: 55, lastDrilled: daysAgo(21), coachEndorsed: true },
  { techniqueId: 'tech-045', proficiency: 'developing', timesDrilled: 28, lastDrilled: daysAgo(30), coachEndorsed: false },
  { techniqueId: 'tech-046', proficiency: 'proficient', timesDrilled: 42, lastDrilled: daysAgo(14), coachEndorsed: true },
  { techniqueId: 'tech-047', proficiency: 'developing', timesDrilled: 15, lastDrilled: daysAgo(7), coachEndorsed: false },

  // Black belt concepts - exploring
  { techniqueId: 'tech-048', proficiency: 'developing', timesDrilled: 35, lastDrilled: daysAgo(3), coachEndorsed: false },
  { techniqueId: 'tech-049', proficiency: 'proficient', timesDrilled: 48, lastDrilled: daysAgo(0), coachEndorsed: true },
  { techniqueId: 'tech-050', proficiency: 'developing', timesDrilled: 25, lastDrilled: daysAgo(17), coachEndorsed: false },
];

// ===========================================
// EXPORT ALL PROFILES
// ===========================================

export const whiteBeltProfile: MockProfile = {
  id: 'user-white-001',
  key: 'white',
  displayName: 'David Morrison (White Belt 3 Stripes)',
  user: whiteBeltUser,
  contextProfile: whiteBeltContextProfile,
  journalEntries: whiteBeltJournalEntries,
  trainingStats: whiteBeltTrainingStats,
  beltHistory: whiteBeltHistory,
  beltRequirements: whiteBeltRequirements,
  positionMastery: whiteBeltPositionMastery,
  milestones: whiteBeltMilestones,
  goals: whiteBeltGoals,
  techniqueProgress: whiteBeltTechniqueProgress,
  progressSummary: {
    currentBelt: 'white',
    currentStripes: 3,
    timeAtBelt: '10 months',
    nextBelt: 'blue',
    overallCompletion: 42,
    requirementsComplete: 1,
    requirementsTotal: 6,
    estimatedTimeToPromotion: '4-6 months',
    strengths: ['Escapes', 'Consistency', 'RNC'],
    weaknesses: ['Sweeps', 'Guard Passing', 'Takedowns'],
    coachFeedbackCount: 8,
    recentFocusAreas: ['Mount Escapes', 'Side Control Escapes'],
  },
  styleFingerprint: {
    dimensions: [
      { id: 'guard', label: 'Guard Game', shortLabel: 'Guard', value: 28, description: 'Bottom position offense - sweeps and submissions from guard' },
      { id: 'passing', label: 'Passing', shortLabel: 'Pass', value: 22, description: "Ability to navigate and pass opponent's guard" },
      { id: 'top', label: 'Top Control', shortLabel: 'Top', value: 38, description: 'Dominance from mount, side control, and knee on belly' },
      { id: 'back', label: 'Back Attacks', shortLabel: 'Back', value: 35, description: 'Taking the back and finishing from back control' },
      { id: 'takedowns', label: 'Takedowns', shortLabel: 'TD', value: 15, description: 'Standing game - wrestling, judo, and guard pulls' },
      { id: 'leglocks', label: 'Leg Locks', shortLabel: 'Legs', value: 8, description: 'Modern leg attack game - heel hooks, knee bars, ankle locks' },
    ],
    archetype: {
      name: 'DEVELOPING',
      description: 'Game still taking shape. Building fundamentals one class at a time.',
      icon: 'balanced',
    },
    dominantStyle: 'Top Control',
    weakestArea: 'Leg Locks',
    balanceScore: 35,
  },
};

export const blueBeltProfile: MockProfile = {
  id: 'user-blue-001',
  key: 'blue',
  displayName: 'Marcus Chen (Blue Belt 2 Stripes)',
  user: blueBeltUser,
  contextProfile: blueBeltContextProfile,
  journalEntries: blueBeltJournalEntries,
  trainingStats: blueBeltTrainingStats,
  beltHistory: blueBeltHistory,
  beltRequirements: blueBeltRequirements,
  positionMastery: blueBeltPositionMastery,
  milestones: blueBeltMilestones,
  goals: blueBeltGoals,
  techniqueProgress: blueBeltTechniqueProgress,
  progressSummary: {
    currentBelt: 'blue',
    currentStripes: 2,
    timeAtBelt: '14 months',
    nextBelt: 'purple',
    overallCompletion: 68,
    requirementsComplete: 4,
    requirementsTotal: 9,
    estimatedTimeToPromotion: '8-12 months',
    strengths: ['Closed Guard', 'Back Control', 'Submissions'],
    weaknesses: ['Takedowns', 'Standing', 'Open Guard'],
    coachFeedbackCount: 15,
    recentFocusAreas: ['Guard Passing', 'Leg Locks', 'Half Guard'],
  },
  styleFingerprint: {
    dimensions: [
      { id: 'guard', label: 'Guard Game', shortLabel: 'Guard', value: 72, description: 'Bottom position offense - sweeps and submissions from guard' },
      { id: 'passing', label: 'Passing', shortLabel: 'Pass', value: 48, description: "Ability to navigate and pass opponent's guard" },
      { id: 'top', label: 'Top Control', shortLabel: 'Top', value: 55, description: 'Dominance from mount, side control, and knee on belly' },
      { id: 'back', label: 'Back Attacks', shortLabel: 'Back', value: 68, description: 'Taking the back and finishing from back control' },
      { id: 'takedowns', label: 'Takedowns', shortLabel: 'TD', value: 28, description: 'Standing game - wrestling, judo, and guard pulls' },
      { id: 'leglocks', label: 'Leg Locks', shortLabel: 'Legs', value: 42, description: 'Modern leg attack game - heel hooks, knee bars, ankle locks' },
    ],
    archetype: {
      name: 'GUARD PLAYER',
      description: 'Dangerous from bottom. Sweeps and submits from guard with precision.',
      icon: 'guard',
      famousExamples: ['Marcelo Garcia', 'Keenan Cornelius', 'Romulo Barral'],
    },
    dominantStyle: 'Guard Game',
    weakestArea: 'Takedowns',
    balanceScore: 52,
  },
};

export const purpleBeltProfile: MockProfile = {
  id: 'user-purple-001',
  key: 'purple',
  displayName: 'Sofia Rodriguez (Purple Belt 1 Stripe)',
  user: purpleBeltUser,
  contextProfile: purpleBeltContextProfile,
  journalEntries: purpleBeltJournalEntries,
  trainingStats: purpleBeltTrainingStats,
  beltHistory: purpleBeltHistory,
  beltRequirements: purpleBeltRequirements,
  positionMastery: purpleBeltPositionMastery,
  milestones: purpleBeltMilestones,
  goals: purpleBeltGoals,
  techniqueProgress: purpleBeltTechniqueProgress,
  progressSummary: {
    currentBelt: 'purple',
    currentStripes: 1,
    timeAtBelt: '16 months',
    nextBelt: 'brown',
    overallCompletion: 78,
    requirementsComplete: 4,
    requirementsTotal: 7,
    estimatedTimeToPromotion: '10-14 months',
    strengths: ['Open Guard', 'Leg Locks', 'Back Takes', 'Competition'],
    weaknesses: ['Wrestling', 'Pressure Passing'],
    coachFeedbackCount: 32,
    recentFocusAreas: ['Berimbolo', 'Competition Prep', 'DLR System'],
  },
  styleFingerprint: {
    dimensions: [
      { id: 'guard', label: 'Guard Game', shortLabel: 'Guard', value: 85, description: 'Bottom position offense - sweeps and submissions from guard' },
      { id: 'passing', label: 'Passing', shortLabel: 'Pass', value: 52, description: "Ability to navigate and pass opponent's guard" },
      { id: 'top', label: 'Top Control', shortLabel: 'Top', value: 58, description: 'Dominance from mount, side control, and knee on belly' },
      { id: 'back', label: 'Back Attacks', shortLabel: 'Back', value: 78, description: 'Taking the back and finishing from back control' },
      { id: 'takedowns', label: 'Takedowns', shortLabel: 'TD', value: 35, description: 'Standing game - wrestling, judo, and guard pulls' },
      { id: 'leglocks', label: 'Leg Locks', shortLabel: 'Legs', value: 82, description: 'Modern leg attack game - heel hooks, knee bars, ankle locks' },
    ],
    archetype: {
      name: 'LEG LOCKER',
      description: 'Modern leg attack specialist. Dangerous entries and tight finishes.',
      icon: 'legs',
      famousExamples: ['Gordon Ryan', 'Craig Jones', 'Lachlan Giles'],
    },
    dominantStyle: 'Guard Game',
    weakestArea: 'Takedowns',
    balanceScore: 45,
  },
};

export const brownBeltProfile: MockProfile = {
  id: 'user-brown-001',
  key: 'brown',
  displayName: 'Elena Kim (Brown Belt 2 Stripes)',
  user: brownBeltUser,
  contextProfile: brownBeltContextProfile,
  journalEntries: brownBeltJournalEntries,
  trainingStats: brownBeltTrainingStats,
  beltHistory: brownBeltHistory,
  beltRequirements: brownBeltRequirements,
  positionMastery: brownBeltPositionMastery,
  milestones: brownBeltMilestones,
  goals: brownBeltGoals,
  techniqueProgress: brownBeltTechniqueProgress,
  progressSummary: {
    currentBelt: 'brown',
    currentStripes: 2,
    timeAtBelt: '18 months',
    nextBelt: 'black',
    overallCompletion: 88,
    requirementsComplete: 4,
    requirementsTotal: 6,
    estimatedTimeToPromotion: '6-12 months',
    strengths: ['Complete Game', 'Teaching', 'Competition', 'Back Control'],
    weaknesses: ['Leg Lock Defense'],
    coachFeedbackCount: 48,
    recentFocusAreas: ['Pressure Passing', 'Teaching Development', 'Refinement'],
  },
  styleFingerprint: {
    dimensions: [
      { id: 'guard', label: 'Guard Game', shortLabel: 'Guard', value: 78, description: 'Bottom position offense - sweeps and submissions from guard' },
      { id: 'passing', label: 'Passing', shortLabel: 'Pass', value: 82, description: "Ability to navigate and pass opponent's guard" },
      { id: 'top', label: 'Top Control', shortLabel: 'Top', value: 85, description: 'Dominance from mount, side control, and knee on belly' },
      { id: 'back', label: 'Back Attacks', shortLabel: 'Back', value: 92, description: 'Taking the back and finishing from back control' },
      { id: 'takedowns', label: 'Takedowns', shortLabel: 'TD', value: 68, description: 'Standing game - wrestling, judo, and guard pulls' },
      { id: 'leglocks', label: 'Leg Locks', shortLabel: 'Legs', value: 55, description: 'Modern leg attack game - heel hooks, knee bars, ankle locks' },
    ],
    archetype: {
      name: 'BACK HUNTER',
      description: 'Constantly seeking the back. Once there, the finish is inevitable.',
      icon: 'back',
      famousExamples: ['Marcelo Garcia', 'Rubens Charles (Cobrinha)'],
    },
    dominantStyle: 'Back Attacks',
    weakestArea: 'Leg Locks',
    balanceScore: 72,
  },
};

// Array of all profiles for selection
export const mockProfiles: MockProfile[] = [
  whiteBeltProfile,
  blueBeltProfile,
  purpleBeltProfile,
  brownBeltProfile,
];

// Helper to get profile by belt key
export function getProfileByBelt(belt: 'white' | 'blue' | 'purple' | 'brown'): MockProfile {
  const profile = mockProfiles.find(p => p.key === belt);
  return profile || blueBeltProfile; // Default to blue if not found
}

// Current active profile key (for prototype switching)
export type ActiveProfileKey = 'white' | 'blue' | 'purple' | 'brown';

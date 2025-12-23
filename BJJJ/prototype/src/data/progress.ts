/**
 * Mock Progress & Belt Tracking Data
 * Belt timeline, requirements, mastery heat maps, milestones
 *
 * This module works with belt-criteria.ts for IBJJF-based requirements
 */

import type { BeltColor } from './users';
import type { RequirementCategory } from './belt-criteria';

// Note: TechnicalRequirement and SubjectiveCriterion types are available
// via belt-criteria.ts for UI components that need to join progress data
// with requirement definitions

export interface BeltPromotion {
  id: string;
  userId: string;
  fromBelt: BeltColor | null;
  fromStripes: number;
  toBelt: BeltColor;
  toStripes: number;
  date: string;
  promotedBy: string;
  notes?: string;
}

export interface BeltRequirement {
  id: string;
  name: string;
  category: 'technique' | 'attendance' | 'sparring' | 'competition' | 'knowledge';
  description: string;
  targetValue: number;
  currentValue: number;
  isComplete: boolean;
  coachVerified: boolean;
}

export interface PositionMastery {
  position: string;
  attackScore: number; // 0-100
  defenseScore: number; // 0-100
  overallScore: number; // 0-100
}

export interface Milestone {
  id: string;
  type: 'streak' | 'sessions' | 'technique' | 'promotion' | 'competition' | 'submission';
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'technique' | 'competition' | 'attendance' | 'promotion' | 'custom';
  title: string;
  description: string;
  targetDate?: string;
  targetValue?: number;
  currentValue?: number;
  isComplete: boolean;
  createdAt: string;
  coachVisible: boolean;
}

// ===========================================
// BELT PROGRESSION HISTORY
// ===========================================

export const mockBeltHistory: BeltPromotion[] = [
  {
    id: 'promo-001',
    userId: 'user-001',
    fromBelt: null,
    fromStripes: 0,
    toBelt: 'white',
    toStripes: 0,
    date: '2022-03-15',
    promotedBy: 'coach-001',
    notes: 'Started training at Alliance BJJ',
  },
  {
    id: 'promo-002',
    userId: 'user-001',
    fromBelt: 'white',
    fromStripes: 0,
    toBelt: 'white',
    toStripes: 1,
    date: '2022-06-20',
    promotedBy: 'coach-001',
    notes: 'First stripe! Good progress on fundamentals',
  },
  {
    id: 'promo-003',
    userId: 'user-001',
    fromBelt: 'white',
    fromStripes: 1,
    toBelt: 'white',
    toStripes: 2,
    date: '2022-10-15',
    promotedBy: 'coach-001',
  },
  {
    id: 'promo-004',
    userId: 'user-001',
    fromBelt: 'white',
    fromStripes: 2,
    toBelt: 'white',
    toStripes: 3,
    date: '2023-02-10',
    promotedBy: 'coach-001',
  },
  {
    id: 'promo-005',
    userId: 'user-001',
    fromBelt: 'white',
    fromStripes: 3,
    toBelt: 'white',
    toStripes: 4,
    date: '2023-06-28',
    promotedBy: 'coach-001',
    notes: 'Ready for blue belt soon',
  },
  {
    id: 'promo-006',
    userId: 'user-001',
    fromBelt: 'white',
    fromStripes: 4,
    toBelt: 'blue',
    toStripes: 0,
    date: '2023-09-15',
    promotedBy: 'coach-001',
    notes: 'Blue belt promotion! Excellent guard work and submissions.',
  },
  {
    id: 'promo-007',
    userId: 'user-001',
    fromBelt: 'blue',
    fromStripes: 0,
    toBelt: 'blue',
    toStripes: 1,
    date: '2024-03-20',
    promotedBy: 'coach-001',
  },
  {
    id: 'promo-008',
    userId: 'user-001',
    fromBelt: 'blue',
    fromStripes: 1,
    toBelt: 'blue',
    toStripes: 2,
    date: '2024-09-10',
    promotedBy: 'coach-001',
    notes: 'Showing good passing game development',
  },
];

// ===========================================
// CURRENT BELT REQUIREMENTS (for blue→purple)
// ===========================================

export const mockBeltRequirements: BeltRequirement[] = [
  // Technique requirements
  {
    id: 'req-001',
    name: 'Guard Passes',
    category: 'technique',
    description: 'Demonstrate 5 different guard passes',
    targetValue: 5,
    currentValue: 3,
    isComplete: false,
    coachVerified: false,
  },
  {
    id: 'req-002',
    name: 'Submissions',
    category: 'technique',
    description: 'Demonstrate 8 submissions from different positions',
    targetValue: 8,
    currentValue: 6,
    isComplete: false,
    coachVerified: false,
  },
  {
    id: 'req-003',
    name: 'Sweeps',
    category: 'technique',
    description: 'Demonstrate 4 sweeps from guard',
    targetValue: 4,
    currentValue: 4,
    isComplete: true,
    coachVerified: true,
  },
  {
    id: 'req-004',
    name: 'Escapes',
    category: 'technique',
    description: 'Demonstrate escapes from all major positions',
    targetValue: 5,
    currentValue: 5,
    isComplete: true,
    coachVerified: true,
  },
  {
    id: 'req-005',
    name: 'Takedowns',
    category: 'technique',
    description: 'Demonstrate 3 takedowns',
    targetValue: 3,
    currentValue: 2,
    isComplete: false,
    coachVerified: false,
  },

  // Attendance requirements
  {
    id: 'req-006',
    name: 'Time at Belt',
    category: 'attendance',
    description: 'Minimum 18 months at blue belt',
    targetValue: 18,
    currentValue: 15,
    isComplete: false,
    coachVerified: false,
  },
  {
    id: 'req-007',
    name: 'Class Attendance',
    category: 'attendance',
    description: 'Attend at least 200 classes at blue belt',
    targetValue: 200,
    currentValue: 178,
    isComplete: false,
    coachVerified: false,
  },

  // Competition requirements
  {
    id: 'req-008',
    name: 'Competition Experience',
    category: 'competition',
    description: 'Compete in at least 3 tournaments',
    targetValue: 3,
    currentValue: 2,
    isComplete: false,
    coachVerified: false,
  },

  // Knowledge requirements
  {
    id: 'req-009',
    name: 'Teaching Ability',
    category: 'knowledge',
    description: 'Assist in teaching fundamentals class',
    targetValue: 1,
    currentValue: 0,
    isComplete: false,
    coachVerified: false,
  },
];

// ===========================================
// POSITION MASTERY (Heat Map Data)
// ===========================================

export const mockPositionMastery: PositionMastery[] = [
  { position: 'Closed Guard', attackScore: 78, defenseScore: 72, overallScore: 75 },
  { position: 'Open Guard', attackScore: 65, defenseScore: 58, overallScore: 62 },
  { position: 'Half Guard', attackScore: 70, defenseScore: 75, overallScore: 72 },
  { position: 'Mount', attackScore: 82, defenseScore: 60, overallScore: 71 },
  { position: 'Side Control', attackScore: 75, defenseScore: 55, overallScore: 65 },
  { position: 'Back', attackScore: 85, defenseScore: 45, overallScore: 65 },
  { position: 'Turtle', attackScore: 50, defenseScore: 70, overallScore: 60 },
  { position: 'Standing', attackScore: 45, defenseScore: 55, overallScore: 50 },
];

// ===========================================
// MILESTONES & BADGES
// ===========================================

// Icon names reference the Icons component from ../components/ui/Icons.tsx
// NEVER use emojis - always use lineart icon names
export const mockMilestones: Milestone[] = [
  {
    id: 'mile-001',
    type: 'promotion',
    name: 'Blue Belt',
    description: 'Earned blue belt rank',
    earnedAt: '2023-09-15',
    icon: 'Belt', // Line art icon name
  },
  {
    id: 'mile-002',
    type: 'sessions',
    name: 'Century Club',
    description: 'Completed 100 training sessions',
    earnedAt: '2023-05-20',
    icon: 'Hundred', // Line art icon name
  },
  {
    id: 'mile-003',
    type: 'sessions',
    name: 'Double Century',
    description: 'Completed 200 training sessions',
    earnedAt: '2024-08-15',
    icon: 'Target', // Line art icon name
  },
  {
    id: 'mile-004',
    type: 'streak',
    name: 'Two Week Warrior',
    description: 'Trained 14 days in a row',
    earnedAt: '2024-03-10',
    icon: 'Flame', // Line art icon name
  },
  {
    id: 'mile-005',
    type: 'streak',
    name: 'Three Week Streak',
    description: 'Trained 21 days in a row',
    earnedAt: '2024-07-28',
    icon: 'Zap', // Line art icon name
  },
  {
    id: 'mile-006',
    type: 'competition',
    name: 'First Competition',
    description: 'Competed in first tournament',
    earnedAt: '2023-04-15',
    icon: 'Trophy', // Line art icon name
  },
  {
    id: 'mile-007',
    type: 'competition',
    name: 'Medal Winner',
    description: 'Won a medal in competition',
    earnedAt: '2024-06-22',
    icon: 'Medal', // Line art icon name
  },
  {
    id: 'mile-008',
    type: 'submission',
    name: 'Armbar Master',
    description: 'Landed 10 armbars in sparring',
    earnedAt: '2023-08-10',
    icon: 'Award', // Line art icon name
  },
  {
    id: 'mile-009',
    type: 'technique',
    name: 'Well Rounded',
    description: 'Drilled techniques from all positions',
    earnedAt: '2024-02-15',
    icon: 'Star', // Line art icon name
  },
];

// ===========================================
// GOALS
// ===========================================

export const mockGoals: Goal[] = [
  {
    id: 'goal-001',
    userId: 'user-001',
    type: 'promotion',
    title: 'Earn Purple Belt',
    description: 'Complete all purple belt requirements and earn promotion',
    targetDate: '2025-09-01',
    isComplete: false,
    createdAt: '2024-01-15',
    coachVisible: true,
  },
  {
    id: 'goal-002',
    userId: 'user-001',
    type: 'attendance',
    title: 'Train 4x per Week',
    description: 'Maintain consistent 4 sessions per week for 3 months',
    targetValue: 48,
    currentValue: 32,
    isComplete: false,
    createdAt: '2024-10-01',
    coachVisible: true,
  },
  {
    id: 'goal-003',
    userId: 'user-001',
    type: 'technique',
    title: 'Master Leg Locks',
    description: 'Become proficient in heel hooks and ankle locks',
    isComplete: false,
    createdAt: '2024-11-01',
    coachVisible: true,
  },
  {
    id: 'goal-004',
    userId: 'user-001',
    type: 'competition',
    title: 'Compete at IBJJF Open',
    description: 'Register and compete at the next IBJJF Austin Open',
    targetDate: '2025-03-15',
    isComplete: false,
    createdAt: '2024-12-01',
    coachVisible: true,
  },
  {
    id: 'goal-005',
    userId: 'user-001',
    type: 'technique',
    title: 'Improve Takedowns',
    description: 'Drill takedowns weekly and complete requirement',
    targetValue: 3,
    currentValue: 2,
    isComplete: false,
    createdAt: '2024-09-15',
    coachVisible: true,
  },
];

// ===========================================
// PROGRESS SUMMARY
// ===========================================

export const mockProgressSummary = {
  currentBelt: 'blue' as BeltColor,
  currentStripes: 2,
  timeAtBelt: '15 months',
  nextBelt: 'purple' as BeltColor,
  overallCompletion: 68,
  requirementsComplete: 4,
  requirementsTotal: 9,
  estimatedTimeToPromotion: '6-9 months',
  strengths: ['Closed Guard', 'Back Control', 'Submissions'],
  weaknesses: ['Takedowns', 'Standing', 'Side Control Escapes'],
  coachFeedbackCount: 12,
  recentFocusAreas: ['Guard Passing', 'Leg Locks'],
};

// ===========================================
// IBJJF CRITERIA PROGRESS TRACKING
// ===========================================

/**
 * Tracks a user's progress on IBJJF technical requirements
 * Links to TechnicalRequirement from belt-criteria.ts
 */
export interface IBJJFRequirementProgress {
  requirementId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'verified';
  completedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * Tracks a user's progress on subjective criteria
 * Links to SubjectiveCriterion from belt-criteria.ts
 */
export interface SubjectiveCriteriaProgress {
  criterionId: string;
  status: 'not-met' | 'developing' | 'met';
  assessedBy?: string;
  assessedAt?: string;
  notes?: string;
}

/**
 * Category-level progress summary
 */
export interface CategoryProgress {
  category: RequirementCategory;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
}

/**
 * Complete promotion readiness assessment
 */
export interface PromotionReadiness {
  userId: string;
  currentBelt: BeltColor;
  targetBelt: BeltColor;
  meetsAgeRequirement: boolean;
  meetsTimeRequirement: boolean;
  timeAtCurrentBelt: number; // months
  timeRequired: number; // months
  technicalProgress: {
    byCategory: CategoryProgress[];
    overallPercentage: number;
  };
  subjectiveProgress: {
    met: number;
    total: number;
    percentage: number;
  };
  areasNeedingWork?: string[]; // Areas that need improvement for promotion
  coachRecommendation?: 'not-ready' | 'almost-ready' | 'ready';
  coachNotes?: string;
  lastAssessmentDate?: string;
}

// ===========================================
// MOCK IBJJF PROGRESS DATA (Tony Chen)
// ===========================================

export const mockTonyChenIBJJFProgress: IBJJFRequirementProgress[] = [
  // Blue Belt Requirements - Completed
  { requirementId: 'bb-sub-001', status: 'verified', completedAt: '2024-02-15', verifiedBy: 'coach-001', verifiedAt: '2024-02-20' },
  { requirementId: 'bb-sub-002', status: 'verified', completedAt: '2024-03-10', verifiedBy: 'coach-001', verifiedAt: '2024-03-15' },
  { requirementId: 'bb-sub-003', status: 'verified', completedAt: '2024-04-05', verifiedBy: 'coach-001', verifiedAt: '2024-04-10' },
  { requirementId: 'bb-sub-007', status: 'verified', completedAt: '2024-01-20', verifiedBy: 'coach-001', verifiedAt: '2024-01-25' },
  { requirementId: 'bb-sub-008', status: 'verified', completedAt: '2024-02-28', verifiedBy: 'coach-001', verifiedAt: '2024-03-05' },
  { requirementId: 'bb-sub-011', status: 'completed', completedAt: '2024-08-15', notes: 'Solid straight ankle lock' },
  { requirementId: 'bb-guard-001', status: 'verified', completedAt: '2024-01-10', verifiedBy: 'coach-001', verifiedAt: '2024-01-15' },
  { requirementId: 'bb-guard-002', status: 'verified', completedAt: '2024-05-20', verifiedBy: 'coach-001', verifiedAt: '2024-05-25' },
  { requirementId: 'bb-guard-005', status: 'completed', completedAt: '2024-06-10' },
  { requirementId: 'bb-pass-001', status: 'verified', completedAt: '2024-07-15', verifiedBy: 'coach-001', verifiedAt: '2024-07-20' },
  { requirementId: 'bb-pass-002', status: 'completed', completedAt: '2024-08-01' },
  { requirementId: 'bb-esc-001', status: 'verified', completedAt: '2024-01-05', verifiedBy: 'coach-001', verifiedAt: '2024-01-10' },
  { requirementId: 'bb-esc-002', status: 'verified', completedAt: '2024-02-01', verifiedBy: 'coach-001', verifiedAt: '2024-02-05' },
  { requirementId: 'bb-td-001', status: 'completed', completedAt: '2024-09-01' },
  { requirementId: 'bb-td-002', status: 'completed', completedAt: '2024-09-05' },
  { requirementId: 'bb-td-006', status: 'completed', completedAt: '2024-06-20' },

  // Blue Belt Requirements - In Progress
  { requirementId: 'bb-guard-003', status: 'in-progress', notes: 'Working on butterfly guard hooks' },
  { requirementId: 'bb-guard-004', status: 'in-progress', notes: 'DLR concepts need more drilling' },
  { requirementId: 'bb-sub-004', status: 'in-progress', notes: 'Guillotine finish rate needs improvement' },
  { requirementId: 'bb-sub-005', status: 'in-progress', notes: 'Ezekiel from mount is progressing' },
  { requirementId: 'bb-pass-003', status: 'in-progress', notes: 'Half guard passing is inconsistent' },
  { requirementId: 'bb-esc-003', status: 'in-progress', notes: 'Back escapes need more work' },

  // Purple Belt Requirements - Started
  { requirementId: 'pb-combo-001', status: 'in-progress', notes: 'Armbar-triangle-omoplata chain developing' },
  { requirementId: 'pb-guard-001', status: 'in-progress', notes: 'Focusing on DLR as primary open guard' },
  { requirementId: 'pb-sub-001', status: 'in-progress', notes: 'Ankle lock solid, working on kneebar' },
];

export const mockTonyChenSubjectiveProgress: SubjectiveCriteriaProgress[] = [
  // Blue Belt Subjective - Met
  { criterionId: 'bb-subj-001', status: 'met', assessedBy: 'coach-001', assessedAt: '2024-09-15' },
  { criterionId: 'bb-subj-002', status: 'met', assessedBy: 'coach-001', assessedAt: '2024-09-15' },
  { criterionId: 'bb-subj-003', status: 'met', assessedBy: 'coach-001', assessedAt: '2024-09-15' },
  { criterionId: 'bb-subj-005', status: 'met', assessedBy: 'coach-001', assessedAt: '2024-09-15' },
  { criterionId: 'bb-subj-006', status: 'met', assessedBy: 'coach-001', assessedAt: '2024-09-15', notes: 'Helps white belts regularly' },

  // Blue Belt Subjective - Developing
  { criterionId: 'bb-subj-004', status: 'developing', notes: 'Still learning competition scoring nuances' },
  { criterionId: 'bb-subj-007', status: 'developing', notes: 'Composure improving but still gets flustered' },
  { criterionId: 'bb-subj-008', status: 'developing', notes: 'Game is developing - guard focus emerging' },

  // Purple Belt Subjective - Not Met Yet
  { criterionId: 'pb-subj-001', status: 'not-met', notes: 'A-game still developing' },
  { criterionId: 'pb-subj-002', status: 'not-met', notes: 'Not yet giving tough rolls to upper belts' },
  { criterionId: 'pb-subj-003', status: 'developing', notes: 'Helps fundamentals class occasionally' },
];

export const mockTonyChenPromotionReadiness: PromotionReadiness = {
  userId: 'user-001',
  currentBelt: 'blue',
  targetBelt: 'purple',
  meetsAgeRequirement: true,
  meetsTimeRequirement: false,
  timeAtCurrentBelt: 15,
  timeRequired: 18,
  technicalProgress: {
    byCategory: [
      { category: 'submissions', total: 12, completed: 8, inProgress: 2, percentage: 67 },
      { category: 'guard', total: 5, completed: 3, inProgress: 2, percentage: 60 },
      { category: 'guard-passing', total: 4, completed: 2, inProgress: 1, percentage: 50 },
      { category: 'escapes', total: 6, completed: 4, inProgress: 1, percentage: 67 },
      { category: 'takedowns', total: 6, completed: 3, inProgress: 0, percentage: 50 },
      { category: 'positional-knowledge', total: 5, completed: 3, inProgress: 1, percentage: 60 },
    ],
    overallPercentage: 59,
  },
  subjectiveProgress: {
    met: 5,
    total: 11,
    percentage: 45,
  },
  areasNeedingWork: ['Open guard development', 'Combination attacks', 'Half guard passing'],
  coachRecommendation: 'almost-ready',
  coachNotes: 'Tony shows strong fundamentals and dedication. Needs 3 more months at blue belt and should focus on open guard development and combination attacks. On track for purple in mid-2025.',
  lastAssessmentDate: '2024-11-15',
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Calculate percentage of requirements completed for a belt
 */
export const calculateBeltProgress = (
  requirements: IBJJFRequirementProgress[],
  targetBelt: BeltColor
): number => {
  const beltPrefix = {
    white: 'wb-',
    blue: 'bb-',
    purple: 'pb-',
    brown: 'brb-',
    black: 'blk-',
  }[targetBelt];

  const relevantReqs = requirements.filter(r => r.requirementId.startsWith(beltPrefix));
  const completed = relevantReqs.filter(r => r.status === 'completed' || r.status === 'verified');

  return relevantReqs.length > 0 ? Math.round((completed.length / relevantReqs.length) * 100) : 0;
};

/**
 * Get requirements that still need work
 */
export const getIncompleteRequirements = (
  requirements: IBJJFRequirementProgress[]
): IBJJFRequirementProgress[] => {
  return requirements.filter(r => r.status === 'not-started' || r.status === 'in-progress');
};

/**
 * Check if user is ready for promotion based on IBJJF criteria
 */
export const isPromotionReady = (readiness: PromotionReadiness): boolean => {
  return (
    readiness.meetsAgeRequirement &&
    readiness.meetsTimeRequirement &&
    readiness.technicalProgress.overallPercentage >= 80 &&
    readiness.subjectiveProgress.percentage >= 70 &&
    readiness.coachRecommendation === 'ready'
  );
};

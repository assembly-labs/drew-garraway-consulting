/**
 * Mock Competition Data
 * Tournament history, match records, and preparation
 */

export type MatchResult = 'win' | 'loss';
export type MatchEndType = 'submission' | 'points' | 'advantage' | 'decision' | 'dq' | 'injury';

export interface CompetitionMatch {
  id: string;
  competitionId: string;
  opponentName?: string;
  opponentAcademy?: string;
  weightClass: string;
  result: MatchResult;
  endType: MatchEndType;
  submissionType?: string;
  pointsFor?: number;
  pointsAgainst?: number;
  round?: string;
  videoUrl?: string;
  notes?: string;
}

export interface Competition {
  id: string;
  userId: string;
  name: string;
  organization: string;
  date: string;
  location: string;
  weightClass: string;
  beltDivision: string;
  gi: boolean;
  matches: CompetitionMatch[];
  placement?: string;
  medalType?: 'gold' | 'silver' | 'bronze' | null;
  reflectionNotes?: string;
  lessonsLearned?: string[];
}

export interface CompetitionGoal {
  id: string;
  competitionId?: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface PrepChecklist {
  id: string;
  competitionId: string;
  items: {
    task: string;
    isComplete: boolean;
    dueDate?: string;
  }[];
}

// ===========================================
// MOCK COMPETITIONS
// ===========================================

export const mockCompetitions: Competition[] = [
  {
    id: 'comp-001',
    userId: 'user-001',
    name: 'Austin Summer Open',
    organization: 'IBJJF',
    date: '2024-06-22',
    location: 'Austin, TX',
    weightClass: 'Medium Heavy',
    beltDivision: 'Blue Belt Adult',
    gi: true,
    matches: [
      {
        id: 'match-001',
        competitionId: 'comp-001',
        opponentName: 'Carlos Mendez',
        opponentAcademy: 'Gracie Barra Austin',
        weightClass: 'Medium Heavy',
        result: 'win',
        endType: 'points',
        pointsFor: 6,
        pointsAgainst: 2,
        round: 'Quarter Final',
        notes: 'Got the takedown and passed to mount. Controlled well.',
      },
      {
        id: 'match-002',
        competitionId: 'comp-001',
        opponentName: 'Mike Thompson',
        opponentAcademy: 'Atos Austin',
        weightClass: 'Medium Heavy',
        result: 'win',
        endType: 'submission',
        submissionType: 'Armbar',
        round: 'Semi Final',
        notes: 'Pulled guard and hit the armbar from closed guard.',
      },
      {
        id: 'match-003',
        competitionId: 'comp-001',
        opponentName: 'Jake Wilson',
        opponentAcademy: 'Paragon BJJ',
        weightClass: 'Medium Heavy',
        result: 'loss',
        endType: 'points',
        pointsFor: 2,
        pointsAgainst: 4,
        round: 'Final',
        notes: 'He had better wrestling. Got taken down twice.',
      },
    ],
    placement: '2nd Place',
    medalType: 'silver',
    reflectionNotes: 'Happy with silver but need to work on takedowns. My guard game is solid for competition but standing is a weakness.',
    lessonsLearned: [
      'Need better takedown defense',
      'Guard pulling strategy worked well',
      'Cardio held up - training paid off',
      'Stay calm in finals next time',
    ],
  },
  {
    id: 'comp-002',
    userId: 'user-001',
    name: 'Houston No-Gi Championship',
    organization: 'NAGA',
    date: '2024-03-15',
    location: 'Houston, TX',
    weightClass: '180-189 lbs',
    beltDivision: 'Intermediate',
    gi: false,
    matches: [
      {
        id: 'match-004',
        competitionId: 'comp-002',
        opponentName: 'Unknown',
        weightClass: '180-189 lbs',
        result: 'win',
        endType: 'submission',
        submissionType: 'RNC',
        round: 'Round 1',
        notes: 'Quick match, got the back early.',
      },
      {
        id: 'match-005',
        competitionId: 'comp-002',
        opponentName: 'Unknown',
        weightClass: '180-189 lbs',
        result: 'loss',
        endType: 'submission',
        submissionType: 'Heel Hook',
        round: 'Round 2',
        notes: 'Got caught in a heel hook. Need to work on leg lock defense.',
      },
    ],
    placement: 'Did not place',
    medalType: null,
    reflectionNotes: 'Learned I need leg lock defense badly. The RNC win was good but the heel hook loss was frustrating.',
    lessonsLearned: [
      'Leg lock defense is critical for no-gi',
      'Don\'t get complacent after a quick win',
      'Need more no-gi specific training',
    ],
  },
];

// ===========================================
// UPCOMING COMPETITION
// ===========================================

export const mockUpcomingCompetition: Competition = {
  id: 'comp-003',
  userId: 'user-001',
  name: 'Austin Spring Open',
  organization: 'IBJJF',
  date: '2025-03-15',
  location: 'Austin, TX',
  weightClass: 'Medium Heavy',
  beltDivision: 'Blue Belt Adult',
  gi: true,
  matches: [],
};

// ===========================================
// PREP CHECKLIST
// ===========================================

export const mockPrepChecklist: PrepChecklist = {
  id: 'prep-001',
  competitionId: 'comp-003',
  items: [
    { task: 'Register for competition', isComplete: false, dueDate: '2025-02-01' },
    { task: 'Confirm weight class', isComplete: false, dueDate: '2025-02-15' },
    { task: 'Buy/check competition gi', isComplete: true },
    { task: 'Start weight cut if needed', isComplete: false, dueDate: '2025-03-01' },
    { task: 'Increase sparring intensity', isComplete: false, dueDate: '2025-02-15' },
    { task: 'Video review past matches', isComplete: false },
    { task: 'Drill takedowns daily', isComplete: false },
    { task: 'Rest week before comp', isComplete: false, dueDate: '2025-03-08' },
  ],
};

// ===========================================
// COMPETITION STATS
// ===========================================

export const mockCompetitionStats = {
  totalCompetitions: 2,
  totalMatches: 5,
  wins: 3,
  losses: 2,
  submissionWins: 2,
  submissionLosses: 1,
  pointWins: 1,
  medals: {
    gold: 0,
    silver: 1,
    bronze: 0,
  },
  winRate: 60,
  submissionRate: 67,
  averagePointsScored: 4,
  averagePointsAllowed: 2.5,
};

// ===========================================
// BELT-SPECIFIC COMPETITION STATS
// ===========================================

export type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface BeltCompetitionStats {
  totalCompetitions: number;
  totalMatches: number;
  wins: number;
  losses: number;
  submissionWins: number;
  submissionLosses: number;
  medals: { gold: number; silver: number; bronze: number };
}

export const beltCompetitionStats: Record<BeltLevel, BeltCompetitionStats> = {
  white: {
    // David - never competed, considering first comp
    totalCompetitions: 0,
    totalMatches: 0,
    wins: 0,
    losses: 0,
    submissionWins: 0,
    submissionLosses: 0,
    medals: { gold: 0, silver: 0, bronze: 0 },
  },
  blue: {
    // Marcus - 2 competitions, 1 silver medal
    totalCompetitions: 2,
    totalMatches: 5,
    wins: 3,
    losses: 2,
    submissionWins: 2,
    submissionLosses: 1,
    medals: { gold: 0, silver: 1, bronze: 0 },
  },
  purple: {
    // Sofia - experienced competitor, 8 competitions
    totalCompetitions: 8,
    totalMatches: 24,
    wins: 18,
    losses: 6,
    submissionWins: 12,
    submissionLosses: 2,
    medals: { gold: 3, silver: 2, bronze: 1 },
  },
  brown: {
    // Elena - veteran competitor, 12 competitions
    totalCompetitions: 12,
    totalMatches: 38,
    wins: 28,
    losses: 10,
    submissionWins: 18,
    submissionLosses: 3,
    medals: { gold: 4, silver: 3, bronze: 2 },
  },
  black: {
    // Default black belt competitor
    totalCompetitions: 20,
    totalMatches: 58,
    wins: 42,
    losses: 16,
    submissionWins: 28,
    submissionLosses: 5,
    medals: { gold: 8, silver: 4, bronze: 3 },
  },
};

// ===========================================
// BELT-SPECIFIC UPCOMING COMPETITIONS
// ===========================================

export const beltUpcomingCompetitions: Record<BeltLevel, Competition | null> = {
  white: {
    // David considering first comp - local beginner friendly
    id: 'comp-white-001',
    userId: 'user-white-001',
    name: 'Austin Beginners Open',
    organization: 'Good Fight',
    date: '2025-04-12',
    location: 'Austin, TX',
    weightClass: 'Heavy',
    beltDivision: 'White Belt Masters',
    gi: true,
    matches: [],
  },
  blue: {
    // Marcus - IBJJF in March
    id: 'comp-003',
    userId: 'user-001',
    name: 'Austin Spring Open',
    organization: 'IBJJF',
    date: '2025-03-15',
    location: 'Austin, TX',
    weightClass: 'Medium Heavy',
    beltDivision: 'Blue Belt Adult',
    gi: true,
    matches: [],
  },
  purple: {
    // Sofia - Pans in February
    id: 'comp-purple-001',
    userId: 'user-purple-001',
    name: 'Pan American Championship',
    organization: 'IBJJF',
    date: '2025-02-20',
    location: 'Orlando, FL',
    weightClass: 'Light Feather',
    beltDivision: 'Purple Belt Adult',
    gi: true,
    matches: [],
  },
  brown: {
    // Elena - Worlds in June
    id: 'comp-brown-001',
    userId: 'user-brown-001',
    name: 'World Championship',
    organization: 'IBJJF',
    date: '2025-06-05',
    location: 'Anaheim, CA',
    weightClass: 'Light',
    beltDivision: 'Brown Belt Adult',
    gi: true,
    matches: [],
  },
  black: null, // No upcoming competition set
};

// Helper to get competition stats by belt
export function getCompetitionStatsByBelt(belt: BeltLevel): BeltCompetitionStats {
  return beltCompetitionStats[belt];
}

// Helper to get upcoming competition by belt
export function getUpcomingCompetitionByBelt(belt: BeltLevel): Competition | null {
  return beltUpcomingCompetitions[belt];
}

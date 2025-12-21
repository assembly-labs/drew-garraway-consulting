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

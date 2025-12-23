/**
 * Mock Training Journal Data
 * Session logs, sparring records, and personal notes
 */

export type TrainingType = 'gi' | 'nogi' | 'openmat' | 'private' | 'competition';
export type SparringOutcome = 'submission-win' | 'submission-loss' | 'points-win' | 'points-loss' | 'draw' | 'positional';

export interface SparringRound {
  partnerId: string;
  partnerName: string;
  partnerBelt: string;
  outcome: SparringOutcome;
  submissionType?: string;
  notes?: string;
}

export interface TechniqueDrilled {
  techniqueId: string;
  techniqueName: string;
  reps?: number;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  type: TrainingType;
  duration: number; // minutes
  techniques: TechniqueDrilled[];
  sparringRounds: SparringRound[];
  notes: string;
  privateNotes?: string;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  injury?: string;
  isPrivate: boolean;
}

export interface RawNote {
  id: string;
  entryId: string;
  rawText: string;
  parsedAt?: string;
  extractedTechniques?: string[];
  extractedSparring?: string[];
}

// ===========================================
// MOCK JOURNAL ENTRIES
// ===========================================

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'entry-001',
    userId: 'user-001',
    date: '2024-12-20',
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-007', techniqueName: 'Toreando Pass', reps: 20, notes: 'Focused on speed and hip pressure' },
      { techniqueId: 'tech-008', techniqueName: 'Knee Cut Pass', reps: 15, notes: 'Still getting caught in half guard' },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Triangle', notes: 'Got caught being lazy with posture' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'draw', notes: 'Competitive roll, neither of us scored' },
    ],
    notes: 'Good class today. Professor Silva showed some details on the toreando that really clicked. Need to work on maintaining posture against higher belts.',
    privateNotes: 'Feeling a bit discouraged after getting triangled so easily. Need to refocus.',
    energyLevel: 4,
    mood: 3,
    isPrivate: false,
  },
  {
    id: 'entry-002',
    userId: 'user-001',
    date: '2024-12-19',
    type: 'nogi',
    duration: 75,
    techniques: [
      { techniqueId: 'tech-012', techniqueName: 'Heel Hook', reps: 10, notes: 'Working on outside heel hook from 50/50' },
      { techniqueId: 'tech-004', techniqueName: 'Rear Naked Choke', reps: 8, notes: 'Short choke variation' },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sarah W.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Heel Hook', notes: 'She caught me in the saddle instantly' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'No-gi fundamentals class. Really enjoying the leg lock game, even though I\'m getting caught a lot. Amanda is a beast with leg locks.',
    energyLevel: 5,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'entry-003',
    userId: 'user-001',
    date: '2024-12-18',
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-001', techniqueName: 'Armbar from Guard', reps: 15 },
      { techniqueId: 'tech-009', techniqueName: 'Kimura from Guard', reps: 12 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Kimura' },
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Armbar' },
    ],
    notes: 'Fundamentals class. Good to revisit the basics. Jake is improving quickly.',
    energyLevel: 4,
    mood: 5,
    isPrivate: false,
  },
  {
    id: 'entry-004',
    userId: 'user-001',
    date: '2024-12-17',
    type: 'openmat',
    duration: 120,
    techniques: [],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sarah W.', partnerBelt: 'purple', outcome: 'draw' },
      { partnerId: 'user-004', partnerName: 'Elena R.', partnerBelt: 'brown', outcome: 'submission-loss', submissionType: 'Bow and Arrow' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'Triangle' },
      { partnerId: 'coach-001', partnerName: 'Ricardo S.', partnerBelt: 'black', outcome: 'submission-loss', submissionType: 'Cross Choke', notes: 'He was going easy on me' },
    ],
    notes: 'Sunday open mat. Lots of hard rolls. Felt good but tired.',
    energyLevel: 3,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'entry-005',
    userId: 'user-001',
    date: '2024-12-15',
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-002', techniqueName: 'Triangle Choke', reps: 20 },
      { techniqueId: 'tech-003', techniqueName: 'Scissor Sweep', reps: 15 },
    ],
    sparringRounds: [
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'draw' },
    ],
    notes: 'Light day, focused on technique rather than hard sparring.',
    energyLevel: 3,
    mood: 4,
    isPrivate: false,
  },
  {
    id: 'entry-006',
    userId: 'user-001',
    date: '2024-12-14',
    type: 'nogi',
    duration: 60,
    techniques: [
      { techniqueId: 'tech-009', techniqueName: 'Kimura from Guard', reps: 10 },
    ],
    sparringRounds: [
      { partnerId: 'user-003', partnerName: 'Jake M.', partnerBelt: 'white', outcome: 'submission-win', submissionType: 'Guillotine' },
    ],
    notes: 'Quick lunch session. Worked on kimura grip attacks.',
    energyLevel: 4,
    mood: 4,
    injury: 'Slight tweak in left elbow, nothing serious',
    isPrivate: false,
  },
  {
    id: 'entry-007',
    userId: 'user-001',
    date: '2024-12-12',
    type: 'gi',
    duration: 90,
    techniques: [
      { techniqueId: 'tech-006', techniqueName: 'Mount Escape (Upa)', reps: 25 },
      { techniqueId: 'tech-005', techniqueName: 'Hip Escape (Shrimp)', reps: 30 },
    ],
    sparringRounds: [
      { partnerId: 'user-002', partnerName: 'Sarah W.', partnerBelt: 'purple', outcome: 'submission-loss', submissionType: 'Armbar' },
      { partnerId: 'user-005', partnerName: 'Tommy N.', partnerBelt: 'blue', outcome: 'submission-win', submissionType: 'RNC' },
    ],
    notes: 'Escape drills day. Coach emphasized the importance of frames.',
    energyLevel: 4,
    mood: 4,
    isPrivate: false,
  },
];

// ===========================================
// RAW NOTES (for AI parsing demo)
// ===========================================

export const mockRawNotes: RawNote[] = [
  {
    id: 'raw-001',
    entryId: 'entry-001',
    rawText: `Great class today! Worked on passing the guard a lot. Did maybe 20 reps of the toreando pass - Professor Silva showed this detail about driving the knees down that really helped.

Also drilled knee cuts but kept getting caught in half guard.

Rolled with Jake (white belt) and got him with an armbar. Then Elena (brown) triangled me - I was being lazy with my posture again. Had a fun competitive roll with Tommy that ended in a draw.

Need to keep my posture better against higher belts!`,
    parsedAt: '2024-12-20T19:30:00Z',
    extractedTechniques: ['Toreando Pass', 'Knee Cut Pass', 'Armbar', 'Triangle'],
    extractedSparring: ['vs Jake - Win by Armbar', 'vs Elena - Loss by Triangle', 'vs Tommy - Draw'],
  },
  {
    id: 'raw-002',
    entryId: 'entry-002',
    rawText: `No-gi tonight with Amanda. She's a killer with leg locks.

Practiced outside heel hooks from 50/50 and short RNCs. Sarah caught me in the saddle right away during sparring - I need to respect the leg entanglements more. Got Tommy with a rear naked though.

Really liking the leg lock game even though I suck at it right now.`,
    parsedAt: '2024-12-19T21:00:00Z',
    extractedTechniques: ['Heel Hook', 'Rear Naked Choke'],
    extractedSparring: ['vs Sarah - Loss by Heel Hook', 'vs Tommy - Win by RNC'],
  },
];

// ===========================================
// TRAINING STATS (aggregated)
// ===========================================

export const mockTrainingStats = {
  totalSessions: 247,
  totalHours: 312,
  currentStreak: 5,
  longestStreak: 21,
  thisMonth: {
    sessions: 12,
    hours: 15.5,
    techniques: 8,
    sparringRounds: 24,
    targetSessions: 16, // Monthly goal
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
    wins: 89,
    losses: 67,
    draws: 45,
  },
  submissionsMade: {
    'Armbar': 18,
    'Triangle': 15,
    'RNC': 22,
    'Kimura': 8,
    'Guillotine': 12,
    'Bow and Arrow': 4,
    'Other': 10,
  },
  submissionsReceived: {
    'Armbar': 12,
    'Triangle': 14,
    'RNC': 8,
    'Heel Hook': 6,
    'Choke': 15,
    'Other': 12,
  },
};

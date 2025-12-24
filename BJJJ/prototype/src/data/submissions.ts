/**
 * Mock Submission Data
 *
 * Pre-seeded submission records for testing and demonstration.
 * Call seedMockSubmissions() to populate localStorage with test data.
 */

import type { SubmissionRecord } from '../types/database';
import { getBodyRegion } from '../types/database';

const USER_ID = 'user-001';

// Generate realistic submission distribution
function generateMockSubmissions(): SubmissionRecord[] {
  const submissions: SubmissionRecord[] = [];
  let id = 1;

  // Helper to create a submission
  const addSubmission = (
    technique: string,
    outcome: 'given' | 'received',
    daysAgo: number,
    sessionId?: string
  ) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    submissions.push({
      id: `sub-${String(id++).padStart(4, '0')}`,
      session_id: sessionId || `session-${Math.floor(id / 3)}`,
      user_id: USER_ID,
      technique_name: technique,
      outcome,
      body_region: getBodyRegion(technique),
      partner_belt: null,
      position: null,
      date: date.toISOString().split('T')[0],
      created_at: date.toISOString(),
    });
  };

  // Submissions given - weighted toward user's "deadly" techniques
  // Total: ~89 to match existing mock stats (but only show after 50)

  // RNC - user's deadliest (22 total)
  for (let i = 0; i < 22; i++) {
    addSubmission('RNC', 'given', Math.floor(i * 5));
  }

  // Armbar - second best (18 total)
  for (let i = 0; i < 18; i++) {
    addSubmission('Armbar', 'given', Math.floor(i * 6) + 1);
  }

  // Triangle (15 total)
  for (let i = 0; i < 15; i++) {
    addSubmission('Triangle', 'given', Math.floor(i * 7) + 2);
  }

  // Guillotine (12 total)
  for (let i = 0; i < 12; i++) {
    addSubmission('Guillotine', 'given', Math.floor(i * 8) + 3);
  }

  // Kimura (8 total)
  for (let i = 0; i < 8; i++) {
    addSubmission('Kimura', 'given', Math.floor(i * 12) + 4);
  }

  // Bow and Arrow (4 total)
  for (let i = 0; i < 4; i++) {
    addSubmission('Bow and Arrow', 'given', Math.floor(i * 25) + 5);
  }

  // Heel Hook (6 total)
  for (let i = 0; i < 6; i++) {
    addSubmission('Heel Hook', 'given', Math.floor(i * 15) + 6);
  }

  // Americana (4 total)
  for (let i = 0; i < 4; i++) {
    addSubmission('Americana', 'given', Math.floor(i * 20) + 7);
  }

  // Submissions received - weighted toward user's weaknesses
  // Total: ~67 to match existing mock stats

  // Triangle - user's achilles heel (14 total)
  for (let i = 0; i < 14; i++) {
    addSubmission('Triangle', 'received', Math.floor(i * 7) + 1);
  }

  // Armbar (12 total)
  for (let i = 0; i < 12; i++) {
    addSubmission('Armbar', 'received', Math.floor(i * 8) + 2);
  }

  // RNC (8 total)
  for (let i = 0; i < 8; i++) {
    addSubmission('RNC', 'received', Math.floor(i * 10) + 3);
  }

  // Guillotine (8 total)
  for (let i = 0; i < 8; i++) {
    addSubmission('Guillotine', 'received', Math.floor(i * 12) + 4);
  }

  // Heel Hook (6 total)
  for (let i = 0; i < 6; i++) {
    addSubmission('Heel Hook', 'received', Math.floor(i * 15) + 5);
  }

  // Kimura (6 total)
  for (let i = 0; i < 6; i++) {
    addSubmission('Kimura', 'received', Math.floor(i * 16) + 6);
  }

  // Darce (4 total)
  for (let i = 0; i < 4; i++) {
    addSubmission('Darce', 'received', Math.floor(i * 20) + 7);
  }

  // Kneebar (5 total)
  for (let i = 0; i < 5; i++) {
    addSubmission('Kneebar', 'received', Math.floor(i * 18) + 8);
  }

  // Ankle Lock (4 total)
  for (let i = 0; i < 4; i++) {
    addSubmission('Ankle Lock', 'received', Math.floor(i * 22) + 9);
  }

  return submissions;
}

/**
 * Seed mock submissions into localStorage
 * Call this once to populate test data
 */
export function seedMockSubmissions(): void {
  const STORAGE_KEY = 'bjj-submissions';
  const existing = localStorage.getItem(STORAGE_KEY);

  // Only seed if no existing data
  if (!existing || JSON.parse(existing).length === 0) {
    const submissions = generateMockSubmissions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    console.log(`Seeded ${submissions.length} mock submissions`);
  }
}

/**
 * Clear mock submissions from localStorage
 */
export function clearMockSubmissions(): void {
  localStorage.removeItem('bjj-submissions');
  console.log('Cleared mock submissions');
}

/**
 * Get pre-computed mock stats (for components that don't need real-time data)
 */
export const mockSubmissionStats = {
  totalGiven: 89,
  totalReceived: 67,
  deadliestAttack: {
    technique: 'RNC',
    count: 22,
  },
  achillesHeel: {
    technique: 'Triangle',
    count: 14,
  },
  bodyHeatMap: {
    given: {
      neck: 53, // RNC (22) + Triangle (15) + Guillotine (12) + Bow and Arrow (4)
      arms: 30, // Armbar (18) + Kimura (8) + Americana (4)
      legs: 6,  // Heel Hook (6)
    },
    received: {
      neck: 34, // Triangle (14) + RNC (8) + Guillotine (8) + Darce (4)
      arms: 18, // Armbar (12) + Kimura (6)
      legs: 15, // Heel Hook (6) + Kneebar (5) + Ankle Lock (4)
    },
  },
  techniqueBreakdown: {
    given: [
      { technique: 'RNC', count: 22 },
      { technique: 'Armbar', count: 18 },
      { technique: 'Triangle', count: 15 },
      { technique: 'Guillotine', count: 12 },
      { technique: 'Kimura', count: 8 },
      { technique: 'Heel Hook', count: 6 },
      { technique: 'Bow and Arrow', count: 4 },
      { technique: 'Americana', count: 4 },
    ],
    received: [
      { technique: 'Triangle', count: 14 },
      { technique: 'Armbar', count: 12 },
      { technique: 'RNC', count: 8 },
      { technique: 'Guillotine', count: 8 },
      { technique: 'Heel Hook', count: 6 },
      { technique: 'Kimura', count: 6 },
      { technique: 'Kneebar', count: 5 },
      { technique: 'Darce', count: 4 },
      { technique: 'Ankle Lock', count: 4 },
    ],
  },
};

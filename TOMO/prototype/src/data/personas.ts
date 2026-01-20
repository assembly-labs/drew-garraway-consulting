/**
 * Persona Profiles for Belt Personalization Testing
 *
 * 6 distinct personas representing different user archetypes and risk levels.
 * Extends the existing MockProfile system with persona-specific metadata.
 *
 * WHITE BELT:
 * - white-excelling: Jake Thompson ("The Natural") - Thriving, low risk
 * - white-at-risk: David Morrison ("The Late Starter") - Struggling, high risk
 *
 * BLUE BELT:
 * - blue-excelling: Marcus Chen ("The Dedicated Hobbyist") - Progressing, moderate risk
 * - blue-at-risk: Ryan Torres ("The Fading Fire") - Declining, critical risk
 *
 * PURPLE BELT:
 * - purple-average: Sofia Rodriguez ("The Grinder") - Stable, low risk
 *
 * BROWN BELT:
 * - brown-average: Elena Kim ("The Veteran") - Refined, very low risk
 *
 * Reference: /internal-docs/personas/PERSONA_PROFILES.md
 */

import type { MockProfile } from './mock-profiles';
import { getProfileByBelt } from './mock-profiles';
import type { BeltLevel } from '../context/UserProfileContext';

// ===========================================
// PERSONA TYPES
// ===========================================

export type PersonaKey =
  | 'white-excelling'
  | 'white-at-risk'
  | 'blue-excelling'
  | 'blue-at-risk'
  | 'purple-average'
  | 'brown-average';

export type RiskLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'critical';
export type PersonaStatus = 'thriving' | 'progressing' | 'stable' | 'struggling' | 'declining' | 'refined';

// Persona extends MockProfile but with a different key type
export interface Persona extends Omit<MockProfile, 'key'> {
  // Use PersonaKey instead of the original key type
  key: PersonaKey;
  // Persona-specific metadata
  archetype: string;
  riskLevel: RiskLevel;
  status: PersonaStatus;
  // Profile avatar image
  avatarUrl?: string;
}

// ===========================================
// PERSONA DEFINITIONS
// ===========================================

// Get existing profiles from mock-profiles.ts
const existingWhite = getProfileByBelt('white');
const existingBlue = getProfileByBelt('blue');
const existingPurple = getProfileByBelt('purple');
const existingBrown = getProfileByBelt('brown');

/**
 * WHITE BELT - EXCELLING: Jake Thompson
 * "The Natural" - Thriving
 *
 * Uses David Morrison's base data but with modified stats
 * to represent a thriving white belt
 */
const whiteExcellingPersona: Persona = {
  ...existingWhite,
  id: 'persona-white-excelling',
  key: 'white-excelling',
  displayName: 'Jake Thompson',
  archetype: 'The Natural',
  riskLevel: 'low',
  status: 'thriving',
  avatarUrl: '/avatars/jake-thompson.jpg',
  // Override context profile for Jake
  contextProfile: {
    ...existingWhite.contextProfile,
    userId: 'user-white-excelling-001',
    name: 'Jake Thompson',
    stripes: 3,
    gymName: 'Atos Austin',
    targetFrequency: 4,
    birthYear: 1998,
    loggingPreference: 'voice',
    sessionCount: 87,
  },
  // Override training stats for high engagement
  trainingStats: {
    ...existingWhite.trainingStats,
    totalSessions: 87,
    totalHours: 130,
    currentStreak: 12,
    longestStreak: 18,
    thisMonth: {
      sessions: 14,
      hours: 21,
      techniques: 23,
      sparringRounds: 42,
      targetSessions: 16,
    },
    sparringRecord: { wins: 45, losses: 38, draws: 22 },
  },
  // Override progress summary
  progressSummary: {
    ...existingWhite.progressSummary,
    currentStripes: 3,
    timeAtBelt: '8 months',
    overallCompletion: 78,
    estimatedTimeToPromotion: '2-3 months',
    strengths: ['Top control', 'Takedowns', 'Cardio', 'Consistency'],
    weaknesses: ['Guard retention', 'Submissions from bottom', 'Patience'],
  },
};

/**
 * WHITE BELT - AT RISK: David Morrison
 * "The Late Starter" - Struggling
 *
 * 52-year-old IT Manager who started 18 months ago.
 * Training frequency declining. Questioning if he belongs.
 * High risk of dropout - needs encouragement about attendance.
 *
 * Reference: /internal-docs/personas/PERSONA_PROFILES.md
 */
const whiteAtRiskPersona: Persona = {
  ...existingWhite,
  id: 'persona-white-at-risk',
  key: 'white-at-risk',
  displayName: 'David Morrison',
  archetype: 'The Late Starter',
  riskLevel: 'high',
  status: 'struggling',
  avatarUrl: '/avatars/david-morrison.jpg',
  // Override context profile for David's struggling situation
  contextProfile: {
    ...existingWhite.contextProfile,
    userId: 'user-white-at-risk-001',
    name: 'David Morrison',
    stripes: 2, // Only 2 stripes after 18 months
    trainingStartDate: '2024-07-01', // 18 months ago from Jan 2026
    currentBeltDate: '2024-07-01',
    gymName: 'Gracie Barra Portland',
    trainingGoals: ['fitness', 'mental'] as const,
    targetFrequency: 2, // His goal is just 2x/week
    birthYear: 1972,
    loggingPreference: 'text',
    sessionCount: 47, // Low for 18 months
  },
  // Override training stats - LOW performance numbers
  trainingStats: {
    ...existingWhite.trainingStats,
    totalSessions: 47,
    totalHours: 70,
    currentStreak: 1, // Barely maintaining
    longestStreak: 6,
    thisMonth: {
      sessions: 3, // Only 3 sessions this month (target: 8)
      hours: 4.5,
      techniques: 4,
      sparringRounds: 6,
      targetSessions: 8,
    },
    thisYear: {
      sessions: 24,
      hours: 36,
    },
    // Rough sparring record - losing most of the time
    sparringRecord: { wins: 12, losses: 48, draws: 15 },
    // Limited submissions
    submissionsMade: {
      'Americana': 4,
      'Kimura': 3,
      'RNC': 2,
    },
  },
  // Override progress summary
  progressSummary: {
    ...existingWhite.progressSummary,
    currentStripes: 2,
    timeAtBelt: '18 months',
    overallCompletion: 42,
    estimatedTimeToPromotion: '8-12 months',
    strengths: ['Coachable', 'Calm under pressure', 'Asks good questions'],
    weaknesses: ['Athleticism', 'Recovery time', 'Consistency', 'Guard retention'],
  },
};

/**
 * BLUE BELT - EXCELLING: Marcus Chen
 * "The Dedicated Hobbyist" - Progressing
 *
 * 34-year-old Marketing Manager, 2.5 years training.
 * Consistent 3x/week, developing his guard game.
 * Moderate risk - blue belt blues are real but he's managing.
 *
 * Reference: /docs/personas/PERSONA_PROFILES.md
 */
const blueExcellingPersona: Persona = {
  ...existingBlue,
  id: 'persona-blue-excelling',
  key: 'blue-excelling',
  displayName: 'Marcus Chen',
  archetype: 'The Dedicated Hobbyist',
  riskLevel: 'moderate',
  status: 'progressing',
  avatarUrl: '/avatars/marcus-chen.jpg',
  // Override user data
  user: {
    ...existingBlue.user,
    id: 'user-blue-excelling-001',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.c@email.com',
    stripes: 2,
    goals: ['Develop complete guard game', 'Compete at local level', 'Stay consistent through plateau'],
  },
  // Override context profile for Marcus
  contextProfile: {
    ...existingBlue.contextProfile,
    userId: 'user-blue-excelling-001',
    name: 'Marcus Chen',
    stripes: 2,
    trainingStartDate: '2023-07-15', // 2.5 years ago from Jan 2026
    currentBeltDate: '2025-03-20', // 10 months at blue from Jan 2026
    gymName: '10th Planet Denver',
    trainingGoals: ['fitness', 'mental', 'community'] as const,
    targetFrequency: 3,
    birthYear: 1990,
    loggingPreference: 'voice',
    sessionCount: 247,
  },
  // Override training stats for consistent engagement
  trainingStats: {
    ...existingBlue.trainingStats,
    totalSessions: 247,
    totalHours: 370,
    currentStreak: 8,
    longestStreak: 24,
    thisMonth: {
      sessions: 11,
      hours: 16.5,
      techniques: 18,
      sparringRounds: 33,
      targetSessions: 12,
    },
    thisYear: {
      sessions: 127,
      hours: 190,
    },
    sparringRecord: { wins: 124, losses: 108, draws: 67 },
  },
  // Override progress summary
  progressSummary: {
    ...existingBlue.progressSummary,
    currentStripes: 2,
    timeAtBelt: '10 months',
    overallCompletion: 55,
    estimatedTimeToPromotion: '14-20 months',
    strengths: ['Closed guard', 'Sweeps', 'Patience', 'Consistency'],
    weaknesses: ['Guard retention', 'Leg locks', 'Top pressure', 'Submissions from top'],
  },
};

/**
 * BLUE BELT - AT RISK: Ryan Torres
 * "The Fading Fire" - Declining
 *
 * Uses Marcus Chen's base data but with modified stats
 * to represent a blue belt who has stopped training
 */
const blueAtRiskPersona: Persona = {
  ...existingBlue,
  id: 'persona-blue-at-risk',
  key: 'blue-at-risk',
  displayName: 'Ryan Torres',
  archetype: 'The Fading Fire',
  riskLevel: 'critical',
  status: 'declining',
  avatarUrl: '/avatars/ryan-torres.jpg',
  // Override user data
  user: {
    ...existingBlue.user,
    id: 'user-blue-at-risk-001',
    firstName: 'Ryan',
    lastName: 'Torres',
    email: 'ryan.t@email.com',
    stripes: 1,
    goals: ['Get back on track', 'Find consistency', 'Stop comparing myself'],
  },
  // Override context profile for Ryan
  contextProfile: {
    ...existingBlue.contextProfile,
    userId: 'user-blue-at-risk-001',
    name: 'Ryan Torres',
    stripes: 1,
    trainingStartDate: '2023-01-01', // 3 years ago from Jan 2026
    currentBeltDate: '2024-11-15', // 14 months at blue from Jan 2026
    gymName: 'Carlson Gracie Chicago',
    targetFrequency: 3,
    birthYear: 1993,
    loggingPreference: 'text',
    sessionCount: 156,
    notificationsEnabled: false, // Turned them off
  },
  // Override training stats for declining engagement
  trainingStats: {
    ...existingBlue.trainingStats,
    totalSessions: 156,
    totalHours: 234,
    currentStreak: 0, // Broken streak
    longestStreak: 31,
    thisMonth: {
      sessions: 1,
      hours: 1.5,
      techniques: 1,
      sparringRounds: 3,
      targetSessions: 12,
    },
    thisYear: {
      sessions: 24,
      hours: 36,
    },
    sparringRecord: { wins: 72, losses: 89, draws: 41 },
  },
  // Override progress summary
  progressSummary: {
    ...existingBlue.progressSummary,
    currentStripes: 1,
    timeAtBelt: '14 months',
    overallCompletion: 28,
    estimatedTimeToPromotion: 'Unknown - need consistency',
    strengths: ['Natural athleticism', 'Triangle', 'Guillotine'],
    weaknesses: ['Consistency', 'Guard passing', 'Composure', 'Follow-through'],
  },
};

/**
 * PURPLE BELT - AVERAGE: Sofia Rodriguez
 * "The Grinder" - Stable
 *
 * 28-year-old Physical Therapist, 5 years training.
 * Competitor mindset, trains 5x/week, systematic approach.
 * Low risk - deeply committed to the journey.
 *
 * Reference: /docs/personas/PERSONA_PROFILES.md
 */
const purpleAveragePersona: Persona = {
  ...existingPurple,
  id: 'persona-purple-average',
  key: 'purple-average',
  displayName: 'Sofia Rodriguez',
  archetype: 'The Grinder',
  riskLevel: 'low',
  status: 'stable',
  avatarUrl: '/avatars/sofia-rodriguez.jpg',
  // Override user data
  user: {
    ...existingPurple.user,
    id: 'user-purple-average-001',
    firstName: 'Sofia',
    lastName: 'Rodriguez',
    email: 'sofia.r@email.com',
    stripes: 1,
    goals: ['Win at Pans', 'Develop complete leg lock game', 'Start teaching fundamentals'],
  },
  // Override context profile for Sofia
  contextProfile: {
    ...existingPurple.contextProfile,
    userId: 'user-purple-average-001',
    name: 'Sofia Rodriguez',
    stripes: 1,
    trainingStartDate: '2021-01-01', // 5 years ago from Jan 2026
    currentBeltDate: '2025-05-15', // 8 months at purple from Jan 2026
    gymName: 'Atos HQ San Diego',
    trainingGoals: ['competition', 'fitness', 'community'] as const,
    targetFrequency: 5,
    birthYear: 1996,
    loggingPreference: 'voice',
    sessionCount: 612,
  },
  // Override training stats for high-volume competitor
  trainingStats: {
    ...existingPurple.trainingStats,
    totalSessions: 612,
    totalHours: 918,
    currentStreak: 15,
    longestStreak: 42,
    thisMonth: {
      sessions: 18,
      hours: 27,
      techniques: 12,
      sparringRounds: 54,
      targetSessions: 20,
    },
    thisYear: {
      sessions: 198,
      hours: 297,
    },
    sparringRecord: { wins: 298, losses: 189, draws: 145 },
  },
  // Override progress summary
  progressSummary: {
    ...existingPurple.progressSummary,
    currentStripes: 1,
    timeAtBelt: '8 months',
    overallCompletion: 45,
    estimatedTimeToPromotion: '18-24 months',
    strengths: ['Guard (lasso/spider)', 'Armbars', 'Triangles', 'Teaching', 'Competition mindset'],
    weaknesses: ['Leg locks', 'Top pressure', 'Wrestling'],
  },
};

/**
 * BROWN BELT - AVERAGE: Elena Kim
 * "The Veteran" - Refined
 *
 * 38-year-old CrossFit gym owner, 8.5 years training.
 * Focus on refinement and teaching, sustainable pace.
 * Very low risk - BJJ is integral to her identity.
 *
 * Reference: /docs/personas/PERSONA_PROFILES.md
 */
const brownAveragePersona: Persona = {
  ...existingBrown,
  id: 'persona-brown-average',
  key: 'brown-average',
  displayName: 'Elena Kim',
  archetype: 'The Veteran',
  riskLevel: 'very-low',
  status: 'refined',
  avatarUrl: '/avatars/elena-kim.jpg',
  // Override user data
  user: {
    ...existingBrown.user,
    id: 'user-brown-average-001',
    firstName: 'Elena',
    lastName: 'Kim',
    email: 'elena.k@email.com',
    stripes: 2,
    goals: ['Refine A-game', 'Develop teaching methodology', 'Stay healthy for black belt'],
  },
  // Override context profile for Elena
  contextProfile: {
    ...existingBrown.contextProfile,
    userId: 'user-brown-average-001',
    name: 'Elena Kim',
    stripes: 2,
    trainingStartDate: '2017-06-01', // 8.5 years ago from Jan 2026
    currentBeltDate: '2024-07-15', // 18 months at brown from Jan 2026
    gymName: 'Marcelo Garcia Seattle',
    trainingGoals: ['community', 'mental', 'fitness'] as const,
    targetFrequency: 4,
    birthYear: 1986,
    loggingPreference: 'text',
    sessionCount: 1247,
  },
  // Override training stats for veteran practitioner
  trainingStats: {
    ...existingBrown.trainingStats,
    totalSessions: 1247,
    totalHours: 1870,
    currentStreak: 6,
    longestStreak: 58,
    thisMonth: {
      sessions: 14,
      hours: 21,
      techniques: 5,
      sparringRounds: 42,
      targetSessions: 16,
    },
    thisYear: {
      sessions: 156,
      hours: 234,
    },
    sparringRecord: { wins: 589, losses: 312, draws: 284 },
  },
  // Override progress summary
  progressSummary: {
    ...existingBrown.progressSummary,
    currentStripes: 2,
    timeAtBelt: '18 months',
    overallCompletion: 78,
    estimatedTimeToPromotion: '6-12 months (when ready)',
    strengths: ['Chokes', 'Pressure passing', 'Teaching', 'Game IQ', 'Composure'],
    weaknesses: ['Leg locks (generational gap)', 'Recovery time', 'Wrestling'],
  },
};

// ===========================================
// EXPORTS
// ===========================================

export const personas: Persona[] = [
  whiteExcellingPersona,
  whiteAtRiskPersona,
  blueExcellingPersona,
  blueAtRiskPersona,
  purpleAveragePersona,
  brownAveragePersona,
];

export function getPersonaByKey(key: PersonaKey): Persona {
  const persona = personas.find(p => p.key === key);
  return persona || blueExcellingPersona; // Default to blue-excelling
}

export function getPersonasByBelt(belt: BeltLevel): Persona[] {
  return personas.filter(p => p.contextProfile.belt === belt);
}

export function getPersonaDisplayInfo(key: PersonaKey): { label: string; name: string; riskLevel: string } {
  const persona = getPersonaByKey(key);
  const beltLabel = persona.contextProfile.belt.charAt(0).toUpperCase() + persona.contextProfile.belt.slice(1);
  const statusLabel = persona.status.charAt(0).toUpperCase() + persona.status.slice(1);

  return {
    label: `${beltLabel} (${statusLabel})`,
    name: persona.displayName,
    riskLevel: persona.riskLevel,
  };
}

// Persona options for Settings dropdown
export const PERSONA_OPTIONS: { value: PersonaKey; label: string; name: string; belt: BeltLevel; riskLevel: RiskLevel }[] = [
  { value: 'white-excelling', label: 'White (Thriving)', name: 'Jake Thompson', belt: 'white', riskLevel: 'low' },
  { value: 'white-at-risk', label: 'White (Struggling)', name: 'David Morrison', belt: 'white', riskLevel: 'high' },
  { value: 'blue-excelling', label: 'Blue (Progressing)', name: 'Marcus Chen', belt: 'blue', riskLevel: 'moderate' },
  { value: 'blue-at-risk', label: 'Blue (Declining)', name: 'Ryan Torres', belt: 'blue', riskLevel: 'critical' },
  { value: 'purple-average', label: 'Purple (Stable)', name: 'Sofia Rodriguez', belt: 'purple', riskLevel: 'low' },
  { value: 'brown-average', label: 'Brown (Refined)', name: 'Elena Kim', belt: 'brown', riskLevel: 'very-low' },
];

export default personas;

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
  // Override context profile for Jake
  contextProfile: {
    ...existingWhite.contextProfile,
    userId: 'user-white-excelling-001',
    name: 'Jake Thompson',
    stripes: 3,
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
 * Uses existing white belt profile as-is,
 * representing a struggling older white belt
 */
const whiteAtRiskPersona: Persona = {
  ...existingWhite,
  id: 'persona-white-at-risk',
  key: 'white-at-risk',
  archetype: 'The Late Starter',
  riskLevel: 'high',
  status: 'struggling',
};

/**
 * BLUE BELT - EXCELLING: Marcus Chen
 * "The Dedicated Hobbyist" - Progressing
 *
 * Uses existing blue belt profile as-is
 */
const blueExcellingPersona: Persona = {
  ...existingBlue,
  id: 'persona-blue-excelling',
  key: 'blue-excelling',
  archetype: 'The Dedicated Hobbyist',
  riskLevel: 'moderate',
  status: 'progressing',
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
 * Uses existing purple belt profile as-is
 */
const purpleAveragePersona: Persona = {
  ...existingPurple,
  id: 'persona-purple-average',
  key: 'purple-average',
  archetype: 'The Grinder',
  riskLevel: 'low',
  status: 'stable',
};

/**
 * BROWN BELT - AVERAGE: Elena Kim
 * "The Veteran" - Refined
 *
 * Uses existing brown belt profile as-is
 */
const brownAveragePersona: Persona = {
  ...existingBrown,
  id: 'persona-brown-average',
  key: 'brown-average',
  archetype: 'The Veteran',
  riskLevel: 'very-low',
  status: 'refined',
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

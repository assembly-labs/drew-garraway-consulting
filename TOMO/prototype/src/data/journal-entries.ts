/**
 * Mock Journal Entries
 *
 * Simplified data model for the Journal page.
 * Data complexity scales by belt level:
 *
 * WHITE: date, type, duration, lesson_topic, notes
 * BLUE: + techniques_drilled, sparring_rounds, worked_well, struggles
 * PURPLE+: + submissions_given, submissions_received
 */

import type { JournalEntry } from '../components/features/JournalEntryCard';

// ===========================================
// MOCK DATA - Recent Sessions
// ===========================================

/**
 * Generate dates relative to today for realistic mock data
 */
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export const mockJournalEntriesV2: JournalEntry[] = [
  // Today
  {
    id: 'je-001',
    date: daysAgo(0),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Closed guard sweeps',
    notes: 'Focused on hip bump and scissor sweep. Feeling more confident with the timing.',
    techniques_drilled: ['Hip Bump Sweep', 'Scissor Sweep', 'Flower Sweep'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Hip bump timing', 'Guard retention'],
    struggles: ['Passing butterfly guard'],
    submissions_given: ['Triangle', 'Armbar'],
    submissions_received: ['Heel Hook'],
  },

  // Yesterday
  {
    id: 'je-002',
    date: daysAgo(1),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Leg lock defense',
    notes: 'Coach went over heel hook defense. Boot the leg and turn in.',
    techniques_drilled: ['Heel Hook Defense', 'Boot and Turn'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Leg pummeling'],
    struggles: ['Got caught in saddle', 'Inside heel hook'],
    submissions_given: ['Guillotine'],
    submissions_received: ['Inside Heel Hook', 'Ankle Lock'],
  },

  // 3 days ago
  {
    id: 'je-003',
    date: daysAgo(3),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Knee cut passing',
    notes: 'Details on hip pressure and backstep. Good drilling partner.',
    techniques_drilled: ['Knee Cut Pass', 'Backstep Pass'],
    did_spar: true,
    sparring_rounds: 6,
    worked_well: ['Knee cut felt sharp', 'Pressure passing'],
    struggles: ['Half guard recovery'],
    submissions_given: ['Cross Collar Choke', 'Armbar'],
    submissions_received: [],
  },

  // 5 days ago
  {
    id: 'je-004',
    date: daysAgo(5),
    time: '12:00',
    training_type: 'nogi',
    duration_minutes: 60,
    lesson_topic: 'Arm drags from seated',
    notes: 'Quick lunch session. Arm drags to back takes.',
    techniques_drilled: ['Arm Drag', 'Seat Belt Control'],
    did_spar: true,
    sparring_rounds: 3,
    worked_well: ['Arm drags landing'],
    struggles: ['Finishing the RNC'],
    submissions_given: [],
    submissions_received: ['RNC'],
  },

  // 6 days ago
  {
    id: 'je-005',
    date: daysAgo(6),
    time: '19:00',
    training_type: 'both',
    duration_minutes: 120,
    lesson_topic: null, // Open mat - no lesson
    notes: 'Sunday open mat. Lots of good rounds.',
    techniques_drilled: [],
    did_spar: true,
    sparring_rounds: 8,
    worked_well: ['Cardio held up', 'Sweeps from bottom'],
    struggles: ['Top pressure against bigger guys'],
    submissions_given: ['Triangle', 'Kimura', 'Armbar'],
    submissions_received: ['Bow and Arrow', 'Americana'],
  },

  // 8 days ago
  {
    id: 'je-006',
    date: daysAgo(8),
    time: '18:30',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Mount escapes',
    notes: 'Upa and elbow-knee escapes. Drilled a lot.',
    techniques_drilled: ['Upa Escape', 'Elbow-Knee Escape', 'Trap and Roll'],
    did_spar: false,
    sparring_rounds: null,
    worked_well: ['Hip movement'],
    struggles: ['Timing on upa'],
    submissions_given: [],
    submissions_received: [],
  },

  // 10 days ago
  {
    id: 'je-007',
    date: daysAgo(10),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Collar chokes from guard',
    notes: 'Cross choke, loop choke, and baseball bat. Good details.',
    techniques_drilled: ['Cross Collar Choke', 'Loop Choke', 'Baseball Bat Choke'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Grip fighting', 'Breaking posture'],
    struggles: ['Finishing the loop choke'],
    submissions_given: ['Cross Collar Choke'],
    submissions_received: ['Armbar'],
  },

  // 12 days ago
  {
    id: 'je-008',
    date: daysAgo(12),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Guillotine variations',
    notes: 'High elbow, arm-in, Marcelotine. Need to work on finishing.',
    techniques_drilled: ['High Elbow Guillotine', 'Arm-In Guillotine', 'Marcelotine'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Setting up the guillotine'],
    struggles: ['They kept getting their head out'],
    submissions_given: [],
    submissions_received: ['Triangle', 'D\'Arce'],
  },

  // 14 days ago
  {
    id: 'je-009',
    date: daysAgo(14),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Guard retention basics',
    notes: 'Framing, hip movement, leg pummeling. Fundamentals class.',
    techniques_drilled: ['Hip Escape', 'Leg Pummeling', 'Framing'],
    did_spar: true,
    sparring_rounds: 3,
    worked_well: ['Frames working better'],
    struggles: ['Got passed a lot still'],
    submissions_given: [],
    submissions_received: ['Ezekiel'],
  },

  // 16 days ago
  {
    id: 'je-010',
    date: daysAgo(16),
    time: '12:00',
    training_type: 'nogi',
    duration_minutes: 60,
    lesson_topic: 'Single leg defense',
    notes: 'Sprawl, whizzer, front headlock counters.',
    techniques_drilled: ['Sprawl', 'Whizzer', 'Front Headlock'],
    did_spar: false,
    sparring_rounds: null,
    worked_well: ['Sprawl timing'],
    struggles: [],
    submissions_given: [],
    submissions_received: [],
  },
];

// ===========================================
// HELPER: Transform to legacy format if needed
// ===========================================

export function transformToLegacySession(entry: JournalEntry) {
  return {
    id: entry.id,
    date: entry.date,
    time: entry.time || '19:00',
    trainingType: entry.training_type,
    durationMinutes: entry.duration_minutes || 60,
    techniques: entry.techniques_drilled,
    submissionsGiven: entry.submissions_given.length,
    submissionsReceived: entry.submissions_received.length,
    struggles: entry.struggles,
    workedWell: entry.worked_well,
    sparringRounds: entry.sparring_rounds,
    lessonTopic: entry.lesson_topic,
    techniquesDrilled: entry.techniques_drilled,
  };
}

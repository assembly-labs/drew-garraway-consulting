/**
 * Mock Journal Entries - V2 FORMAT (CURRENT)
 *
 * ✓ CURRENT: This is the preferred data format for new features.
 * Uses the JournalEntry type from types/journal-entry.ts
 *
 * USED BY: SessionHistory.tsx, JournalEntryCard.tsx
 *
 * Data complexity scales by belt level:
 * WHITE: date, type, duration, lesson_topic, notes
 * BLUE: + techniques_drilled, sparring_rounds, worked_well, struggles
 * PURPLE+: + submissions_given, submissions_received
 */

import type { JournalEntry } from '../types/journal-entry';

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
  // ===========================================
  // RECENT (Last 7 days)
  // ===========================================

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

  // ===========================================
  // WEEK 2 (8-14 days ago)
  // ===========================================

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

  // ===========================================
  // WEEK 3 (15-21 days ago)
  // ===========================================

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

  // 17 days ago
  {
    id: 'je-011',
    date: daysAgo(17),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Spider guard basics',
    notes: 'Grips, lasso, and transitioning to triangle. Fun class.',
    techniques_drilled: ['Spider Guard', 'Lasso Guard', 'Triangle from Spider'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Sleeve grips'],
    struggles: ['Getting swept when they stand'],
    submissions_given: ['Triangle'],
    submissions_received: ['Stack Pass'],
  },

  // 19 days ago
  {
    id: 'je-012',
    date: daysAgo(19),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Kimura trap system',
    notes: 'Kimura grip from everywhere. Really like this system.',
    techniques_drilled: ['Kimura Trap', 'Back Take from Kimura', 'Armbar from Kimura'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Kimura grip control'],
    struggles: ['They kept straightening arm'],
    submissions_given: ['Kimura'],
    submissions_received: ['Guillotine'],
  },

  // 21 days ago (3 weeks)
  {
    id: 'je-013',
    date: daysAgo(21),
    time: '19:00',
    training_type: 'both',
    duration_minutes: 120,
    lesson_topic: null,
    notes: 'Open mat. Focused on guard passing all day.',
    techniques_drilled: [],
    did_spar: true,
    sparring_rounds: 10,
    worked_well: ['Torreando pass', 'Leg weave'],
    struggles: ['De La Riva guard'],
    submissions_given: ['Armbar', 'RNC'],
    submissions_received: ['Triangle', 'Omoplata'],
  },

  // ===========================================
  // WEEK 4-5 (22-35 days ago)
  // ===========================================

  // 24 days ago
  {
    id: 'je-014',
    date: daysAgo(24),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Half guard bottom',
    notes: 'Knee shield, underhook battle, dog fight. Solid fundamentals.',
    techniques_drilled: ['Knee Shield', 'Underhook', 'Dog Fight'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Knee shield retention'],
    struggles: ['Getting flattened out'],
    submissions_given: [],
    submissions_received: ['Americana'],
  },

  // 26 days ago
  {
    id: 'je-015',
    date: daysAgo(26),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Wrestling basics',
    notes: 'Double leg, single leg, level change. Coach is ex-wrestler.',
    techniques_drilled: ['Double Leg', 'Single Leg', 'Level Change'],
    did_spar: true,
    sparring_rounds: 6,
    worked_well: ['Level change'],
    struggles: ['Finishing takedowns'],
    submissions_given: ['Guillotine'],
    submissions_received: [],
  },

  // 28 days ago (1 month)
  {
    id: 'je-016',
    date: daysAgo(28),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Side control escapes',
    notes: 'Frames, hip escape to guard, going to knees. Needed this.',
    techniques_drilled: ['Frame Escape', 'Hip Escape', 'Granby Roll'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Framing'],
    struggles: ['Timing the escape'],
    submissions_given: [],
    submissions_received: ['Kimura', 'Americana'],
  },

  // 31 days ago
  {
    id: 'je-017',
    date: daysAgo(31),
    time: '12:00',
    training_type: 'nogi',
    duration_minutes: 60,
    lesson_topic: 'Darce choke',
    notes: 'Setup from front headlock and side control. Tricky finish.',
    techniques_drilled: ['Darce Choke', 'Front Headlock'],
    did_spar: true,
    sparring_rounds: 3,
    worked_well: ['Entry to darce'],
    struggles: ['Locking it up'],
    submissions_given: [],
    submissions_received: ['RNC'],
  },

  // 33 days ago
  {
    id: 'je-018',
    date: daysAgo(33),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Back attacks',
    notes: 'Seatbelt, hooks, RNC and bow and arrow. Love back control.',
    techniques_drilled: ['Seatbelt Control', 'RNC', 'Bow and Arrow'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Maintaining back control'],
    struggles: ['They kept escaping before I could finish'],
    submissions_given: ['RNC', 'Bow and Arrow'],
    submissions_received: [],
  },

  // ===========================================
  // WEEK 6-7 (36-49 days ago)
  // ===========================================

  // 36 days ago
  {
    id: 'je-019',
    date: daysAgo(36),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Saddle entries',
    notes: 'Inside sankaku, outside sankaku, heel hook finishes.',
    techniques_drilled: ['Inside Sankaku', 'Outside Sankaku', 'Heel Hook'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Inside sankaku entry'],
    struggles: ['Finishing heel hooks'],
    submissions_given: [],
    submissions_received: ['Heel Hook'],
  },

  // 38 days ago
  {
    id: 'je-020',
    date: daysAgo(38),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'De La Riva guard',
    notes: 'Basic DLR, berimbolo entries, back takes. Complex stuff.',
    techniques_drilled: ['De La Riva Guard', 'Berimbolo', 'Baby Bolo'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['DLR hook'],
    struggles: ['Berimbolo timing'],
    submissions_given: ['Armbar'],
    submissions_received: ['Knee Cut Pass'],
  },

  // 42 days ago
  {
    id: 'je-021',
    date: daysAgo(42),
    time: '19:00',
    training_type: 'both',
    duration_minutes: 120,
    lesson_topic: null,
    notes: 'Competition training. Hard rounds, good cardio test.',
    techniques_drilled: [],
    did_spar: true,
    sparring_rounds: 12,
    worked_well: ['Cardio', 'Scrambles'],
    struggles: ['Gassed in later rounds'],
    submissions_given: ['Triangle', 'Armbar', 'Guillotine'],
    submissions_received: ['RNC', 'Armbar'],
  },

  // 45 days ago
  {
    id: 'je-022',
    date: daysAgo(45),
    time: '18:30',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Turtle attacks',
    notes: 'Clock choke, crucifix, back takes from turtle.',
    techniques_drilled: ['Clock Choke', 'Crucifix', 'Spiral Ride'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Clock choke setup'],
    struggles: ['They kept standing up'],
    submissions_given: ['Clock Choke'],
    submissions_received: [],
  },

  // 47 days ago
  {
    id: 'je-023',
    date: daysAgo(47),
    time: '19:00',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Anaconda and darce',
    notes: 'Front headlock attacks. Gator roll finishes.',
    techniques_drilled: ['Anaconda', 'Darce', 'Gator Roll'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Front headlock control'],
    struggles: ['Choosing anaconda vs darce'],
    submissions_given: ['Darce'],
    submissions_received: ['Guillotine'],
  },

  // ===========================================
  // WEEK 8-10 (50-70 days ago)
  // ===========================================

  // 52 days ago
  {
    id: 'je-024',
    date: daysAgo(52),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'X-guard sweeps',
    notes: 'Technical lift, ankle pick, stand up sweep. Fun guard.',
    techniques_drilled: ['X-Guard', 'Technical Lift', 'Ankle Pick Sweep'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Entry to x-guard'],
    struggles: ['Timing the sweep'],
    submissions_given: [],
    submissions_received: ['Toe Hold'],
  },

  // 56 days ago
  {
    id: 'je-025',
    date: daysAgo(56),
    time: '18:30',
    training_type: 'nogi',
    duration_minutes: 75,
    lesson_topic: 'Body lock passing',
    notes: 'Over under, body lock pass, smash pass. Pressure style.',
    techniques_drilled: ['Body Lock Pass', 'Over Under Pass', 'Smash Pass'],
    did_spar: true,
    sparring_rounds: 5,
    worked_well: ['Body lock control'],
    struggles: ['They kept recovering guard'],
    submissions_given: ['Arm Triangle'],
    submissions_received: [],
  },

  // 60 days ago (2 months)
  {
    id: 'je-026',
    date: daysAgo(60),
    time: '19:00',
    training_type: 'gi',
    duration_minutes: 90,
    lesson_topic: 'Omoplata system',
    notes: 'Omoplata from guard, sweeps, submissions. Good details.',
    techniques_drilled: ['Omoplata', 'Omoplata Sweep', 'Wristlock from Omoplata'],
    did_spar: true,
    sparring_rounds: 4,
    worked_well: ['Omoplata entry'],
    struggles: ['They kept rolling out'],
    submissions_given: ['Omoplata'],
    submissions_received: ['Stack Pass'],
  },

  // 65 days ago
  {
    id: 'je-027',
    date: daysAgo(65),
    time: '12:00',
    training_type: 'nogi',
    duration_minutes: 60,
    lesson_topic: 'Butterfly guard',
    notes: 'Elevations, arm drags, guillotine setups. Quick session.',
    techniques_drilled: ['Butterfly Guard', 'Butterfly Sweep', 'Arm Drag'],
    did_spar: true,
    sparring_rounds: 3,
    worked_well: ['Butterfly hooks'],
    struggles: ['Getting smashed flat'],
    submissions_given: [],
    submissions_received: ['Knee Slice'],
  },

  // 70 days ago
  {
    id: 'je-028',
    date: daysAgo(70),
    time: '19:00',
    training_type: 'both',
    duration_minutes: 120,
    lesson_topic: null,
    notes: 'Open mat before the holiday. Good vibes, lots of flow rolling.',
    techniques_drilled: [],
    did_spar: true,
    sparring_rounds: 8,
    worked_well: ['Flow rolling', 'Relaxed game'],
    struggles: ['Nothing specific'],
    submissions_given: ['Triangle', 'Kimura'],
    submissions_received: ['Armbar'],
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

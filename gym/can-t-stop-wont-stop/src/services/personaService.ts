/**
 * Persona Service - Can't Stop Won't Stop
 *
 * ALL 8 PERSONAS with proper distribution:
 * - Goggins: 25% - Relentless confrontation, brutal self-accountability
 * - Jocko: 20% - Disciplined, direct, no-nonsense leadership
 * - Arnold: 12% - Confident winner, motivational champion
 * - Stallone: 12% - Underdog fighter, gritty determination
 * - Bruce Lee: 10% - Philosophical warrior, practical wisdom with edge
 * - Renzo: 10% - Street-smart warrior, aggressive wisdom, fighting spirit
 * - Rickson: 8% - Calm mastery, invisible technique, breathing-focused
 * - Chuck: 3% - Absurd legendary status, deadpan humor (EASTER EGG)
 */

export type PersonaName =
  | 'Goggins'
  | 'Jocko'
  | 'Arnold'
  | 'Stallone'
  | 'Bruce Lee'
  | 'Renzo'
  | 'Rickson'
  | 'Chuck';

export interface PersonaMessage {
  persona: PersonaName;
  message: string;
}

// =============================================================================
// WORKOUT START
// =============================================================================
const workoutStart: PersonaMessage[] = [
  { persona: 'Jocko', message: 'Time to go to work. Get after it.' },
  { persona: 'Goggins', message: 'Timer starts. No excuses from here. Stay hard.' },
  { persona: 'Arnold', message: "Let's go! Time to get HUGE!" },
  { persona: 'Stallone', message: "One round at a time. Let's do this." },
  { persona: 'Bruce Lee', message: 'Empty your mind. Now fill it with iron.' },
  { persona: 'Renzo', message: "Time to fight. Let's fucking go." },
  { persona: 'Rickson', message: 'Breathe. Focus. Begin.' },
  { persona: 'Chuck', message: "Chuck Norris doesn't start workouts. Workouts start when Chuck arrives. You? Hit start." },
];

// =============================================================================
// MID-WORKOUT PUSH
// =============================================================================
const midWorkoutPush: PersonaMessage[] = [
  { persona: 'Goggins', message: "Who's gonna carry the boats? You or someone else?" },
  { persona: 'Goggins', message: 'Stay hard! No time for weakness!' },
  { persona: 'Goggins', message: 'Greatness doesn\'t care how you feel!' },
  { persona: 'Jocko', message: "Keep moving. Don't stop." },
  { persona: 'Jocko', message: 'Get after it.' },
  { persona: 'Arnold', message: 'Come on! One more! You got this!' },
  { persona: 'Arnold', message: 'No pain, no gain!' },
  { persona: 'Stallone', message: "It ain't over. Keep punching." },
  { persona: 'Bruce Lee', message: 'The successful warrior is the average man with laser-like focus. Focus.' },
  { persona: 'Renzo', message: "Push through. That's what warriors do." },
  { persona: 'Rickson', message: 'Breathe through it. Control your breath, control the moment.' },
  { persona: 'Chuck', message: "Time doesn't wait for you. You're not Chuck Norris." },
];

// =============================================================================
// PAUSE WARNINGS (CRITICAL EASTER EGG)
// =============================================================================
const pauseWarnings: PersonaMessage[] = [
  { persona: 'Goggins', message: "Taking a break? Your competition isn't." },
  { persona: 'Goggins', message: 'Quit whining, push!' },
  { persona: 'Jocko', message: 'Pausing. Weak.' },
  { persona: 'Arnold', message: 'No breaks for champions. Get back to work!' },
  { persona: 'Stallone', message: "You wanna quit? That ain't you." },
  { persona: 'Bruce Lee', message: "The mind is the limit. Pause your mind, pause your body. Don't." },
  { persona: 'Renzo', message: "You tap in training, you tap in life. Don't tap." },
  { persona: 'Rickson', message: 'Discomfort is temporary. Breathe. Continue.' },
  { persona: 'Chuck', message: 'Chuck Norris never pauses. Neither should you.' },
];

// =============================================================================
// WORKOUT COMPLETE
// =============================================================================
const workoutComplete: PersonaMessage[] = [
  { persona: 'Jocko', message: 'Done. Good work.' },
  { persona: 'Goggins', message: 'Finished. That\'s what we do. Stay hard.' },
  { persona: 'Arnold', message: 'COMPLETE! You are a MACHINE!' },
  { persona: 'Stallone', message: 'You went the distance. Respect.' },
  { persona: 'Bruce Lee', message: 'Knowing is not enough. You applied. That\'s the way.' },
  { persona: 'Renzo', message: 'Session done. That\'s how you train like a fighter.' },
  { persona: 'Rickson', message: 'Complete. Breathe. Recover. Repeat tomorrow.' },
  { persona: 'Chuck', message: 'Workout complete. Chuck Norris is aware. He\'s unimpressed, but aware.' },
];

// =============================================================================
// WORKOUT FAILED (Time ran out)
// =============================================================================
const workoutFailed: PersonaMessage[] = [
  { persona: 'Jocko', message: "Time's up. You failed. Learn from it." },
  { persona: 'Goggins', message: 'Ran out of time. Plan better or move faster. This is on you.' },
  { persona: 'Arnold', message: 'You didn\'t finish! Next time, CRUSH IT!' },
  { persona: 'Stallone', message: 'Got knocked out. Happens. Come back stronger tomorrow.' },
  { persona: 'Bruce Lee', message: "Defeat is a state of mind. You're not defeated. Just unprepared. Fix it." },
  { persona: 'Renzo', message: 'Ran out of time? You got submitted by the clock. Train harder.' },
  { persona: 'Rickson', message: 'Incomplete. Analyze. Breathe. Adjust. Return stronger.' },
  { persona: 'Chuck', message: 'Time beat you. Chuck Norris beat time in an arm wrestle. Be more like Chuck.' },
];

// =============================================================================
// STAGNATION (3+ weeks same weight)
// =============================================================================
const stagnationAlert: PersonaMessage[] = [
  { persona: 'Jocko', message: '3 weeks. Same weight. Unacceptable. Add weight.' },
  { persona: 'Goggins', message: 'Stuck at 185? Comfortable? That\'s fucking weak. Level up.' },
  { persona: 'Arnold', message: 'You\'re better than this! Add weight NOW!' },
  { persona: 'Stallone', message: "Nobody's gonna hit as hard as life. But you're hitting the same weight? Come on." },
  { persona: 'Bruce Lee', message: 'Adaptation without progress is death. Add weight or die stagnant.' },
  { persona: 'Renzo', message: 'Same weight for 3 weeks? That\'s bullshit. Fight harder.' },
  { persona: 'Rickson', message: 'Your body adapted weeks ago. The weight must evolve. Add more.' },
  { persona: 'Chuck', message: 'Chuck Norris added 500 lbs in 3 weeks. You added zero. Fix it.' },
];

// =============================================================================
// PERSONAL RECORDS (PRs)
// =============================================================================
const prAchieved: PersonaMessage[] = [
  { persona: 'Jocko', message: 'New PR. Good.' },
  { persona: 'Goggins', message: 'PR logged. Now beat it next week. Stay hard.' },
  { persona: 'Arnold', message: 'YES! That\'s a CHAMPION! New PR!' },
  { persona: 'Stallone', message: 'That\'s what I\'m talking about. You earned that.' },
  { persona: 'Bruce Lee', message: 'You just became more than you were. Good. Do it again.' },
  { persona: 'Renzo', message: 'That\'s a warrior\'s PR. Respect.' },
  { persona: 'Rickson', message: 'New record. Breathe it in. Tomorrow, break it again.' },
  { persona: 'Chuck', message: 'PR achieved. Chuck Norris nods with approval. Briefly.' },
];

// =============================================================================
// PHILOSOPHICAL DROPS
// =============================================================================
const philosophicalMoments: PersonaMessage[] = [
  { persona: 'Jocko', message: 'Discipline equals freedom. Stay disciplined.' },
  { persona: 'Goggins', message: 'Suffering is the true test of life. Embrace the suck.' },
  { persona: 'Arnold', message: 'The mind always gives up before the body. Don\'t listen.' },
  { persona: 'Stallone', message: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving." },
  { persona: 'Bruce Lee', message: 'Absorb what is useful. Reject what is useless. Add what is specifically your own. Now shut up and lift.' },
  { persona: 'Renzo', message: "If you're thinking, you're late. Train so hard your body knows before your mind does." },
  { persona: 'Rickson', message: 'Comfort in the uncomfortable. This is where warriors are born. Breathe and become.' },
  { persona: 'Chuck', message: 'When Chuck Norris does a pushup, he doesn\'t push himself up. He pushes the world down. Physics bends for legends.' },
];

// =============================================================================
// FORM REMINDERS
// =============================================================================
const formReminders: PersonaMessage[] = [
  { persona: 'Jocko', message: 'Form first. Speed second. Execute properly.' },
  { persona: 'Goggins', message: 'Sloppy reps don\'t count. Do it right or do it again.' },
  { persona: 'Arnold', message: 'SQUEEZE! Control the weight! Form is EVERYTHING!' },
  { persona: 'Stallone', message: 'Technique wins fights. Control the bar.' },
  { persona: 'Bruce Lee', message: 'A punch is just a punch. Until it\'s perfect. Same with reps. Be perfect.' },
  { persona: 'Renzo', message: 'Bad technique gets you hurt. Control the weight or drop it.' },
  { persona: 'Rickson', message: 'Invisible technique. Perfect position. Breathe and execute with precision.' },
  { persona: 'Chuck', message: 'Chuck\'s form is perfect because physics adjusts to Chuck. You? Fix your form.' },
];

// =============================================================================
// WEIGHTED RANDOM SELECTION
// =============================================================================

/**
 * Weighted random selection based on persona distribution:
 * Goggins: 25%, Jocko: 20%, Arnold: 12%, Stallone: 12%,
 * Bruce Lee: 10%, Renzo: 10%, Rickson: 8%, Chuck: 3%
 */
function weightedRandom<T extends PersonaMessage>(items: T[]): T {
  // Group messages by persona
  const byPersona: Record<string, T[]> = {};
  items.forEach(item => {
    if (!byPersona[item.persona]) {
      byPersona[item.persona] = [];
    }
    byPersona[item.persona].push(item);
  });

  // Define weights
  const weights: Record<PersonaName, number> = {
    Goggins: 0.25,
    Jocko: 0.20,
    Arnold: 0.12,
    Stallone: 0.12,
    'Bruce Lee': 0.10,
    Renzo: 0.10,
    Rickson: 0.08,
    Chuck: 0.03,
  };

  // Calculate cumulative weights for available personas
  const available: { persona: PersonaName; cumulative: number; items: T[] }[] = [];
  let cumulative = 0;

  (Object.keys(byPersona) as PersonaName[]).forEach(persona => {
    if (byPersona[persona].length > 0) {
      cumulative += weights[persona];
      available.push({
        persona,
        cumulative,
        items: byPersona[persona],
      });
    }
  });

  // Select persona based on weighted random
  const rand = Math.random() * cumulative;
  for (const entry of available) {
    if (rand <= entry.cumulative) {
      // Return random message from selected persona
      return entry.items[Math.floor(Math.random() * entry.items.length)];
    }
  }

  // Fallback (should never reach here)
  return items[Math.floor(Math.random() * items.length)];
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const personaService = {
  /**
   * Get a workout start message
   */
  getWorkoutStart(): PersonaMessage {
    return weightedRandom(workoutStart);
  },

  /**
   * Get a mid-workout push message
   */
  getMidWorkoutPush(): PersonaMessage {
    return weightedRandom(midWorkoutPush);
  },

  /**
   * Get a pause warning message (CRITICAL EASTER EGG)
   */
  getPauseWarning(): PersonaMessage {
    return weightedRandom(pauseWarnings);
  },

  /**
   * Get a workout complete message
   */
  getWorkoutComplete(): PersonaMessage {
    return weightedRandom(workoutComplete);
  },

  /**
   * Get a workout failed message
   */
  getWorkoutFailed(): PersonaMessage {
    return weightedRandom(workoutFailed);
  },

  /**
   * Get a stagnation alert message
   */
  getStagnationAlert(): PersonaMessage {
    return weightedRandom(stagnationAlert);
  },

  /**
   * Get a PR achievement message
   */
  getPRAchieved(): PersonaMessage {
    return weightedRandom(prAchieved);
  },

  /**
   * Get a philosophical moment
   */
  getPhilosophicalMoment(): PersonaMessage {
    return weightedRandom(philosophicalMoments);
  },

  /**
   * Get a form reminder
   */
  getFormReminder(): PersonaMessage {
    return weightedRandom(formReminders);
  },
};

export default personaService;

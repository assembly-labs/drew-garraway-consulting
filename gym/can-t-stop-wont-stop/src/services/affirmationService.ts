/**
 * Affirmation Service - Can't Stop Won't Stop
 *
 * Celebration messages for completing exercises
 * These appear as full-screen green overlays when user dismisses a completed exercise
 */

export interface Affirmation {
  message: string;
  emoji?: string;
}

const affirmations: Affirmation[] = [
  { message: 'BEAST MODE!', emoji: '💪' },
  { message: 'CRUSHING IT!', emoji: '🔥' },
  { message: 'ONE DOWN, KEEP GOING!', emoji: '⚡' },
  { message: "THAT'S WARRIOR SPIRIT!", emoji: '⚔️' },
  { message: 'UNSTOPPABLE!', emoji: '🚀' },
  { message: 'VICTORY!', emoji: '✅' },
  { message: 'RELENTLESS!', emoji: '💯' },
  { message: 'NO QUIT IN YOU!', emoji: '🔨' },
  { message: 'SAVAGE EFFORT!', emoji: '🦁' },
  { message: 'MONSTER WORK!', emoji: '👹' },
  { message: 'DOMINANT!', emoji: '👑' },
  { message: 'IRON WILL!', emoji: '🏋️' },
  { message: 'STAY HARD!', emoji: '💀' },
  { message: 'BUILT DIFFERENT!', emoji: '🗿' },
  { message: 'ELITE MENTALITY!', emoji: '🎯' },
  { message: 'WORK DONE!', emoji: '✊' },
  { message: 'PROGRESS MADE!', emoji: '📈' },
  { message: 'EXECUTED!', emoji: '⚡' },
  { message: 'LOCKED IN!', emoji: '🔒' },
  { message: 'LEVELS UP!', emoji: '⬆️' },
];

/**
 * Get a random affirmation message
 */
export function getAffirmation(): Affirmation {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

export default {
  getAffirmation,
};

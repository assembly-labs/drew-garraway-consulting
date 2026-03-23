import type { PowerCard, FeelingsCard } from './types';

export function canMatch(powerCard: PowerCard, feelingsCard: FeelingsCard): boolean {
  return powerCard.emotionTypes.includes(feelingsCard.emotion);
}

export function getMatchablePowerCards(hand: PowerCard[], feelingsCard: FeelingsCard): PowerCard[] {
  return hand.filter(pc => canMatch(pc, feelingsCard));
}

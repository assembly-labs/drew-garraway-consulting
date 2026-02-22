import type { PowerCard, FeelingsCard } from '../../game/types';
import { PowerCardDisplay } from '../cards/PowerCard';
import { getMatchablePowerCards } from '../../game/matching';

interface PlayerHandProps {
  hand: PowerCard[];
  onSelectCard?: (cardId: string) => void;
  selectedCardId?: string | null;
  highlightForFeelings?: FeelingsCard | null;
}

export function PlayerHand({
  hand,
  onSelectCard,
  selectedCardId,
  highlightForFeelings,
}: PlayerHandProps) {
  const matchableIds = highlightForFeelings
    ? new Set(getMatchablePowerCards(hand, highlightForFeelings).map(c => c.id))
    : null;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 px-1">
        {hand.map(card => (
          <PowerCardDisplay
            key={card.id}
            card={card}
            onClick={onSelectCard ? () => onSelectCard(card.id) : undefined}
            selected={selectedCardId === card.id}
            glowing={matchableIds?.has(card.id) ?? false}
            dimmed={matchableIds !== null && !matchableIds.has(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

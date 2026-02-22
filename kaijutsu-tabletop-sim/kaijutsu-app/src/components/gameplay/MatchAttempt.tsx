import type { FeelingsCard } from '../../game/types';
import { useGame } from '../../hooks/useGame';
import { EmpathyCardDisplay } from '../cards/EmpathyCard';
import { PlayerHand } from './PlayerHand';

interface MatchAttemptProps {
  card: FeelingsCard;
}

export function MatchAttempt({ card }: MatchAttemptProps) {
  const { state, attemptMatch, sendToActive } = useGame();
  const currentPlayer = state.players[state.activePlayerIndex];
  const isFailed = state.phase === 'match-fail';

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <p className="text-center text-sm font-medium text-gray-500">
          {isFailed ? 'That card doesn\'t match. Try another or send to Active Empathy.' : 'Choose a Power Card that matches this feeling!'}
        </p>
      </div>

      {/* Feelings Card display */}
      <div className="flex flex-1 items-center justify-center p-4">
        <EmpathyCardDisplay card={card} />
      </div>

      {/* Actions */}
      <div className="bg-white p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <p className="mb-2 text-sm font-medium text-gray-500">
          Player {currentPlayer?.id}'s Hand — tap a glowing card to match
        </p>
        <PlayerHand
          hand={currentPlayer?.hand ?? []}
          onSelectCard={attemptMatch}
          highlightForFeelings={card}
        />
        <button
          onClick={sendToActive}
          className="mt-3 w-full rounded-xl bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-transform active:scale-95"
        >
          No match — Send to Active Empathy
        </button>
      </div>
    </div>
  );
}

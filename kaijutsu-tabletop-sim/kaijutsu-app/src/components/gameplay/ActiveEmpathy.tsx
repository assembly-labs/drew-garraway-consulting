import { useState } from 'react';
import type { FeelingsCard } from '../../game/types';
import { useGame } from '../../hooks/useGame';
import { EmpathyCardDisplay } from '../cards/EmpathyCard';
import { PlayerHand } from './PlayerHand';
import { EMOTION_EMOJI } from '../../game/constants';

export function ActiveEmpathy() {
  const { state, attemptMatchActive } = useGame();
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingsCard | null>(null);
  const currentPlayer = state.players[state.activePlayerIndex];

  if (state.activeEmpathy.length === 0) return null;

  // Sort by emotion
  const sorted = [...state.activeEmpathy].sort((a, b) => a.emotion.localeCompare(b.emotion));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          Active Empathy
        </p>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {state.activeEmpathy.length}
        </span>
      </div>

      {/* Card previews */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sorted.map(card => (
          <button
            key={card.id}
            onClick={() => setSelectedFeelings(selectedFeelings?.id === card.id ? null : card)}
            className={`flex h-14 min-w-14 items-center justify-center rounded-xl border-2 text-xl transition-all active:scale-95 ${
              selectedFeelings?.id === card.id
                ? 'border-gray-900 bg-gray-100 ring-2 ring-gray-900/20'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {EMOTION_EMOJI[card.emotion]}
          </button>
        ))}
      </div>

      {/* Expanded card + match UI */}
      {selectedFeelings && state.phase === 'playing' && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3">
          <EmpathyCardDisplay card={selectedFeelings} />
          <p className="mt-3 text-xs font-medium text-gray-500">
            Tap a matching Power Card from your hand:
          </p>
          <div className="mt-2">
            <PlayerHand
              hand={currentPlayer?.hand ?? []}
              onSelectCard={(powerCardId) => attemptMatchActive(selectedFeelings.id, powerCardId)}
              highlightForFeelings={selectedFeelings}
            />
          </div>
          <button
            onClick={() => setSelectedFeelings(null)}
            className="mt-2 w-full rounded-lg bg-gray-200 px-3 py-2 text-xs font-medium text-gray-600 active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

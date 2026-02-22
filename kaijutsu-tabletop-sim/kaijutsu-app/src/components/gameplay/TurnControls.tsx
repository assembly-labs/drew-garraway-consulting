import { useGame } from '../../hooks/useGame';

export function TurnControls() {
  const { state, drawCard } = useGame();
  const canDraw = state.phase === 'playing' && state.centralPile.length > 0;

  return (
    <div className="flex gap-3">
      {canDraw && (
        <button
          onClick={drawCard}
          className="flex-1 rounded-2xl bg-gray-900 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Draw Card
        </button>
      )}
      {!canDraw && state.phase === 'playing' && state.centralPile.length === 0 && (
        <p className="flex-1 rounded-2xl bg-gray-100 px-6 py-4 text-center text-sm font-medium text-gray-500">
          No cards left to draw. Match Active Empathy cards or the game ends.
        </p>
      )}
    </div>
  );
}

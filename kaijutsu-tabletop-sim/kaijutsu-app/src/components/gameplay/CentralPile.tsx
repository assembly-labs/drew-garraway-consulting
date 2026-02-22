import { useGame } from '../../hooks/useGame';
import { CardBack } from '../cards/CardBack';

export function CentralPile() {
  const { state, drawCard } = useGame();
  const canDraw = state.phase === 'playing' && state.centralPile.length > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      {state.centralPile.length > 0 ? (
        <CardBack
          count={state.centralPile.length}
          onClick={canDraw ? drawCard : undefined}
          label="Tap to Draw"
        />
      ) : (
        <div className="flex h-48 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-400">Pile empty</p>
        </div>
      )}
    </div>
  );
}

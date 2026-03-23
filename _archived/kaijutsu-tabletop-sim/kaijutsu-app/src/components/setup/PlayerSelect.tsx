import { useGame } from '../../hooks/useGame';
import { MIN_PLAYERS, MAX_PLAYERS } from '../../game/constants';

export function PlayerSelect() {
  const { state, setPlayerCount, startGame } = useGame();
  const counts = Array.from(
    { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
    (_, i) => i + MIN_PLAYERS
  );

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        How many players?
      </h2>
      <div className="mt-8 flex gap-4">
        {counts.map(n => (
          <button
            key={n}
            onClick={() => setPlayerCount(n)}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold shadow-md transition-all active:scale-95 sm:h-24 sm:w-24 sm:text-3xl ${
              state.playerCount === n
                ? 'bg-gray-900 text-white ring-4 ring-gray-900/30'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {state.playerCount >= MIN_PLAYERS && (
        <button
          onClick={startGame}
          className="mt-8 w-full max-w-xs rounded-2xl bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95 sm:w-auto"
        >
          Begin
        </button>
      )}
    </div>
  );
}

import { useGame } from '../../hooks/useGame';

export function WelcomeScreen() {
  const { state, setPlayerCount, enterFacilitatorSetup } = useGame();
  const hasFavorites = state.favoritedPowerCardIds.size + state.favoritedFeelingsCardIds.size > 0;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
        KAIJUTSU
      </h1>
      <p className="mt-3 text-xl text-gray-600 sm:text-2xl">
        Battle with Cards. Grow with Heart.
      </p>
      <p className="mt-2 text-base text-gray-400">
        A mindfulness card game for 2-4 players
      </p>
      <button
        onClick={() => setPlayerCount(0)}
        className="mt-10 w-full max-w-xs rounded-2xl bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95 sm:w-auto"
      >
        Start Game
      </button>
      <button
        onClick={enterFacilitatorSetup}
        className="mt-4 text-sm font-medium text-gray-400 underline decoration-gray-300 transition-colors hover:text-gray-600"
      >
        Facilitator Setup
        {hasFavorites && (
          <span className="ml-1 text-green-500">
            ({state.favoritedPowerCardIds.size + state.favoritedFeelingsCardIds.size} selected)
          </span>
        )}
      </button>
    </div>
  );
}

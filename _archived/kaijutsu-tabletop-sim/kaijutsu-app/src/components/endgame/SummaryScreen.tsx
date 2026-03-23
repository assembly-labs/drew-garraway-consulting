import { useGame } from '../../hooks/useGame';
import { EMOTION_EMOJI, CHARACTER_COLORS } from '../../game/constants';

export function SummaryScreen() {
  const { state, newGame } = useGame();
  const isFullWin = state.completedPairs.length >= state.totalEmpathyCards;

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-4xl">
          {isFullWin ? '\u{1F389}' : '\u{1F31F}'}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          {isFullWin ? 'Amazing work, team!' : 'Great effort, team!'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {isFullWin
            ? `You matched all ${state.totalEmpathyCards} feelings!`
            : `You matched ${state.completedPairs.length} of ${state.totalEmpathyCards} feelings!`
          }
        </p>
      </div>

      {/* Completed pairs list */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-4 text-center text-sm font-medium text-gray-500">
          Talk about it! Which technique would you use in real life?
        </p>
        <div className="mx-auto max-w-lg space-y-3">
          {state.completedPairs.map((pair, i) => {
            const charColor = CHARACTER_COLORS[pair.powerCard.character] || '#666';
            return (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {EMOTION_EMOJI[pair.feelingsCard.emotion]}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {pair.feelingsCard.event}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg">&rarr;</span>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: charColor }}
                      >
                        {pair.powerCard.character}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {pair.powerCard.techniqueName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Play again */}
      <div className="bg-white p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <button
          onClick={newGame}
          className="w-full rounded-2xl bg-gray-900 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

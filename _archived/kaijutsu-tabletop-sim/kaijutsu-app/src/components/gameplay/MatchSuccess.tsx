import { useGame } from '../../hooks/useGame';
import { EMOTION_EMOJI, CHARACTER_COLORS } from '../../game/constants';

export function MatchSuccess() {
  const { state, acknowledgeMatch } = useGame();
  const pair = state.completedPairs[state.completedPairs.length - 1];
  if (!pair) return null;

  const { feelingsCard, powerCard } = pair;
  const charColor = CHARACTER_COLORS[powerCard.character] || '#666';

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="animate-slide-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="mb-4 text-center text-4xl">
          {EMOTION_EMOJI[feelingsCard.emotion]}
        </p>

        <p className="text-center text-sm font-bold uppercase tracking-wider text-green-600">
          Great Match!
        </p>

        <p className="mt-3 text-center text-base text-gray-600">
          {feelingsCard.event}
        </p>

        <div className="my-4 text-center text-2xl text-gray-300">&darr;</div>

        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: charColor + '15', borderLeft: `4px solid ${charColor}` }}
        >
          <p className="text-sm font-bold" style={{ color: charColor }}>
            {powerCard.character}'s {powerCard.techniqueName}
          </p>
          <p className="mt-2 text-base leading-relaxed text-gray-800">
            {powerCard.techniqueDescription}
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-gray-400">
          Read the technique out loud together!
        </p>

        <button
          onClick={acknowledgeMatch}
          className="mt-4 w-full rounded-2xl bg-gray-900 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

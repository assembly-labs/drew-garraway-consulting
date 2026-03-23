import type { ActionCard } from '../../game/types';
import { useGame } from '../../hooks/useGame';

interface ActionPromptProps {
  card: ActionCard;
}

export function ActionPrompt({ card }: ActionPromptProps) {
  const { dismissAction } = useGame();

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="animate-slide-up w-full max-w-md rounded-3xl bg-amber-50 p-8 shadow-2xl">
        <div className="mb-4 text-center text-3xl">
          <span aria-hidden="true">&#9889;</span>
        </div>

        <p className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-amber-600">
          ACTION CARD
        </p>

        <p className="text-center text-2xl font-semibold leading-relaxed text-gray-900">
          {card.promptText}
        </p>

        {card.groupAction && (
          <p className="mt-3 text-center text-sm font-medium text-amber-500">
            Everyone does this together!
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Perform this action, then tap Done
        </p>

        <button
          onClick={dismissAction}
          className="mt-4 w-full rounded-2xl bg-gray-900 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
}

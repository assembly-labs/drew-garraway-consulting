import { useGame } from '../../hooks/useGame';

export function CompletedEvents() {
  const { state } = useGame();

  if (state.completedPairs.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">Completed</p>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {state.completedPairs.length}/{state.totalEmpathyCards}
        </span>
      </div>
    </div>
  );
}

import { useGame } from '../../hooks/useGame';

export function Header() {
  const { state } = useGame();
  const currentPlayer = state.players[state.activePlayerIndex];

  return (
    <header className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white shadow-md">
      <h1 className="text-lg font-bold tracking-wide">KAIJUTSU</h1>
      <div className="flex items-center gap-4 text-sm">
        <span className="rounded-full bg-white/20 px-3 py-1 font-medium">
          Player {currentPlayer?.id}'s Turn
        </span>
        <span className="text-gray-300">
          {state.completedPairs.length}/{state.totalEmpathyCards} matched
        </span>
      </div>
    </header>
  );
}

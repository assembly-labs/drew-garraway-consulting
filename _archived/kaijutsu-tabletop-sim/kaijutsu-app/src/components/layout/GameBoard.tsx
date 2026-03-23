import { Header } from './Header';
import { useGame } from '../../hooks/useGame';
import { isActionCard, isFeelingsCard } from '../../game/types';
import { CentralPile } from '../gameplay/CentralPile';
import { PlayerHand } from '../gameplay/PlayerHand';
import { ActionPrompt } from '../gameplay/ActionPrompt';
import { MatchAttempt } from '../gameplay/MatchAttempt';
import { MatchSuccess } from '../gameplay/MatchSuccess';
import { ActiveEmpathy } from '../gameplay/ActiveEmpathy';
import { CompletedEvents } from '../gameplay/CompletedEvents';
import { TurnControls } from '../gameplay/TurnControls';

export function GameBoard() {
  const { state } = useGame();
  const currentPlayer = state.players[state.activePlayerIndex];

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        {/* Main game area */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Central area — draw pile + turn controls */}
          <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <CentralPile />
            <TurnControls />
          </section>

          {/* Player hand */}
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-medium text-gray-500">
              Player {currentPlayer?.id}'s Hand
            </p>
            {currentPlayer && (
              <PlayerHand hand={currentPlayer.hand} />
            )}
          </section>
        </div>

        {/* Sidebar — active empathy + completed */}
        <div className="flex flex-col gap-4 lg:w-80">
          <ActiveEmpathy />
          <CompletedEvents />
        </div>
      </main>

      {/* Overlay modals based on phase */}
      {state.phase === 'action-prompt' && state.currentDrawnCard && isActionCard(state.currentDrawnCard) && (
        <ActionPrompt card={state.currentDrawnCard} />
      )}

      {(state.phase === 'empathy-drawn' || state.phase === 'match-fail') && state.currentDrawnCard && isFeelingsCard(state.currentDrawnCard) && (
        <MatchAttempt card={state.currentDrawnCard} />
      )}

      {state.phase === 'match-success' && (
        <MatchSuccess />
      )}
    </div>
  );
}

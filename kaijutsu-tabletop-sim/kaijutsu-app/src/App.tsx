import { GameProvider } from './context/GameContext';
import { useGame } from './hooks/useGame';
import { WelcomeScreen } from './components/setup/WelcomeScreen';
import { PlayerSelect } from './components/setup/PlayerSelect';
import { FacilitatorSetup } from './components/setup/FacilitatorSetup';
import { GameBoard } from './components/layout/GameBoard';
import { SummaryScreen } from './components/endgame/SummaryScreen';

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'facilitator-setup':
      return <FacilitatorSetup />;
    case 'setup':
      return <PlayerSelect />;
    case 'game-won':
      return <SummaryScreen />;
    default:
      return <GameBoard />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;

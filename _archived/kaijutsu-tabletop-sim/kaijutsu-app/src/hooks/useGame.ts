import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  const { state, dispatch } = context;

  return {
    state,
    setPlayerCount: (count: number) => dispatch({ type: 'SET_PLAYER_COUNT', count }),
    startGame: () => dispatch({ type: 'START_GAME' }),
    drawCard: () => dispatch({ type: 'DRAW_CARD' }),
    dismissAction: () => dispatch({ type: 'DISMISS_ACTION' }),
    attemptMatch: (powerCardId: string) => dispatch({ type: 'ATTEMPT_MATCH', powerCardId }),
    attemptMatchActive: (feelingsCardId: string, powerCardId: string) =>
      dispatch({ type: 'ATTEMPT_MATCH_ACTIVE', feelingsCardId, powerCardId }),
    sendToActive: () => dispatch({ type: 'SEND_TO_ACTIVE' }),
    acknowledgeMatch: () => dispatch({ type: 'ACKNOWLEDGE_MATCH' }),
    nextTurn: () => dispatch({ type: 'NEXT_TURN' }),
    newGame: () => dispatch({ type: 'NEW_GAME' }),
    enterFacilitatorSetup: () => dispatch({ type: 'ENTER_FACILITATOR_SETUP' }),
    exitFacilitatorSetup: () => dispatch({ type: 'EXIT_FACILITATOR_SETUP' }),
    toggleFavoritePower: (cardId: string) => dispatch({ type: 'TOGGLE_FAVORITE_POWER', cardId }),
    toggleFavoriteFeelings: (cardId: string) => dispatch({ type: 'TOGGLE_FAVORITE_FEELINGS', cardId }),
  };
}

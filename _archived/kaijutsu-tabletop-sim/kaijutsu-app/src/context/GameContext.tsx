import { createContext, useReducer, type ReactNode } from 'react';
import type { GameState, GameAction } from '../game/types';
import { gameReducer, createInitialState } from '../game/engine';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  return (
    <GameContext value={{ state, dispatch }}>
      {children}
    </GameContext>
  );
}

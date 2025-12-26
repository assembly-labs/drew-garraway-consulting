'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/stores/game-store';
import {
  MOCK_USER,
  MOCK_GAME,
  MOCK_PLAYERS,
  MOCK_LEADERBOARD,
  MOCK_REPORTS,
  MOCK_GAMES_WITH_PLAYERS,
  isDevMode,
} from './mock-data';

export function useDevMode() {
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsDevModeActive(isDevMode());
  }, [searchParams]);

  return isDevModeActive;
}

export function useDevModeData() {
  const isDevModeActive = useDevMode();
  const {
    setUser,
    setCurrentGame,
    setPlayers,
    setMyPlayer,
    setLeaderboard,
    setRecentReports,
  } = useGameStore();

  useEffect(() => {
    if (isDevModeActive) {
      setUser(MOCK_USER);
      setCurrentGame(MOCK_GAME);
      setPlayers(MOCK_PLAYERS);
      setMyPlayer(MOCK_PLAYERS[0]);
      setLeaderboard(MOCK_LEADERBOARD);
      setRecentReports(MOCK_REPORTS);
    }
  }, [isDevModeActive, setUser, setCurrentGame, setPlayers, setMyPlayer, setLeaderboard, setRecentReports]);

  return {
    isDevMode: isDevModeActive,
    mockUser: MOCK_USER,
    mockGame: MOCK_GAME,
    mockPlayers: MOCK_PLAYERS,
    mockLeaderboard: MOCK_LEADERBOARD,
    mockReports: MOCK_REPORTS,
    mockGamesWithPlayers: MOCK_GAMES_WITH_PLAYERS,
  };
}

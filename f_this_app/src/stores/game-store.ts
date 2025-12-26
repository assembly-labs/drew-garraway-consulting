import { create } from 'zustand';
import { Game, GamePlayer, User, CurseReport, LeaderboardEntry } from '@/types/database';

interface GameState {
  // Current user
  user: User | null;
  setUser: (user: User | null) => void;

  // Active game
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;

  // Players in current game
  players: GamePlayer[];
  setPlayers: (players: GamePlayer[]) => void;

  // Current user's player record
  myPlayer: GamePlayer | null;
  setMyPlayer: (player: GamePlayer | null) => void;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  setLeaderboard: (entries: LeaderboardEntry[]) => void;

  // Recent reports (for activity feed)
  recentReports: CurseReport[];
  addReport: (report: CurseReport) => void;
  setRecentReports: (reports: CurseReport[]) => void;

  // UI state
  isReporting: boolean;
  setIsReporting: (isReporting: boolean) => void;
  selectedPlayer: GamePlayer | null;
  setSelectedPlayer: (player: GamePlayer | null) => void;

  // Around Kids mode (local toggle state)
  aroundKidsActive: boolean;
  setAroundKidsActive: (active: boolean) => void;

  // Modals
  showWeeklyRecap: boolean;
  setShowWeeklyRecap: (show: boolean) => void;
  showNiceWordModal: boolean;
  setShowNiceWordModal: (show: boolean) => void;

  // Reset store
  reset: () => void;
}

const initialState = {
  user: null,
  currentGame: null,
  players: [],
  myPlayer: null,
  leaderboard: [],
  recentReports: [],
  isReporting: false,
  selectedPlayer: null,
  aroundKidsActive: false,
  showWeeklyRecap: false,
  showNiceWordModal: false,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setCurrentGame: (game) =>
    set({
      currentGame: game,
      aroundKidsActive: game?.around_kids_active ?? false,
    }),

  setPlayers: (players) => set({ players }),

  setMyPlayer: (player) => set({ myPlayer: player }),

  setLeaderboard: (entries) => set({ leaderboard: entries }),

  addReport: (report) =>
    set((state) => ({
      recentReports: [report, ...state.recentReports].slice(0, 20),
    })),

  setRecentReports: (reports) => set({ recentReports: reports }),

  setIsReporting: (isReporting) => set({ isReporting }),

  setSelectedPlayer: (player) => set({ selectedPlayer: player }),

  setAroundKidsActive: (active) => set({ aroundKidsActive: active }),

  setShowWeeklyRecap: (show) => set({ showWeeklyRecap: show }),

  setShowNiceWordModal: (show) => set({ showNiceWordModal: show }),

  reset: () => set(initialState),
}));

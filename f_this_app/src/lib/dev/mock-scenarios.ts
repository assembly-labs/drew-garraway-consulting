// Extended mock data for different UX testing scenarios
import { User, Game, GamePlayer, LeaderboardEntry, WeeklyStats, CurseReport } from '@/types/database';

// ============================================
// USERS
// ============================================
export const USERS: Record<string, User> = {
  drew: {
    id: 'user-drew',
    email: 'drew@example.com',
    display_name: 'Drew',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  sarah: {
    id: 'user-sarah',
    email: 'sarah@example.com',
    display_name: 'Sarah',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  mike: {
    id: 'user-mike',
    email: 'mike@example.com',
    display_name: 'Mike the Saint',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  alex: {
    id: 'user-alex',
    email: 'alex@example.com',
    display_name: 'Alex Potty Mouth',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  jen: {
    id: 'user-jen',
    email: 'jen@example.com',
    display_name: 'Jen',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  chris: {
    id: 'user-chris',
    email: 'chris@example.com',
    display_name: 'Chris',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

// ============================================
// GAME SCENARIOS
// ============================================

// Scenario 1: Active game with multiple players, normal state
export const GAME_ACTIVE_NORMAL: Game = {
  id: 'game-active-normal',
  name: 'Office Swear Jar',
  invite_code: 'OFFICE',
  creator_id: 'user-drew',
  mode: 'ffa',
  preset_type: 'office_mode',
  settings: {
    multiplier_days: ['sunday'],
    holidays_2x: true,
    around_kids_enabled: true,
    immunity_windows: [],
    streak_rewards: true,
    nice_word_enabled: true,
    nice_word_daily_limit: 3,
    nice_word_points: -1,
  },
  status: 'active',
  start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Started 1 week ago
  end_date: null,
  current_nice_word: 'Splendid',
  around_kids_active: false,
  cease_fire_until: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Scenario 2: Game in lobby waiting for players
export const GAME_LOBBY: Game = {
  id: 'game-lobby',
  name: 'Family Game Night',
  invite_code: 'FAMILY',
  creator_id: 'user-drew',
  mode: 'ffa',
  preset_type: 'family_friendly',
  settings: {
    multiplier_days: ['sunday'],
    holidays_2x: true,
    around_kids_enabled: true,
    immunity_windows: [],
    streak_rewards: true,
    nice_word_enabled: true,
    nice_word_daily_limit: 5,
    nice_word_points: -1,
  },
  status: 'lobby',
  start_date: null,
  end_date: null,
  current_nice_word: 'Wonderful',
  around_kids_active: false,
  cease_fire_until: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Scenario 3: Game with 2X multiplier active (Around Kids ON)
export const GAME_2X_ACTIVE: Game = {
  ...GAME_ACTIVE_NORMAL,
  id: 'game-2x-active',
  name: 'BBQ with the Fam',
  invite_code: 'BBQ2X',
  around_kids_active: true,
};

// Scenario 4: Game with cease-fire active
export const GAME_CEASEFIRE: Game = {
  ...GAME_ACTIVE_NORMAL,
  id: 'game-ceasefire',
  name: 'Meeting Mode',
  invite_code: 'PEACE',
  cease_fire_until: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
};

// Scenario 5: Completed game
export const GAME_COMPLETED: Game = {
  ...GAME_ACTIVE_NORMAL,
  id: 'game-completed',
  name: 'Last Month Challenge',
  invite_code: 'DONE01',
  status: 'completed',
  end_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Ended 2 days ago
};

// Scenario 6: Teams mode game
export const GAME_TEAMS: Game = {
  ...GAME_ACTIVE_NORMAL,
  id: 'game-teams',
  name: 'Sales vs Engineering',
  invite_code: 'VERSUS',
  mode: 'teams',
  preset_type: 'friend_group',
};

// ============================================
// PLAYER CONFIGURATIONS
// ============================================

export const PLAYERS_ACTIVE_GAME: GamePlayer[] = [
  {
    id: 'player-drew-active',
    game_id: 'game-active-normal',
    user_id: 'user-drew',
    team_id: null,
    current_score: 5,
    streak_days: 2,
    last_curse_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_admin: true,
    joined_at: new Date().toISOString(),
    user: USERS.drew,
  },
  {
    id: 'player-sarah-active',
    game_id: 'game-active-normal',
    user_id: 'user-sarah',
    team_id: null,
    current_score: 8,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: USERS.sarah,
  },
  {
    id: 'player-mike-active',
    game_id: 'game-active-normal',
    user_id: 'user-mike',
    team_id: null,
    current_score: 1,
    streak_days: 7,
    last_curse_date: null,
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: USERS.mike,
  },
  {
    id: 'player-alex-active',
    game_id: 'game-active-normal',
    user_id: 'user-alex',
    team_id: null,
    current_score: 23,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: USERS.alex,
  },
];

export const PLAYERS_LOBBY: GamePlayer[] = [
  {
    id: 'player-drew-lobby',
    game_id: 'game-lobby',
    user_id: 'user-drew',
    team_id: null,
    current_score: 0,
    streak_days: 0,
    last_curse_date: null,
    is_admin: true,
    joined_at: new Date().toISOString(),
    user: USERS.drew,
  },
];

// ============================================
// LEADERBOARD SCENARIOS
// ============================================

export const LEADERBOARD_ACTIVE: LeaderboardEntry[] = [
  { rank: 1, user_id: 'user-mike', display_name: 'Mike the Saint', avatar_url: null, score: 1, streak_days: 7, curses_today: 0, is_you: false },
  { rank: 2, user_id: 'user-drew', display_name: 'Drew', avatar_url: null, score: 5, streak_days: 2, curses_today: 1, is_you: true },
  { rank: 3, user_id: 'user-sarah', display_name: 'Sarah', avatar_url: null, score: 8, streak_days: 0, curses_today: 3, is_you: false },
  { rank: 4, user_id: 'user-alex', display_name: 'Alex Potty Mouth', avatar_url: null, score: 23, streak_days: 0, curses_today: 6, is_you: false },
];

// ============================================
// WEEKLY STATS SCENARIOS
// ============================================

export const WEEKLY_STATS_NORMAL: WeeklyStats = {
  total_curses: 5,
  curses_reported_by_you: 8,
  multiplier_curses: 2,
  nice_words_used: 4,
  clean_days: 3,
  streak_days: 2,
  rank: 2,
  total_players: 4,
  trend: 'up',
  trend_amount: 3,
  most_reported_player: { name: 'Alex Potty Mouth', count: 23 },
  top_snitch: { name: 'Sarah', count: 15 },
  winner: { name: 'Mike the Saint', score: 1 },
  biggest_loser: { name: 'Alex Potty Mouth', score: 23 },
};

// ============================================
// RECENT ACTIVITY
// ============================================

export const RECENT_REPORTS: CurseReport[] = [
  {
    id: 'report-1',
    game_id: 'game-active-normal',
    reporter_id: 'user-drew',
    offender_id: 'user-alex',
    multiplier_applied: 1,
    points_awarded: 1,
    around_kids_active: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reporter: USERS.drew,
    offender: USERS.alex,
  },
  {
    id: 'report-2',
    game_id: 'game-active-normal',
    reporter_id: 'user-sarah',
    offender_id: 'user-alex',
    multiplier_applied: 2,
    points_awarded: 2,
    around_kids_active: true,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    reporter: USERS.sarah,
    offender: USERS.alex,
  },
  {
    id: 'report-3',
    game_id: 'game-active-normal',
    reporter_id: 'user-mike',
    offender_id: 'user-drew',
    multiplier_applied: 1,
    points_awarded: 1,
    around_kids_active: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reporter: USERS.mike,
    offender: USERS.drew,
  },
  {
    id: 'report-4',
    game_id: 'game-active-normal',
    reporter_id: 'user-sarah',
    offender_id: 'user-sarah',
    multiplier_applied: 1,
    points_awarded: 1,
    around_kids_active: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reporter: USERS.alex, // Alex reported Sarah
    offender: USERS.sarah,
  },
];

// ============================================
// GAME COLLECTIONS FOR HOME SCREEN
// ============================================

export const HOME_GAMES_MULTIPLE = [
  { ...GAME_ACTIVE_NORMAL, game_players: PLAYERS_ACTIVE_GAME },
  { ...GAME_LOBBY, game_players: PLAYERS_LOBBY },
  { ...GAME_COMPLETED, game_players: PLAYERS_ACTIVE_GAME },
];

export const HOME_GAMES_EMPTY: never[] = [];

export const HOME_GAMES_SINGLE = [
  { ...GAME_ACTIVE_NORMAL, game_players: PLAYERS_ACTIVE_GAME },
];

// ============================================
// PROFILE STATS SCENARIOS
// ============================================

export const PROFILE_STATS_VETERAN = {
  total_games: 12,
  total_wins: 4,
  total_curses: 127,
  total_reports_filed: 234,
  longest_streak: 14,
  total_nice_words: 45,
};

export const PROFILE_STATS_NEWBIE = {
  total_games: 1,
  total_wins: 0,
  total_curses: 3,
  total_reports_filed: 5,
  longest_streak: 1,
  total_nice_words: 2,
};

// ============================================
// SCENARIO PRESETS (for UX Journey testing)
// ============================================

export const SCENARIOS = {
  // New user, empty state
  newUser: {
    user: USERS.drew,
    games: HOME_GAMES_EMPTY,
    profileStats: PROFILE_STATS_NEWBIE,
  },

  // Active player with multiple games
  activePlayer: {
    user: USERS.drew,
    games: HOME_GAMES_MULTIPLE,
    activeGame: GAME_ACTIVE_NORMAL,
    players: PLAYERS_ACTIVE_GAME,
    leaderboard: LEADERBOARD_ACTIVE,
    weeklyStats: WEEKLY_STATS_NORMAL,
    recentReports: RECENT_REPORTS,
    profileStats: PROFILE_STATS_VETERAN,
  },

  // Host waiting in lobby
  hostLobby: {
    user: USERS.drew,
    games: [{ ...GAME_LOBBY, game_players: PLAYERS_LOBBY }],
    activeGame: GAME_LOBBY,
    players: PLAYERS_LOBBY,
  },

  // 2X multiplier active
  multiplierActive: {
    user: USERS.drew,
    games: HOME_GAMES_SINGLE,
    activeGame: GAME_2X_ACTIVE,
    players: PLAYERS_ACTIVE_GAME,
    leaderboard: LEADERBOARD_ACTIVE,
  },

  // Cease-fire mode
  ceasefire: {
    user: USERS.drew,
    games: HOME_GAMES_SINGLE,
    activeGame: GAME_CEASEFIRE,
    players: PLAYERS_ACTIVE_GAME,
  },

  // Completed game viewing stats
  gameEnded: {
    user: USERS.drew,
    games: [{ ...GAME_COMPLETED, game_players: PLAYERS_ACTIVE_GAME }],
    activeGame: GAME_COMPLETED,
    players: PLAYERS_ACTIVE_GAME,
    leaderboard: LEADERBOARD_ACTIVE,
    weeklyStats: WEEKLY_STATS_NORMAL,
  },
};

export type ScenarioKey = keyof typeof SCENARIOS;

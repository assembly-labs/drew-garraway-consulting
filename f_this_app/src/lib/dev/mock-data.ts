// Mock data for dev/testing mode
import { User, Game, GamePlayer, LeaderboardEntry, WeeklyStats, CurseReport } from '@/types/database';

export const MOCK_USER: User = {
  id: 'user-test-001',
  email: 'test@example.com',
  display_name: 'Drew (Test)',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_USERS: User[] = [
  MOCK_USER,
  {
    id: 'user-test-002',
    email: 'sarah@example.com',
    display_name: 'Sarah',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-test-003',
    email: 'mike@example.com',
    display_name: 'Mike',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-test-004',
    email: 'alex@example.com',
    display_name: 'Alex the Potty Mouth',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_GAME: Game = {
  id: 'game-test-001',
  name: 'Office Swear Jar',
  invite_code: 'ABC123',
  creator_id: 'user-test-001',
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
  start_date: new Date().toISOString(),
  end_date: null,
  current_nice_word: 'Splendid',
  around_kids_active: false,
  cease_fire_until: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_LOBBY_GAME: Game = {
  ...MOCK_GAME,
  id: 'game-test-002',
  name: 'Family Game Night',
  invite_code: 'FAM456',
  status: 'lobby',
  preset_type: 'family_friendly',
  start_date: null,
};

export const MOCK_PLAYERS: GamePlayer[] = [
  {
    id: 'player-001',
    game_id: 'game-test-001',
    user_id: 'user-test-001',
    team_id: null,
    current_score: 3,
    streak_days: 2,
    last_curse_date: new Date().toISOString(),
    is_admin: true,
    joined_at: new Date().toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: 'player-002',
    game_id: 'game-test-001',
    user_id: 'user-test-002',
    team_id: null,
    current_score: 7,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: MOCK_USERS[1],
  },
  {
    id: 'player-003',
    game_id: 'game-test-001',
    user_id: 'user-test-003',
    team_id: null,
    current_score: 1,
    streak_days: 5,
    last_curse_date: null,
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: MOCK_USERS[2],
  },
  {
    id: 'player-004',
    game_id: 'game-test-001',
    user_id: 'user-test-004',
    team_id: null,
    current_score: 12,
    streak_days: 0,
    last_curse_date: new Date().toISOString(),
    is_admin: false,
    joined_at: new Date().toISOString(),
    user: MOCK_USERS[3],
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: 'user-test-003', display_name: 'Mike', avatar_url: null, score: 1, streak_days: 5, curses_today: 0, is_you: false },
  { rank: 2, user_id: 'user-test-001', display_name: 'Drew (Test)', avatar_url: null, score: 3, streak_days: 2, curses_today: 1, is_you: true },
  { rank: 3, user_id: 'user-test-002', display_name: 'Sarah', avatar_url: null, score: 7, streak_days: 0, curses_today: 2, is_you: false },
  { rank: 4, user_id: 'user-test-004', display_name: 'Alex the Potty Mouth', avatar_url: null, score: 12, streak_days: 0, curses_today: 4, is_you: false },
];

export const MOCK_WEEKLY_STATS: WeeklyStats = {
  total_curses: 7,
  curses_reported_by_you: 4,
  multiplier_curses: 2,
  nice_words_used: 3,
  clean_days: 2,
  streak_days: 2,
  rank: 2,
  total_players: 4,
  trend: 'up',
  trend_amount: 2,
  most_reported_player: {
    name: 'Alex the Potty Mouth',
    count: 12,
  },
  top_snitch: {
    name: 'Sarah',
    count: 8,
  },
  winner: {
    name: 'Mike',
    score: 1,
  },
  biggest_loser: {
    name: 'Alex the Potty Mouth',
    score: 12,
  },
};

export const MOCK_REPORTS: CurseReport[] = [
  {
    id: 'report-001',
    game_id: 'game-test-001',
    reporter_id: 'user-test-001',
    offender_id: 'user-test-004',
    multiplier_applied: 1,
    points_awarded: 1,
    around_kids_active: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    reporter: MOCK_USERS[0],
    offender: MOCK_USERS[3],
  },
  {
    id: 'report-002',
    game_id: 'game-test-001',
    reporter_id: 'user-test-002',
    offender_id: 'user-test-004',
    multiplier_applied: 2,
    points_awarded: 2,
    around_kids_active: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    reporter: MOCK_USERS[1],
    offender: MOCK_USERS[3],
  },
  {
    id: 'report-003',
    game_id: 'game-test-001',
    reporter_id: 'user-test-002',
    offender_id: 'user-test-001',
    multiplier_applied: 1,
    points_awarded: 1,
    around_kids_active: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    reporter: MOCK_USERS[1],
    offender: MOCK_USERS[0],
  },
];

// Games list for home page
export const MOCK_GAMES_WITH_PLAYERS = [
  {
    ...MOCK_GAME,
    game_players: MOCK_PLAYERS,
  },
  {
    ...MOCK_LOBBY_GAME,
    game_players: MOCK_PLAYERS.slice(0, 2).map(p => ({ ...p, game_id: 'game-test-002' })),
  },
];

// Helper to check if in dev mode
export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const hasCookie = document.cookie.includes('dev_mode=true');
  const hasParam = params.get('dev') === 'true';
  return hasCookie || hasParam;
}

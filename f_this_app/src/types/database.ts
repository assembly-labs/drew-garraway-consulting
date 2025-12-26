// Database types matching our Supabase schema

export type GameMode = 'ffa' | 'teams';
export type GameStatus = 'lobby' | 'active' | 'completed';
export type PresetType = 'family_friendly' | 'office_mode' | 'friend_group' | 'hardcore' | 'custom';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameSettings {
  multiplier_days: string[]; // e.g., ['sunday', 'saturday']
  holidays_2x: boolean;
  around_kids_enabled: boolean;
  immunity_windows: ImmunityWindow[];
  streak_rewards: boolean;
  nice_word_enabled: boolean;
  nice_word_daily_limit: number;
  nice_word_points: number;
}

export interface ImmunityWindow {
  id: string;
  name: string;
  day_of_week?: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  recurring: boolean;
}

export interface Game {
  id: string;
  name: string;
  invite_code: string;
  creator_id: string;
  mode: GameMode;
  preset_type: PresetType;
  settings: GameSettings;
  status: GameStatus;
  start_date: string | null;
  end_date: string | null;
  current_nice_word: string | null;
  around_kids_active: boolean;
  cease_fire_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  game_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  user_id: string;
  team_id: string | null;
  current_score: number;
  streak_days: number;
  last_curse_date: string | null;
  is_admin: boolean;
  joined_at: string;
  // Joined fields
  user?: User;
  team?: Team;
}

export interface CurseReport {
  id: string;
  game_id: string;
  reporter_id: string;
  offender_id: string;
  multiplier_applied: number;
  points_awarded: number;
  around_kids_active: boolean;
  timestamp: string;
  // Joined fields
  reporter?: User;
  offender?: User;
}

export interface NiceWordLog {
  id: string;
  game_id: string;
  user_id: string;
  word: string;
  points_awarded: number;
  timestamp: string;
  // Joined fields
  user?: User;
}

// Leaderboard entry for display
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  score: number;
  streak_days: number;
  curses_today: number;
  is_you: boolean;
  team_id?: string | null;
  team_name?: string;
  team_color?: string;
}

// Weekly stats for recap
export interface WeeklyStats {
  total_curses: number;
  curses_reported_by_you: number;
  multiplier_curses: number;
  nice_words_used: number;
  clean_days: number;
  streak_days: number;
  rank: number;
  total_players: number;
  trend: 'up' | 'down' | 'same';
  trend_amount: number;
  most_reported_player: {
    name: string;
    count: number;
  } | null;
  top_snitch: {
    name: string;
    count: number;
  } | null;
  winner: {
    name: string;
    score: number;
  } | null;
  biggest_loser: {
    name: string;
    score: number;
  } | null;
}

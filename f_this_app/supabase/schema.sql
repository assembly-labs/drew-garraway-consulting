-- F*** This App! Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read all users (for player lists)
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- GAMES TABLE
-- ============================================
CREATE TABLE public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  mode TEXT CHECK (mode IN ('ffa', 'teams')) DEFAULT 'ffa' NOT NULL,
  preset_type TEXT CHECK (preset_type IN ('family_friendly', 'office_mode', 'friend_group', 'hardcore', 'custom')) DEFAULT 'friend_group' NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb NOT NULL,
  status TEXT CHECK (status IN ('lobby', 'active', 'completed')) DEFAULT 'lobby' NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  current_nice_word TEXT,
  around_kids_active BOOLEAN DEFAULT FALSE NOT NULL,
  cease_fire_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Games are viewable by players in the game
CREATE POLICY "Games viewable by players" ON public.games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = games.id
      AND game_players.user_id = auth.uid()
    )
    OR creator_id = auth.uid()
  );

-- Anyone can view a game by invite code (for joining)
CREATE POLICY "Games viewable by invite code" ON public.games
  FOR SELECT USING (true);

-- Only creator can update game
CREATE POLICY "Creator can update game" ON public.games
  FOR UPDATE USING (creator_id = auth.uid());

-- Authenticated users can create games
CREATE POLICY "Authenticated users can create games" ON public.games
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FF0000' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Teams viewable by game players
CREATE POLICY "Teams viewable by game players" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = teams.game_id
      AND game_players.user_id = auth.uid()
    )
  );

-- Game creator can manage teams
CREATE POLICY "Creator can manage teams" ON public.teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.games
      WHERE games.id = teams.game_id
      AND games.creator_id = auth.uid()
    )
  );

-- ============================================
-- GAME PLAYERS TABLE
-- ============================================
CREATE TABLE public.game_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  current_score INTEGER DEFAULT 0 NOT NULL,
  streak_days INTEGER DEFAULT 0 NOT NULL,
  last_curse_date TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(game_id, user_id)
);

-- Enable RLS
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

-- Game players viewable by other players in same game
CREATE POLICY "Game players viewable by game members" ON public.game_players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_players gp
      WHERE gp.game_id = game_players.game_id
      AND gp.user_id = auth.uid()
    )
  );

-- Users can join games
CREATE POLICY "Users can join games" ON public.game_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own player record
CREATE POLICY "Users can update own player record" ON public.game_players
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can update any player in their game
CREATE POLICY "Admins can update players" ON public.game_players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.game_players gp
      WHERE gp.game_id = game_players.game_id
      AND gp.user_id = auth.uid()
      AND gp.is_admin = true
    )
  );

-- ============================================
-- CURSE REPORTS TABLE
-- ============================================
CREATE TABLE public.curse_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  offender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  multiplier_applied INTEGER DEFAULT 1 NOT NULL,
  points_awarded INTEGER DEFAULT 1 NOT NULL,
  around_kids_active BOOLEAN DEFAULT FALSE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.curse_reports ENABLE ROW LEVEL SECURITY;

-- Curse reports viewable by game players
CREATE POLICY "Curse reports viewable by game players" ON public.curse_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = curse_reports.game_id
      AND game_players.user_id = auth.uid()
    )
  );

-- Game players can create curse reports
CREATE POLICY "Game players can create reports" ON public.curse_reports
  FOR INSERT WITH CHECK (
    auth.uid() = reporter_id
    AND EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = curse_reports.game_id
      AND game_players.user_id = auth.uid()
    )
  );

-- ============================================
-- NICE WORD LOGS TABLE
-- ============================================
CREATE TABLE public.nice_word_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  points_awarded INTEGER DEFAULT -1 NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.nice_word_logs ENABLE ROW LEVEL SECURITY;

-- Nice word logs viewable by game players
CREATE POLICY "Nice word logs viewable by game players" ON public.nice_word_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = nice_word_logs.game_id
      AND game_players.user_id = auth.uid()
    )
  );

-- Users can log their own nice word usage
CREATE POLICY "Users can log own nice word usage" ON public.nice_word_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.game_players
      WHERE game_players.game_id = nice_word_logs.game_id
      AND game_players.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate invite code on game creation
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_game_invite_code
  BEFORE INSERT ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Function to update player score when curse is reported
CREATE OR REPLACE FUNCTION update_player_score_on_curse()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.game_players
  SET
    current_score = current_score + NEW.points_awarded,
    last_curse_date = NEW.timestamp,
    streak_days = 0
  WHERE game_id = NEW.game_id AND user_id = NEW.offender_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_score_on_curse
  AFTER INSERT ON public.curse_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_player_score_on_curse();

-- Function to update player score when nice word is used
CREATE OR REPLACE FUNCTION update_player_score_on_nice_word()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.game_players
  SET current_score = current_score + NEW.points_awarded
  WHERE game_id = NEW.game_id AND user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_score_on_nice_word
  AFTER INSERT ON public.nice_word_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_player_score_on_nice_word();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================
-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.curse_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nice_word_logs;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_game_players_game_id ON public.game_players(game_id);
CREATE INDEX idx_game_players_user_id ON public.game_players(user_id);
CREATE INDEX idx_curse_reports_game_id ON public.curse_reports(game_id);
CREATE INDEX idx_curse_reports_offender_id ON public.curse_reports(offender_id);
CREATE INDEX idx_curse_reports_timestamp ON public.curse_reports(timestamp);
CREATE INDEX idx_nice_word_logs_game_id ON public.nice_word_logs(game_id);
CREATE INDEX idx_nice_word_logs_user_id ON public.nice_word_logs(user_id);
CREATE INDEX idx_games_invite_code ON public.games(invite_code);
CREATE INDEX idx_games_status ON public.games(status);

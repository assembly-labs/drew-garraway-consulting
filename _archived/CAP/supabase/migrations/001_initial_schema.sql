-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age_verified BOOLEAN DEFAULT false NOT NULL,
  age_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  season TEXT,
  team_colors JSONB DEFAULT '{"primary": "#FFD700", "secondary": "#1E40AF"}',
  logo_url TEXT,
  privacy_settings JSONB DEFAULT '{"public": false, "auto_delete": true}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(owner_id, name, season)
);

-- Children (athletes) table - COPPA compliant minimal data
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  jersey_number TEXT,
  position TEXT,
  birth_year INTEGER, -- Only year, not full date for privacy
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Photos table with auto-deletion
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  thumbnail_url TEXT,
  quality_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  delete_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') NOT NULL
);

-- Card designs table
CREATE TABLE public.card_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  photo_id UUID REFERENCES public.photos(id) ON DELETE SET NULL,
  template_id TEXT NOT NULL,
  customization JSONB DEFAULT '{}',
  front_design JSONB NOT NULL,
  back_design JSONB NOT NULL,
  bio_text TEXT,
  stats JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'payment_confirmed', 'printing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  shipping_address JSONB,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Consent log table (immutable audit trail for COPPA)
CREATE TABLE public.consent_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('data_collection', 'photo_upload', 'photo_sharing', 'marketing')),
  granted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_teams_owner ON public.teams(owner_id);
CREATE INDEX idx_children_team ON public.children(team_id);
CREATE INDEX idx_photos_team ON public.photos(team_id);
CREATE INDEX idx_photos_child ON public.photos(child_id);
CREATE INDEX idx_photos_delete_at ON public.photos(delete_at);
CREATE INDEX idx_card_designs_team ON public.card_designs(team_id);
CREATE INDEX idx_card_designs_child ON public.card_designs(child_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_consent_log_parent ON public.consent_log(parent_id);
CREATE INDEX idx_consent_log_child ON public.consent_log(child_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Users can view own teams" ON public.teams
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own teams" ON public.teams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own teams" ON public.teams
  FOR DELETE USING (auth.uid() = owner_id);

-- Children policies
CREATE POLICY "Users can view children in own teams" ON public.children
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = children.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage children in own teams" ON public.children
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = children.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- Photos policies
CREATE POLICY "Users can view photos in own teams" ON public.photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = photos.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage photos in own teams" ON public.photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = photos.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- Card designs policies
CREATE POLICY "Users can view card designs in own teams" ON public.card_designs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = card_designs.team_id
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage card designs in own teams" ON public.card_designs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = card_designs.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Consent log policies (write-only for users, read for compliance)
CREATE POLICY "Users can add consent records" ON public.consent_log
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can view own consent records" ON public.consent_log
  FOR SELECT USING (auth.uid() = parent_id);

-- Functions and Triggers
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_designs_updated_at BEFORE UPDATE ON public.card_designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically delete old photos
CREATE OR REPLACE FUNCTION delete_expired_photos()
RETURNS void AS $$
BEGIN
  DELETE FROM public.photos
  WHERE delete_at < NOW();
END;
$$ language 'plpgsql';

-- Note: Set up a cron job to run delete_expired_photos() daily
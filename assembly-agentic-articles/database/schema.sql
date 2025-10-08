-- Create database
CREATE DATABASE IF NOT EXISTS content_platform;

-- Use the database
\c content_platform;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  subscription_tier VARCHAR(50) DEFAULT 'creator'
);

-- Content drafts table
CREATE TABLE content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_idea TEXT NOT NULL,
  draft_content TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, researching, drafting, review, revising, approved, published
  revision_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Research sources table
CREATE TABLE research_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  excerpt TEXT,
  publication_date DATE,
  domain_authority INT,
  credibility_score FLOAT,
  source_type VARCHAR(50), -- academic, news, industry, blog
  created_at TIMESTAMP DEFAULT NOW()
);

-- Platform content table
CREATE TABLE platform_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- linkedin, twitter, tiktok
  formatted_content TEXT NOT NULL,
  published_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(draft_id, platform)
);

-- User edits table (for future voice learning)
CREATE TABLE user_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_text TEXT,
  edited_text TEXT,
  edit_type VARCHAR(50), -- word_swap, structure, tone, deletion
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar events table (Phase 1 prep)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_title TEXT,
  event_date TIMESTAMP,
  suggested_content TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, dismissed, created
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_content_drafts_user_id ON content_drafts(user_id);
CREATE INDEX idx_content_drafts_status ON content_drafts(status);
CREATE INDEX idx_research_sources_draft_id ON research_sources(draft_id);
CREATE INDEX idx_platform_content_draft_id ON platform_content(draft_id);
CREATE INDEX idx_user_edits_draft_id ON user_edits(draft_id);
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);

-- Insert a default user for MVP testing
INSERT INTO users (email, name, subscription_tier)
VALUES ('test@example.com', 'Test User', 'creator');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_drafts_updated_at BEFORE UPDATE ON content_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
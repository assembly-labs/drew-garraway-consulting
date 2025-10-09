-- Migration: Add source selection tracking
-- Created: 2025-10-08
-- Purpose: Enable user selection of research sources before content generation

-- Add user_selected column to research_sources
-- Default false requires users to explicitly select sources
ALTER TABLE research_sources
ADD COLUMN IF NOT EXISTS user_selected BOOLEAN DEFAULT false;

-- Add research_retry_count to content_drafts
-- Tracks how many times user re-ran research (max 2 allowed)
ALTER TABLE content_drafts
ADD COLUMN IF NOT EXISTS research_retry_count INT DEFAULT 0;

-- Add index for performance on source selection queries
CREATE INDEX IF NOT EXISTS idx_research_sources_draft_selected
ON research_sources(draft_id, user_selected);

-- Add index for retry count queries
CREATE INDEX IF NOT EXISTS idx_content_drafts_retry_count
ON content_drafts(research_retry_count);

-- Add comments for documentation
COMMENT ON COLUMN research_sources.user_selected IS 'Whether user selected this source for content generation. Default false requires explicit selection.';
COMMENT ON COLUMN content_drafts.research_retry_count IS 'Number of times user re-ran research for this draft. Max 2 allowed.';

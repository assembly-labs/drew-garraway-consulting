-- Migration v2: Add warmed_up and instructor fields, remove deferred fields
-- Run AFTER the initial supabase-migration.sql has been applied
-- Date: 2026-03-12

-- Add new fields
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS warmed_up BOOLEAN;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS instructor TEXT;

-- Remove deferred fields (energy_level, mood, worked_well, struggles)
-- These are being deferred to v1.1+ as they aren't core to white/blue belt journaling
ALTER TABLE sessions DROP COLUMN IF EXISTS energy_level;
ALTER TABLE sessions DROP COLUMN IF EXISTS mood;
ALTER TABLE sessions DROP COLUMN IF EXISTS worked_well;
ALTER TABLE sessions DROP COLUMN IF EXISTS struggles;

-- Update training_mode CHECK constraint to remove 'mixed' and 'unknown'
-- (v1.1 uses only 'gi', 'nogi', 'other')
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_training_mode_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_training_mode_check
  CHECK (training_mode IN ('gi', 'nogi', 'other'));

-- Update default schema_version for new rows
ALTER TABLE sessions ALTER COLUMN schema_version SET DEFAULT 2;

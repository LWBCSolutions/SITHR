-- Migration 003: Conversation metadata columns for weekly digest
-- Run in Supabase SQL editor

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS situation_type TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS risk_level TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS policy_gap_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS policy_uploaded BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS export_generated BOOLEAN DEFAULT FALSE;

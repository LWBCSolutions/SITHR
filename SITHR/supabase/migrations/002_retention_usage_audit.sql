-- Migration 002: Data retention, usage tracking, audit log
-- Run in Supabase SQL editor

-- 1. Add expires_at to conversations for 30-day auto-expiry
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');

-- Backfill existing conversations
UPDATE conversations SET expires_at = created_at + INTERVAL '30 days' WHERE expires_at IS NULL;

-- 2. Usage tracking table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
  estimated_cost_usd DECIMAL(10,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS usage_logs_user_id_idx ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx ON usage_logs(created_at);

-- RLS for usage_logs (allow inserts from anon key for server-side logging)
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert usage logs" ON usage_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select own usage logs" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_log_event_type_idx ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log(created_at);

-- RLS for audit_log (allow inserts from anon key for server-side logging)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert audit logs" ON audit_log
  FOR INSERT WITH CHECK (true);

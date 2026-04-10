-- Migration 005: Subscriptions, billing, profiles, and usage tracking
-- Run in Supabase SQL editor

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'trial',
  status TEXT NOT NULL DEFAULT 'trialing',
  trial_start TIMESTAMPTZ DEFAULT NOW(),
  trial_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trial IP tracking
CREATE TABLE IF NOT EXISTS trial_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS trial_ips_ip_idx ON trial_ips(ip_address);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  organisation_name TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly usage tracking
CREATE TABLE IF NOT EXISTS monthly_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  conversations_started INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  exports_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription" ON subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE trial_ips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert trial ips" ON trial_ips
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select trial ips" ON trial_ips
  FOR SELECT USING (true);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own usage" ON monthly_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow insert monthly usage" ON monthly_usage
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update monthly usage" ON monthly_usage
  FOR UPDATE USING (true);

-- Usage increment function
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_period TEXT, p_field TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO monthly_usage (user_id, period, conversations_started, messages_sent, exports_generated)
  VALUES (p_user_id, p_period, 0, 0, 0)
  ON CONFLICT (user_id, period) DO NOTHING;

  EXECUTE format('UPDATE monthly_usage SET %I = %I + 1, updated_at = NOW()
    WHERE user_id = $1 AND period = $2', p_field, p_field)
  USING p_user_id, p_period;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

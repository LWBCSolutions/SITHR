-- Migration 010: Referral codes (with DISCA6 free access flow)
-- Run in Supabase SQL editor.
--
-- Schema notes:
--   type:  'extended_trial' | 'free_months' | 'percent_off' | 'free_access'
--          - extended_trial: adds `value` extra trial days to the standard Stripe trial
--          - free_months:    `value` months free, applied via stripe_coupon_id
--          - percent_off:    `value`% off, applied via stripe_coupon_id
--          - free_access:    `value` days of full access with NO card required
--                            (DISCA6 flow — bypasses Stripe entirely)

CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('extended_trial', 'free_months', 'percent_off', 'free_access')),
  value INTEGER NOT NULL,
  stripe_coupon_id TEXT,
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_code_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(code) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_referral_code_uses_user ON referral_code_uses(user_id);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_code_uses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active codes" ON referral_codes;
CREATE POLICY "Anyone can read active codes"
  ON referral_codes FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Users can see own redemptions" ON referral_code_uses;
CREATE POLICY "Users can see own redemptions"
  ON referral_code_uses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow disca_trial / disca_expired statuses on subscriptions if a CHECK exists.
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check
  CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'incomplete', 'ip_blocked', 'disca_trial', 'disca_expired'));

-- Seed DISCA6: 6 months free Professional access, no card required.
INSERT INTO referral_codes (code, type, value, max_uses, expires_at, description)
VALUES (
  'DISCA6',
  'free_access',
  180,
  100,
  '2027-06-30T23:59:59Z',
  'DISCA community - 6 months free Professional access, no card required'
)
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type,
  value = EXCLUDED.value,
  max_uses = EXCLUDED.max_uses,
  expires_at = EXCLUDED.expires_at,
  description = EXCLUDED.description,
  active = true;

-- Remove the old DISCA code if it was previously seeded.
DELETE FROM referral_codes WHERE code = 'DISCA';

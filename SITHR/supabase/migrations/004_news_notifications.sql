-- Migration 004: News articles and app notifications
-- Run in Supabase SQL editor

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'guidance',
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  pinned BOOLEAN DEFAULT false,
  important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_articles_published_idx ON news_articles(published);
CREATE INDEX IF NOT EXISTS news_articles_pinned_idx ON news_articles(pinned);
CREATE INDEX IF NOT EXISTS news_articles_created_at_idx ON news_articles(created_at DESC);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are readable by all" ON news_articles
  FOR SELECT USING (published = true);

-- App notifications table
CREATE TABLE IF NOT EXISTS app_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  dismissible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active notifications readable by authenticated users" ON app_notifications
  FOR SELECT TO authenticated
  USING (
    active = true
    AND starts_at <= NOW()
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Seed: April 2026 article
INSERT INTO news_articles (
  title, slug, category, summary, content, published, pinned, important
) VALUES (
  'April 2026 Employment Law Changes - Action Required',
  'april-2026-employment-law-changes',
  'legislation',
  'Six changes under the Employment Rights Act 2025 took effect in April 2026. Each requires employer action. Here is what you need to have in place.',
  E'## What Changed on 6 April 2026\n\nSix changes under the Employment Rights Act 2025 came into force. Each requires action.\n\n## 1. Statutory Sick Pay - Day One Entitlement\n\nSSP is payable from the first day of absence. Waiting days abolished. Lower earnings limit removed.\n\n**Check:** Payroll system updated. Sickness absence policy updated. Contracts checked.\n\n## 2. National Living Wage\n\n- Age 21+: £12.71 per hour\n- Age 18-20: £10.85 per hour\n- Age 16-17 and apprentices: £8.00 per hour\n\n**Check:** All staff paid at or above correct rate. Contracts updated.\n\n## 3. Annual Leave Records - New Criminal Duty\n\nEmployers must keep annual leave and holiday pay records for all workers for 6 years. Failure is a criminal offence.\n\n**Check:** Recording system in place. Covers all workers including irregular hours.\n\n## 4. Fair Work Agency - Launched 7 April 2026\n\nSingle enforcement body. Can investigate proactively without a complaint. Six years retrospective power.\n\n**Check:** Holiday pay calculated correctly. NMW compliance confirmed. Records in order.\n\n## 5. Paternity and Parental Leave - Day One Rights\n\nBoth now day one rights. Qualifying periods abolished.\n\n**Check:** Parental leave policy updated. Managers aware.\n\n## 6. Whistleblowing - Sexual Harassment Added\n\nSexual harassment disclosures now expressly protected as qualifying disclosures.\n\n**Check:** Whistleblowing policy updated. Managers briefed.\n\n## Coming Next\n\n**October 2026:** Extended tribunal time limits. Fire and rehire restrictions. Strengthened harassment duty.\n\n**January 2027:** Unfair dismissal qualifying period reduces to 6 months. Compensation cap abolished.\n\n---\n\nThis article provides general guidance based on the law as at April 2026. Seek qualified legal advice for your specific circumstances.',
  true, true, true
) ON CONFLICT (slug) DO NOTHING;

-- Seed: January 2027 notification
INSERT INTO app_notifications (
  type, title, message, cta_text, cta_link, active, starts_at, expires_at, dismissible
) VALUES (
  'alert',
  'January 2027 - Unfair Dismissal Rights Expanding',
  'From 1 January 2027, employees qualify for unfair dismissal protection after just 6 months. Documentation and formal processes must be in order before this date.',
  'Read the Full Update',
  '/news/april-2026-employment-law-changes',
  true,
  NOW(),
  '2027-02-01 00:00:00+00',
  true
);

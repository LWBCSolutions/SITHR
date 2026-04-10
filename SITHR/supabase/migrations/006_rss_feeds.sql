-- Migration 006: RSS feed ingestion, article drafts, and source tracking
-- Run in Supabase SQL Editor

-- =========================================================================
-- 1. RSS Sources table
-- =========================================================================
CREATE TABLE IF NOT EXISTS rss_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'guidance',
  active BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;

-- Only service role can manage sources (admin only)
CREATE POLICY "Service role manages rss_sources" ON rss_sources
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read sources
CREATE POLICY "Authenticated users can read rss_sources" ON rss_sources
  FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- 2. RSS Feed Items table (raw ingested items)
-- =========================================================================
CREATE TABLE IF NOT EXISTS rss_feed_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES rss_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  pub_date TIMESTAMPTZ,
  guid TEXT NOT NULL UNIQUE,
  processed BOOLEAN DEFAULT false,
  ingested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rss_feed_items_processed_idx ON rss_feed_items(processed);
CREATE INDEX IF NOT EXISTS rss_feed_items_source_idx ON rss_feed_items(source_id);
CREATE INDEX IF NOT EXISTS rss_feed_items_pub_date_idx ON rss_feed_items(pub_date DESC);

ALTER TABLE rss_feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rss_feed_items" ON rss_feed_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read rss_feed_items" ON rss_feed_items
  FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- 3. Article Drafts table (AI-generated, pending review)
-- =========================================================================
CREATE TABLE IF NOT EXISTS article_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_item_id UUID REFERENCES rss_feed_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'guidance',
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'rejected', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

CREATE INDEX IF NOT EXISTS article_drafts_status_idx ON article_drafts(status);
CREATE INDEX IF NOT EXISTS article_drafts_created_at_idx ON article_drafts(created_at DESC);

ALTER TABLE article_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages article_drafts" ON article_drafts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read article_drafts" ON article_drafts
  FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- 4. Seed default RSS sources
-- =========================================================================
INSERT INTO rss_sources (name, url, category, active) VALUES
  ('GOV.UK Employment', 'https://www.gov.uk/topic/employment/employment-law.atom', 'legislation', true),
  ('ACAS News', 'https://www.acas.org.uk/rss/news', 'guidance', true),
  ('CIPD News', 'https://www.cipd.org/uk/news/rss', 'guidance', true),
  ('Employment Tribunal Decisions', 'https://www.gov.uk/employment-tribunal-decisions.atom', 'tribunal', true),
  ('Legislation.gov.uk New Acts', 'https://www.legislation.gov.uk/new/ukpga.atom', 'legislation', true),
  ('Legislation.gov.uk New SIs', 'https://www.legislation.gov.uk/new/uksi.atom', 'legislation', true)
ON CONFLICT (url) DO NOTHING;

-- =========================================================================
-- 5. Admin role check function (reusable)
-- =========================================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = $1
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

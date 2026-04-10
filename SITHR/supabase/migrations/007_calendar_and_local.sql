-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_points TEXT,
  category TEXT NOT NULL DEFAULT 'awareness'
    CHECK (category IN ('legislation', 'awareness', 'religious', 'cultural', 'economic', 'local')),
  start_date DATE NOT NULL,
  end_date DATE,
  all_day BOOLEAN DEFAULT true,
  recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  source_url TEXT,
  local_authority_code TEXT,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS calendar_events_category_idx ON calendar_events(category);
CREATE INDEX IF NOT EXISTS calendar_events_la_idx ON calendar_events(local_authority_code);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read calendar_events" ON calendar_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role manages calendar_events" ON calendar_events
  FOR ALL USING (auth.role() = 'service_role');

-- Council feeds table
CREATE TABLE IF NOT EXISTS council_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  local_authority_code TEXT NOT NULL UNIQUE,
  local_authority_name TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE council_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages council_feeds" ON council_feeds
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read council_feeds" ON council_feeds
  FOR SELECT TO authenticated USING (true);

-- User profile columns for local authority
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS business_postcode TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS local_authority_code TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS local_authority_name TEXT;

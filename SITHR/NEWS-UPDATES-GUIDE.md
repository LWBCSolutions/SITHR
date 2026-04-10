# News & Updates - Content Management

## Quick reference - add an article
Use Supabase SQL Editor. See full guide below.

## Quick reference - add a notification
Use Supabase SQL Editor. See full guide below.

## Tables
- `news_articles` - blog posts and updates
- `app_notifications` - modal alerts and banners

## Adding an article
```sql
INSERT INTO news_articles (title, slug, category, summary, content, published, pinned, important)
VALUES ('Title', 'slug-here', 'legislation', 'Summary text.', 'Markdown content here.', true, false, false);
```

Categories: `legislation` `tribunal` `policy` `guidance` `reminder`

## Adding a notification
```sql
INSERT INTO app_notifications (type, title, message, cta_text, cta_link, active, starts_at, expires_at, dismissible)
VALUES ('alert', 'Title', 'Message body.', 'Read More', '/news/slug', true, NOW(), '2027-01-31', true);
```

Types: `info` (blue) `alert` (amber) `urgent` (red) `reminder` (grey) `banner` (top bar)

## Deactivating
```sql
UPDATE app_notifications SET active = false WHERE id = 'uuid';
UPDATE news_articles SET published = false WHERE slug = 'slug';
```

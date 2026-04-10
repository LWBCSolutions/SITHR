// server/src/rssService.ts
// RSS ingestion, AI article generation, and outbound feed service
// Drop this file into server/src/ alongside index.ts

import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
}

export interface RssFeedItem {
  id?: string;
  source_id: string;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  guid: string;
  ingested_at?: string;
  processed: boolean;
}

export interface ArticleDraft {
  id?: string;
  feed_item_id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
  created_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// ---------------------------------------------------------------------------
// Configuration - UK HR and employment law RSS sources
// ---------------------------------------------------------------------------
export const DEFAULT_RSS_SOURCES: Omit<RssSource, 'id'>[] = [
  {
    name: 'GOV.UK Employment',
    url: 'https://www.gov.uk/topic/employment/employment-law.atom',
    category: 'legislation',
    active: true,
  },
  {
    name: 'GOV.UK Health and Safety',
    url: 'https://www.gov.uk/topic/working-at-height/health-safety.atom',
    category: 'guidance',
    active: true,
  },
  {
    name: 'ACAS News',
    url: 'https://www.acas.org.uk/rss/news',
    category: 'guidance',
    active: true,
  },
  {
    name: 'CIPD News',
    url: 'https://www.cipd.org/uk/news/rss',
    category: 'guidance',
    active: true,
  },
  {
    name: 'Employment Tribunal Decisions',
    url: 'https://www.gov.uk/employment-tribunal-decisions.atom',
    category: 'tribunal',
    active: true,
  },
  {
    name: 'Legislation.gov.uk New Acts',
    url: 'https://www.legislation.gov.uk/new/ukpga.atom',
    category: 'legislation',
    active: true,
  },
  {
    name: 'Legislation.gov.uk New SIs',
    url: 'https://www.legislation.gov.uk/new/uksi.atom',
    category: 'legislation',
    active: true,
  },
];

// ---------------------------------------------------------------------------
// RSS Parser instance
// ---------------------------------------------------------------------------
const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'SIT-HR-Advisory/1.0 (+https://sithr.lwbc.ltd)',
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
  },
  customFields: {
    item: ['summary', 'updated'],
  },
});

// ---------------------------------------------------------------------------
// Core service class
// ---------------------------------------------------------------------------
export class RssService {
  private supabase;
  private anthropic;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  // -------------------------------------------------------------------------
  // 1. Seed default sources if table is empty
  // -------------------------------------------------------------------------
  async seedSources(): Promise<void> {
    const { data: existing } = await this.supabase
      .from('rss_sources')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) return;

    for (const source of DEFAULT_RSS_SOURCES) {
      await this.supabase.from('rss_sources').insert(source);
    }
    console.log(`[RSS] Seeded ${DEFAULT_RSS_SOURCES.length} default sources`);
  }

  // -------------------------------------------------------------------------
  // 2. Fetch and ingest all active feeds
  // -------------------------------------------------------------------------
  async ingestFeeds(): Promise<number> {
    const { data: sources } = await this.supabase
      .from('rss_sources')
      .select('*')
      .eq('active', true);

    if (!sources || sources.length === 0) {
      console.log('[RSS] No active sources found');
      return 0;
    }

    let totalNew = 0;

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);
        const items = feed.items || [];

        for (const item of items) {
          const guid = item.guid || item.link || item.title || '';
          if (!guid) continue;

          // Check if already ingested
          const { data: exists } = await this.supabase
            .from('rss_feed_items')
            .select('id')
            .eq('guid', guid)
            .limit(1);

          if (exists && exists.length > 0) continue;

          // Check relevance before inserting
          const isRelevant = this.isHrRelevant(
            item.title || '',
            item.contentSnippet || item.content || item.summary || ''
          );

          if (!isRelevant) continue;

          const feedItem: Omit<RssFeedItem, 'id' | 'ingested_at'> = {
            source_id: source.id,
            title: (item.title || '').substring(0, 500),
            link: (item.link || '').substring(0, 1000),
            description: (item.contentSnippet || item.content || item.summary || '').substring(0, 5000),
            pub_date: item.pubDate || item.isoDate || new Date().toISOString(),
            guid,
            processed: false,
          };

          const { error } = await this.supabase.from('rss_feed_items').insert(feedItem);
          if (!error) totalNew++;
        }

        // Update last_fetched timestamp
        await this.supabase
          .from('rss_sources')
          .update({ last_fetched: new Date().toISOString() })
          .eq('id', source.id);

        console.log(`[RSS] Ingested from ${source.name}: ${items.length} items checked`);
      } catch (err) {
        console.error(`[RSS] Error fetching ${source.name}:`, err);
        await this.supabase
          .from('rss_sources')
          .update({ last_error: String(err) })
          .eq('id', source.id);
      }
    }

    console.log(`[RSS] Total new items ingested: ${totalNew}`);
    return totalNew;
  }

  // -------------------------------------------------------------------------
  // 3. Relevance filter - quick keyword check before AI processing
  // -------------------------------------------------------------------------
  private isHrRelevant(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();
    const keywords = [
      'employment', 'employer', 'employee', 'worker', 'workplace',
      'dismissal', 'redundancy', 'disciplinary', 'grievance',
      'tribunal', 'unfair dismissal', 'discrimination',
      'maternity', 'paternity', 'parental leave', 'flexible working',
      'sick pay', 'ssp', 'statutory', 'minimum wage', 'living wage',
      'acas', 'cipd', 'equality act', 'employment rights',
      'whistleblowing', 'protected disclosure', 'tupe',
      'contract of employment', 'notice period', 'garden leave',
      'settlement agreement', 'compromise agreement',
      'health and safety', 'reasonable adjustments', 'disability',
      'harassment', 'bullying', 'victimisation',
      'fire and rehire', 'zero hours', 'agency worker',
      'right to work', 'immigration', 'sponsor licence',
      'data protection', 'gdpr', 'subject access',
      'trade union', 'collective bargaining',
      'occupational health', 'fit note',
      'fair work agency', 'employment rights act',
      'annual leave', 'holiday pay', 'working time',
      // Economic and business keywords
      'interest rate', 'inflation', 'cpi', 'rpi', 'cost of living',
      'national insurance', 'employer nic', 'ni contributions',
      'energy price', 'price cap', 'utility costs',
      'pension', 'auto-enrolment', 'auto enrolment', 'workplace pension',
      'budget', 'fiscal', 'tax threshold', 'personal allowance',
      'national living wage', 'national minimum wage', 'nlw', 'nmw',
      'apprenticeship levy', 'employment allowance',
      'business rates', 'small business',
      'labour market', 'unemployment', 'vacancy', 'recruitment',
      'wage growth', 'pay review', 'pay award', 'salary benchmark',
      'skills shortage', 'workforce planning',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  // -------------------------------------------------------------------------
  // 4. Generate AI draft articles from unprocessed feed items
  // -------------------------------------------------------------------------
  async generateDrafts(batchSize: number = 5): Promise<number> {
    const { data: unprocessed } = await this.supabase
      .from('rss_feed_items')
      .select('*')
      .eq('processed', false)
      .order('pub_date', { ascending: false })
      .limit(batchSize);

    if (!unprocessed || unprocessed.length === 0) {
      console.log('[RSS] No unprocessed items to generate drafts for');
      return 0;
    }

    let draftsCreated = 0;

    for (const item of unprocessed) {
      try {
        const draft = await this.generateArticle(item);
        if (draft) {
          await this.supabase.from('article_drafts').insert(draft);
          draftsCreated++;
        }

        // Mark as processed regardless of whether we created a draft
        await this.supabase
          .from('rss_feed_items')
          .update({ processed: true })
          .eq('id', item.id);
      } catch (err) {
        console.error(`[RSS] Error generating draft for "${item.title}":`, err);
        // Mark as processed to avoid retry loops
        await this.supabase
          .from('rss_feed_items')
          .update({ processed: true })
          .eq('id', item.id);
      }
    }

    console.log(`[RSS] Generated ${draftsCreated} draft articles`);
    return draftsCreated;
  }

  // -------------------------------------------------------------------------
  // 5. AI article generation using Anthropic
  // -------------------------------------------------------------------------
  private async generateArticle(
    item: RssFeedItem
  ): Promise<Omit<ArticleDraft, 'id' | 'created_at'> | null> {
    const prompt = `You are the content writer for SIT-HR Advisory, a UK employment law and HR advisory platform for SME employers.

You have been given a news item from an RSS feed. Your task is to write a practical, actionable article for UK employers based on this news.

RULES:
- Write for a UK SME employer audience (1 to 250 employees)
- Focus on what the employer needs to DO, not just what happened
- Reference specific legislation by section number where relevant
- Include practical action points
- Use Markdown formatting with ## headings
- Keep the tone professional but accessible
- Do NOT use emdashes (the character typed as two hyphens or the long dash character) anywhere in your output. Use commas, semicolons, colons, or full stops instead.
- Include a disclaimer at the end: "This article provides general guidance based on the law as understood at the date of publication. It is not legal advice. Seek qualified legal advice for your specific circumstances."
- If the item is not relevant to UK employers (employment law, HR, people management, workplace economics, business costs, tax, pensions, or labour market data), respond with exactly: NOT_RELEVANT
- Maximum 800 words for the article content
- The summary should be 1 to 2 sentences, maximum 200 characters

NEWS ITEM:
Title: ${item.title}
Source: ${item.link}
Published: ${item.pub_date}
Description: ${item.description}

Respond in this exact JSON format:
{
  "title": "Article title (clear, practical, max 80 characters)",
  "category": "legislation|tribunal|policy|guidance|reminder",
  "summary": "1-2 sentence summary for the article list view",
  "content": "Full markdown article content"
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';

      if (text.includes('NOT_RELEVANT')) return null;

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);

      const slug = this.generateSlug(parsed.title);

      return {
        feed_item_id: item.id || '',
        title: parsed.title,
        slug,
        category: parsed.category || 'guidance',
        summary: parsed.summary,
        content: parsed.content,
        status: 'draft',
      };
    } catch (err) {
      console.error('[RSS] Anthropic API error:', err);
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // 6. Slug generator
  // -------------------------------------------------------------------------
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 80)
      .replace(/-$/, '');
  }

  // -------------------------------------------------------------------------
  // 7. Publish an approved draft to the news_articles table
  // -------------------------------------------------------------------------
  async publishDraft(draftId: string, reviewerId?: string): Promise<boolean> {
    const { data: draft } = await this.supabase
      .from('article_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (!draft) return false;

    // Insert into news_articles
    const { error: insertError } = await this.supabase
      .from('news_articles')
      .insert({
        title: draft.title,
        slug: draft.slug,
        category: draft.category,
        summary: draft.summary,
        content: draft.content,
        published: true,
        pinned: false,
        important: false,
      });

    if (insertError) {
      console.error('[RSS] Error publishing draft:', insertError);
      return false;
    }

    // Update draft status
    await this.supabase
      .from('article_drafts')
      .update({
        status: 'published',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId || null,
      })
      .eq('id', draftId);

    console.log(`[RSS] Published draft: ${draft.title}`);
    return true;
  }

  // -------------------------------------------------------------------------
  // 8. Reject a draft
  // -------------------------------------------------------------------------
  async rejectDraft(draftId: string, reviewerId?: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('article_drafts')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId || null,
      })
      .eq('id', draftId);

    return !error;
  }

  // -------------------------------------------------------------------------
  // 9. List drafts by status
  // -------------------------------------------------------------------------
  async listDrafts(
    status: string = 'draft',
    limit: number = 20
  ): Promise<ArticleDraft[]> {
    const { data } = await this.supabase
      .from('article_drafts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  // -------------------------------------------------------------------------
  // 10. Generate outbound RSS XML for published articles
  // -------------------------------------------------------------------------
  async generateOutboundFeed(): Promise<string> {
    const { data: articles } = await this.supabase
      .from('news_articles')
      .select('title, slug, category, summary, content, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(50);

    const siteUrl = process.env.SITE_URL || 'https://sithr.lwbc.ltd';
    const now = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>SIT-HR Advisory - Employment Law Updates</title>
  <link>${siteUrl}</link>
  <description>UK employment law updates, tribunal decisions, and HR guidance for employers</description>
  <language>en-gb</language>
  <lastBuildDate>${now}</lastBuildDate>
  <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
  <ttl>60</ttl>
`;

    if (articles) {
      for (const article of articles) {
        const pubDate = new Date(article.created_at).toUTCString();
        const articleUrl = `${siteUrl}/news/${article.slug}`;
        const escapedTitle = this.escapeXml(article.title);
        const escapedSummary = this.escapeXml(article.summary);

        xml += `  <item>
    <title>${escapedTitle}</title>
    <link>${articleUrl}</link>
    <description>${escapedSummary}</description>
    <category>${article.category}</category>
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="true">${articleUrl}</guid>
  </item>
`;
      }
    }

    xml += `</channel>
</rss>`;

    return xml;
  }

  // -------------------------------------------------------------------------
  // 11. XML escape helper
  // -------------------------------------------------------------------------
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // -------------------------------------------------------------------------
  // 12. Full daily run: ingest then generate drafts
  // -------------------------------------------------------------------------
  async dailyRun(): Promise<void> {
    console.log('[RSS] Starting daily run...');
    const startTime = Date.now();

    try {
      await this.seedSources();
      const ingested = await this.ingestFeeds();
      const drafts = await this.generateDrafts(10);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `[RSS] Daily run complete in ${elapsed}s. Ingested: ${ingested}, Drafts: ${drafts}`
      );
    } catch (err) {
      console.error('[RSS] Daily run failed:', err);
    }
  }
  // -------------------------------------------------------------------------
  // Local authority news ingestion
  // -------------------------------------------------------------------------
  async ingestLocalNews(): Promise<number> {
    const { data: feeds } = await this.supabase
      .from('council_feeds')
      .select('*')
      .eq('active', true);

    if (!feeds || feeds.length === 0) return 0;

    let totalNew = 0;

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.feed_url);

        for (const item of (parsed.items || [])) {
          const title = item.title || '';
          const snippet = item.contentSnippet || item.content || item.summary || '';
          const text = `${title} ${snippet}`.toLowerCase();

          const employerKeywords = [
            'business', 'employer', 'employment', 'planning', 'road closure',
            'consultation', 'grant', 'support', 'rates', 'parking',
            'licence', 'licensing', 'health', 'safety', 'waste',
            'council tax', 'commercial', 'enterprise', 'skills',
            'training', 'apprenticeship', 'recruitment fair',
          ];

          if (!employerKeywords.some(kw => text.includes(kw))) continue;

          const { error } = await this.supabase
            .from('calendar_events')
            .insert({
              title: title.substring(0, 200),
              description: snippet.substring(0, 500) || 'Local authority news item.',
              action_points: 'Check the council website for full details and any deadlines.',
              category: 'local',
              start_date: item.pubDate
                ? new Date(item.pubDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              source_url: item.link || feed.feed_url,
              local_authority_code: feed.local_authority_code,
            });

          if (!error) totalNew++;
        }

        await this.supabase
          .from('council_feeds')
          .update({ last_fetched: new Date().toISOString() })
          .eq('id', feed.id);

      } catch (err) {
        console.error(`[LOCAL] Error fetching ${feed.local_authority_name}:`, err);
      }
    }

    return totalNew;
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------
export const rssService = new RssService();

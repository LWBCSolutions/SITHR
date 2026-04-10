import Anthropic from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// Awareness Calendar
// ============================================================

interface AwarenessEvent {
  name: string;
  date: string;
  endDate?: string;
  category: 'awareness' | 'religious' | 'cultural' | 'legal';
  description: string;
}

const AWARENESS_CALENDAR: AwarenessEvent[] = [
  // --- January ---
  { name: 'Start of new holiday year (Jan orgs)', date: '2026-01-01', category: 'legal', description: 'Many organisations begin their annual leave year on 1 January.' },

  // --- February ---
  { name: 'LGBT+ History Month', date: '2026-02-01', endDate: '2026-02-28', category: 'awareness', description: 'A month celebrating the history and achievements of the LGBT+ community in the UK.' },
  { name: 'Time to Talk Day', date: '2026-02-05', category: 'awareness', description: 'A national day to get people talking about mental health, run by Mind and Rethink Mental Illness.' },
  { name: 'Ramadan begins (approx)', date: '2026-02-17', endDate: '2026-03-19', category: 'religious', description: 'The Islamic month of fasting. Employees may be fasting during daylight hours; consider flexible breaks and workload adjustments.' },
  { name: 'Chinese New Year', date: '2027-02-06', category: 'cultural', description: 'Celebrated by Chinese, Vietnamese, Korean, and other East Asian communities worldwide.' },

  // --- March ---
  { name: 'International Women\'s Day', date: '2026-03-08', category: 'awareness', description: 'A global day celebrating women\'s social, economic, cultural, and political achievements.' },
  { name: 'Neurodiversity Celebration Week', date: '2026-03-16', endDate: '2026-03-22', category: 'awareness', description: 'A week celebrating the strengths of neurodivergent individuals including those with dyslexia, autism, ADHD, and dyspraxia.' },
  { name: 'Eid al-Fitr (approx)', date: '2026-03-20', category: 'religious', description: 'Marks the end of Ramadan. A major celebration for Muslim employees; many may request leave.' },
  { name: 'World Down Syndrome Day', date: '2026-03-21', category: 'awareness', description: 'A global awareness day for Down syndrome, promoting inclusion and equal opportunities.' },

  // --- April ---
  { name: 'Start of new holiday year (Apr orgs)', date: '2026-04-01', category: 'legal', description: 'Many organisations begin their annual leave year on 1 April, aligned with the financial year.' },
  { name: 'Stress Awareness Month', date: '2026-04-01', endDate: '2026-04-30', category: 'awareness', description: 'A month dedicated to raising awareness of stress causes and cures. Managers should check in on team wellbeing.' },
  { name: 'World Autism Awareness Day', date: '2026-04-02', category: 'awareness', description: 'Raising awareness of autism. Consider what reasonable adjustments your workplace offers for autistic colleagues.' },
  { name: 'Easter (Good Friday)', date: '2026-04-03', category: 'religious', description: 'Christian observance. Good Friday is a UK bank holiday.' },
  { name: 'Easter Monday', date: '2026-04-06', category: 'religious', description: 'UK bank holiday following Easter Sunday.' },
  { name: 'End of tax year', date: '2026-04-05', category: 'legal', description: 'The UK tax year ends on 5 April. Payroll teams will be processing year-end.' },
  { name: 'National Minimum Wage uprating', date: '2026-04-06', category: 'legal', description: 'New NMW/NLW rates come into effect. Ensure all pay rates are updated.' },
  { name: 'National Pet Day', date: '2026-04-11', category: 'awareness', description: 'A light-hearted day to acknowledge the role pets play in employee wellbeing.' },
  { name: 'Passover begins', date: '2026-04-01', endDate: '2026-04-09', category: 'religious', description: 'Jewish festival of Passover. Some employees may request leave for Seder nights and observance.' },
  { name: 'Vaisakhi', date: '2026-04-14', category: 'religious', description: 'Sikh new year and harvest festival, one of the most important dates in the Sikh calendar.' },
  { name: 'World Day for Safety and Health at Work', date: '2026-04-28', category: 'awareness', description: 'A day to promote safe, healthy, and decent working conditions.' },

  // --- May ---
  { name: 'Deaf Awareness Week', date: '2026-05-04', endDate: '2026-05-10', category: 'awareness', description: 'A week raising awareness of deafness and hearing loss. Consider communication accessibility in your team.' },
  { name: 'Mental Health Awareness Week', date: '2026-05-11', endDate: '2026-05-17', category: 'awareness', description: 'The Mental Health Foundation\'s annual campaign. This year\'s theme focuses on community and connection.' },
  { name: 'Learning at Work Week', date: '2026-05-18', endDate: '2026-05-22', category: 'awareness', description: 'Campaign for Learning\'s week promoting workplace development. A good prompt to discuss CPD with your team.' },
  { name: 'Vesak / Buddha Day', date: '2026-05-12', category: 'religious', description: 'The most important Buddhist festival, celebrating the birth, enlightenment, and death of the Buddha.' },

  // --- June ---
  { name: 'Volunteers\' Week', date: '2026-06-01', endDate: '2026-06-07', category: 'awareness', description: 'A week to celebrate and thank volunteers across the UK.' },
  { name: 'Pride Month', date: '2026-06-01', endDate: '2026-06-30', category: 'awareness', description: 'A month celebrating LGBTQ+ communities worldwide. Consider visible allyship in the workplace.' },
  { name: 'Carers Week', date: '2026-06-08', endDate: '2026-06-14', category: 'awareness', description: 'Raising awareness of the challenges faced by unpaid carers. Many of your employees may have caring responsibilities.' },
  { name: 'Eid al-Adha (approx)', date: '2026-06-06', category: 'religious', description: 'One of the most important Islamic festivals. Muslim employees may request leave.' },
  { name: 'Loneliness Awareness Week', date: '2026-06-15', endDate: '2026-06-21', category: 'awareness', description: 'Campaign highlighting the impact of loneliness. Particularly relevant for remote and hybrid teams.' },
  { name: 'World Wellbeing Week', date: '2026-06-22', endDate: '2026-06-28', category: 'awareness', description: 'A week promoting physical, emotional, and social wellbeing in the workplace.' },

  // --- September ---
  { name: 'National Inclusion Week', date: '2026-09-28', endDate: '2026-10-02', category: 'awareness', description: 'The UK\'s largest diversity and inclusion event. A prompt to review inclusion practices.' },
  { name: 'Rosh Hashanah', date: '2026-09-12', endDate: '2026-09-13', category: 'religious', description: 'Jewish New Year. Observant employees will not work on these days.' },
  { name: 'Yom Kippur', date: '2026-09-21', category: 'religious', description: 'The holiest day in the Jewish calendar. A strict day of fasting and prayer; observant employees will not work.' },

  // --- October ---
  { name: 'Black History Month UK', date: '2026-10-01', endDate: '2026-10-31', category: 'awareness', description: 'A month celebrating the contributions and achievements of Black people in Britain.' },
  { name: 'World Mental Health Day', date: '2026-10-10', category: 'awareness', description: 'A day for global mental health education and awareness, with a focus on making mental health a universal human right.' },
  { name: 'World Menopause Day', date: '2026-10-18', category: 'awareness', description: 'Raising awareness of menopause and the support available. Consider your workplace menopause policy.' },
  { name: 'Navratri / Dussehra', date: '2026-10-07', endDate: '2026-10-15', category: 'religious', description: 'Hindu festival of nine nights culminating in Dussehra. Some employees may celebrate or fast during this period.' },
  { name: 'Diwali', date: '2026-10-20', category: 'religious', description: 'The Hindu, Sikh, and Jain festival of lights. One of the most widely celebrated festivals in the UK.' },

  // --- November ---
  { name: 'Movember', date: '2026-11-01', endDate: '2026-11-30', category: 'awareness', description: 'A month raising awareness of men\'s health issues including prostate cancer, testicular cancer, and mental health.' },

  // --- December ---
  { name: 'International Day of Persons with Disabilities', date: '2026-12-03', category: 'awareness', description: 'A day to promote the rights and well-being of disabled people in all areas of society.' },
  { name: 'International Human Rights Day', date: '2026-12-10', category: 'awareness', description: 'Marks the adoption of the Universal Declaration of Human Rights.' },
  { name: 'Hanukkah', date: '2026-12-05', endDate: '2026-12-13', category: 'religious', description: 'The Jewish festival of lights, lasting eight days. Observant employees may celebrate in the evenings.' },
  { name: 'Christmas Day', date: '2026-12-25', category: 'religious', description: 'Christian celebration and UK bank holiday. Many workplaces close between Christmas and New Year.' },
];

// ============================================================
// Team Talk Service
// ============================================================

class TeamTalkService {
  private supabase: SupabaseClient;
  private anthropic: Anthropic;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
  }

  // Get events happening in the next N weeks
  getUpcomingEvents(weeksAhead: number = 2): AwarenessEvent[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() + weeksAhead * 7 * 24 * 60 * 60 * 1000);

    return AWARENESS_CALENDAR.filter(event => {
      const eventDate = new Date(event.date);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;

      // Event starts within the window, or is ongoing (started before but ends within/after)
      return (eventDate >= now && eventDate <= cutoff) ||
             (eventEnd >= now && eventDate <= cutoff);
    });
  }

  // Generate the weekly briefing content via AI
  async generateWeeklyBriefing(): Promise<{
    title: string;
    slug: string;
    summary: string;
    content: string;
  }> {
    const upcomingEvents = this.getUpcomingEvents(2);
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekStr = weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // ISO week number
    const jan1 = new Date(weekStart.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((weekStart.getTime() - jan1.getTime()) / (1000 * 60 * 60 * 24) + jan1.getDay() + 1) / 7);

    const eventsBlock = upcomingEvents.length > 0
      ? upcomingEvents.map(e => `- ${e.name} (${e.date}${e.endDate ? ' to ' + e.endDate : ''}): ${e.description}`).join('\n')
      : '- No specific awareness events in the next two weeks.';

    const prompt = `You are the editorial writer for SIT-HR Advisory, a UK employment law and HR platform for small and medium employers. You write a weekly management briefing called "Team Talk".

Write this week's Team Talk briefing. The date is ${weekStr}.

UPCOMING AWARENESS EVENTS (next 2 weeks):
${eventsBlock}

STRUCTURE (use exactly these markdown headings):

## This Week's Awareness
2 to 3 sentences. Mention the most relevant upcoming awareness dates, cultural events, or religious observances from the list above. Tell managers what it is and suggest one practical thing they can do (acknowledge it in a team meeting, check if anyone needs adjustments, etc.).

## Did You Know?
2 to 3 sentences. One surprising or useful fact about UK employment law, workplace culture, or people management. Make it an "I didn't know that" moment. Cite the legal source briefly if relevant (e.g. "under the Equality Act 2010").

## Quick Skill
2 to 4 sentences. One practical micro-skill for managers. Draw from people management psychology: the 3-second pause before responding, naming emotions to defuse them ("It sounds like you're frustrated"), separating the person from the behaviour, checking in without interrogating ("How are things going?" not "Is everything OK?"), the warmth-and-firmness balance, active listening, the window of tolerance. Pick one technique and explain how to use it in a real scenario.

## Conversation Starter
1 to 2 sentences. A question managers can drop into a team meeting or one-to-one. Format it as a markdown blockquote. Keep it low-pressure and open-ended. Examples of the tone: "What's one thing that made your work easier this week?" or "If you could change one thing about how we communicate as a team, what would it be?"

## On the Horizon
2 to 3 sentences. One upcoming legal change, policy trend, or regulatory development that affects UK employers. Plain English explanation of what it means and what managers should do about it.

RULES:
- Total word count: 250 to 350 words. Managers should read this in 2 to 3 minutes.
- Tone: warm, direct, accessible. Write as a helpful colleague, not a textbook.
- NEVER use em dashes. Use commas, semicolons, colons, or full stops instead.
- Do not use double hyphens as dashes.
- Do not use bullet points within sections (except the Conversation Starter blockquote). Use flowing prose.
- Each section should feel complete on its own.
- UK English spelling throughout.

Return your response as JSON with these fields:
{
  "summary": "One sentence summary of this week's briefing (under 120 characters)",
  "content": "The full markdown content with all 5 sections"
}

Return ONLY valid JSON, no markdown code fences, no explanation.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('');

    let parsed: { summary: string; content: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    return {
      title: `Team Talk: Week of ${weekStr}`,
      slug: `team-talk-w${weekNum}-${weekStart.getFullYear()}`,
      summary: parsed.summary,
      content: parsed.content,
    };
  }

  // Create a draft in the article_drafts table
  async createDraft(): Promise<string> {
    const briefing = await this.generateWeeklyBriefing();

    const { data, error } = await this.supabase
      .from('article_drafts')
      .insert({
        feed_item_id: `team-talk-${briefing.slug}`,
        title: briefing.title,
        slug: briefing.slug,
        category: 'teamtalk',
        summary: briefing.summary,
        content: briefing.content,
        status: 'draft',
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to insert Team Talk draft: ${error.message}`);
    }

    return data.id;
  }
}

export const teamTalkService = new TeamTalkService();

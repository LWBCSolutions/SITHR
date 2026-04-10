import path from 'path';
import dotenv from 'dotenv';

// Load env BEFORE any module that checks process.env at import time
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cron from 'node-cron';
import multer from 'multer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import stripeRouter from './stripe';
import { PLAN_LIMITS, type PlanName } from './planLimits';
import { documentLibrary } from './documentLibrary';
import { rssService } from './rssService';
import { teamTalkService } from './teamTalkService';

// ---------------------------------------------------------------------------
// Load and combine system prompt at startup
// ---------------------------------------------------------------------------
function loadSystemPrompt(): string {
  const rootDir = path.resolve(__dirname, '../..');
  const files = [
    path.join(rootDir, 'system-prompt', 'system-prompt.md'),
    path.join(rootDir, 'skills', 'employment-law', 'SKILL.md'),
    path.join(rootDir, 'skills', 'hr-psychology', 'SKILL.md'),
  ];

  const parts: string[] = [];
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      parts.push(content);
    } catch (err) {
      console.warn(`Warning: could not load system prompt file ${filePath}:`, err);
    }
  }

  return parts.join('\n\n');
}

const systemPrompt = loadSystemPrompt();
console.log(`System prompt loaded (${systemPrompt.length} characters)`);

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ---------------------------------------------------------------------------
// Anthropic retry wrapper for overload errors
// ---------------------------------------------------------------------------
async function callAnthropicWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
  maxRetries = 3
): Promise<Anthropic.Message> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (error: unknown) {
      const err = error as { status?: number; error?: { error?: { type?: string } }; headers?: Record<string, string> };
      const isOverloaded = err?.status === 529 ||
        err?.error?.error?.type === 'overloaded_error';
      const isRetryable = err?.headers?.['x-should-retry'] === 'true';

      if ((isOverloaded || isRetryable) && attempt < maxRetries) {
        const delay = attempt * 2000;
        console.log(`Anthropic overloaded, retry ${attempt}/${maxRetries} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// ---------------------------------------------------------------------------
// Supabase configuration
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (supabaseConfigured) {
  console.log('Supabase configured');
} else {
  console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY not set  - Supabase features disabled');
}

// Create a Supabase client authenticated as the requesting user.
// The frontend sends the user's access token in the Authorization header;
// this lets RLS policies that check auth.uid() work correctly.
function getSupabaseClient(req: Request): SupabaseClient | null {
  if (!supabaseConfigured) return null;

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}

// ---------------------------------------------------------------------------
// Conversation cleanup (30-day expiry)
// ---------------------------------------------------------------------------
async function cleanupExpiredConversations() {
  if (!supabaseConfigured) return;
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data: expired } = await client
      .from('conversations')
      .select('id')
      .lt('expires_at', new Date().toISOString());

    if (expired && expired.length > 0) {
      const ids = expired.map((c: { id: string }) => c.id);
      await client.from('messages').delete().in('conversation_id', ids);
      await client.from('conversations').delete().in('id', ids);
      console.log(`Cleaned up ${ids.length} expired conversations`);
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}

cleanupExpiredConversations();
setInterval(cleanupExpiredConversations, 24 * 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// Audit log helper
// ---------------------------------------------------------------------------
async function auditLog(eventType: string, metadata: object, ip: string) {
  if (!supabaseConfigured) return;
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    await client.from('audit_log').insert({
      event_type: eventType,
      metadata,
      ip_address: ip,
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

// ---------------------------------------------------------------------------
// Input sanitisation helper
// ---------------------------------------------------------------------------
function sanitiseInput(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, 5000);
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use('/api/stripe', stripeRouter);
app.use(express.json({ limit: '2mb' }));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", process.env.SUPABASE_URL || ''].filter(Boolean),
      imgSrc: ["'self'", "data:"],
    }
  },
}));

// Rate limiting for chat endpoint
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Rate limit exceeded. Maximum 20 queries per hour.' },
  standardHeaders: true,
  keyGenerator: (req) => {
    const auth = req.headers.authorization;
    if (auth) return auth;
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  validate: false,
});
app.use('/api/chat', chatLimiter);

const policyReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many policy reviews. Please try again in an hour.' },
  standardHeaders: true,
  keyGenerator: (req) => {
    const auth = req.headers.authorization;
    if (auth) return auth;
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  validate: false,
});

// ---------------------------------------------------------------------------
// Auth middleware - extracts user from JWT
// ---------------------------------------------------------------------------
function requireAuth(req: Request, res: Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const payload = JSON.parse(Buffer.from(auth.split('.')[1], 'base64').toString());
    (req as any).user = { id: payload.sub, email: payload.email || '' };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------------------------------------------------------------------------
// GET /api/subscription - current user subscription, usage, and profile
// ---------------------------------------------------------------------------
app.get('/api/subscription', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const period = new Date().toISOString().slice(0, 7);

    const userClient = getSupabaseClient(req);
    if (!userClient) {
      res.status(503).json({ error: 'Supabase not configured' });
      return;
    }

    const [subResult, usageResult, profileResult] = await Promise.all([
      userClient.from('subscriptions').select('*').eq('user_id', userId).single(),
      userClient.from('monthly_usage').select('*').eq('user_id', userId).eq('period', period).single(),
      userClient.from('user_profiles').select('*').eq('user_id', userId).single(),
    ]);

    let subscription = subResult.data;
    if (!subscription) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      const { data: newSub } = await userClient
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: 'trial',
          status: 'trialing',
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
        })
        .select()
        .single();

      subscription = newSub;
    }

    const plan = (subscription?.plan || 'trial') as PlanName;
    const limits = PLAN_LIMITS[plan];

    const usage = usageResult.data || {
      conversations_started: 0,
      messages_sent: 0,
      exports_generated: 0,
    };

    const now = Date.now();
    const trialEndMs = subscription?.trial_end
      ? new Date(subscription.trial_end).getTime()
      : now + 7 * 24 * 60 * 60 * 1000;

    const trialDaysRemaining = subscription?.status === 'trialing'
      ? Math.max(0, Math.ceil((trialEndMs - now) / (1000 * 60 * 60 * 24)))
      : 0;

    const isTrialExpired = subscription?.status === 'trialing' && trialEndMs < now;

    res.json({
      subscription,
      plan,
      limits,
      usage,
      profile: profileResult.data || null,
      trialDaysRemaining,
      isTrialExpired,
    });
  } catch (err) {
    console.error('Subscription endpoint error:', err);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/trial/register-ip - record trial IP for abuse prevention
// ---------------------------------------------------------------------------
app.post('/api/trial/register-ip', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket.remoteAddress
      || 'unknown';

    const adminClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: existing } = await adminClient
      .from('trial_ips')
      .select('id, user_id')
      .eq('ip_address', ip)
      .single();

    if (existing && existing.user_id !== userId) {
      await adminClient
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: 'trial',
          status: 'ip_blocked',
          trial_start: new Date().toISOString(),
          trial_end: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      res.json({ blocked: true });
      return;
    }

    await adminClient
      .from('trial_ips')
      .upsert({
        ip_address: ip,
        user_id: userId,
        used_at: new Date().toISOString(),
      }, { onConflict: 'ip_address' });

    res.json({ blocked: false });
  } catch (err) {
    console.error('Trial IP registration error:', err);
    res.status(500).json({ error: 'Failed to register trial' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/documents - list document templates (public)
// ---------------------------------------------------------------------------
app.get('/api/documents', (_req: Request, res: Response) => {
  const { category, tier } = _req.query;
  let docs = documentLibrary.map(doc => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    tier: doc.tier,
    description: doc.description,
    triggers: doc.triggers,
  }));

  if (category && category !== 'all') {
    docs = docs.filter(d => d.category === category);
  }
  if (tier === '1') docs = docs.filter(d => d.tier === 1);
  if (tier === '2') docs = docs.filter(d => d.tier === 2);

  res.json({ documents: docs, total: docs.length });
});

// ---------------------------------------------------------------------------
// GET /api/documents/:id - single document with full content (public)
// ---------------------------------------------------------------------------
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const doc = documentLibrary.find(d => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ document: doc });
});

// Serve static files in production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// ---------------------------------------------------------------------------
// POST /api/chat  - streaming chat via Anthropic
// ---------------------------------------------------------------------------
// Document generation system prompt - instructs Claude to return structured JSON
const documentGenerationPrompt = `You are a document generation system for SIT-HR, an HR advisory tool for the adult social care sector in England & Wales.

Analyze the conversation provided and generate a document pack. Return ONLY valid JSON with no markdown code fences. The JSON must follow this exact structure:

{
  "summary": "2-3 sentence summary of the conversation and the HR situation",
  "actionChecklist": ["Step 1...", "Step 2...", "Step 3..."],
  "documents": [
    {
      "templateId": "template-id-from-list",
      "title": "Document Title",
      "filledFields": {
        "field name": "value from conversation context"
      }
    }
  ]
}

Available document templates and their fields:

ABSENCE CATEGORY:
- return-to-work-form: Return to Work Interview Form
  Fields: Employee name, Manager name, Date of interview, Date absence began, Date returned to work, Reason for absence, Is absence disability-related, Fit note received, Actions agreed, Next review date
- absence-notification: Sickness Absence Notification Form
  Fields: Employee name, Date of notification, Method of notification, Date absence began, Expected return date, Reason for absence, Manager receiving notification
- absence-stage1-warning: Stage 1 Absence Warning Letter
  Fields: Employee name, Employee address, Date, Manager name, Absence dates and reasons, Bradford Factor score, Meeting date, Warning duration, Review date, Appeal deadline
- absence-stage2-warning: Stage 2 Absence Warning Letter
  Fields: Employee name, Employee address, Date, Manager name, Previous warning date, Further absence dates, Bradford Factor score, Meeting date, Warning duration, Review date, Appeal deadline
- absence-stage3-final: Stage 3 Final Absence Review / Dismissal Letter
  Fields: Employee name, Employee address, Date, Panel chair name, Previous warnings summary, Total absence record, Meeting date, Decision, Notice period, Last working day, Appeal deadline

DISCIPLINARY CATEGORY:
- investigation-invite: Invitation to Investigation Meeting
  Fields: Employee name, Employee address, Date, Investigating officer name, Allegation summary, Meeting date and time, Meeting location, Right to be accompanied note
- investigation-record: Investigation Meeting Record
  Fields: Employee name, Investigating officer name, Date of meeting, Note taker name, Allegation summary, Questions and responses, Documents reviewed, Findings summary
- disciplinary-invite: Invitation to Disciplinary Hearing
  Fields: Employee name, Employee address, Date, Hearing chair name, Allegation details, Hearing date and time, Hearing location, Possible outcomes, Right to be accompanied, Documents enclosed list
- disciplinary-warning: Disciplinary Outcome - Written Warning
  Fields: Employee name, Employee address, Date, Hearing chair name, Hearing date, Allegation, Finding, Sanction, Warning duration, Improvement required, Review date, Appeal deadline
- disciplinary-final-dismissal: Disciplinary Outcome - Final Warning or Dismissal
  Fields: Employee name, Employee address, Date, Hearing chair name, Hearing date, Allegation, Finding, Decision, Reason for decision, Notice period, Last working day, Appeal deadline

GRIEVANCE CATEGORY:
- grievance-form: Grievance Submission Form
  Fields: Employee name, Date submitted, Grievance details, Outcome sought, Previous attempts to resolve
- grievance-acknowledgement: Acknowledgement of Grievance Letter
  Fields: Employee name, Employee address, Date, HR contact name, Date grievance received, Grievance summary, Meeting date and time, Right to be accompanied
- grievance-invite: Invitation to Grievance Meeting
  Fields: Employee name, Employee address, Date, Hearing officer name, Grievance summary, Meeting date and time, Meeting location, Right to be accompanied
- grievance-outcome: Grievance Outcome Letter
  Fields: Employee name, Employee address, Date, Hearing officer name, Meeting date, Grievance summary, Findings, Decision, Actions to be taken, Appeal deadline
- grievance-appeal-outcome: Grievance Appeal Outcome Letter
  Fields: Employee name, Employee address, Date, Appeal chair name, Appeal hearing date, Original grievance summary, Appeal grounds, Appeal findings, Appeal decision, Further recourse

CAPABILITY CATEGORY:
- performance-improvement-plan: Performance Improvement Plan
  Fields: Employee name, Manager name, Date, Role, Performance concerns, Expected standards, Support measures, Review dates, Review period duration, Consequences of no improvement
- capability-invite: Invitation to Capability Meeting
  Fields: Employee name, Employee address, Date, Meeting chair name, Performance concerns summary, Meeting date and time, Meeting location, Right to be accompanied, Possible outcomes
- capability-stage1-warning: Stage 1 Capability Warning Letter
  Fields: Employee name, Employee address, Date, Meeting chair name, Meeting date, Performance concerns, Expected improvements, Support offered, Review period, Review date, Warning duration, Appeal deadline
- capability-stage2-final: Stage 2 Capability Final Warning Letter
  Fields: Employee name, Employee address, Date, Meeting chair name, Meeting date, Previous warning date, Ongoing performance concerns, Expected improvements, Support offered, Review period, Warning duration, Appeal deadline
- capability-dismissal: Capability Dismissal Letter
  Fields: Employee name, Employee address, Date, Panel chair name, Meeting date, Performance history, Previous warnings, Decision, Reason, Notice period, Last working day, Appeal deadline

GENERAL CATEGORY:
- contract-variation: Contract Variation Letter
  Fields: Employee name, Employee address, Date, Current terms, Proposed new terms, Reason for variation, Effective date, Response deadline, Consultation notes
- settlement-heads: Settlement Agreement - Heads of Terms
  Fields: Employee name, Employer name, Date, Termination date, Settlement sum, Ex-gratia payment, Notice pay, Holiday pay accrued, Reference terms, Confidentiality terms, Legal advice contribution, Claims waived
- redundancy-at-risk: Redundancy At Risk Letter
  Fields: Employee name, Employee address, Date, Reason for redundancy, Pool description, Selection criteria, Consultation meeting date, Right to be accompanied, Alternative employment note
- redundancy-confirmation: Redundancy Selection Confirmation Letter
  Fields: Employee name, Employee address, Date, Selection outcome, Redundancy payment calculation, Notice period, Last working day, Holiday pay, Right of appeal, Appeal deadline
- file-note: File Note / Contemporaneous Record
  Fields: Author name, Date, Time, Persons present, Location, Subject, Summary of discussion, Actions agreed, Signed by

RULES:
- Only include documents that are directly relevant to the conversation.
- Fill fields with information from the conversation where available.
- Where information is not available in the conversation, use "[INSERT: field description]" as the value.
- Never use real employee names - if the conversation mentions names, replace with "[INSERT: Employee name]".
- The actionChecklist should contain practical next steps based on the conversation.
- Do not include any markdown formatting in the JSON.
- Use straight hyphens (-) not em-dashes or en-dashes.`;

// Report summary system prompt for binder situation summaries
const reportSummaryPrompt = `You generate structured situation summaries for HR advisory reports. Based on the conversation provided, return ONLY valid JSON with no markdown fences.

For Low and Medium risk situations, return:

{
  "situation_type": "one-line type e.g. Sickness Absence - Stage 1",
  "summary": "2-3 sentence factual summary",
  "risk_level": "Low | Medium | High | Critical",
  "risk_rationale": "one sentence explaining the risk level",
  "key_legal_framework": ["ERA 1996 s.X", "Acas Code 2015"],
  "immediate_actions": ["action 1", "action 2", "action 3"],
  "flags": []
}

For High and Critical risk situations, include a detailed_analysis field:

{
  "situation_type": "...",
  "summary": "...",
  "risk_level": "High or Critical",
  "risk_rationale": "...",
  "key_legal_framework": [...],
  "immediate_actions": [...],
  "flags": [...],
  "detailed_analysis": {
    "competing_tensions": [
      {
        "tension": "Brief description of the legal tension",
        "obligation_a": "First competing obligation",
        "obligation_b": "Second competing obligation",
        "resolution": "How to navigate - which takes priority and why"
      }
    ],
    "investigation_framework": [
      "Key question the investigation must answer 1",
      "Key question the investigation must answer 2",
      "Key question the investigation must answer 3"
    ],
    "tribunal_exposure": {
      "current": "Exposure now - what a tribunal would examine",
      "post_jan_2027": "How exposure changes after January 2027",
      "mitigation": "What correct process now does to reduce this exposure"
    },
    "process_checklist": [
      "Step 1 with specific detail",
      "Step 2 with specific detail"
    ]
  }
}

Only include detailed_analysis for High and Critical risk. Omit it entirely for Low and Medium.

For flags, only include items that are genuinely present:
- Protected characteristic in play
- Safeguarding concern
- Protected disclosure risk
- January 2027 exposure

If none apply, return an empty array. Use straight hyphens only, no em-dashes.`;

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory, documentGeneration } = req.body as {
      message: string;
      conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
      documentGeneration?: boolean;
    };

    if (!message && !documentGeneration) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...(conversationHistory || []),
    ];

    if (message) {
      messages.push({ role: 'user', content: sanitiseInput(message) });
    }

    // -----------------------------------------------------------------------
    // Document generation mode - non-streaming JSON response
    // -----------------------------------------------------------------------
    if (documentGeneration) {
      const docPrompt = messages.length > 0
        ? `Based on the following conversation, generate the document pack:\n\n${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}`
        : 'Generate a general HR document pack template.';

      const docMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [
        { role: 'user', content: docPrompt },
      ];

      const response = await callAnthropicWithRetry({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: documentGenerationPrompt,
        messages: docMessages,
      });

      const textContent = response.content.find(c => c.type === 'text');
      const responseText = textContent ? textContent.text : '';

      // Audit log for export pack
      auditLog('export_pack', { conversation_length: messages.length }, req.ip || '');

      res.json({ type: 'document_pack', content: responseText });
      return;
    }

    // -----------------------------------------------------------------------
    // Normal chat mode - streaming SSE
    // -----------------------------------------------------------------------
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullResponse = '';

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages,
    });

    stream.on('text', (deltaText: string) => {
      fullResponse += deltaText;
      res.write(`data: ${JSON.stringify({ type: 'content', text: deltaText })}\n\n`);
    });

    stream.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'done', text: fullResponse })}\n\n`);
      res.end();

      // Log usage (non-blocking)
      if (supabaseConfigured) {
        stream.finalMessage().then((finalMessage) => {
          if (finalMessage?.usage) {
            const inputTokens = finalMessage.usage.input_tokens || 0;
            const outputTokens = finalMessage.usage.output_tokens || 0;
            const cost = (inputTokens * 0.000003) + (outputTokens * 0.000015);
            const client = createClient(supabaseUrl, supabaseAnonKey);
            client.from('usage_logs').insert({
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              model: 'claude-sonnet-4-20250514',
              estimated_cost_usd: cost,
            }).then(({ error }) => {
              if (error) console.error('Usage log error:', error.message);
            });
          }
        }).catch(() => {});
      }
    });

    stream.on('error', (err: unknown) => {
      console.error('Anthropic stream error:', err);
      const e = err as { status?: number; message?: string; error?: { error?: { type?: string } } };
      const isOverloaded = e?.status === 529 || e?.error?.error?.type === 'overloaded_error';
      const msg = isOverloaded
        ? 'The guidance service is temporarily busy. Please try again in a moment.'
        : (e?.message || 'An error occurred');
      res.write(`data: ${JSON.stringify({ type: 'error', message: msg, retryable: isOverloaded })}\n\n`);
      res.end();
    });
  } catch (err: unknown) {
    console.error('Chat endpoint error:', err);
    let errorMessage = 'Internal server error';
    if (err instanceof Error) {
      if (err.message.includes('overloaded') || err.message.includes('Overloaded')) {
        errorMessage = 'The service is temporarily busy. Please wait a moment and try again.';
      } else {
        errorMessage = err.message;
      }
    }
    const e = err as { status?: number; error?: { error?: { type?: string } } };
    const isOverloaded = e?.status === 529 || e?.error?.error?.type === 'overloaded_error';
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage, retryable: isOverloaded })}\n\n`);
      res.end();
    } else {
      res.status(isOverloaded ? 503 : 500).json({ error: isOverloaded ? 'service_busy' : errorMessage, message: errorMessage, retryable: isOverloaded });
    }
  }
});

// ---------------------------------------------------------------------------
// POST /api/report-summary  - generate structured situation summary
// ---------------------------------------------------------------------------
app.post('/api/report-summary', async (req: Request, res: Response) => {
  try {
    const { conversationHistory } = req.body;
    const prompt = conversationHistory.map((m: {role: string, content: string}) =>
      `${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');

    const response = await callAnthropicWithRetry({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: reportSummaryPrompt,
      messages: [{ role: 'user', content: `Generate a situation summary for this conversation:\n\n${prompt}` }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    res.json({ content: textContent?.text || '{}' });
  } catch (err) {
    console.error('Report summary error:', err);
    res.status(500).json({ error: 'Failed to generate report summary' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/analyse-policy  - lightweight policy gap analysis
// ---------------------------------------------------------------------------
const policyAnalysisPrompt = `You are reviewing an employer's HR policy document for potential gaps or outdated provisions. Your role is strictly limited to identifying items worth discussing with a policy writer.

RULES:
- Identify a maximum of 5 specific observations
- Each observation must be a single clear sentence
- Never suggest specific replacement language
- Never rewrite or redraft any part of the policy
- Frame every observation as something worth discussing with a policy writer
- Do not say the policy is wrong - say it may be worth reviewing
- If the policy appears broadly sound, say so and list no more than 2 minor observations
- Do not reference specific employee situations from the conversation
- Do not produce a score, rating, or grade
- No em-dashes - use hyphens only
- Write as a senior HR professional

Respond in valid JSON only. No preamble. No explanation outside the JSON.

{
  "overall": "broadly sound" or "some observations" or "several observations",
  "observations": ["observation 1", "observation 2"],
  "disclaimer": "These observations are not a policy audit. Have this policy reviewed by a qualified HR professional before relying on it."
}`;

app.post('/api/analyse-policy', async (req: Request, res: Response) => {
  try {
    const { policyFilename, policyContent, situationType } = req.body as {
      policyFilename: string;
      policyContent: string;
      situationType: string;
    };

    if (!policyContent || !policyFilename) {
      res.json({ error: true });
      return;
    }

    const truncatedContent = policyContent.substring(0, 3000);

    const response = await callAnthropicWithRetry({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: policyAnalysisPrompt,
      messages: [{
        role: 'user',
        content: `Policy document: ${sanitiseInput(policyFilename)}\nSituation type: ${sanitiseInput(situationType || 'General HR')}\nPolicy content: ${truncatedContent}\n\nIdentify any observations worth discussing with a policy writer.`,
      }],
    });

    const textContent = response.content.find(c => c.type === 'text');
    const raw = textContent?.text || '';

    // Parse JSON response
    let cleaned = raw.trim();
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) cleaned = fenceMatch[1].trim();

    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error('Policy analysis error:', err);
    res.json({ error: true });
  }
});

// ---------------------------------------------------------------------------
// POST /api/extract-document  - extract text from uploaded files (PDF, DOCX, images)
// ---------------------------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

app.post('/api/extract-document', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    let extractedText = '';
    const mimetype = file.mimetype;
    const filename = file.originalname;

    if (mimetype === 'application/pdf') {
      // PDF extraction
      try {
        const data = await pdfParse(file.buffer);
        extractedText = data.text || '';
      } catch {
        extractedText = '[PDF text extraction failed]';
      }
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      // DOCX extraction
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = result.value || '';
      } catch {
        extractedText = '[DOCX text extraction failed]';
      }
    } else if (mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8');
    } else if (mimetype.startsWith('image/')) {
      // OCR via tesseract.js
      try {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('eng');
        const { data } = await worker.recognize(file.buffer);
        extractedText = data.text || '';
        await worker.terminate();
        if (!extractedText.trim()) {
          extractedText = `[Image file: ${filename} - OCR returned no readable text]`;
        }
      } catch {
        extractedText = `[Image file: ${filename} - OCR not available, ${mimetype.replace('image/', '').toUpperCase()} document attached]`;
      }
    }

    // Sanitise and truncate
    extractedText = extractedText
      .replace(/<[^>]+>/g, '')
      .trim()
      .substring(0, 15000);

    res.json({
      filename,
      mimetype,
      content: extractedText,
      charCount: extractedText.length,
    });
  } catch (err) {
    console.error('Document extraction error:', err);
    const msg = err instanceof Error ? err.message : 'Extraction failed';
    res.status(500).json({ error: msg });
  }
});

// ---------------------------------------------------------------------------
// POST /api/conversations  - create a conversation
// ---------------------------------------------------------------------------
app.post('/api/conversations', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const { user_id, title } = req.body as { user_id: string; title: string };

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id, title })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('Create conversation error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// GET /api/conversations/:userId  - list conversations for a user
// (includes expires_at if the column exists in the table)
// ---------------------------------------------------------------------------
app.get('/api/conversations/:userId', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const { userId } = req.params;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('List conversations error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// GET /api/conversations/:conversationId/messages  - list messages
// ---------------------------------------------------------------------------
app.get('/api/conversations/:conversationId/messages', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const { conversationId } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('List messages error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// POST /api/messages  - create a message
// ---------------------------------------------------------------------------
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const { conversation_id, role, content } = req.body as {
      conversation_id: string;
      role: string;
      content: string;
    };

    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, role, content })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation_id);

    res.json(data);
  } catch (err) {
    console.error('Create message error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/conversations/:conversationId  - delete conversation + messages
// ---------------------------------------------------------------------------
app.delete('/api/conversations/:conversationId', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const { conversationId } = req.params;

    // Delete messages first (foreign key dependency)
    const { error: msgError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (msgError) {
      res.status(400).json({ error: msgError.message });
      return;
    }

    // Delete the conversation
    const { error: convError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (convError) {
      res.status(400).json({ error: convError.message });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete conversation error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// GET /api/news  - list published articles (public)
// ---------------------------------------------------------------------------
app.get('/api/news', async (_req: Request, res: Response) => {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await client
      .from('news_articles')
      .select('id, title, slug, category, summary, pinned, important, created_at')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ articles: data || [] });
  } catch (err) {
    console.error('News list error:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/news/:slug  - single article by slug (public)
// ---------------------------------------------------------------------------
app.get('/api/news/:slug', async (req: Request, res: Response) => {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await client
      .from('news_articles')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ article: data });
  } catch (err) {
    console.error('News article error:', err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/notifications  - active notifications (requires auth)
// ---------------------------------------------------------------------------
app.get('/api/notifications', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient(req);
    if (!supabase) {
      res.status(503).json({ error: 'Supabase is not configured' });
      return;
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('app_notifications')
      .select('*')
      .eq('active', true)
      .lte('starts_at', now)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ notifications: data || [] });
  } catch (err) {
    console.error('Notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ---------------------------------------------------------------------------
// Policy Review endpoint (streaming)
// ---------------------------------------------------------------------------
app.post('/api/policy-review', requireAuth, policyReviewLimiter, async (req: Request, res: Response) => {
  try {
    const { documentText, fileName, context } = req.body;

    if (!documentText || typeof documentText !== 'string') {
      res.status(400).json({ error: 'No document text provided.' });
      return;
    }

    if (documentText.length > 100000) {
      res.status(400).json({ error: 'Document too large. Maximum 100,000 characters.' });
      return;
    }

    const policyReviewPrompt = fs.readFileSync(
      path.join(__dirname, '../../system-prompt/policy-review-prompt.md'),
      'utf-8'
    );

    const userMessage = `Please review the following HR policy document.

DOCUMENT NAME: ${sanitiseInput(fileName || 'Unknown')}

ORGANISATION CONTEXT:
- Type: ${sanitiseInput(context?.orgType || 'Not specified')}
- Staff count: ${sanitiseInput(context?.staffCount || 'Not specified')}
- Specific concerns: ${sanitiseInput(context?.concerns || 'None specified')}
- Agreed ways of working: ${sanitiseInput(context?.agreedWays || 'None specified')}

DOCUMENT TEXT:
---
${documentText.slice(0, 80000)}
---

Please provide a complete Policy Review Report following the output structure in your instructions.`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullResponse = '';

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: policyReviewPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    stream.on('text', (deltaText: string) => {
      fullResponse += deltaText;
      res.write(`data: ${JSON.stringify({ type: 'content', text: deltaText })}\n\n`);
    });

    stream.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'done', text: fullResponse })}\n\n`);
      res.end();

      auditLog('policy_review', { fileName, orgType: context?.orgType }, req.ip || '');
    });

    stream.on('error', (err: Error) => {
      console.error('Policy review stream error:', err);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Review failed.' })}\n\n`);
        res.end();
      }
    });
  } catch (error) {
    console.error('Policy review error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Policy review failed.' });
    } else if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Review failed.' })}\n\n`);
      res.end();
    }
  }
});

// ---------------------------------------------------------------------------
// Outbound RSS feed
// ---------------------------------------------------------------------------
app.get('/rss.xml', async (_req: Request, res: Response) => {
  try {
    const xml = await rssService.generateOutboundFeed();
    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    console.error('RSS feed generation error:', err);
    res.status(500).send('Error generating RSS feed');
  }
});

app.get('/feed', async (_req: Request, res: Response) => {
  try {
    const xml = await rssService.generateOutboundFeed();
    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    console.error('RSS feed generation error:', err);
    res.status(500).send('Error generating RSS feed');
  }
});

// ---------------------------------------------------------------------------
// Admin API routes for RSS draft management
// ---------------------------------------------------------------------------
app.get('/api/admin/drafts', requireAuth, async (req: Request, res: Response) => {
  try {
    const status = (req.query.status as string) || 'draft';
    const limit = parseInt(req.query.limit as string) || 20;
    const drafts = await rssService.listDrafts(status, limit);
    res.json({ drafts });
  } catch (err) {
    console.error('List drafts error:', err);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

app.post('/api/admin/drafts/:id/publish', requireAuth, async (req: Request, res: Response) => {
  try {
    const draftId = String(req.params.id);
    const reviewerId = String((req as any).user?.id || '');
    const success = await rssService.publishDraft(draftId, reviewerId || undefined);
    if (success) {
      res.json({ success: true, message: 'Draft published successfully' });
    } else {
      res.status(404).json({ error: 'Draft not found or could not be published' });
    }
  } catch (err) {
    console.error('Publish draft error:', err);
    res.status(500).json({ error: 'Failed to publish draft' });
  }
});

app.post('/api/admin/drafts/:id/reject', requireAuth, async (req: Request, res: Response) => {
  try {
    const draftId = String(req.params.id);
    const reviewerId = String((req as any).user?.id || '');
    const success = await rssService.rejectDraft(draftId, reviewerId || undefined);
    if (success) {
      res.json({ success: true, message: 'Draft rejected' });
    } else {
      res.status(404).json({ error: 'Draft not found' });
    }
  } catch (err) {
    console.error('Reject draft error:', err);
    res.status(500).json({ error: 'Failed to reject draft' });
  }
});

app.post('/api/admin/rss/run', requireAuth, async (_req: Request, res: Response) => {
  try {
    await rssService.dailyRun();
    res.json({ success: true, message: 'RSS ingestion completed' });
  } catch (err) {
    console.error('Manual RSS run error:', err);
    res.status(500).json({ error: 'RSS ingestion failed' });
  }
});

app.get('/api/admin/rss/sources', requireAuth, async (_req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('rss_sources')
      .select('*')
      .order('name');
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ sources: data || [] });
  } catch (err) {
    console.error('List RSS sources error:', err);
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

app.post('/api/admin/rss/sources', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, url, category, active } = req.body;
    if (!name || !url) {
      res.status(400).json({ error: 'Name and URL are required' });
      return;
    }
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('rss_sources')
      .insert({ name, url, category: category || 'guidance', active: active !== false })
      .select()
      .single();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ source: data });
  } catch (err) {
    console.error('Add RSS source error:', err);
    res.status(500).json({ error: 'Failed to add source' });
  }
});

// POST /api/admin/team-talk/generate - manually generate a Team Talk briefing
app.post('/api/admin/team-talk/generate', requireAuth, async (_req: Request, res: Response) => {
  try {
    const draftId = await teamTalkService.createDraft();
    res.json({ success: true, draftId, message: 'Team Talk draft generated' });
  } catch (err) {
    console.error('Team Talk generation error:', err);
    res.status(500).json({ error: 'Failed to generate Team Talk' });
  }
});

// ---------------------------------------------------------------------------
// Catch-all: serve SPA index.html for non-API GET requests
// ---------------------------------------------------------------------------
app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Client build not found' });
  }
});

// ---------------------------------------------------------------------------
// Weekly report generation
// ---------------------------------------------------------------------------
async function sendWeeklyReport() {
  if (!process.env.RESEND_API_KEY || !process.env.REPORT_EMAIL) return;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const client = createClient(supabaseUrl, supabaseAnonKey);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: usage } = await client
      .from('usage_logs')
      .select('input_tokens, output_tokens, estimated_cost_usd')
      .gte('created_at', weekAgo.toISOString());

    if (!usage || usage.length === 0) return;

    const totalInput = usage.reduce((s, r) => s + r.input_tokens, 0);
    const totalOutput = usage.reduce((s, r) => s + r.output_tokens, 0);
    const totalCost = usage.reduce((s, r) => s + parseFloat(r.estimated_cost_usd), 0);
    const weekEnd = new Date().toLocaleDateString('en-GB');

    await resend.emails.send({
      from: process.env.RESEND_FROM || 'SIT-HR <noreply@lwbc.ltd>',
      to: process.env.REPORT_EMAIL,
      subject: `SIT-HR Weekly Report - w/e ${weekEnd} - $${totalCost.toFixed(4)}`,
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
        <div style="background:#1C1C1E;padding:20px;border-radius:8px 8px 0 0">
          <span style="color:#fff;font-size:20px;font-weight:700">SIT</span><span style="color:#2D7DD2;font-size:20px;font-weight:700">-HR</span>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0">Weekly Usage Report</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #E0E0E0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:14px;color:#666">Period: w/e ${weekEnd}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#F5F5F5"><td style="padding:12px;font-size:12px;color:#666">Queries</td><td style="padding:12px;font-weight:700;text-align:right">${usage.length}</td></tr>
            <tr><td style="padding:12px;font-size:12px;color:#666">Input Tokens</td><td style="padding:12px;text-align:right">${totalInput.toLocaleString()}</td></tr>
            <tr style="background:#F5F5F5"><td style="padding:12px;font-size:12px;color:#666">Output Tokens</td><td style="padding:12px;text-align:right">${totalOutput.toLocaleString()}</td></tr>
            <tr><td style="padding:12px;font-size:12px;color:#666;font-weight:700">Estimated Cost</td><td style="padding:12px;text-align:right;font-weight:700;color:#2D7DD2">$${totalCost.toFixed(4)}</td></tr>
          </table>
          <p style="font-size:11px;color:#AAA">Claude Sonnet rates: $3/M input, $15/M output. Document generation excluded.</p>
        </div>
      </div>`
    });
    console.log(`Weekly report sent. Cost: $${totalCost.toFixed(4)}`);
  } catch (err) {
    console.error('Weekly report error:', err);
  }
}

// Every Monday at 05:30 UK time - generate weekly Team Talk briefing
cron.schedule('30 5 * * 1', async () => {
  console.log('[CRON] Generating weekly Team Talk briefing...');
  try {
    const draftId = await teamTalkService.createDraft();
    console.log(`[CRON] Team Talk draft created: ${draftId}`);
  } catch (err) {
    console.error('[CRON] Team Talk generation error:', err);
  }
}, { timezone: 'Europe/London' });

// Every Monday at 08:00 UK time
cron.schedule('0 8 * * 1', sendWeeklyReport, { timezone: 'Europe/London' });

// Daily RSS ingestion and article draft generation at 06:00 UK time
cron.schedule('0 6 * * *', async () => {
  console.log('[CRON] Starting daily RSS ingestion...');
  try {
    await rssService.dailyRun();
  } catch (err) {
    console.error('[CRON] RSS daily run error:', err);
  }
}, { timezone: 'Europe/London' });

// Afternoon catch-up at 14:00 UK time
cron.schedule('0 14 * * *', async () => {
  console.log('[CRON] Starting afternoon RSS ingestion...');
  try {
    await rssService.ingestFeeds();
    await rssService.generateDrafts(5);
  } catch (err) {
    console.error('[CRON] RSS afternoon run error:', err);
  }
}, { timezone: 'Europe/London' });

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`SIT-HR server running on port ${PORT}`);
  console.log(`Supabase: ${supabaseConfigured ? 'configured' : 'not configured'}`);
});

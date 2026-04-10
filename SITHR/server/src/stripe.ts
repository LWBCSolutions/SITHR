import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getPlanFromPriceId, getPlanLimits } from './planLimits';

const router = express.Router();

// ---------------------------------------------------------------------------
// If Stripe is not configured, return 503 on all routes
// ---------------------------------------------------------------------------
if (!process.env.STRIPE_SECRET_KEY) {
  router.all('*', (_req, res) => {
    res.status(503).json({ error: 'Stripe is not configured' });
  });
} else {
// Only set up real routes when Stripe key is available

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10' as const,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAdminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

function getUserFromReq(req: express.Request): { id: string; email: string } | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(Buffer.from(auth.split('.')[1], 'base64').toString());
    return { id: payload.sub, email: payload.email || '' };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// POST /webhook -- Stripe webhook handler
// ---------------------------------------------------------------------------
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    res.status(400).json({ error: `Webhook Error: ${message}` });
    return;
  }

  const supabase = getAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price?.id || '';
        const plan = getPlanFromPriceId(priceId);

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          plan,
          status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: false,
        }, { onConflict: 'user_id' });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id || '';
        const plan = getPlanFromPriceId(priceId);

        await supabase
          .from('subscriptions')
          .update({
            plan,
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  res.json({ received: true });
});

// ---------------------------------------------------------------------------
// JSON body parsing for non-webhook routes
const jsonParser = express.json();

// POST /create-checkout -- Create a Stripe Checkout session
// ---------------------------------------------------------------------------
router.post('/create-checkout', jsonParser, async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let { priceId } = req.body;
    if (!priceId) {
      res.status(400).json({ error: 'priceId is required' });
      return;
    }

    // Resolve plan names to Stripe price IDs
    const planToPriceMap: Record<string, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      professional: process.env.STRIPE_PRICE_PROFESSIONAL,
      organisation: process.env.STRIPE_PRICE_ORGANISATION,
    };
    if (planToPriceMap[priceId]) {
      priceId = planToPriceMap[priceId];
    }

    if (!priceId || priceId.length < 5) {
      console.error('Invalid priceId after resolution:', priceId);
      res.status(400).json({ error: 'Invalid plan. Please check Stripe price configuration.' });
      return;
    }

    console.log('Creating checkout for user:', user.id, 'resolved price:', priceId?.substring(0, 20) + '...');

    const supabase = getAdminClient();

    // Check for existing Stripe customer
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      currency: 'gbp',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://sithr.lwbc.ltd/settings/billing?success=true',
      cancel_url: 'https://sithr.lwbc.ltd/settings/billing?cancelled=true',
      metadata: { user_id: user.id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Create checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ---------------------------------------------------------------------------
// POST /customer-portal -- Open Stripe billing portal
// ---------------------------------------------------------------------------
router.post('/customer-portal', jsonParser, async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const supabase = getAdminClient();
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!sub?.stripe_customer_id) {
      res.status(404).json({ error: 'No subscription found' });
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: 'https://sithr.lwbc.ltd/settings/billing',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Customer portal error:', err);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// ---------------------------------------------------------------------------
// GET /subscription -- Get current subscription, usage, and profile
// ---------------------------------------------------------------------------
router.get('/subscription', async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const supabase = getAdminClient();

    // Fetch subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If no subscription exists, create a trial
    let sub = subscription;
    if (!sub) {
      const trialDays = parseInt(process.env.STRIPE_TRIAL_DAYS || '7', 10);
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + trialDays);

      const { data: newSub } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: 'trial',
          status: 'trialing',
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
          current_period_start: new Date().toISOString(),
          current_period_end: trialEnd.toISOString(),
          cancel_at_period_end: false,
        }, { onConflict: 'user_id' })
        .select()
        .single();

      sub = newSub;
    }

    // Current period month for usage lookup
    const now = new Date();
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Fetch usage and profile in parallel
    const [usageResult, profileResult] = await Promise.all([
      supabase
        .from('monthly_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_month', periodMonth)
        .single(),
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
    ]);

    const usage = usageResult.data || {
      conversations_count: 0,
      messages_count: 0,
      exports_count: 0,
    };
    const profile = profileResult.data || null;

    const plan = sub?.plan || 'trial';
    const limits = getPlanLimits(plan);

    // Calculate trial days remaining
    let trialDaysRemaining = 7;
    let isTrialExpired = false;
    if (sub?.plan === 'trial') {
      const endField = sub.trial_end || sub.current_period_end;
      if (endField) {
        const endDate = new Date(endField);
        const msRemaining = endDate.getTime() - Date.now();
        trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
        isTrialExpired = msRemaining <= 0;
      }
    }

    res.json({
      subscription: sub,
      plan,
      limits,
      usage,
      profile,
      isTrialExpired,
      trialDaysRemaining,
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// ---------------------------------------------------------------------------
// POST /trial/register-ip -- Record trial IP address
// ---------------------------------------------------------------------------
router.post('/trial/register-ip', jsonParser, async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const supabase = getAdminClient();

    // Check if IP already used by a different user
    const { data: existing } = await supabase
      .from('trial_ips')
      .select('user_id')
      .eq('ip_address', ip)
      .neq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      // IP already used by another user - block this trial
      await supabase
        .from('subscriptions')
        .update({ status: 'ip_blocked' })
        .eq('user_id', user.id);

      res.json({ blocked: true });
      return;
    }

    // Upsert IP record
    await supabase.from('trial_ips').upsert(
      { user_id: user.id, ip_address: ip },
      { onConflict: 'user_id' }
    );

    res.json({ blocked: false });
  } catch (err) {
    console.error('Register IP error:', err);
    res.status(500).json({ error: 'Failed to register IP' });
  }
});

// ---------------------------------------------------------------------------
// PUT /profile -- Update user profile
// ---------------------------------------------------------------------------
router.put('/profile', jsonParser, async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { display_name, organisation_name, job_title } = req.body;
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        display_name: display_name || null,
        organisation_name: organisation_name || null,
        job_title: job_title || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'Failed to update profile' });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /account -- Delete user account and all associated data
// ---------------------------------------------------------------------------
router.delete('/account', jsonParser, async (req, res) => {
  try {
    const user = getUserFromReq(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const supabase = getAdminClient();

    // Cancel Stripe subscription if one exists
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (sub?.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      } catch (stripeErr) {
        console.error('Failed to cancel Stripe subscription:', stripeErr);
      }
    }

    // Delete user data in order (respecting foreign key constraints)
    await supabase.from('messages').delete().eq('user_id', user.id);
    await supabase.from('conversations').delete().eq('user_id', user.id);
    await supabase.from('subscriptions').delete().eq('user_id', user.id);
    await supabase.from('monthly_usage').delete().eq('user_id', user.id);
    await supabase.from('user_profiles').delete().eq('id', user.id);

    // Note: deleting from auth.users would require a service role key

    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// End of Stripe-configured block
}

export default router;

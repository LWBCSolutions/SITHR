import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getPlanFromPriceId } from './planLimits';
import { lookupReferral, describeReferral } from './referral';

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
          status: subscription.status,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          trial_start: subscription.trial_start
            ? new Date(subscription.trial_start * 1000).toISOString()
            : null,
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
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

// ---------------------------------------------------------------------------
// POST /validate-referral -- Validate a referral code without redeeming it
// ---------------------------------------------------------------------------
router.post('/validate-referral', jsonParser, async (req, res) => {
  try {
    const { code } = req.body as { code?: string };
    if (!code || typeof code !== 'string') {
      res.status(400).json({ valid: false, message: 'Code is required.' });
      return;
    }

    const result = await lookupReferral(code);
    if (!result.valid || !result.referral) {
      res.json({ valid: false, message: result.message });
      return;
    }

    res.json({
      valid: true,
      type: result.referral.type,
      value: result.referral.value,
      description: result.referral.description,
      message: describeReferral(result.referral),
    });
  } catch (err) {
    console.error('Validate referral error:', err);
    res.status(500).json({ valid: false, message: 'Validation failed.' });
  }
});

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
    const { referralCode } = req.body as { referralCode?: string };
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

    let trialDays = parseInt(process.env.STRIPE_TRIAL_DAYS || '7', 10);
    let stripeCouponId: string | undefined;

    if (referralCode && typeof referralCode === 'string') {
      const result = await lookupReferral(referralCode);
      if (result.valid && result.referral) {
        const referral = result.referral;

        // free_access codes do not go through Stripe Checkout - reject here.
        if (referral.type === 'free_access') {
          res.status(400).json({
            error: 'wrong_flow',
            message: 'This code grants free access. Use the Activate Free Access button instead.',
          });
          return;
        }

        const adminClient = getAdminClient();

        // Has this user already used this code?
        const { data: existingUse } = await adminClient
          .from('referral_code_uses')
          .select('id')
          .eq('code_id', referral.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingUse) {
          if (referral.type === 'extended_trial') {
            trialDays += referral.value;
          } else if (referral.stripe_coupon_id) {
            stripeCouponId = referral.stripe_coupon_id;
          }

          await adminClient.from('referral_code_uses').insert({
            code_id: referral.id,
            user_id: user.id,
          });
          await adminClient
            .from('referral_codes')
            .update({ current_uses: referral.current_uses + 1 })
            .eq('id', referral.id);
        }
      }
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      currency: 'gbp',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trialDays,
        metadata: { user_id: user.id },
      },
      allow_promotion_codes: stripeCouponId ? false : true,
      success_url: 'https://sithr.lwbc.ltd/settings/billing?success=true',
      cancel_url: 'https://sithr.lwbc.ltd/settings/billing?cancelled=true',
      metadata: { user_id: user.id },
    };

    if (stripeCouponId) {
      sessionConfig.discounts = [{ coupon: stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
// (Removed: a duplicate /subscription handler used to live here with stale
// column names. The active /api/subscription endpoint is in index.ts.)
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

    const { display_name, organisation_name, job_title, business_postcode, local_authority_code, local_authority_name } = req.body;
    const supabase = getAdminClient();

    const updateData: Record<string, unknown> = {
      user_id: user.id,
      display_name: display_name || null,
      organisation_name: organisation_name || null,
      job_title: job_title || null,
      updated_at: new Date().toISOString(),
    };
    if (business_postcode !== undefined) updateData.business_postcode = business_postcode || null;
    if (local_authority_code !== undefined) updateData.local_authority_code = local_authority_code || null;
    if (local_authority_name !== undefined) updateData.local_authority_name = local_authority_name || null;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(updateData, { onConflict: 'user_id' })
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
    await supabase.from('user_profiles').delete().eq('user_id', user.id);

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

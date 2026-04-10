import { useState } from 'react';
import { motion } from 'framer-motion';

interface UpgradeModalProps {
  reason: 'trial_expired' | 'conversation_limit' | 'message_limit' | 'export_limit' | 'feature_gate';
  onClose?: () => void;
}

const REASONS: Record<string, string> = {
  trial_expired: 'Your free trial has ended. Choose a plan to continue.',
  conversation_limit: 'You have reached your conversation limit for this month.',
  message_limit: 'You have reached the message limit for this conversation.',
  export_limit: 'You have reached your export limit for this month.',
  feature_gate: 'This feature is available on Professional and above.',
};

const PLANS = [
  {
    name: 'Starter',
    price: '19',
    priceId: 'starter',
    features: [
      '10 conversations per month',
      '15 messages per conversation',
      '3 export packs per month',
      '1 policy upload',
      'News & Updates',
      'Standard support',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '49',
    priceId: 'professional',
    features: [
      '40 conversations per month',
      '30 messages per conversation',
      '15 export packs per month',
      '3 policy uploads',
      'Template emails',
      'Policy quality flag',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Organisation',
    price: '99',
    priceId: 'organisation',
    features: [
      'Unlimited conversations',
      'Unlimited messages',
      'Unlimited exports',
      '3 policy uploads',
      'All Professional features',
      'Up to 5 users',
      'Priority support',
    ],
    popular: false,
  },
];

export default function UpgradeModal({ reason, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleChoosePlan = async (planId: string) => {
    setLoading(planId);
    try {
      const { getAuthHeaders } = await import('../lib/api');
      const headers = await getAuthHeaders();
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ priceId: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  };

  const canDismiss = reason === 'feature_gate' && onClose;

  return (
    <>
      <motion.div
        className="upgrade-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="upgrade-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
      >
        {canDismiss && (
          <button className="upgrade-modal__close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
            </svg>
          </button>
        )}

        <h2 className="upgrade-modal__title">Choose Your Plan</h2>
        <p className="upgrade-modal__reason">{REASONS[reason]}</p>

        <div className="upgrade-modal__plans">
          {PLANS.map(plan => (
            <div key={plan.name} className={`plan-card ${plan.popular ? 'plan-card--popular' : ''}`}>
              {plan.popular && <span className="plan-card__badge">Most Popular</span>}
              <h3 className="plan-card__name">{plan.name}</h3>
              <div className="plan-card__price">
                <span className="plan-card__amount">{plan.price}</span>
                <span className="plan-card__period">/month</span>
              </div>
              <ul className="plan-card__features">
                {plan.features.map((f, i) => (
                  <li key={i} className="plan-card__feature">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2D7DD2" strokeWidth="2" strokeLinecap="round"><polyline points="2,7 5,10 12,3"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="plan-card__btn"
                onClick={() => handleChoosePlan(plan.priceId)}
                disabled={loading !== null}
              >
                {loading === plan.priceId ? 'Redirecting...' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

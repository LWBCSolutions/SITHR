import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAuthHeaders } from '../lib/api';

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

interface PlanSelectionPageProps {
  onActivated?: () => void;
}

export default function PlanSelectionPage({ onActivated }: PlanSelectionPageProps = {}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralStatus, setReferralStatus] = useState<{
    valid: boolean;
    message: string;
    type?: string;
  } | null>(null);
  const [validating, setValidating] = useState(false);
  const [activating, setActivating] = useState(false);

  const isFreeAccess = referralStatus?.valid && referralStatus.type === 'free_access';

  const handleValidateReferral = async () => {
    if (!referralCode.trim()) return;
    setValidating(true);
    setReferralStatus(null);
    setError(null);
    try {
      const res = await fetch('/api/stripe/validate-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: referralCode }),
      });
      const data = await res.json();
      setReferralStatus({
        valid: !!data.valid,
        message: data.message || 'Unknown response.',
        type: data.type,
      });
    } catch {
      setReferralStatus({ valid: false, message: 'Could not validate code.' });
    } finally {
      setValidating(false);
    }
  };

  const handleActivateFreeAccess = async () => {
    setActivating(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/auth/redeem-disca', {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: referralCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onActivated) onActivated();
        else window.location.reload();
        return;
      }
      setError(data.message || 'Could not activate free access. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setActivating(false);
    }
  };

  const handleChoosePlan = async (planId: string) => {
    setLoading(planId);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const body: { priceId: string; referralCode?: string } = { priceId: planId };
      if (referralStatus?.valid && referralCode.trim()) {
        body.referralCode = referralCode.trim();
      }
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || 'Could not start checkout. Please try again.');
      setLoading(null);
    } catch {
      setError('Network error. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="plan-selection-page">
      <motion.div
        className="plan-selection-page__inner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}
      >
        <h1 className="plan-selection-page__title">Choose your plan</h1>
        <p className="plan-selection-page__subtitle">
          Start with a 7-day free trial. Cancel any time. Your card will not be charged
          until the trial ends.
        </p>

        {error && <div className="plan-selection-page__error">{error}</div>}

        {isFreeAccess ? (
          <div className="free-access-card">
            <div className="free-access-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="free-access-card__title">{referralStatus?.message}</h2>
            <p className="free-access-card__body">
              You'll get full Professional access for the next 6 months. No card required.
              We'll send a friendly reminder before your access ends.
            </p>
            <button
              className="free-access-card__btn"
              onClick={handleActivateFreeAccess}
              disabled={activating}
            >
              {activating ? 'Activating...' : 'Activate Free Access'}
            </button>
            <button
              className="free-access-card__back"
              onClick={() => {
                setReferralStatus(null);
                setReferralCode('');
              }}
              disabled={activating}
            >
              Use a different code or choose a paid plan
            </button>
          </div>
        ) : (
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
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#2D7DD2" strokeWidth="2" strokeLinecap="round">
                      <polyline points="2,7 5,10 12,3" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="plan-card__btn"
                onClick={() => handleChoosePlan(plan.priceId)}
                disabled={loading !== null}
              >
                {loading === plan.priceId ? 'Redirecting...' : 'Start free trial'}
              </button>
            </div>
          ))}
        </div>
        )}

        {!isFreeAccess && (
        <div className="referral-section">
          {!showReferral ? (
            <button
              type="button"
              className="referral-toggle"
              onClick={() => setShowReferral(true)}
            >
              Have a referral code?
            </button>
          ) : (
            <div className="referral-input-group">
              <input
                type="text"
                className="referral-input"
                value={referralCode}
                onChange={e => {
                  setReferralCode(e.target.value.toUpperCase());
                  setReferralStatus(null);
                }}
                placeholder="Enter code"
                maxLength={20}
              />
              <button
                type="button"
                className="referral-apply-btn"
                onClick={handleValidateReferral}
                disabled={validating || !referralCode.trim()}
              >
                {validating ? 'Checking...' : 'Apply'}
              </button>
              {referralStatus && (
                <p
                  className={`referral-message ${
                    referralStatus.valid ? 'referral-message--success' : 'referral-message--error'
                  }`}
                >
                  {referralStatus.message}
                </p>
              )}
            </div>
          )}
        </div>
        )}

        <p className="plan-selection-page__footnote">
          By starting a trial you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

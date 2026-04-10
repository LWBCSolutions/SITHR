import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { getAuthHeaders } from '../lib/api';

type Tab = 'profile' | 'account' | 'billing' | 'danger';

const TAB_LABELS: Record<Tab, string> = {
  profile: 'Profile',
  account: 'Account',
  billing: 'Billing',
  danger: 'Danger Zone',
};

const PLAN_BADGE_CLASS: Record<string, string> = {
  trial: 'plan-badge--trial',
  starter: 'plan-badge--starter',
  professional: 'plan-badge--professional',
  organisation: 'plan-badge--organisation',
};

function UsageBar({ label, used, total }: { label: string; used: number; total: number }) {
  const safeUsed = used ?? 0;
  const isUnlimited = total == null || !isFinite(total) || total === 0;
  const pct = isUnlimited ? 0 : Math.min(Math.round((safeUsed / total) * 100), 100);
  const fillColor = pct >= 100 ? '#A32D2D' : pct >= 80 ? '#854F0B' : '#2D7DD2';

  if (isUnlimited) {
    return (
      <div className="usage-bar-group">
        <div className="usage-bar-label">
          <span>{label}</span>
          <span className="usage-unlimited-badge">Unlimited</span>
        </div>
      </div>
    );
  }

  return (
    <div className="usage-bar-group">
      <div className="usage-bar-label">
        <span>{label}</span>
        <span>{safeUsed} of {total} ({pct}%)</span>
      </div>
      <div className="usage-bar">
        <div className="usage-bar__fill" style={{ width: `${pct}%`, background: fillColor }} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, plan, limits, usage, profile, isTrialExpired, trialDaysRemaining, refreshSubscription } = useSubscription();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [postcode, setPostcode] = useState('');
  const [laCode, setLaCode] = useState('');
  const [laName, setLaName] = useState('');
  const [postcodeLooking, setPostcodeLooking] = useState(false);
  const [postcodeMsg, setPostcodeMsg] = useState('');

  // Account state
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Danger zone state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Billing banners
  const billingSuccess = searchParams.get('success') === 'true';
  const billingCancelled = searchParams.get('cancelled') === 'true';

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setOrgName(profile.organisation_name || '');
      setJobTitle(profile.job_title || '');
      setPostcode(profile.business_postcode || '');
      setLaCode(profile.local_authority_code || '');
      setLaName(profile.local_authority_name || '');
    }
  }, [profile]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    if (billingSuccess || billingCancelled) {
      setActiveTab('billing');
      if (billingSuccess) refreshSubscription();
    }
  }, [billingSuccess, billingCancelled, refreshSubscription]);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          display_name: displayName,
          organisation_name: orgName,
          job_title: jobTitle,
          business_postcode: postcode,
          local_authority_code: laCode,
          local_authority_name: laName,
        }),
      });
      if (res.ok) {
        setProfileMsg('Profile saved successfully.');
        refreshSubscription();
      } else {
        setProfileMsg('Failed to save profile. Please try again.');
      }
    } catch {
      setProfileMsg('Failed to save profile. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setPasswordMsg('Password must be at least 8 characters.');
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMsg(error.message);
      } else {
        setPasswordMsg('Password updated successfully.');
        setNewPassword('');
      }
    } catch {
      setPasswordMsg('Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        await supabase.auth.signOut();
        window.location.href = '/';
      }
    } catch {
      setDeleting(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/stripe/portal', { headers });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Silent fail
    }
  };

  const handleChoosePlan = async (priceId: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Silent fail
    }
  };

  const dismissBanner = () => {
    searchParams.delete('success');
    searchParams.delete('cancelled');
    setSearchParams(searchParams);
  };

  return (
    <div className="settings-page">
      <Link to="/" className="settings-back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="13" y1="8" x2="3" y2="8"/><polyline points="7,4 3,8 7,12"/>
        </svg>
        Back to Chat
      </Link>

      <h1 className="settings-heading">Settings</h1>

      <div className="settings-tabs">
        {(Object.keys(TAB_LABELS) as Tab[]).map(tab => (
          <button
            key={tab}
            className={`settings-tab ${activeTab === tab ? 'settings-tab--active' : ''} ${tab === 'danger' ? 'settings-tab--danger' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <motion.div
        className="settings-content"
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
          <div className="settings-section">
            <h2 className="settings-section__title">Profile Information</h2>
            <p className="settings-section__desc">Update your personal details.</p>

            <label className="settings-label">
              Display Name
              <input
                className="settings-input"
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label className="settings-label">
              Organisation Name
              <input
                className="settings-input"
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Company or organisation"
              />
            </label>

            <label className="settings-label">
              Job Title
              <input
                className="settings-input"
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="Your role"
              />
            </label>

            {profileMsg && <p className="settings-msg">{profileMsg}</p>}

            <button className="settings-btn" onClick={handleProfileSave} disabled={profileSaving}>
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          <div className="settings-section" style={{ marginTop: 24 }}>
            <h2 className="settings-section__title">Business Location</h2>
            <p className="settings-section__desc">
              Enter your business postcode to see local council news in the Compliance Calendar.
            </p>

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <label className="settings-label" style={{ flex: 1 }}>
                Business Postcode
                <input
                  className="settings-input"
                  type="text"
                  value={postcode}
                  onChange={e => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. SW1A 1AA"
                />
              </label>
              <button
                className="settings-btn"
                style={{ marginBottom: 0, minWidth: 100 }}
                onClick={async () => {
                  if (!postcode.trim()) return;
                  setPostcodeLooking(true);
                  setPostcodeMsg('');
                  try {
                    const res = await fetch(`/api/postcode/${encodeURIComponent(postcode.trim())}`);
                    if (!res.ok) {
                      setPostcodeMsg('Postcode not found. Please check and try again.');
                      return;
                    }
                    const data = await res.json();
                    setLaCode(data.local_authority_code || '');
                    setLaName(data.local_authority_name || '');
                    setPostcode(data.postcode || postcode);
                    setPostcodeMsg(`Detected: ${data.local_authority_name}`);
                  } catch {
                    setPostcodeMsg('Lookup failed. Please try again.');
                  } finally {
                    setPostcodeLooking(false);
                  }
                }}
                disabled={postcodeLooking || !postcode.trim()}
              >
                {postcodeLooking ? 'Looking up...' : 'Lookup'}
              </button>
            </div>

            {laName && (
              <p className="settings-msg" style={{ marginTop: 8 }}>
                Local authority: <strong>{laName}</strong> ({laCode})
              </p>
            )}
            {postcodeMsg && !laName && (
              <p className="settings-msg" style={{ marginTop: 8 }}>{postcodeMsg}</p>
            )}
          </div>
          </>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="settings-section">
            <h2 className="settings-section__title">Account</h2>

            <label className="settings-label">
              Email Address
              <input className="settings-input" type="email" value={email} disabled />
            </label>

            <h3 className="settings-section__subtitle">Change Password</h3>

            <label className="settings-label">
              New Password
              <input
                className="settings-input"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </label>

            {passwordMsg && <p className="settings-msg">{passwordMsg}</p>}

            <button className="settings-btn" onClick={handlePasswordChange} disabled={passwordSaving || !newPassword}>
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="settings-section">
            {billingSuccess && (
              <div className="settings-banner settings-banner--success">
                <span>Payment successful! Your plan is now active.</span>
                <button className="settings-banner__dismiss" onClick={dismissBanner}>&times;</button>
              </div>
            )}
            {billingCancelled && (
              <div className="settings-banner settings-banner--warn">
                <span>Checkout was cancelled. No changes were made.</span>
                <button className="settings-banner__dismiss" onClick={dismissBanner}>&times;</button>
              </div>
            )}

            <h2 className="settings-section__title">Billing & Usage</h2>

            <div className="settings-plan-row">
              <span>Current Plan:</span>
              <span className={`plan-badge ${PLAN_BADGE_CLASS[plan] || 'plan-badge--trial'}`}>
                {limits.label || plan}
              </span>
            </div>

            {plan === 'trial' && (
              <div className="settings-trial-info">
                {isTrialExpired ? (
                  <p className="settings-trial-expired">Your trial has ended - choose a plan to continue.</p>
                ) : (
                  <p className={`settings-trial-remaining ${
                    trialDaysRemaining <= 2 ? 'settings-trial-remaining--red' :
                    trialDaysRemaining <= 6 ? 'settings-trial-remaining--amber' : ''
                  }`}>
                    {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining in your free trial.
                  </p>
                )}
              </div>
            )}

            {subscription?.cancel_at_period_end && subscription.current_period_end && (
              <p className="settings-cancel-notice">
                Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}.
              </p>
            )}

            <div className="settings-usage">
              <h3 className="settings-section__subtitle">Usage This Period</h3>
              <UsageBar label="Conversations" used={usage.conversations_started} total={limits.conversations} />
              <UsageBar label="Exports" used={usage.exports_generated} total={limits.exportsPerMonth} />
            </div>

            {plan !== 'trial' && (
              <button className="settings-btn settings-btn--outline" onClick={handleManageBilling}>
                Manage Billing
              </button>
            )}

            <div className="settings-upgrade-cards">
              <h3 className="settings-section__subtitle">Available Plans</h3>
              <div className="settings-plans-grid">
                {[
                  { name: 'Starter', price: '19', id: 'starter', features: ['10 conversations/mo', '15 msgs/conversation', '3 exports/mo'] },
                  { name: 'Professional', price: '49', id: 'professional', features: ['40 conversations/mo', '30 msgs/conversation', '15 exports/mo'], popular: true },
                  { name: 'Organisation', price: '99', id: 'organisation', features: ['Unlimited conversations', 'Unlimited messages', 'Unlimited exports'] },
                ].map(p => (
                  <div key={p.id} className={`plan-card-sm ${p.popular ? 'plan-card-sm--popular' : ''}`}>
                    {p.popular && <span className="plan-card__badge">Popular</span>}
                    <h4 className="plan-card-sm__name">{p.name}</h4>
                    <div className="plan-card-sm__price">
                      <strong>{p.price}</strong>/mo
                    </div>
                    <ul className="plan-card-sm__features">
                      {p.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                    <button
                      className="plan-card__btn"
                      onClick={() => handleChoosePlan(p.id)}
                      disabled={plan === p.id}
                    >
                      {plan === p.id ? 'Current Plan' : 'Choose Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="settings-section danger-zone">
            <h2 className="settings-section__title danger-zone__title">Danger Zone</h2>
            <p className="settings-section__desc">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <label className="settings-label">
              Type <strong>DELETE</strong> to confirm
              <input
                className="settings-input danger-zone__input"
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </label>

            <button
              className="settings-btn danger-zone__btn"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deleting}
            >
              {deleting ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

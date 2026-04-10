import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getAuthHeaders } from '../lib/api';

interface PlanLimits {
  conversations: number;
  messagesPerConversation: number;
  exportsPerMonth: number;
  policyUploads: number;
  label: string;
}

interface Usage {
  conversations_started: number;
  messages_sent: number;
  exports_generated: number;
}

interface Profile {
  display_name: string | null;
  organisation_name: string | null;
  job_title: string | null;
}

interface Subscription {
  plan: string;
  status: string;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  plan: string;
  limits: PlanLimits;
  usage: Usage;
  profile: Profile | null;
  isTrialExpired: boolean;
  trialDaysRemaining: number;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const defaultLimits: PlanLimits = {
  conversations: Infinity,
  messagesPerConversation: Infinity,
  exportsPerMonth: Infinity,
  policyUploads: 3,
  label: 'Free Trial',
};

const defaultUsage: Usage = { conversations_started: 0, messages_sent: 0, exports_generated: 0 };

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  plan: 'trial',
  limits: defaultLimits,
  usage: defaultUsage,
  profile: null,
  isTrialExpired: false,
  trialDaysRemaining: 7,
  loading: true,
  refreshSubscription: async () => {},
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<SubscriptionContextType, 'refreshSubscription' | 'loading'>>({
    subscription: null,
    plan: 'trial',
    limits: defaultLimits,
    usage: defaultUsage,
    profile: null,
    isTrialExpired: false,
    trialDaysRemaining: 7,
  });
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/subscription', { headers });
      if (!res.ok) return;
      const data = await res.json();
      setState({
        subscription: data.subscription,
        plan: data.plan || 'trial',
        limits: data.limits || defaultLimits,
        usage: data.usage || defaultUsage,
        profile: data.profile,
        isTrialExpired: data.isTrialExpired || false,
        trialDaysRemaining: data.trialDaysRemaining ?? 7,
      });
    } catch {
      // Silent fail - defaults apply
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider value={{ ...state, loading, refreshSubscription: fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

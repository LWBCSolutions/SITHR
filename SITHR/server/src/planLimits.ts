export const PLAN_LIMITS = {
  trial: {
    conversations: Infinity,
    messagesPerConversation: Infinity,
    exportsPerMonth: Infinity,
    policyUploads: 3,
    label: 'Free Trial',
  },
  starter: {
    conversations: 10,
    messagesPerConversation: 15,
    exportsPerMonth: 3,
    policyUploads: 1,
    label: 'Starter',
  },
  professional: {
    conversations: 40,
    messagesPerConversation: 30,
    exportsPerMonth: 15,
    policyUploads: 3,
    label: 'Professional',
  },
  organisation: {
    conversations: Infinity,
    messagesPerConversation: Infinity,
    exportsPerMonth: Infinity,
    policyUploads: 3,
    label: 'Organisation',
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanName] || PLAN_LIMITS.trial;
}

export function getPlanFromPriceId(priceId: string): PlanName {
  const map: Record<string, PlanName> = {};
  if (process.env.STRIPE_PRICE_STARTER) map[process.env.STRIPE_PRICE_STARTER] = 'starter';
  if (process.env.STRIPE_PRICE_PROFESSIONAL) map[process.env.STRIPE_PRICE_PROFESSIONAL] = 'professional';
  if (process.env.STRIPE_PRICE_ORGANISATION) map[process.env.STRIPE_PRICE_ORGANISATION] = 'organisation';
  return map[priceId] || 'starter';
}

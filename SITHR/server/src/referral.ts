import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ReferralType = 'extended_trial' | 'free_months' | 'percent_off' | 'free_access';

export interface ReferralRecord {
  id: string;
  code: string;
  description: string | null;
  type: ReferralType;
  value: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  stripe_coupon_id: string | null;
  active: boolean;
}

function getAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function lookupReferral(
  code: string
): Promise<{ valid: boolean; message: string; referral?: ReferralRecord }> {
  if (!code || typeof code !== 'string') {
    return { valid: false, message: 'Code is required.' };
  }

  const supabase = getAdminClient();
  const normalised = code.toUpperCase().trim();

  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('code', normalised)
    .eq('active', true)
    .single();

  if (error || !data) {
    return { valid: false, message: 'Invalid or expired code.' };
  }

  const referral = data as ReferralRecord;
  if (referral.expires_at && new Date(referral.expires_at) < new Date()) {
    return { valid: false, message: 'This code has expired.' };
  }
  if (referral.max_uses != null && referral.current_uses >= referral.max_uses) {
    return { valid: false, message: 'This code has reached its usage limit.' };
  }
  return { valid: true, message: 'Code applied.', referral };
}

export function describeReferral(r: ReferralRecord): string {
  if (r.type === 'free_access') {
    const months = Math.round(r.value / 30);
    return months >= 1
      ? `${months} month${months > 1 ? 's' : ''} free access - no card required!`
      : `${r.value} days free access - no card required!`;
  }
  if (r.type === 'free_months') {
    return `${r.value} month${r.value > 1 ? 's' : ''} free`;
  }
  if (r.type === 'extended_trial') {
    return `${r.value} extra trial day${r.value > 1 ? 's' : ''}`;
  }
  return `${r.value}% off`;
}

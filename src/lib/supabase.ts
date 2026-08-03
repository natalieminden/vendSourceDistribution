import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client, anon key only.
 *
 * Every read this client makes is filtered by row level security, so a rep can
 * only ever see their own orders, commissions and events. The service role key
 * lives in api/_lib/clients.ts and must never appear in this bundle.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isPortalConfigured = Boolean(url && anonKey);

export const supabase = createClient(url ?? "http://localhost", anonKey ?? "public-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface Rep {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  commission_rate: number;
  status: "pending" | "active" | "suspended";
  role: "rep" | "admin";
  created_at: string;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string | null;
  line_items: { description: string | null; quantity: number | null; amount_total: number }[];
  total: number;
  discount: number;
  status: "paid" | "refunded" | "disputed";
  created_at: string;
}

export interface Commission {
  id: string;
  order_id: string;
  amount: number;
  rate: number;
  status: "pending" | "clearable" | "paid" | "reversed";
  hold_until: string;
  paid_at: string | null;
  self_referral_flag: boolean;
  created_at: string;
}

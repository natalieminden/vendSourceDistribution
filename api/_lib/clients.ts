import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// No apiVersion override: pinning to a version the installed SDK's types don't
// know about is how you get silently-wrong response shapes.
export const stripe = new Stripe(required("STRIPE_SECRET_KEY"));

/**
 * Service-role client. Bypasses RLS, so it must only ever be constructed in
 * server code — never import this from anything under src/.
 */
export const db = createClient(
  required("SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

/** Days a commission stays pending before it becomes payable. */
export const COMMISSION_HOLD_DAYS = Number(process.env.COMMISSION_HOLD_DAYS ?? 45);

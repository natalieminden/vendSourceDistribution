import { db } from "./clients";

export interface RepRecord {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  commission_rate: number;
}

export const CODE_PATTERN = /^[A-Z0-9]{3,32}$/;

export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

/**
 * Looks up the active rep owning a referral code.
 *
 * Returns null for unknown, pending or suspended reps — a suspended rep's code
 * must stop both discounting and earning immediately.
 */
export async function findRepByCode(code: string): Promise<RepRecord | null> {
  const { data, error } = await db
    .from("reps")
    .select("id, email, name, referral_code, commission_rate")
    .eq("referral_code", code)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data as RepRecord | null;
}

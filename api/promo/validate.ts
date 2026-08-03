import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findRepByCode, normalizeCode } from "../_lib/reps";

/**
 * Validates a promo/referral code and returns its discount rate.
 *
 * Deliberately vague on failure: this endpoint would otherwise let anyone
 * enumerate valid rep codes.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const code = normalizeCode(req.body?.code);
  if (!code) {
    return res.status(200).json({ valid: false, code: "", rate: 0, message: "That code isn't valid." });
  }

  try {
    const rep = await findRepByCode(code);
    if (!rep) {
      return res.status(200).json({ valid: false, code, rate: 0, message: "That code isn't valid." });
    }

    return res.status(200).json({
      valid: true,
      code,
      // The customer discount tracks the rep's commission rate.
      rate: Number(rep.commission_rate),
    });
  } catch (err) {
    console.error("promo/validate failed", err);
    return res.status(500).json({ error: "Could not validate that code." });
  }
}

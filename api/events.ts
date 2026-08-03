import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_lib/clients";
import { clientIp, sessionHash } from "./_lib/catalog";
import { findRepByCode, normalizeCode } from "./_lib/reps";

const ALLOWED_TYPES = new Set(["visit", "checkout_start"]);

/**
 * Top-of-funnel tracking for referral links. Only fires when a ref code is
 * present, so this records rep attribution rather than general site analytics.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // sendBeacon posts a Blob, which may arrive unparsed.
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;

  const code = normalizeCode(body?.refCode);
  const type = String(body?.type ?? "");
  if (!code || !ALLOWED_TYPES.has(type)) {
    // Nothing worth recording — still a success as far as the browser cares.
    return res.status(204).end();
  }

  try {
    const rep = await findRepByCode(code);
    await db.from("events").insert({
      ref_code: code,
      rep_id: rep?.id ?? null,
      type,
      path: typeof body?.path === "string" ? body.path.slice(0, 512) : null,
      session_hash: sessionHash(
        clientIp(req.headers),
        String(req.headers["user-agent"] ?? "")
      ),
    });
  } catch (err) {
    // Analytics failures must never surface to the visitor.
    console.error("event insert failed", err);
  }

  return res.status(204).end();
}

function safeParse(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

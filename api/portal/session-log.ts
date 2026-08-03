import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../_lib/clients";
import { clientIp, sessionHash } from "../_lib/catalog";

/**
 * Records a rep sign-in.
 *
 * rep_sessions has no client insert policy — otherwise a rep could forge their
 * own sign-in history — so this verifies the caller's access token and writes
 * the row with the service role.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing access token." });
  }

  try {
    // Validates the JWT against Supabase rather than trusting any claimed id.
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid access token." });
    }

    await db.from("rep_sessions").insert({
      rep_id: data.user.id,
      ip_hash: sessionHash(clientIp(req.headers), ""),
      user_agent: String(req.headers["user-agent"] ?? "").slice(0, 512),
    });

    return res.status(204).end();
  } catch (err) {
    console.error("session-log failed", err);
    // Never block a sign-in over an audit write.
    return res.status(204).end();
  }
}

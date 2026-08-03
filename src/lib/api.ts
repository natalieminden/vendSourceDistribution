/** Client for the portal API. Same origin on Vercel, so no base URL needed. */

import { getRef } from "./referral";

export interface CheckoutLine {
  productId: string;
  quantity: number;
}

export interface PromoResult {
  valid: boolean;
  code: string;
  /** Fractional discount, e.g. 0.1 for 10%. Zero when invalid. */
  rate: number;
  message?: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // A misrouted request or a platform-level failure returns an HTML error page.
  // Parsing that would surface "Unexpected token '<'" to the customer.
  const isJson = res.headers.get("content-type")?.includes("application/json");
  if (!isJson) {
    throw new Error("Checkout is temporarily unavailable. Please try again shortly.");
  }

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((payload as { error?: string })?.error || `Request failed (${res.status})`);
  }
  if (payload === null) {
    throw new Error("Checkout is temporarily unavailable. Please try again shortly.");
  }
  return payload as T;
}

/**
 * Server-side promo validation. The rate lives in the database against the rep's
 * code — never in this bundle, where anyone could read or forge it.
 */
export function validatePromo(code: string): Promise<PromoResult> {
  return postJson<PromoResult>("/api/promo/validate", { code });
}

/**
 * Creates a Stripe Checkout Session and returns its hosted URL.
 * Prices are resolved server-side from the product catalog; the client only
 * says which products and how many.
 */
export function createCheckoutSession(input: {
  lines: CheckoutLine[];
  addonIds: string[];
  promoCode?: string | null;
}): Promise<{ url: string }> {
  return postJson<{ url: string }>("/api/checkout", {
    ...input,
    refCode: getRef(),
  });
}

/** Fire-and-forget funnel event. Never blocks or surfaces errors to the user. */
export function trackEvent(type: "visit" | "checkout_start", path: string) {
  const refCode = getRef();
  if (!refCode) return;

  const payload = JSON.stringify({ type, path, refCode });
  try {
    // sendBeacon survives the navigation to Stripe; fetch may be cancelled.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
      return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never break the page.
  }
}

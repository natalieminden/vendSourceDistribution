import type { VercelRequest, VercelResponse } from "@vercel/node";
import { stripe, SITE_URL } from "./_lib/clients";
import { resolveLines } from "./_lib/catalog";
import { findRepByCode, normalizeCode } from "./_lib/reps";

/**
 * Reuses one coupon per discount rate rather than minting a fresh coupon per
 * checkout, which would fill the Stripe account with single-use objects.
 */
async function couponForRate(rate: number): Promise<string> {
  const percent = Math.round(rate * 100);
  const id = `rep-referral-${percent}`;
  try {
    await stripe.coupons.retrieve(id);
  } catch {
    await stripe.coupons.create({
      id,
      percent_off: percent,
      duration: "once",
      name: `Rep referral discount (${percent}%)`,
    });
  }
  return id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { lines, addonIds, promoCode, refCode } = req.body ?? {};
    const resolved = resolveLines(lines, addonIds ?? [], SITE_URL);

    // Attribution: an explicitly entered promo code beats a stored ?ref= visit,
    // since the customer only has the code because a rep handed it to them.
    const code = normalizeCode(promoCode) ?? normalizeCode(refCode);
    const rep = code ? await findRepByCode(code) : null;

    const discounts = rep
      ? [{ coupon: await couponForRate(Number(rep.commission_rate)) }]
      : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolved.map(line => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitAmount,
          product_data: {
            name: line.name,
            description: line.description,
            ...(line.image ? { images: [line.image] } : {}),
          },
        },
      })),
      discounts,
      // Stripe collects email, name, shipping and payment details on its hosted
      // page. None of it touches this site.
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      phone_number_collection: { enabled: true },
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop`,
      // The two attribution carriers the webhook reads back.
      client_reference_id: rep ? rep.referral_code : undefined,
      metadata: {
        ref_code: rep?.referral_code ?? "",
        rep_id: rep?.id ?? "",
        commission_rate: rep ? String(rep.commission_rate) : "",
      },
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("checkout failed", err);
    const message = err instanceof Error ? err.message : "Checkout is unavailable right now.";
    return res.status(400).json({ error: message });
  }
}

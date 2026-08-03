import type { VercelRequest, VercelResponse } from "@vercel/node";
import type Stripe from "stripe";
import { stripe, db, COMMISSION_HOLD_DAYS } from "../_lib/clients";

/**
 * Stripe webhook — the source of truth for orders and commissions.
 *
 * Nothing else in the system may write to either table. A rep never marks their
 * own sale as won, which is what makes an open affiliate model safe to run.
 */

// Signature verification needs the unparsed body.
export const config = { api: { bodyParser: false } };

async function rawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function toAmount(cents: number | null | undefined): number {
  return Math.round((cents ?? 0)) / 100;
}

function paymentIntentOf(charge: Stripe.Charge): string | null {
  if (!charge.payment_intent) return null;
  return typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id;
}

/** Same registrable domain on both sides is a self-referral signal, not proof. */
function isSelfReferral(customerEmail: string | null, repEmail: string): boolean {
  if (!customerEmail) return false;
  const customer = customerEmail.toLowerCase();
  const rep = repEmail.toLowerCase();
  if (customer === rep) return true;

  const freemail = new Set([
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com",
  ]);
  const customerDomain = customer.split("@")[1];
  const repDomain = rep.split("@")[1];
  if (!customerDomain || !repDomain) return false;
  return customerDomain === repDomain && !freemail.has(repDomain);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Ignore sessions that expired or were never paid.
  if (session.payment_status !== "paid") return;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

  const refCode = session.metadata?.ref_code || session.client_reference_id || null;
  const repId = session.metadata?.rep_id || null;

  const total = toAmount(session.amount_total);
  const subtotal = toAmount(session.amount_subtotal);
  const discount = toAmount(session.total_details?.amount_discount);

  const { data: order, error: orderError } = await db
    .from("orders")
    .upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        customer_email: session.customer_details?.email ?? "",
        customer_name: session.customer_details?.name ?? null,
        shipping_address: session.collected_information?.shipping_details ?? null,
        line_items: lineItems.data.map(item => ({
          description: item.description,
          quantity: item.quantity,
          amount_total: toAmount(item.amount_total),
        })),
        subtotal,
        discount,
        total,
        currency: session.currency ?? "usd",
        status: "paid",
        ref_code: refCode,
        rep_id: repId || null,
      },
      // Stripe retries webhooks; replaying one must not duplicate the order.
      { onConflict: "stripe_session_id" }
    )
    .select("id")
    .single();

  if (orderError) throw orderError;
  if (!repId) return;

  const { data: rep, error: repError } = await db
    .from("reps")
    .select("id, email, commission_rate")
    .eq("id", repId)
    .maybeSingle();

  if (repError) throw repError;
  if (!rep) {
    console.warn(`Order ${order.id} references unknown rep ${repId}; no commission accrued.`);
    return;
  }

  // Commission is earned on what the customer actually paid, after discount.
  const rate = Number(rep.commission_rate);
  const holdUntil = new Date(Date.now() + COMMISSION_HOLD_DAYS * 864e5).toISOString();

  const { error: commissionError } = await db.from("commissions").upsert(
    {
      order_id: order.id,
      rep_id: rep.id,
      amount: Math.round(total * rate * 100) / 100,
      rate,
      status: "pending",
      hold_until: holdUntil,
      self_referral_flag: isSelfReferral(session.customer_details?.email ?? null, rep.email),
    },
    { onConflict: "order_id" }
  );

  if (commissionError) throw commissionError;
}

/** Refunds and disputes claw back any commission that hasn't been paid out. */
async function reverseForPaymentIntent(
  paymentIntentId: string | null,
  status: "refunded" | "disputed"
) {
  if (!paymentIntentId) return;

  const { data: order, error } = await db
    .from("orders")
    .update({ status })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!order) return;

  // Already-paid commissions are left alone: the money is gone and recovering it
  // is a manual conversation, not something to silently rewrite here.
  const { error: reverseError } = await db
    .from("commissions")
    .update({ status: "reversed" })
    .eq("order_id", order.id)
    .in("status", ["pending", "clearable"]);

  if (reverseError) throw reverseError;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return res.status(400).json({ error: "Missing webhook signature." });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await rawBody(req), signature as string, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).json({ error: "Invalid signature." });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await reverseForPaymentIntent(paymentIntentOf(event.data.object as Stripe.Charge), "refunded");
        break;
      case "charge.dispute.created": {
        // A dispute carries the charge id, so resolve the charge to reach its
        // payment intent — the key orders are stored against.
        const dispute = event.data.object as Stripe.Dispute;
        const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;
        const charge = await stripe.charges.retrieve(chargeId);
        await reverseForPaymentIntent(paymentIntentOf(charge), "disputed");
        break;
      }
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    // A non-2xx tells Stripe to retry, which is what we want for a transient
    // database failure — the upserts above make replays safe.
    console.error(`Webhook handler failed for ${event.type}`, err);
    return res.status(500).json({ error: "Handler failed." });
  }
}

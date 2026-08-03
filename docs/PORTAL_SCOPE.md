# Sales Rep Portal — Scope

Status: **Phase 1 built, not yet deployed.** Last updated 2026-08-03.

Phase 1 needs a Supabase project, Stripe keys and a Vercel project before it does
anything — see "Going live" at the bottom.

## Decisions locked

| Decision | Choice |
|---|---|
| Customer accounts | **No.** Guest checkout only. See rationale below. |
| Payments | Real, Stripe Checkout (hosted redirect). Owned separately. |
| Affiliate model | Open/self-serve eventually; <10 reps near term. Build schema for open, defer the UI. |
| Payouts | Stripe Connect Express — handles W-9 collection and 1099 issuance. |
| Hosting | Move the whole site to Vercel. Portal at `/portal`. Retire the GitHub Pages workflow. |
| Backend | Supabase (Postgres + Auth + Row Level Security). |

## Why no customer accounts

Buyers purchase $3,799–$6,799 capital equipment once, maybe twice. Accounts exist to speed *repeat* purchase and store payment methods — neither applies. Stripe already holds the payment record and emails receipts.

What replaces them:
- An `orders` row keyed by email, written by the Stripe webhook.
- *(Optional, only if buyers ask)* a signed magic link for order status. One route, no auth system.

Revisit only if consumables/restocking become a subscription line.

## Architecture

```
Vercel
├── /                    marketing SPA (existing React/Vite app)
├── /portal              rep portal (new routes, same bundle)
└── /api
    ├── checkout         creates Stripe Checkout Session
    └── webhooks/stripe  source of truth for orders + commissions

Supabase — Postgres, Auth (reps only), RLS
Stripe   — Checkout, Connect Express (payouts, W-9, 1099)
```

## Attribution chain

```
vendsource.com/?ref=MARIA20
  → store ref in localStorage + first-party cookie (90-day window)
  → POST /api/checkout includes ref
  → Stripe Checkout Session carries:
        client_reference_id: <ref_code>
        metadata: { ref_code, rep_id }
  → webhook checkout.session.completed
  → write order + resolve rep_id + accrue commission (status=pending)
```

The `?ref=` code and the checkout promo code are **the same string**, resolved server-side. A rep gives a customer 10% off; the rep gets credit. One code does both jobs.

Commission is derived from Stripe events, never self-reported. There is no "mark as won" button and therefore no attribution disputes — this is what makes an open affiliate model viable.

### Reversals
- `charge.refunded` → reverse the commission row.
- `charge.dispute.created` → reverse and flag.

## The Stripe seam

Only two contract points between the payments work and the portal:

**1. Session creation** must include `client_reference_id` and `metadata.ref_code`.
**2. Webhook** must handle `checkout.session.completed`, `charge.refunded`, `charge.dispute.created`.

Everything the portal displays derives from those. Discounts must be applied server-side at session creation (`discounts`), not client-side.

## Data model

```
reps
  id, email, name, referral_code (unique), commission_rate,
  status (pending|active|suspended),
  stripe_connect_account_id, w9_received_at,
  role (rep|admin), created_at

orders
  id, stripe_session_id, stripe_payment_intent_id,
  customer_email, customer_name, shipping_address,
  line_items (jsonb), subtotal, discount, total,
  status (paid|refunded|disputed),
  rep_id (nullable), ref_code, created_at

commissions
  id, order_id, rep_id, amount, rate,
  status (pending|clearable|paid|reversed),
  hold_until, paid_at, stripe_transfer_id,
  self_referral_flag, created_at

events
  id, ref_code, type (visit|checkout_start), path,
  session_hash, created_at

rep_sessions
  id, rep_id, ip_hash, user_agent, created_at
```

RLS policy: a rep reads only rows where `rep_id = auth.uid()`. Admin role bypasses. **Enforce at the database, not in the UI** — this is the main reason for choosing Supabase.

## Affiliate safeguards (schema now, UI later)

**Clawback holds.** 10% of a $6,799 machine is $680. If it refunds after payout, that money is gone. Commissions sit `pending` until `hold_until` (30–60 days past delivery), then become `clearable`. Never pay inside the refund window.

**Tax.** A single sale clears the $600/yr 1099-NEC threshold. Stripe Connect Express collects W-9s and issues 1099s — this is the main reason to use it rather than manual ACH.

**Self-referral.** At webhook time, flag when buyer email matches the rep's email or domain. Flag for review; do not auto-block.

## Portal screens

**Rep:** dashboard (visits → checkouts → orders → commission, this month), my link + QR, order list, commission ledger with pending/cleared/paid.

**Admin:** all reps side by side, rep approval queue, payout approval, commission overrides.

## Phasing

**Phase 1 — Foundation** — built
- ~~Card number field removed.~~ Stripe Checkout is hosted; the site collects no payment data.
- ~~Promo validation moved server-side~~ to `api/promo/validate.ts`, resolved against `reps`.
- ~~Deploy migrated~~: `vercel.json` in, GitHub Pages workflow and `/vendSourceDistribution/` base path out.
- ~~Schema and RLS~~ in `supabase/migrations/0001_portal_schema.sql`.
- ~~`?ref=` capture~~ in `src/lib/referral.ts`, wired through `ReferralTracker` in `src/App.tsx`.
- ~~`/api/checkout` and `/api/webhooks/stripe`~~, plus `/api/events`.

**Phase 2 — Portal MVP** — built
- ~~Supabase Auth for reps~~ via `src/context/RepAuthContext.tsx`.
- ~~`/portal` routes~~: login, dashboard, my link, orders, commissions.
- ~~Sign-in tracking~~ via `api/portal/session-log.ts`.
- The whole portal is lazily loaded, so storefront visitors download neither
  Supabase nor the QR library.

**Phase 3 — Affiliate self-serve** *(deferred while under ~10 reps)*
- Public signup, terms acceptance, Connect Express onboarding, admin approval queue, automated payouts.

**Phase 4 — Analytics depth**
- Funnel, per-product breakdown, leaderboard.

### Next up: admin rate editor

Decided against tiered/MLM commission structures in favour of a per-rep rate set
by an admin. The schema already supports it (`reps.commission_rate`, admin-only
via RLS). What remains is the UI, whose whole job is preventing a fat-finger
100%-instead-of-10%:

- Input accepts percent (`10`), never a fraction (`0.1`) — unit confusion is the
  usual cause of this error.
- Preview the change in dollars: "at 22%, a Haha 1200 Ultra pays $1,496".
- Soft ceiling around 15% requiring typed confirmation, above the DB's hard 50%
  `check` constraint.
- An audit row per change (who, when, old → new), which doubles as undo.

Existing commissions are unaffected by any rate change, since each commission row
snapshots its own rate at write time.

## Going live (Phase 1)

1. **Supabase** — create the project, run `supabase/migrations/0001_portal_schema.sql`.
2. **Seed a rep** — create an auth user, then insert a matching `reps` row with `status = 'active'` and a `referral_code`. Nothing works without at least one.
3. **Stripe** — copy `.env.example` to `.env.local`; fill the secret key. Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. In production, register the endpoint for `checkout.session.completed`, `charge.refunded`, `charge.dispute.created`.
4. **Vercel** — import the repo, set every variable from `.env.example` (`SITE_URL` = the real origin), deploy, point the domain.
5. **Disable GitHub Pages** in repo settings so the old build stops serving.

`vite dev` serves the SPA only — `/api/*` routes need `vercel dev` to run locally.

### Verified so far
Typecheck and production build are clean. In the browser: `?ref=` persists to
localStorage and cookie, `/shop` and `/checkout/success` resolve without the old
base path, the drawer renders as a single step with no card field, a failing
`/api/checkout` surfaces a readable message rather than a parse error, the portal
guard redirects an unauthenticated `/portal/*` visit to the login page, and a
sign-in against an unreachable backend reports a readable error.

Not yet exercised — everything that needs live credentials: Stripe session
creation, the webhook, and any authenticated portal read.

## Open items

- Commission rate: flat 10% for everyone, or per-rep? Schema supports per-rep.
- Hold period length — depends on the return policy, which isn't written down yet.
- Attribution window: 90 days assumed. Last-click assumed (no multi-touch).
- Does an existing CRM need to receive leads, or is the portal the system of record?

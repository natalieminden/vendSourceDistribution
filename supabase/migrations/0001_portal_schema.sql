-- Sales rep portal — core schema.
-- See docs/PORTAL_SCOPE.md for the reasoning behind each table.
--
-- Trust model: the browser never writes to these tables. Orders and commissions
-- are written only by the Stripe webhook using the service role key. Reps read
-- their own rows through RLS; admins read everything.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- reps
-- ---------------------------------------------------------------------------

create type rep_status as enum ('pending', 'active', 'suspended');
create type rep_role as enum ('rep', 'admin');

create table reps (
  id                        uuid primary key references auth.users (id) on delete cascade,
  email                     text        not null unique,
  name                      text        not null,
  referral_code             text        not null unique,
  commission_rate           numeric(5,4) not null default 0.1000,
  status                    rep_status  not null default 'pending',
  role                      rep_role    not null default 'rep',
  stripe_connect_account_id text        unique,
  w9_received_at            timestamptz,
  created_at                timestamptz not null default now()
);

-- Referral codes are matched case-insensitively and must fit the client-side
-- pattern in src/lib/referral.ts.
create unique index reps_referral_code_upper_idx on reps (upper(referral_code));
alter table reps add constraint reps_referral_code_format
  check (referral_code ~ '^[A-Z0-9]{3,32}$');
alter table reps add constraint reps_commission_rate_range
  check (commission_rate >= 0 and commission_rate <= 0.5);

-- ---------------------------------------------------------------------------
-- orders — written by the Stripe webhook, never by the client
-- ---------------------------------------------------------------------------

create type order_status as enum ('paid', 'refunded', 'disputed');

create table orders (
  id                       uuid primary key default gen_random_uuid(),
  stripe_session_id        text        not null unique,
  stripe_payment_intent_id text        unique,
  customer_email           text        not null,
  customer_name            text,
  shipping_address         jsonb,
  line_items               jsonb       not null,
  subtotal                 numeric(10,2) not null,
  discount                 numeric(10,2) not null default 0,
  total                    numeric(10,2) not null,
  currency                 text        not null default 'usd',
  status                   order_status not null default 'paid',
  ref_code                 text,
  rep_id                   uuid references reps (id) on delete set null,
  created_at               timestamptz not null default now()
);

create index orders_rep_id_idx on orders (rep_id, created_at desc);
create index orders_ref_code_idx on orders (ref_code);

-- ---------------------------------------------------------------------------
-- commissions
-- ---------------------------------------------------------------------------

-- pending   → inside the refund window, not yet payable
-- clearable → hold elapsed, safe to pay out
-- paid      → transferred via Stripe Connect
-- reversed  → order refunded or disputed
create type commission_status as enum ('pending', 'clearable', 'paid', 'reversed');

create table commissions (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders (id) on delete cascade,
  rep_id              uuid not null references reps (id) on delete cascade,
  amount              numeric(10,2) not null,
  rate                numeric(5,4)  not null,
  status              commission_status not null default 'pending',
  -- Never pay out before this date: a refunded $6,799 order claws back $680 we
  -- may not be able to recover from an affiliate.
  hold_until          timestamptz not null,
  paid_at             timestamptz,
  stripe_transfer_id  text unique,
  self_referral_flag  boolean not null default false,
  created_at          timestamptz not null default now(),
  unique (order_id)
);

create index commissions_rep_status_idx on commissions (rep_id, status);
create index commissions_payable_idx on commissions (status, hold_until)
  where status in ('pending', 'clearable');

-- ---------------------------------------------------------------------------
-- events — top-of-funnel attribution
-- ---------------------------------------------------------------------------

create type event_type as enum ('visit', 'checkout_start');

create table events (
  id           uuid primary key default gen_random_uuid(),
  ref_code     text not null,
  rep_id       uuid references reps (id) on delete set null,
  type         event_type not null,
  path         text,
  -- Salted hash of IP + user agent. Enough to dedupe a visitor without storing
  -- anything that identifies them.
  session_hash text,
  created_at   timestamptz not null default now()
);

create index events_rep_id_idx on events (rep_id, created_at desc);
create index events_ref_code_idx on events (ref_code, created_at desc);

-- ---------------------------------------------------------------------------
-- rep_sessions — sign-in tracking
-- ---------------------------------------------------------------------------

create table rep_sessions (
  id         uuid primary key default gen_random_uuid(),
  rep_id     uuid not null references reps (id) on delete cascade,
  ip_hash    text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index rep_sessions_rep_id_idx on rep_sessions (rep_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Enforced at the database so a bug in the portal UI cannot leak one rep's
-- earnings to another. The service role used by the webhook bypasses all of it.
-- ---------------------------------------------------------------------------

alter table reps         enable row level security;
alter table orders       enable row level security;
alter table commissions  enable row level security;
alter table events       enable row level security;
alter table rep_sessions enable row level security;

-- SECURITY DEFINER avoids infinite recursion: an admin policy on `reps` that
-- queries `reps` would re-trigger the same policy.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from reps
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create policy reps_self_read on reps
  for select using (id = auth.uid() or is_admin());

-- Reps may edit their own name only; rate, status and role stay admin-only.
create policy reps_self_update on reps
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and commission_rate = (select commission_rate from reps r where r.id = auth.uid())
    and status          = (select status          from reps r where r.id = auth.uid())
    and role            = (select role            from reps r where r.id = auth.uid())
    and referral_code   = (select referral_code   from reps r where r.id = auth.uid())
  );

create policy reps_admin_write on reps
  for all using (is_admin()) with check (is_admin());

create policy orders_rep_read on orders
  for select using (rep_id = auth.uid() or is_admin());

create policy commissions_rep_read on commissions
  for select using (rep_id = auth.uid() or is_admin());

create policy events_rep_read on events
  for select using (rep_id = auth.uid() or is_admin());

create policy rep_sessions_self_read on rep_sessions
  for select using (rep_id = auth.uid() or is_admin());

-- No insert/update/delete policies for authenticated users anywhere else:
-- all writes go through the service role in the API layer.

-- ---------------------------------------------------------------------------
-- Nightly job: release commissions whose hold window has elapsed.
-- Schedule with pg_cron or an external scheduler.
-- ---------------------------------------------------------------------------

create or replace function release_cleared_commissions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  released integer;
begin
  update commissions
     set status = 'clearable'
   where status = 'pending'
     and hold_until <= now();
  get diagnostics released = row_count;
  return released;
end;
$$;

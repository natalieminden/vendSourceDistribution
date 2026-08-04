import { useEffect, useState, ComponentType } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingCart, Package, Wallet, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useRepAuth } from "../../context/RepAuthContext";
import { money, percent } from "../../lib/format";

interface Stats {
  visits: number;
  checkoutStarts: number;
  orders: number;
  revenue: number;
  pending: number;
  clearable: number;
  paid: number;
}

const EMPTY: Stats = {
  visits: 0,
  checkoutStarts: 0,
  orders: 0,
  revenue: 0,
  pending: 0,
  clearable: 0,
  paid: 0,
};

export default function PortalDashboard() {
  const { rep } = useRepAuth();
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // Every query below is scoped by RLS to the signed-in rep.
        const [visits, checkouts, orders, commissions] = await Promise.all([
          supabase.from("events").select("id", { count: "exact", head: true }).eq("type", "visit"),
          supabase.from("events").select("id", { count: "exact", head: true }).eq("type", "checkout_start"),
          supabase.from("orders").select("total, status").eq("status", "paid"),
          supabase.from("commissions").select("amount, status"),
        ]);

        if (!active) return;

        const firstError = visits.error || checkouts.error || orders.error || commissions.error;
        if (firstError) throw firstError;

        const orderRows = (orders.data ?? []) as { total: number }[];
        const commissionRows = (commissions.data ?? []) as { amount: number; status: string }[];
        const sumWhere = (status: string) =>
          commissionRows
            .filter(row => row.status === status)
            .reduce((sum, row) => sum + Number(row.amount), 0);

        setStats({
          visits: visits.count ?? 0,
          checkoutStarts: checkouts.count ?? 0,
          orders: orderRows.length,
          revenue: orderRows.reduce((sum, row) => sum + Number(row.total), 0),
          pending: sumWhere("pending"),
          clearable: sumWhere("clearable"),
          paid: sumWhere("paid"),
        });
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load your stats.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{rep?.name ? `, ${rep.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your code is <span className="font-mono font-semibold text-slate-800">{rep?.referral_code}</span>
          {" · "}earning {percent(rep?.commission_rate)} per sale
        </p>
      </div>

      {/* Funnel */}
      <section>
        <h2 className="text-xs uppercase font-semibold text-slate-400 tracking-wide mb-3">Your funnel</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={Eye} label="Link visits" value={String(stats.visits)} />
          <Stat icon={ShoppingCart} label="Checkouts started" value={String(stats.checkoutStarts)} />
          <Stat icon={Package} label="Orders" value={String(stats.orders)} />
          <Stat icon={Wallet} label="Revenue driven" value={money(stats.revenue)} />
        </div>
      </section>

      {/* Earnings */}
      <section>
        <h2 className="text-xs uppercase font-semibold text-slate-400 tracking-wide mb-3">Earnings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Pending" value={money(stats.pending)} hint="Held until the refund window closes" />
          <Stat label="Ready to pay" value={money(stats.clearable)} hint="Cleared and awaiting payout" />
          <Stat label="Paid out" value={money(stats.paid)} hint="Transferred to you" />
        </div>
        <Link
          to="/portal/commissions"
          className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4"
        >
          View full ledger →
        </Link>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-2xl font-bold text-slate-900 mt-2 block">{value}</span>
      {hint && <span className="text-[11px] text-slate-400 mt-1 block">{hint}</span>}
    </div>
  );
}

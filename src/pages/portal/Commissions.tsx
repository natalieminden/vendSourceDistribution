import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Wallet, Flag } from "lucide-react";
import { supabase, Commission } from "../../lib/supabase";
import { money, shortDate, percent } from "../../lib/format";

const STATUS_LABELS: Record<Commission["status"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  clearable: { label: "Ready", className: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reversed: { label: "Reversed", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function PortalCommissions() {
  const [rows, setRows] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase
      .from("commissions")
      .select("id, order_id, amount, rate, status, hold_until, paid_at, self_referral_flag, created_at")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        else setRows((data ?? []) as Commission[]);
        setLoading(false);
      });

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

  const total = (status: Commission["status"]) =>
    rows.filter(r => r.status === status).reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Commissions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Commission is held until the refund window closes, then becomes payable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Summary label="Pending" value={money(total("pending"))} />
        <Summary label="Ready to pay" value={money(total("clearable"))} />
        <Summary label="Paid out" value={money(total("paid"))} />
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Wallet className="w-12 h-12 text-slate-300 mx-auto stroke-[1.25]" />
          <span className="font-semibold text-slate-800 block mt-4">Nothing here yet</span>
          <p className="text-sm text-slate-500 mt-1">
            Commission appears as soon as a referred order is paid.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Earned</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Rate</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400 text-right">
                  Amount
                </th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Available</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const status = STATUS_LABELS[row.status];
                return (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {shortDate(row.created_at)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{percent(row.rate)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {money(row.amount)}
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {row.status === "paid"
                        ? shortDate(row.paid_at)
                        : row.status === "reversed"
                          ? "—"
                          : shortDate(row.hold_until)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${status.className}`}
                        >
                          {status.label}
                        </span>
                        {row.self_referral_flag && (
                          <span
                            title="Flagged for review: customer details resemble your own"
                            className="text-amber-500"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-2xl font-bold text-slate-900 mt-2 block">{value}</span>
    </div>
  );
}

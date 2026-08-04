import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Package } from "lucide-react";
import { supabase, Order } from "../../lib/supabase";
import { money, shortDate } from "../../lib/format";

const STATUS_STYLES: Record<Order["status"], string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  refunded: "bg-slate-100 text-slate-600 border-slate-200",
  disputed: "bg-amber-50 text-amber-700 border-amber-200",
};

/** Customer emails are masked: a rep needs to recognise their deal, not harvest a list. */
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

export default function PortalOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase
      .from("orders")
      .select("id, customer_email, customer_name, line_items, total, discount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        else setOrders((data ?? []) as Order[]);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Every purchase attributed to your code.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto stroke-[1.25]" />
          <span className="font-semibold text-slate-800 block mt-4">No orders yet</span>
          <p className="text-sm text-slate-500 mt-1">Share your referral link to start earning.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Date</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Customer</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Items</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400 text-right">Total</th>
                <th className="px-5 py-3 text-xs uppercase font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                    {shortDate(order.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-900 font-medium block">{order.customer_name ?? "—"}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {maskEmail(order.customer_email)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {(order.line_items ?? []).map((item, i) => (
                      <span key={i} className="block text-xs">
                        {item.quantity ?? 1} × {item.description ?? "Item"}
                      </span>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                    {money(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

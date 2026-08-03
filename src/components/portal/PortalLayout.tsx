import { ReactNode } from "react";
import { NavLink, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Link2, Receipt, Wallet, LogOut, Loader2 } from "lucide-react";
import { useRepAuth } from "../../context/RepAuthContext";
import { isPortalConfigured } from "../../lib/supabase";

const NAV = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/link", label: "My link", icon: Link2, end: false },
  { to: "/portal/orders", label: "Orders", icon: Receipt, end: false },
  { to: "/portal/commissions", label: "Commissions", icon: Wallet, end: false },
];

/**
 * Portal chrome and route guard.
 *
 * The guard is convenience only — the real boundary is row level security in
 * Postgres, so a rep who bypasses this UI still cannot read anyone else's data.
 */
export default function PortalLayout({ children }: { children: ReactNode }) {
  const { rep, session, loading, signOut } = useRepAuth();
  const location = useLocation();

  if (!isPortalConfigured) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-slate-900">Portal not configured</h1>
          <p className="text-sm text-slate-600 mt-2">
            Set <code className="font-mono text-xs">VITE_SUPABASE_URL</code> and{" "}
            <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/portal/login" state={{ from: location.pathname }} replace />;
  }

  // Signed in but not yet approved, or switched off.
  if (rep && rep.status !== "active") {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-xl font-bold text-slate-900">
            {rep.status === "pending" ? "Account awaiting approval" : "Account suspended"}
          </h1>
          <p className="text-sm text-slate-600">
            {rep.status === "pending"
              ? "An admin needs to activate your account before you can start earning."
              : "Your account has been suspended. Please contact your administrator."}
          </p>
          <button
            onClick={() => void signOut()}
            className="text-sm font-semibold text-slate-700 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white grid place-items-center font-bold text-sm shrink-0">
              V
            </span>
            <span className="font-semibold text-slate-900 truncate">Rep Portal</span>
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <span className="text-sm text-slate-500 truncate hidden sm:block">{rep?.name}</span>
            <button
              onClick={() => void signOut()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-600 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

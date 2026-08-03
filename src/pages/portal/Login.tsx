import { useState, FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useRepAuth } from "../../context/RepAuthContext";

export default function PortalLogin() {
  const { session, loading, signIn } = useRepAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/portal";

  if (!loading && session) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signIn(email, password);
      // The auth listener flips session state, which redirects above.
    } catch (err) {
      // Supabase returns the same message for unknown email and wrong password,
      // which is what we want — no account enumeration.
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-9 h-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">
            V
          </span>
          <span className="font-semibold text-slate-900 text-lg">Rep Portal</span>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Sign in</h1>
            <p className="text-xs text-slate-500 mt-1">Track your referrals and commissions.</p>
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-semibold text-slate-600 block mb-1 uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-semibold text-slate-600 block mb-1 uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? "Signing in…" : "Sign in"}</span>
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Need an account? Ask your VendSource administrator.
        </p>
      </div>
    </div>
  );
}

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isPortalConfigured, Rep } from "../lib/supabase";

interface RepAuthValue {
  session: Session | null;
  rep: Rep | null;
  /** True until the initial session lookup settles — guards against a login flash. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const RepAuthContext = createContext<RepAuthValue | null>(null);

/** Records the sign-in server-side; rep_sessions has no client insert policy. */
async function logSignIn(accessToken: string) {
  try {
    await fetch("/api/portal/session-log", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // Sign-in tracking is best-effort and must never block a rep getting in.
  }
}

export function RepAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [rep, setRep] = useState<Rep | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRep = useCallback(async (userId: string) => {
    // RLS restricts this to the caller's own row.
    const { data, error } = await supabase
      .from("reps")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load rep profile", error);
      setRep(null);
      return;
    }
    setRep(data as Rep | null);
  }, []);

  useEffect(() => {
    if (!isPortalConfigured) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadRep(data.session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (next?.user) {
        void loadRep(next.user.id);
        // Only a fresh sign-in is worth recording; token refreshes fire this too.
        if (event === "SIGNED_IN" && next.access_token) void logSignIn(next.access_token);
      } else {
        setRep(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadRep]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (!error) return;

    // Supabase surfaces transport failures as the browser's raw "Failed to
    // fetch", which tells a rep nothing about what to do next.
    const isNetworkError =
      error.name === "AuthRetryableFetchError" || /failed to fetch|network/i.test(error.message);

    throw new Error(
      isNetworkError
        ? "Can't reach the server. Check your connection and try again."
        : error.message
    );
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRep(null);
    setSession(null);
  };

  return (
    <RepAuthContext.Provider value={{ session, rep, loading, signIn, signOut }}>
      {children}
    </RepAuthContext.Provider>
  );
}

export function useRepAuth() {
  const ctx = useContext(RepAuthContext);
  if (!ctx) throw new Error("useRepAuth must be used within a RepAuthProvider");
  return ctx;
}

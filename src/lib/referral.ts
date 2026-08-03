/**
 * Referral attribution.
 *
 * A rep's code arrives as `?ref=CODE`. We persist it for REF_WINDOW_DAYS in both
 * localStorage and a first-party cookie (belt and braces — localStorage survives
 * cookie-clearing extensions, the cookie survives storage-partitioned contexts),
 * then hand it to /api/checkout so it can ride into the Stripe session.
 *
 * Last click wins: a newer code overwrites an older one.
 */

export const REF_KEY = "vsd_ref";
export const REF_WINDOW_DAYS = 90;

/** Codes are uppercase alphanumeric; anything else is treated as absent. */
const CODE_PATTERN = /^[A-Z0-9]{3,32}$/;

interface StoredRef {
  code: string;
  capturedAt: string;
}

function normalize(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function isExpired(capturedAt: string): boolean {
  const age = Date.now() - new Date(capturedAt).getTime();
  return !Number.isFinite(age) || age > REF_WINDOW_DAYS * 864e5;
}

/**
 * Persist a `?ref=` code if one is present in the given query string.
 * Returns the code that is now active, whether newly captured or pre-existing.
 */
export function captureRef(search: string): string | null {
  const incoming = normalize(new URLSearchParams(search).get("ref"));
  if (!incoming) return getRef();

  const record: StoredRef = { code: incoming, capturedAt: new Date().toISOString() };
  try {
    localStorage.setItem(REF_KEY, JSON.stringify(record));
  } catch {
    // Private browsing or storage full — the cookie still carries attribution.
  }
  writeCookie(REF_KEY, incoming, REF_WINDOW_DAYS);
  return incoming;
}

/** The active referral code, or null if none is stored or the window has lapsed. */
export function getRef(): string | null {
  try {
    const raw = localStorage.getItem(REF_KEY);
    if (raw) {
      const record = JSON.parse(raw) as StoredRef;
      if (record?.code && !isExpired(record.capturedAt)) {
        return normalize(record.code);
      }
      // Lapsed or malformed — drop it so we stop sending a stale code.
      localStorage.removeItem(REF_KEY);
    }
  } catch {
    // Fall through to the cookie.
  }
  return normalize(readCookie(REF_KEY));
}

export function clearRef() {
  try {
    localStorage.removeItem(REF_KEY);
  } catch {
    // Nothing to do — clearing the cookie below is enough.
  }
  writeCookie(REF_KEY, "", -1);
}

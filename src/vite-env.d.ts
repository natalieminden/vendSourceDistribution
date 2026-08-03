/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Public by design — reads are gated by row level security. */
  readonly VITE_SUPABASE_URL?: string;
  /** Anon key. Public by design; never the service role key. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

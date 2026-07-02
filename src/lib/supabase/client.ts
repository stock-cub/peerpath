// Supabase client for use in the browser (Client Components).
// Each call returns a fresh client backed by browser cookies, so the user's
// session stays in sync across tabs.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

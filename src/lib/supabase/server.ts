// Supabase client for use on the server (Server Components, Route Handlers,
// Server Actions). Reads and writes the session via Next.js cookies, which
// is how Supabase keeps the user logged in between requests.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component sometimes, where
            // cookies can't be written. That's fine as long as the proxy
            // (middleware) is also refreshing the session.
          }
        },
      },
    }
  );
}

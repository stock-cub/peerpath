// Both the (app) layout and every page under it need to know who's signed
// in. Without caching, that's 2+ separate network round-trips to Supabase's
// auth server per request. React's cache() dedupes calls within a single
// request, so this only ever fires once no matter how many components ask.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Asks the database whether the signed-in user is an admin (via the
// is_admin() SQL function), rather than trusting anything from the client.
// Cached per-request since both the layout and admin page call this.
export const checkIsAdmin = cache(async (): Promise<boolean> => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
});

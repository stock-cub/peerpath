import { createClient } from "@/lib/supabase/server";

// Asks the database whether the signed-in user is an admin (via the
// is_admin() SQL function), rather than trusting anything from the client.
export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
}

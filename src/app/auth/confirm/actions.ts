"use server";

// Only runs when the user actually clicks the "Confirm sign-in" button on
// the confirm page — not when the link is merely loaded. This is what
// defeats email security scanners (like Microsoft 365 Safe Links) that
// "pre-click" every link in an email to scan it, which would otherwise
// burn the one-time code before the real person clicks it.

import { redirect } from "next/navigation";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function confirmSignIn(params: {
  code: string | null;
  token_hash: string | null;
  type: EmailOtpType | null;
}) {
  const supabase = await createClient();

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (!error) {
      redirect("/welcome");
    }
  } else if (params.token_hash && params.type) {
    const { error } = await supabase.auth.verifyOtp({
      type: params.type,
      token_hash: params.token_hash,
    });
    if (!error) {
      redirect("/welcome");
    }
  }

  redirect("/auth/auth-code-error");
}

"use server";

// Sends a magic-link sign-in email via Supabase. The same flow is used for
// both "sign up" and "log in" — Supabase creates the account automatically
// the first time someone confirms a link for a new email address.

import { createClient } from "@/lib/supabase/server";
import { isUofTEmail } from "@/lib/uoft-email";

export type SendMagicLinkResult = { error: string } | { success: true };

export async function sendMagicLink(
  email: string,
  origin: string
): Promise<SendMagicLinkResult> {
  if (!isUofTEmail(email)) {
    return { error: "Please use your @mail.utoronto.ca email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    console.error("sendMagicLink error:", {
      code: error.code,
      message: error.message,
      status: error.status,
      name: error.name,
    });

    if (error.code === "over_email_send_rate_limit") {
      return {
        error:
          "Too many login attempts right now. Please wait a minute and try again.",
      };
    }

    return { error: "Something went wrong sending your link. Please try again." };
  }

  return { success: true };
}

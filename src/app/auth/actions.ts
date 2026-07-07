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

export type VerifyCodeResult = { error: string } | { success: true };

// Verifies the 6-digit code from the email directly — no link to click,
// so there's nothing for email security scanners (like Microsoft 365 Safe
// Links) to prematurely consume, and no dependency on using the same
// browser that requested the code.
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<VerifyCodeResult> {
  if (!code.trim()) {
    return { error: "Enter the code from your email." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code.trim(),
    type: "email",
  });

  if (error) {
    return { error: "That code didn't work. Check it and try again, or request a new one." };
  }

  return { success: true };
}

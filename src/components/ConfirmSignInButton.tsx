"use client";

// A real button the user must click. Email security scanners that
// "pre-click" links only ever issue a GET for the page — they don't run
// JavaScript or click buttons — so this keeps the one-time code alive
// until an actual person confirms.

import { useState } from "react";
import { type EmailOtpType } from "@supabase/supabase-js";
import { confirmSignIn } from "@/app/auth/confirm/actions";

export default function ConfirmSignInButton({
  code,
  tokenHash,
  type,
}: {
  code: string | null;
  tokenHash: string | null;
  type: EmailOtpType | null;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await confirmSignIn({ code, token_hash: tokenHash, type });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
    >
      {pending ? "Confirming..." : "Confirm sign-in"}
    </button>
  );
}

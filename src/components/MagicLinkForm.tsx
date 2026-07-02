"use client";

// A small form that takes a UofT email and asks Supabase to send a magic
// (confirmation) link. Used on both the sign-up and login pages, since the
// underlying flow is identical.

import { useState, type FormEvent } from "react";
import { sendMagicLink } from "@/app/auth/actions";

export default function MagicLinkForm({ ctaLabel }: { ctaLabel: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await sendMagicLink(email, window.location.origin);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-blue-950/50 border border-blue-800 p-6 text-center">
        <p className="text-lg font-medium text-blue-200">Check your inbox 📬</p>
        <p className="mt-2 text-sm text-blue-300">
          We sent a confirmation link to <span className="font-medium">{email}</span>.
          Click it to finish signing in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="email" className="text-sm font-medium text-slate-300">
        UofT email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@mail.utoronto.ca"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : ctaLabel}
      </button>
    </form>
  );
}

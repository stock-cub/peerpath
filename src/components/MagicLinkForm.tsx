"use client";

// A two-step form: enter your UofT email, then enter the 8-digit code from
// that email. No link to click — sidesteps every issue that comes with
// clickable links (Microsoft Safe Links prefetching, cross-device/browser
// mismatches, etc).

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendMagicLink, verifyEmailCode } from "@/app/auth/actions";

export default function MagicLinkForm({ ctaLabel }: { ctaLabel: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await sendMagicLink(email, window.location.origin);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    setStatus("idle");
    setStep("code");
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await verifyEmailCode(email, code);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    router.push("/welcome");
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
        <div className="rounded-2xl bg-blue-950/50 border border-blue-800 p-4">
          <p className="text-sm text-blue-200">
            We sent a 8-digit code to <span className="font-medium">{email}</span>.
            Enter it below.
          </p>
        </div>
        <label htmlFor="code" className="text-sm font-medium text-slate-300">
          8-digit code
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoFocus
          required
          placeholder="12345678"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-center text-lg tracking-widest text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
        >
          {status === "sending" ? "Verifying..." : "Verify and sign in"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setCode("");
            setStatus("idle");
          }}
          className="text-sm text-slate-400 hover:text-slate-300"
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-3">
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

"use client";

// A small "Request this mentor" widget on each mentor card. Expands to a
// short optional message, then submits a match request via server action.

import { useState, type FormEvent } from "react";
import { requestMentor } from "@/app/(app)/requests/actions";

export default function RequestMentorButton({ mentorId }: { mentorId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await requestMentor(mentorId, message);

    setStatus("error" in result ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <p className="mt-2 text-sm text-emerald-400">
        Request sent! You&apos;ll see it on your dashboard.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Request this mentor
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Optional: say a little about what you're looking for"
        className="rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {status === "error" && (
        <p className="text-sm text-red-400">Couldn&apos;t send your request. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}

"use client";

// Small "Report" / "Block" controls attached to any profile a user can see
// (mentor cards today; can be reused wherever another user's profile shows).

import { useState, type FormEvent } from "react";
import { reportUser, blockUser } from "@/app/(app)/safety/actions";

export default function ReportBlockControls({ targetId }: { targetId: string }) {
  const [mode, setMode] = useState<"idle" | "reporting">("idle");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const result = await reportUser(targetId, reason);
    setStatus("error" in result ? "error" : "done");
  }

  async function handleBlock() {
    setStatus("sending");
    const result = await blockUser(targetId);
    setStatus("error" in result ? "error" : "done");
  }

  if (status === "done") {
    return <p className="mt-2 text-xs text-slate-500">Thanks — we&apos;ll take it from here.</p>;
  }

  return (
    <div className="mt-2">
      {mode === "idle" ? (
        <div className="flex gap-3 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setMode("reporting")}
            className="hover:text-slate-300 hover:underline"
          >
            Report
          </button>
          <button
            type="button"
            onClick={handleBlock}
            disabled={status === "sending"}
            className="hover:text-slate-300 hover:underline"
          >
            Block
          </button>
        </div>
      ) : (
        <form onSubmit={handleReport} className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            required
            placeholder="What happened?"
            className="rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {status === "error" && (
            <p className="text-xs text-red-400">Couldn&apos;t send. Try again.</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-60"
            >
              Submit report
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

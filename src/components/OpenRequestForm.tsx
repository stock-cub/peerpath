"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { requestOpenMatch } from "@/app/(app)/requests/actions";

export default function OpenRequestForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await requestOpenMatch(message);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    router.push("/requests");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        maxLength={500}
        required
        placeholder="e.g. I'm struggling to pick courses for next semester and could use guidance from someone who's done it."
        className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send my request"}
      </button>
    </form>
  );
}

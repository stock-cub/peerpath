"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { joinPrivateStudyGroup } from "@/app/(app)/study-groups/actions";

export default function JoinPrivateGroupForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const result = await joinPrivateStudyGroup(code);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    router.push(result.groupId ? `/study-groups/${result.groupId}` : "/study-groups");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Have an invite code?"
        className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
      >
        Join private group
      </button>
      {status === "error" && <p className="self-center text-sm text-red-400">{errorMessage}</p>}
    </form>
  );
}

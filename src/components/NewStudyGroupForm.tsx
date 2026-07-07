"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createStudyGroup } from "@/app/(app)/study-groups/actions";

const inputClasses =
  "rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

export default function NewStudyGroupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const formData = new FormData(event.currentTarget);
    const result = await createStudyGroup(formData);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }

    router.push(result.groupId ? `/study-groups/${result.groupId}` : "/study-groups");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-300">
          Group name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. RSM100 study crew"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="topic" className="text-sm font-medium text-slate-300">
          Course code
        </label>
        <input
          id="topic"
          name="topic"
          required
          placeholder="e.g. RSM100"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={300}
          placeholder="What's this group for?"
          className={inputClasses}
        />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-800/40 px-4 py-3">
        <input
          type="checkbox"
          name="is_private"
          className="h-5 w-5 rounded border-slate-500 text-blue-500 focus:ring-blue-400"
        />
        <span className="text-sm font-medium text-slate-100">
          Make this a private group (invite code required to join)
        </span>
      </label>

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {status === "saving" ? "Creating..." : "Create group"}
      </button>
    </form>
  );
}

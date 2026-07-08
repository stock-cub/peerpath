"use client";

import { useState } from "react";
import { approveMentor, rejectMentor } from "@/app/(app)/admin/actions";
import type { Profile } from "@/lib/profile";

export default function MentorApprovalRow({ mentor }: { mentor: Profile }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handle(action: (id: string) => Promise<void>) {
    setPending(true);
    await action(mentor.id);
    setDone(true);
  }

  if (done) return null;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-white">{mentor.full_name || "(no name yet)"}</p>
          <p className="text-sm text-slate-400">
            {mentor.year_of_study} · {mentor.program}
          </p>
          {mentor.bio && <p className="mt-2 text-sm text-slate-300">{mentor.bio}</p>}
          {mentor.can_help_with.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {mentor.can_help_with.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => handle(approveMentor)}
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => handle(rejectMentor)}
            className="rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

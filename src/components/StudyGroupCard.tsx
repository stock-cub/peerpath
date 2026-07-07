"use client";

import Link from "next/link";
import { useState } from "react";
import { joinStudyGroup, leaveStudyGroup } from "@/app/(app)/study-groups/actions";
import type { StudyGroup } from "@/lib/study-group";

export default function StudyGroupCard({
  group,
  isMember,
}: {
  group: StudyGroup;
  isMember: boolean;
}) {
  const [joined, setJoined] = useState(isMember);
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    if (joined) {
      await leaveStudyGroup(group.id);
    } else {
      await joinStudyGroup(group.id);
    }
    setJoined(!joined);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/70 border border-slate-700 p-5 shadow-lg">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{group.name}</h3>
          {group.is_private && (
            <span className="rounded-full bg-slate-800 border border-slate-600 px-2 py-0.5 text-xs text-slate-300">
              Private
            </span>
          )}
        </div>
        {group.topic && <p className="text-sm text-slate-400">{group.topic}</p>}
      </div>

      {group.description && (
        <p className="text-sm text-slate-300">{group.description}</p>
      )}

      <div className="mt-1 flex gap-2">
        {joined && (
          <Link
            href={`/study-groups/${group.id}`}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Open chat
          </Link>
        )}
        {(joined || !group.is_private) && (
          <button
            type="button"
            disabled={busy}
            onClick={handleToggle}
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
          >
            {joined ? "Leave" : "Join"}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { assignMentorToRequest, updateRequestStatus } from "@/app/(app)/admin/actions";
import { STATUS_LABELS, STATUS_COLORS, type MatchRequest, type MatchRequestStatus } from "@/lib/match-request";
import type { Profile } from "@/lib/profile";

const NEXT_STATUSES: MatchRequestStatus[] = ["new", "matched", "connected", "closed"];

export default function MatchRequestRow({
  request,
  menteeName,
  mentorName,
  approvedMentors,
}: {
  request: MatchRequest;
  menteeName: string;
  mentorName: string | null;
  approvedMentors: Profile[];
}) {
  const [selectedMentor, setSelectedMentor] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleAssign() {
    if (!selectedMentor) return;
    setBusy(true);
    await assignMentorToRequest(request.id, selectedMentor);
    setBusy(false);
  }

  async function handleStatusChange(status: MatchRequestStatus) {
    setBusy(true);
    await updateRequestStatus(request.id, status);
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">
          {menteeName} {mentorName ? `→ ${mentorName}` : "(open request)"}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[request.status]}`}
        >
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      {request.message && (
        <p className="mt-2 text-sm text-slate-300">{request.message}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!request.mentor_id && (
          <>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-white"
            >
              <option value="">Assign a mentor...</option>
              {approvedMentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.full_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy || !selectedMentor}
              onClick={handleAssign}
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
            >
              Assign
            </button>
          </>
        )}

        <select
          value={request.status}
          disabled={busy}
          onChange={(e) => handleStatusChange(e.target.value as MatchRequestStatus)}
          className="rounded-xl border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-white"
        >
          {NEXT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

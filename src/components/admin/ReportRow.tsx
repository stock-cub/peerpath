"use client";

import { useState } from "react";
import { suspendUser, unsuspendUser } from "@/app/(app)/safety/actions";
import type { Report } from "@/lib/report";

export default function ReportRow({
  report,
  reporterName,
  reportedName,
  reportedIsSuspended,
}: {
  report: Report;
  reporterName: string;
  reportedName: string;
  reportedIsSuspended: boolean;
}) {
  const [suspended, setSuspended] = useState(reportedIsSuspended);
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    if (suspended) {
      await unsuspendUser(report.reported_id);
    } else {
      await suspendUser(report.reported_id);
    }
    setSuspended(!suspended);
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">
          {reporterName} reported {reportedName}
        </p>
        {suspended && (
          <span className="rounded-full bg-red-900/60 border border-red-700 px-3 py-1 text-xs text-red-200">
            Suspended
          </span>
        )}
      </div>
      {report.reason && <p className="mt-2 text-sm text-slate-300">{report.reason}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={handleToggle}
        className="mt-3 rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
      >
        {suspended ? "Unsuspend account" : "Suspend account"}
      </button>
    </div>
  );
}

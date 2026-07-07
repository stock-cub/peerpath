"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToRequest } from "@/app/(app)/requests/actions";

export default function RequestAcceptControls({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle(accept: boolean) {
    setBusy(true);
    await respondToRequest(requestId, accept);
    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => handle(true)}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        Accept
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => handle(false)}
        className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
      >
        Decline
      </button>
    </div>
  );
}

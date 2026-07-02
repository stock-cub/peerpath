import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS, type MatchRequest } from "@/lib/match-request";

export default function RequestCard({
  request,
  title,
}: {
  request: MatchRequest;
  title: string;
}) {
  const isMatched = request.status === "matched" || request.status === "connected";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">{title}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[request.status]}`}
        >
          {STATUS_LABELS[request.status]}
        </span>
      </div>
      {request.message && (
        <p className="mt-2 text-sm text-slate-300">{request.message}</p>
      )}
      {isMatched && (
        <>
          <p className="mt-3 text-sm text-blue-300">
            🎉 You&apos;re matched! Say hello below.
          </p>
          <Link
            href={`/requests/${request.id}/messages`}
            className="mt-2 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Message
          </Link>
        </>
      )}
    </div>
  );
}

export type MatchRequestStatus = "new" | "matched" | "connected" | "closed";

export type MatchRequest = {
  id: string;
  mentee_id: string;
  mentor_id: string | null;
  message: string;
  status: MatchRequestStatus;
  created_at: string;
};

export const STATUS_LABELS: Record<MatchRequestStatus, string> = {
  new: "Waiting for a match",
  matched: "Matched!",
  connected: "Connected",
  closed: "Closed",
};

export const STATUS_COLORS: Record<MatchRequestStatus, string> = {
  new: "bg-slate-700 text-slate-200",
  matched: "bg-blue-600 text-white",
  connected: "bg-emerald-600 text-white",
  closed: "bg-slate-800 text-slate-400",
};

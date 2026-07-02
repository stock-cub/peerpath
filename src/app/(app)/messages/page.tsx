import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { MatchRequest } from "@/lib/match-request";
import type { Profile } from "@/lib/profile";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: requests } = await supabase
    .from("match_requests")
    .select("*")
    .or(`mentee_id.eq.${user?.id ?? ""},mentor_id.eq.${user?.id ?? ""}`)
    .in("status", ["matched", "connected"])
    .order("updated_at", { ascending: false });

  const list = (requests ?? []) as MatchRequest[];

  const otherIds = list
    .map((r) => (r.mentee_id === user?.id ? r.mentor_id : r.mentee_id))
    .filter((id): id is string => !!id);

  let names: Record<string, string> = {};
  if (otherIds.length > 0) {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", otherIds);
    names = Object.fromEntries(
      ((people ?? []) as Pick<Profile, "id" | "full_name">[]).map((p) => [p.id, p.full_name])
    );
  }

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-white">Messages</h1>
        <p className="mt-1 text-slate-300">
          Conversations with your matched mentors and mentees.
        </p>

        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-300">
              No conversations yet — once you&apos;re matched, you can chat
              here.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {list.map((request) => {
              const otherId = request.mentee_id === user?.id ? request.mentor_id : request.mentee_id;
              const otherName = otherId ? names[otherId] ?? "Someone" : "Someone";
              return (
                <Link
                  key={request.id}
                  href={`/requests/${request.id}/messages`}
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 hover:bg-slate-800/70"
                >
                  <p className="font-medium text-white">{otherName}</p>
                  <p className="mt-1 text-sm text-slate-400">Tap to open the chat</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

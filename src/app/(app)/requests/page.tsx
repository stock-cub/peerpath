import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RequestCard from "@/components/RequestCard";
import type { MatchRequest } from "@/lib/match-request";
import type { Profile } from "@/lib/profile";

export default async function RequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_mentor")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const isMentor = (myProfile as Pick<Profile, "is_mentor"> | null)?.is_mentor ?? false;

  const { data: sent } = await supabase
    .from("match_requests")
    .select("*")
    .eq("mentee_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const sentList = (sent ?? []) as MatchRequest[];

  let receivedList: MatchRequest[] = [];
  if (isMentor) {
    const { data: received } = await supabase
      .from("match_requests")
      .select("*")
      .eq("mentor_id", user?.id ?? "")
      .order("created_at", { ascending: false });
    receivedList = (received ?? []) as MatchRequest[];
  }

  // Look up display names: mentors for the "sent" list, mentees for "received".
  const idsToLookUp = [
    ...sentList.map((r) => r.mentor_id),
    ...receivedList.map((r) => r.mentee_id),
  ].filter((id): id is string => !!id);

  let names: Record<string, string> = {};
  if (idsToLookUp.length > 0) {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", idsToLookUp);
    names = Object.fromEntries(
      ((people ?? []) as Pick<Profile, "id" | "full_name">[]).map((p) => [p.id, p.full_name])
    );
  }

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Your requests</h1>
          <Link
            href="/requests/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            New request
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Requests you&apos;ve sent
          </h2>

          {sentList.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
              <p className="text-slate-300">
                You haven&apos;t sent any requests yet.{" "}
                <Link href="/mentors" className="font-medium text-blue-400">
                  Browse mentors
                </Link>{" "}
                or{" "}
                <Link href="/requests/new" className="font-medium text-blue-400">
                  ask to be matched
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {sentList.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  title={
                    request.mentor_id
                      ? `To ${names[request.mentor_id] ?? "a mentor"}`
                      : "Open request — help me get matched"
                  }
                />
              ))}
            </div>
          )}
        </section>

        {isMentor && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Requests you&apos;ve received
            </h2>

            {receivedList.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
                <p className="text-slate-300">
                  No one has requested you yet — that&apos;s okay, keep your
                  profile up to date.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-4">
                {receivedList.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    title={`From ${names[request.mentee_id] ?? "a mentee"}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/admin";
import MentorApprovalRow from "@/components/admin/MentorApprovalRow";
import MatchRequestRow from "@/components/admin/MatchRequestRow";
import ReportRow from "@/components/admin/ReportRow";
import type { Profile } from "@/lib/profile";
import type { MatchRequest } from "@/lib/match-request";
import type { Report } from "@/lib/report";

export default async function AdminPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect("/welcome");
  }

  const supabase = await createClient();

  const { data: pendingMentors } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_mentor", true)
    .eq("is_mentor_approved", false)
    .order("created_at", { ascending: true });

  const { data: approvedMentors } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_mentor", true)
    .eq("is_mentor_approved", true)
    .order("full_name");

  const { data: allRequests } = await supabase
    .from("match_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requestList = (allRequests ?? []) as MatchRequest[];

  const { data: allReports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  const reportList = (allReports ?? []) as Report[];

  const peopleIds = [
    ...requestList.map((r) => r.mentee_id),
    ...requestList.map((r) => r.mentor_id),
    ...reportList.map((r) => r.reporter_id),
    ...reportList.map((r) => r.reported_id),
  ].filter((id): id is string => !!id);

  let names: Record<string, string> = {};
  let suspensionById: Record<string, boolean> = {};
  if (peopleIds.length > 0) {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name, is_suspended")
      .in("id", peopleIds);
    names = Object.fromEntries(
      ((people ?? []) as Pick<Profile, "id" | "full_name">[]).map((p) => [p.id, p.full_name])
    );
    suspensionById = Object.fromEntries(
      ((people ?? []) as Pick<Profile, "id" | "is_suspended">[]).map((p) => [p.id, p.is_suspended])
    );
  }

  const pending = (pendingMentors ?? []) as Profile[];
  const approved = (approvedMentors ?? []) as Profile[];

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="mt-1 text-slate-300">
          Approve mentors and hand-match requests.
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Pending mentor sign-ups
          </h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-slate-400">No pending mentors right now.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {pending.map((mentor) => (
                <MentorApprovalRow key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            All match requests
          </h2>
          {requestList.length === 0 ? (
            <p className="mt-3 text-slate-400">No requests yet.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {requestList.map((request) => (
                <MatchRequestRow
                  key={request.id}
                  request={request}
                  menteeName={names[request.mentee_id] ?? "Unknown"}
                  mentorName={request.mentor_id ? names[request.mentor_id] ?? "Unknown" : null}
                  approvedMentors={approved}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Reports
          </h2>
          {reportList.length === 0 ? (
            <p className="mt-3 text-slate-400">No reports right now.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-4">
              {reportList.map((report) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  reporterName={names[report.reporter_id] ?? "Unknown"}
                  reportedName={names[report.reported_id] ?? "Unknown"}
                  reportedIsSuspended={suspensionById[report.reported_id] ?? false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

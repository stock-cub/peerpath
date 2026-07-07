import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import StudyGroupCard from "@/components/StudyGroupCard";
import JoinPrivateGroupForm from "@/components/JoinPrivateGroupForm";
import type { StudyGroup } from "@/lib/study-group";

export default async function StudyGroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const supabase = await createClient();
  const user = await getCurrentUser();

  let groupsQuery = supabase
    .from("study_groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (course) {
    groupsQuery = groupsQuery.ilike("topic", `%${course}%`);
  }

  const [{ data: groups }, { data: myMemberships }] = await Promise.all([
    groupsQuery,
    supabase.from("study_group_members").select("group_id").eq("user_id", user?.id ?? ""),
  ]);

  const list = (groups ?? []) as StudyGroup[];
  const joinedIds = new Set((myMemberships ?? []).map((m) => m.group_id));

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Study groups</h1>
            <p className="mt-1 text-slate-300">
              Find peers working through the same course, or start your own.
            </p>
          </div>
          <Link
            href="/study-groups/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            New group
          </Link>
        </div>

        <form action="/study-groups" className="mt-6 flex gap-2">
          <input
            type="text"
            name="course"
            defaultValue={course}
            placeholder="Search by course code, e.g. RSM100"
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Search
          </button>
          {course && (
            <Link
              href="/study-groups"
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="mt-3">
          <JoinPrivateGroupForm />
        </div>

        {list.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-300">
              {course
                ? `No study groups yet for "${course}" — be the first to start one.`
                : "No study groups yet — be the first to start one."}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {list.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                isMember={joinedIds.has(group.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import MentorCard from "@/components/MentorCard";
import { HELP_AREAS, type Profile } from "@/lib/profile";

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: blocked } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", user?.id ?? "");
  const blockedIds = (blocked ?? []).map((b) => b.blocked_id);

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("is_mentor", true)
    .eq("is_mentor_approved", true)
    .eq("is_suspended", false)
    .order("full_name");

  if (area) {
    query = query.contains("can_help_with", [area]);
  }
  if (blockedIds.length > 0) {
    query = query.not("id", "in", `(${blockedIds.join(",")})`);
  }

  const { data: mentors } = await query;
  const list = (mentors ?? []) as Profile[];

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Find people</h1>
            <p className="mt-1 text-slate-300">
              Mentors, study partners, and collaborators across every year.
            </p>
          </div>
          <Link
            href="/requests/new"
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Not sure? Get matched
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/mentors"
            className={`rounded-full border px-3 py-1.5 text-sm ${
              !area
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-slate-600 text-slate-300 hover:bg-slate-800"
            }`}
          >
            All
          </Link>
          {HELP_AREAS.map((option) => (
            <Link
              key={option}
              href={`/mentors?area=${encodeURIComponent(option)}`}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                area === option
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {option}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-300">
              No mentors yet in this area — we&apos;re adding them every week.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {list.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

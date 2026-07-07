import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import StudyGroupThread from "@/components/StudyGroupThread";
import type { StudyGroup, StudyGroupMessage } from "@/lib/study-group";
import type { Profile } from "@/lib/profile";

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: group } = await supabase
    .from("study_groups")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!group) {
    notFound();
  }

  const { data: membership } = await supabase
    .from("study_group_members")
    .select("user_id")
    .eq("group_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/study-groups");
  }

  const [{ data: members }, { data: messages }] = await Promise.all([
    supabase.from("study_group_members").select("user_id").eq("group_id", id),
    supabase
      .from("study_group_messages")
      .select("*")
      .eq("group_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const memberIds = (members ?? []).map((m) => m.user_id);
  let names: Record<string, string> = {};
  if (memberIds.length > 0) {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", memberIds);
    names = Object.fromEntries(
      ((people ?? []) as Pick<Profile, "id" | "full_name">[]).map((p) => [p.id, p.full_name])
    );
  }

  const typedGroup = group as StudyGroup;

  return (
    <div className="flex flex-1 justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link href="/study-groups" className="text-sm text-blue-400">
          ← Back to study groups
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{typedGroup.name}</h1>
        {typedGroup.topic && <p className="text-slate-400">{typedGroup.topic}</p>}

        {typedGroup.is_private && typedGroup.creator_id === user.id && typedGroup.invite_code && (
          <div className="mt-3 rounded-xl bg-blue-950/40 border border-blue-800 p-3">
            <p className="text-sm text-blue-200">
              This is a private group. Share this invite code so others can join:
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-white">
              {typedGroup.invite_code}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {memberIds.map((memberId) => (
            <span
              key={memberId}
              className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200"
            >
              {names[memberId] ?? "Someone"}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
          <StudyGroupThread
            groupId={id}
            messages={(messages ?? []) as StudyGroupMessage[]}
            currentUserId={user.id}
            names={names}
          />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import MessageThread from "@/components/MessageThread";
import type { Message } from "@/lib/message";
import type { Profile } from "@/lib/profile";

export default async function MessageThreadPage({
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

  const { data: request } = await supabase
    .from("match_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!request) {
    notFound();
  }

  const isParticipant = request.mentee_id === user.id || request.mentor_id === user.id;
  const isMatched = request.status === "matched" || request.status === "connected";

  if (!isParticipant || !isMatched) {
    redirect("/requests");
  }

  const otherId = request.mentee_id === user.id ? request.mentor_id : request.mentee_id;
  let otherName = "your match";
  if (otherId) {
    const { data: otherProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", otherId)
      .maybeSingle();
    otherName = (otherProfile as Pick<Profile, "full_name"> | null)?.full_name || otherName;
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-1 justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link href="/requests" className="text-sm text-blue-400">
          ← Back to requests
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Chat with {otherName}
        </h1>
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
          <MessageThread
            requestId={id}
            messages={(messages ?? []) as Message[]}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  );
}

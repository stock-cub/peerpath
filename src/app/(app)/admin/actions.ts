"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MatchRequestStatus } from "@/lib/match-request";

// All of these rely on the database's RLS policies (is_admin()) to actually
// enforce who's allowed to do this — if the caller isn't an admin, Supabase
// rejects the write regardless of what the UI shows.

export async function approveMentor(profileId: string) {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ is_mentor_approved: true })
    .eq("id", profileId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

export async function rejectMentor(profileId: string) {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ is_mentor: false, is_mentor_approved: false })
    .eq("id", profileId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

export async function assignMentorToRequest(requestId: string, mentorId: string) {
  const supabase = await createClient();
  await supabase
    .from("match_requests")
    .update({ mentor_id: mentorId, status: "matched" })
    .eq("id", requestId);
  revalidatePath("/admin");
  revalidatePath("/requests");
}

export async function updateRequestStatus(
  requestId: string,
  status: MatchRequestStatus
) {
  const supabase = await createClient();
  await supabase.from("match_requests").update({ status }).eq("id", requestId);
  revalidatePath("/admin");
  revalidatePath("/requests");
}

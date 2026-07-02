"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SafetyActionResult = { error: string } | { success: true };

export async function reportUser(
  reportedId: string,
  reason: string
): Promise<SafetyActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to report someone." };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_id: reportedId,
    reason: reason.trim(),
  });

  if (error) {
    return { error: "Couldn't send your report. Please try again." };
  }

  return { success: true };
}

export async function blockUser(blockedId: string): Promise<SafetyActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to block someone." };
  }

  const { error } = await supabase.from("blocks").insert({
    blocker_id: user.id,
    blocked_id: blockedId,
  });

  if (error) {
    return { error: "Couldn't block this user. Please try again." };
  }

  revalidatePath("/mentors");
  return { success: true };
}

export async function suspendUser(profileId: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_suspended: true }).eq("id", profileId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

export async function unsuspendUser(profileId: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_suspended: false }).eq("id", profileId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

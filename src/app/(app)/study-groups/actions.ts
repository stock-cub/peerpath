"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

export type StudyGroupActionResult = { error: string } | { success: true; groupId?: string };

function generateInviteCode(): string {
  // Short, readable code — not a security secret, just a "you need this to
  // join" shareable string, similar to a Discord invite.
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createStudyGroup(formData: FormData): Promise<StudyGroupActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPrivate = formData.get("is_private") === "on";

  if (!name) {
    return { error: "Give your group a name." };
  }
  if (!topic) {
    return { error: "Add the course code this group is for." };
  }

  const supabase = await createClient();

  const { data: group, error } = await supabase
    .from("study_groups")
    .insert({
      name,
      topic,
      description,
      creator_id: user.id,
      is_private: isPrivate,
      invite_code: isPrivate ? generateInviteCode() : null,
    })
    .select("id")
    .single();

  if (error || !group) {
    return { error: "Couldn't create the group. Please try again." };
  }

  // The creator automatically joins their own group.
  await supabase.from("study_group_members").insert({ group_id: group.id, user_id: user.id });

  revalidatePath("/study-groups");
  return { success: true, groupId: group.id };
}

export async function joinPrivateStudyGroup(code: string): Promise<StudyGroupActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (!code.trim()) {
    return { error: "Enter an invite code." };
  }

  const supabase = await createClient();
  const { data: groupId, error } = await supabase.rpc("join_private_study_group", {
    p_code: code.trim().toUpperCase(),
  });

  if (error || !groupId) {
    return { error: "That invite code didn't work. Double check it and try again." };
  }

  revalidatePath("/study-groups");
  return { success: true, groupId };
}

export async function joinStudyGroup(groupId: string): Promise<StudyGroupActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("study_group_members")
    .insert({ group_id: groupId, user_id: user.id });

  if (error) {
    return { error: "Couldn't join the group. Please try again." };
  }

  revalidatePath("/study-groups");
  revalidatePath(`/study-groups/${groupId}`);
  return { success: true };
}

export async function leaveStudyGroup(groupId: string): Promise<StudyGroupActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("study_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Couldn't leave the group. Please try again." };
  }

  revalidatePath("/study-groups");
  revalidatePath(`/study-groups/${groupId}`);
  return { success: true };
}

export async function sendStudyGroupMessage(
  groupId: string,
  body: string
): Promise<StudyGroupActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (!body.trim()) {
    return { error: "Write something first." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("study_group_messages")
    .insert({ group_id: groupId, sender_id: user.id, body: body.trim() });

  if (error) {
    return { error: "Couldn't send your message. Please try again." };
  }

  revalidatePath(`/study-groups/${groupId}`);
  return { success: true };
}

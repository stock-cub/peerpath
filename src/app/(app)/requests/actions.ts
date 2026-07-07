"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SubmitRequestResult = { error: string } | { success: true };

// Used from a mentor's card: "Request this mentor".
export async function requestMentor(
  mentorId: string,
  message: string
): Promise<SubmitRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("match_requests").insert({
    mentee_id: user.id,
    mentor_id: mentorId,
    message: message.trim(),
  });

  if (error) {
    return { error: "Couldn't send your request. Please try again." };
  }

  return { success: true };
}

// Used by a mentor on a request sent directly to them — no admin needed.
export async function respondToRequest(
  requestId: string,
  accept: boolean
): Promise<SubmitRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("match_requests")
    .update({ status: accept ? "matched" : "closed" })
    .eq("id", requestId)
    .eq("mentor_id", user.id);

  if (error) {
    return { error: "Couldn't update the request. Please try again." };
  }

  return { success: true };
}

// Used from the "help me get matched" form: no specific mentor chosen yet.
export async function requestOpenMatch(message: string): Promise<SubmitRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!message.trim()) {
    return { error: "Tell us a bit about what you're looking for." };
  }

  const { error } = await supabase.from("match_requests").insert({
    mentee_id: user.id,
    mentor_id: null,
    message: message.trim(),
  });

  if (error) {
    return { error: "Couldn't send your request. Please try again." };
  }

  return { success: true };
}

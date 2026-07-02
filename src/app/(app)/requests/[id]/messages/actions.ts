"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SendMessageResult = { error: string } | { success: true };

export async function sendMessage(
  requestId: string,
  body: string
): Promise<SendMessageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to send a message." };
  }

  if (!body.trim()) {
    return { error: "Write something first." };
  }

  const { error } = await supabase.from("messages").insert({
    request_id: requestId,
    sender_id: user.id,
    body: body.trim(),
  });

  if (error) {
    return { error: "Couldn't send your message. Please try again." };
  }

  revalidatePath(`/requests/${requestId}/messages`);
  return { success: true };
}

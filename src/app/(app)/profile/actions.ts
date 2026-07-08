"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SaveProfileResult = { error: string } | { success: true };

export async function saveProfile(formData: FormData): Promise<SaveProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isMentor = formData.get("is_mentor") === "on";

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: String(formData.get("full_name") ?? "").trim(),
    year_of_study: String(formData.get("year_of_study") ?? ""),
    program: String(formData.get("program") ?? "Rotman Commerce").trim(),
    headline: String(formData.get("headline") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    is_mentor: isMentor,
    can_help_with: formData.getAll("can_help_with").map(String),
    looking_for: formData.getAll("looking_for").map(String),
    mentor_availability: isMentor
      ? (String(formData.get("mentor_availability") ?? "") || null)
      : null,
  });

  if (error) {
    return { error: "Couldn't save your profile. Please try again." };
  }

  return { success: true };
}

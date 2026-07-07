import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/profile";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Safety net: if the row wasn't created automatically (e.g. account
  // existed before the profiles table did), create it now.
  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: user.id })
      .select("*")
      .single();
    profile = created;
  }

  return (
    <div className="flex flex-1 justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900/70 border border-slate-700 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Your profile</h1>
        <p className="mt-1 text-slate-300">
          This is what other PeerPath members will see.
        </p>
        <div className="mt-6">
          <ProfileForm profile={profile as Profile} />
        </div>
      </div>
    </div>
  );
}

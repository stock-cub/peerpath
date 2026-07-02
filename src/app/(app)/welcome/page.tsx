import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-semibold text-white">
          Welcome to PeerPath 🎉
        </h1>
        <p className="mt-3 text-slate-300">
          You&apos;re signed in as <span className="font-medium text-white">{user.email}</span>.
          Use the sidebar to set up your profile, browse mentors, or check
          your requests.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import MagicLinkForm from "@/components/MagicLinkForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/70 border border-slate-700 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">
          Join PeerPath
        </h1>
        <p className="mt-2 text-slate-300">
          Only verified UofT accounts can join. We&apos;ll email you a link
          to confirm it&apos;s really you.
        </p>
        <div className="mt-6">
          <MagicLinkForm ctaLabel="Send my confirmation link" />
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Already confirmed?{" "}
          <Link href="/login" className="font-medium text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

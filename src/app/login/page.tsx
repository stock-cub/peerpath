import Link from "next/link";
import MagicLinkForm from "@/components/MagicLinkForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/70 border border-slate-700 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-slate-300">
          Enter your UofT email and we&apos;ll send you a link to log in —
          no password needed.
        </p>
        <div className="mt-6">
          <MagicLinkForm ctaLabel="Send my login link" />
        </div>
        <p className="mt-6 text-sm text-slate-400">
          New to PeerPath?{" "}
          <Link href="/signup" className="font-medium text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

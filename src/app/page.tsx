import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          PeerPath
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Find your people at Rotman. First-years get matched with an
          upper-year mentor who&apos;s been exactly where you are.
        </p>
        <p className="mt-2 text-lg text-slate-300">
          Already past year one? Find ambitious peers, teammates for your
          next case comp, and people building in your program — not just
          mentees to take on.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
          >
            Sign up with UofT email
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-600 px-6 py-3 font-medium text-slate-200 hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Only @mail.utoronto.ca accounts can join.
        </p>
      </div>
    </div>
  );
}

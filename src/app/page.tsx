import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            Find your people
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
            First-years get matched with an upper-year mentor who&apos;s been
            exactly where you are.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-slate-300">
            Already past year one? Find ambitious peers, teammates for your
            next case comp, and people building in your program — not just
            mentees to take on.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
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

        <div className="hidden justify-center lg:flex">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-slate-400">
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path
                    d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-400">
                  Profile
                </p>
                <p className="text-lg font-semibold text-white">Your name here</p>
                <p className="text-sm text-slate-400">3rd year · Rotman Commerce</p>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-blue-300">
              &ldquo;Looking for teammates for case comps&rdquo;
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200">
                Networking
              </span>
              <span className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200">
                Recruiting
              </span>
              <span className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200">
                Study tips
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

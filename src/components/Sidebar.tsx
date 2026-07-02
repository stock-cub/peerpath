"use client";

// Persistent nav for the logged-in area of the app (everything inside the
// (app) route group). On phones it collapses into a horizontal scrolling
// bar; on larger screens it's a fixed left sidebar.

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/welcome", label: "Home" },
  { href: "/profile", label: "Your profile" },
  { href: "/mentors", label: "Find a mentor" },
  { href: "/requests", label: "My requests" },
  { href: "/requests/new", label: "Get matched" },
  { href: "/messages", label: "Messages" },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? [...LINKS, { href: "/admin", label: "Admin" }] : LINKS;

  return (
    <aside
      className="flex w-full flex-row items-center gap-1 overflow-x-auto border-b border-slate-800
      bg-slate-950/60 px-4 py-3
      sm:w-56 sm:shrink-0 sm:flex-col sm:items-stretch sm:gap-1 sm:overflow-visible sm:border-b-0
      sm:border-r sm:px-4 sm:py-8"
    >
      <Link
        href="/welcome"
        className="mr-2 shrink-0 px-2 text-lg font-semibold text-white sm:mb-6 sm:mr-0 sm:text-xl"
      >
        PeerPath
      </Link>

      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <form action="/auth/sign-out" method="post" className="ml-auto shrink-0 sm:ml-0 sm:mt-auto sm:pt-6">
        <button
          type="submit"
          className="w-full rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-300 hover:bg-slate-800"
        >
          Log out
        </button>
      </form>
    </aside>
  );
}

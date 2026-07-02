// Next.js 16 renamed "middleware.ts" to "proxy.ts". This runs on every
// request before the page loads, and keeps the Supabase login session
// fresh so users don't get randomly logged out.

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

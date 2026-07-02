import Sidebar from "@/components/Sidebar";
import { checkIsAdmin } from "@/lib/admin";

// Shared layout for the logged-in area (welcome, profile, mentors, requests).
// The proxy already redirects signed-out users away from these routes.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkIsAdmin();

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

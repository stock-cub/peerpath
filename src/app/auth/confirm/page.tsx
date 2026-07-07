// This is the page users land on from their confirmation email. It does
// NOT process the code automatically — see actions.ts for why. It just
// shows a button; clicking it is what actually completes sign-in.

import { type EmailOtpType } from "@supabase/supabase-js";
import ConfirmSignInButton from "@/components/ConfirmSignInButton";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string }>;
}) {
  const params = await searchParams;
  const code = params.code ?? null;
  const tokenHash = params.token_hash ?? null;
  const type = (params.type as EmailOtpType | undefined) ?? null;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold text-white">Almost there</h1>
        <p className="mt-2 text-slate-300">
          Click below to finish signing in to PeerPath.
        </p>
        <div className="mt-6">
          <ConfirmSignInButton code={code} tokenHash={tokenHash} type={type} />
        </div>
      </div>
    </div>
  );
}

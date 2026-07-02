import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold text-white">
          That link didn&apos;t work
        </h1>
        <p className="mt-2 text-slate-300">
          It may have expired or already been used. Request a new one below.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-500"
        >
          Get a new link
        </Link>
      </div>
    </div>
  );
}

import OpenRequestForm from "@/components/OpenRequestForm";

export default function NewRequestPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-slate-700 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Help me get matched</h1>
        <p className="mt-2 text-slate-300">
          Not sure who to ask? Tell us what you need and we&apos;ll match you
          with a mentor by hand.
        </p>
        <div className="mt-6">
          <OpenRequestForm />
        </div>
      </div>
    </div>
  );
}

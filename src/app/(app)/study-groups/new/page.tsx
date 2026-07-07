import NewStudyGroupForm from "@/components/NewStudyGroupForm";

export default function NewStudyGroupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-slate-700 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Start a study group</h1>
        <p className="mt-2 text-slate-300">
          Give it a name and a course or topic so others can find it.
        </p>
        <div className="mt-6">
          <NewStudyGroupForm />
        </div>
      </div>
    </div>
  );
}

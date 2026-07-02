import type { Profile } from "@/lib/profile";
import RequestMentorButton from "@/components/RequestMentorButton";
import ReportBlockControls from "@/components/ReportBlockControls";

export default function MentorCard({ mentor }: { mentor: Profile }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/70 border border-slate-700 p-5 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-white">{mentor.full_name}</h3>
        <p className="text-sm text-slate-400">
          {mentor.year_of_study} · {mentor.program}
        </p>
      </div>

      {mentor.headline && (
        <p className="text-sm italic text-blue-300">&ldquo;{mentor.headline}&rdquo;</p>
      )}

      {mentor.bio && <p className="text-sm text-slate-300">{mentor.bio}</p>}

      {mentor.mentor_help_areas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mentor.mentor_help_areas.map((area) => (
            <span
              key={area}
              className="rounded-full bg-blue-950/60 border border-blue-800 px-3 py-1 text-xs text-blue-200"
            >
              {area}
            </span>
          ))}
        </div>
      )}

      <RequestMentorButton mentorId={mentor.id} />
      <ReportBlockControls targetId={mentor.id} />
    </div>
  );
}

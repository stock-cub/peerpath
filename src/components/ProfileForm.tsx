"use client";

// The profile edit form. Everyone fills in both "what I can help with" and
// "what I'm looking for" — a 4th-year's "looking for" is usually teammates
// or industry contacts, not mentorship, so this isn't just for mentees.
// The mentor-specific fields (availability) only show once someone opts
// into being listed in the mentor directory.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/app/(app)/profile/actions";
import { YEAR_OPTIONS, HELP_AREAS, LOOKING_FOR_OPTIONS, type Profile } from "@/lib/profile";

const inputClasses =
  "rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isMentor, setIsMentor] = useState(profile.is_mentor);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const formData = new FormData(event.currentTarget);
    const result = await saveProfile(formData);

    if ("error" in result) {
      setStatus("error");
      return;
    }

    setStatus("saved");
    setTimeout(() => router.push("/mentors"), 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-sm font-medium text-slate-300">
          Name
        </label>
        <input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name}
          required
          className={inputClasses}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="year_of_study" className="text-sm font-medium text-slate-300">
            Year of study
          </label>
          <select
            id="year_of_study"
            name="year_of_study"
            defaultValue={profile.year_of_study}
            required
            className={inputClasses}
          >
            <option value="" disabled>
              Select...
            </option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="program" className="text-sm font-medium text-slate-300">
            Program
          </label>
          <input
            id="program"
            name="program"
            defaultValue={profile.program || "Rotman Commerce"}
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="headline" className="text-sm font-medium text-slate-300">
          What are you here for? (one line)
        </label>
        <input
          id="headline"
          name="headline"
          maxLength={120}
          defaultValue={profile.headline}
          placeholder="e.g. Looking for teammates for case comps"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium text-slate-300">
          Short bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          defaultValue={profile.bio}
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">
          What can you help with?
        </span>
        <div className="flex flex-wrap gap-2">
          {HELP_AREAS.map((area) => (
            <label
              key={area}
              className="flex items-center gap-2 rounded-lg bg-slate-800/70 border border-slate-600 px-3 py-1.5 text-sm text-slate-100"
            >
              <input
                type="checkbox"
                name="can_help_with"
                value={area}
                defaultChecked={profile.can_help_with?.includes(area)}
                className="h-4 w-4 rounded border-slate-500 text-blue-500 focus:ring-blue-400"
              />
              {area}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">
          What are you looking for?
        </span>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded-lg bg-slate-800/70 border border-slate-600 px-3 py-1.5 text-sm text-slate-100"
            >
              <input
                type="checkbox"
                name="looking_for"
                value={option}
                defaultChecked={profile.looking_for?.includes(option)}
                className="h-4 w-4 rounded border-slate-500 text-blue-500 focus:ring-blue-400"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-800/40 px-4 py-3">
        <input
          type="checkbox"
          name="is_mentor"
          checked={isMentor}
          onChange={(e) => setIsMentor(e.target.checked)}
          className="h-5 w-5 rounded border-slate-500 text-blue-500 focus:ring-blue-400"
        />
        <span className="text-sm font-medium text-slate-100">
          List me in the mentor directory
        </span>
      </label>

      {isMentor && (
        <div className="flex flex-col gap-1 rounded-xl bg-blue-950/40 border border-blue-800 p-4">
          <span className="text-sm font-medium text-slate-200">
            Availability vibe
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-100">
              <input
                type="radio"
                name="mentor_availability"
                value="one_off"
                defaultChecked={profile.mentor_availability === "one_off"}
                className="h-4 w-4 border-slate-500 text-blue-500 focus:ring-blue-400"
              />
              One-off chat
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-100">
              <input
                type="radio"
                name="mentor_availability"
                value="ongoing"
                defaultChecked={profile.mentor_availability === "ongoing"}
                className="h-4 w-4 border-slate-500 text-blue-500 focus:ring-blue-400"
              />
              Ongoing mentorship
            </label>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400">
          Couldn&apos;t save your profile. Please try again.
        </p>
      )}
      {status === "saved" && (
        <p className="text-sm text-emerald-400">Saved!</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {status === "saving" ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

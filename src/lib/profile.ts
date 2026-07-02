// Shared shape of a PeerPath profile row, plus the constants used to build
// the profile form (year options, mentor help areas, etc).

export type MentorAvailability = "one_off" | "ongoing";

export type Profile = {
  id: string;
  full_name: string;
  year_of_study: string;
  program: string;
  headline: string;
  bio: string;
  is_mentor: boolean;
  mentor_help_areas: string[];
  mentor_availability: MentorAvailability | null;
  is_mentor_approved: boolean;
  is_suspended: boolean;
};

export const YEAR_OPTIONS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year+",
] as const;

export const HELP_AREAS = [
  "Course selection",
  "Recruiting / internships",
  "Clubs & getting involved",
  "Adjusting to UofT",
  "Study tips",
  "Networking",
] as const;

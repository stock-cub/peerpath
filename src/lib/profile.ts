// Shared shape of a PeerPath profile row, plus the constants used to build
// the profile form (year options, help areas, etc).

export type MentorAvailability = "one_off" | "ongoing";

export type Profile = {
  id: string;
  full_name: string;
  year_of_study: string;
  program: string;
  headline: string;
  bio: string;
  is_mentor: boolean;
  can_help_with: string[];
  looking_for: string[];
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

// What someone can offer — every user picks from this, not just mentors.
export const HELP_AREAS = [
  "Course selection",
  "Recruiting / internships",
  "Clubs & getting involved",
  "Adjusting to UofT",
  "Study tips",
  "Networking",
] as const;

// What someone's looking for — deliberately broader than "a mentor", since
// upper-years are usually after teammates or collaborators, not guidance.
export const LOOKING_FOR_OPTIONS = [
  "Mentorship / guidance",
  "Study partners",
  "Teammates for projects or competitions",
  "Industry contacts / networking",
  "Just meeting people in my program",
] as const;

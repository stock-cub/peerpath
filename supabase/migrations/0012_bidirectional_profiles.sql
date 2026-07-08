-- Every user — not just mentors — should say what they can help with AND
-- what they're looking for. A 4th-year isn't looking for a mentor; they're
-- probably looking for teammates, collaborators, or industry contacts.
-- Doing this now, before there's real user data to migrate, is much
-- cheaper than retrofitting it later.

alter table public.profiles rename column mentor_help_areas to can_help_with;
alter table public.profiles add column if not exists looking_for text[] not null default '{}';

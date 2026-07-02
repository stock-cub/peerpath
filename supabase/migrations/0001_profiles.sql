-- Phase 2: Profiles
-- One row per user, keyed to their auth account. Mentor-specific fields are
-- nullable because most fields only apply when is_mentor = true.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  year_of_study text not null default '',
  program text not null default 'Rotman Commerce',
  headline text not null default '', -- "what I'm here for", one line
  bio text not null default '',
  is_mentor boolean not null default false,
  mentor_help_areas text[] not null default '{}',
  mentor_availability text, -- 'one_off' | 'ongoing'
  is_mentor_approved boolean not null default false, -- set by admin, Phase 5
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can view any profile (needed for the mentor directory).
-- Writing is restricted to your own row.
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Automatically create an empty profile row the moment someone confirms
-- their account, so the profile form always has a row to update.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

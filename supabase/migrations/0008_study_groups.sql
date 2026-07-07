-- Study groups: any signed-in student can create a group (e.g. for a
-- specific course) and others can join. Membership is open — no approval
-- needed, this is just peers finding each other, not a moderated feature.

create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  topic text not null default '', -- e.g. course code
  description text not null default '',
  creator_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.study_groups enable row level security;

create policy "Anyone signed in can view study groups"
  on public.study_groups for select
  to authenticated
  using (true);

create policy "Users can create study groups"
  on public.study_groups for insert
  to authenticated
  with check (auth.uid() = creator_id);

create table if not exists public.study_group_members (
  group_id uuid not null references public.study_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.study_group_members enable row level security;

create policy "Anyone signed in can view group membership"
  on public.study_group_members for select
  to authenticated
  using (true);

create policy "Users can join groups themselves"
  on public.study_group_members for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can leave groups themselves"
  on public.study_group_members for delete
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.study_group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.study_group_messages enable row level security;

create or replace function public.is_study_group_member(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.study_group_members
    where group_id = target_group_id and user_id = auth.uid()
  );
$$;

create policy "Group members can view messages"
  on public.study_group_messages for select
  to authenticated
  using (public.is_study_group_member(group_id));

create policy "Group members can send messages"
  on public.study_group_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid() and public.is_study_group_member(group_id)
  );

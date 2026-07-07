-- Private study groups: hidden from the public browse list unless you're
-- already a member, joinable only with an invite code (not just clicking
-- "Join"). The code check happens inside a security-definer function so it
-- can't be bypassed by calling the members table directly.

alter table public.study_groups add column if not exists is_private boolean not null default false;
alter table public.study_groups add column if not exists invite_code text unique;

-- Replace the old "everyone can see every group" policy with one that
-- hides private groups from non-members.
drop policy if exists "Anyone signed in can view study groups" on public.study_groups;

create policy "Public groups are visible to everyone, private ones to members"
  on public.study_groups for select
  to authenticated
  using (
    not is_private
    or creator_id = auth.uid()
    or public.is_study_group_member(id)
  );

-- Same idea for the member list: don't leak who's in a private group to
-- people who aren't in it.
drop policy if exists "Anyone signed in can view group membership" on public.study_group_members;

create policy "Membership visible for public groups, members-only for private"
  on public.study_group_members for select
  to authenticated
  using (
    exists (
      select 1 from public.study_groups sg
      where sg.id = group_id
        and (not sg.is_private or public.is_study_group_member(sg.id))
    )
  );

-- Direct inserts (the normal "Join" button) only work for public groups.
-- Joining a private group has to go through join_private_study_group below.
drop policy if exists "Users can join groups themselves" on public.study_group_members;

create policy "Users can join public groups themselves"
  on public.study_group_members for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.study_groups where id = group_id and not is_private)
  );

create or replace function public.join_private_study_group(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group_id uuid;
begin
  select id into target_group_id
  from public.study_groups
  where invite_code = p_code and is_private;

  if target_group_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.study_group_members (group_id, user_id)
  values (target_group_id, auth.uid())
  on conflict (group_id, user_id) do nothing;

  return target_group_id;
end;
$$;

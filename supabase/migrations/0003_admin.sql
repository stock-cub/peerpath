-- Phase 5: Admin panel
-- Grants a small, explicit list of emails admin powers: approving mentors
-- and hand-matching requests. Everyone else is blocked from touching the
-- approval/matching fields, even on their own row.

create table if not exists public.admin_emails (
  email text primary key
);

alter table public.admin_emails enable row level security;

create policy "Authenticated users can check the admin list"
  on public.admin_emails for select
  to authenticated
  using (true);

insert into public.admin_emails (email)
values ('daniyal.rashid@mail.utoronto.ca')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails where email = auth.jwt() ->> 'email'
  );
$$;

-- Admins can view and update every profile and match request.
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can view all match requests"
  on public.match_requests for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update all match requests"
  on public.match_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Safety net: even though the "update own profile" policy technically
-- allows writing any column, this trigger stops non-admins from ever
-- flipping their own is_mentor_approved flag.
create or replace function public.protect_mentor_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.is_mentor_approved = old.is_mentor_approved;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_mentor_approval on public.profiles;
create trigger protect_mentor_approval
  before update on public.profiles
  for each row execute function public.protect_mentor_approval();

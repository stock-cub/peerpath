-- Phase 6: Safety
-- Reports and blocks are simple, explicit records. A block just filters who
-- shows up for the blocking user; it doesn't need mutual consent. Reports
-- go straight to the admin panel for the founder to review by hand.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null default '',
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can create reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on public.reports for select
  to authenticated
  using (auth.uid() = reporter_id);

create policy "Admins can view all reports"
  on public.reports for select
  to authenticated
  using (public.is_admin());

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

alter table public.blocks enable row level security;

create policy "Users can create their own blocks"
  on public.blocks for insert
  to authenticated
  with check (auth.uid() = blocker_id);

create policy "Users can view their own blocks"
  on public.blocks for select
  to authenticated
  using (auth.uid() = blocker_id);

create policy "Users can remove their own blocks"
  on public.blocks for delete
  to authenticated
  using (auth.uid() = blocker_id);

-- Admin can suspend an account, which hides it everywhere (directory,
-- new match requests) without deleting any data.
alter table public.profiles add column if not exists is_suspended boolean not null default false;

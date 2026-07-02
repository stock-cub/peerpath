-- Phase 4: Match requests (human-assisted matching)
-- A mentee can request a specific mentor (mentor_id set) or submit an open
-- "help me get matched" request (mentor_id null, admin assigns one later).

create table if not exists public.match_requests (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid not null references public.profiles (id) on delete cascade,
  mentor_id uuid references public.profiles (id) on delete set null,
  message text not null default '',
  status text not null default 'new', -- 'new' | 'matched' | 'connected' | 'closed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.match_requests enable row level security;

-- Mentees see and create their own requests. Mentors can see requests
-- assigned to them, once matched. Admin access comes in Phase 5.
create policy "Mentees can view their own requests"
  on public.match_requests for select
  to authenticated
  using (auth.uid() = mentee_id or auth.uid() = mentor_id);

create policy "Mentees can create their own requests"
  on public.match_requests for insert
  to authenticated
  with check (auth.uid() = mentee_id);

drop trigger if exists set_match_requests_updated_at on public.match_requests;
create trigger set_match_requests_updated_at
  before update on public.match_requests
  for each row execute function public.set_updated_at();

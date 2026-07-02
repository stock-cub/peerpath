-- Simple in-app messaging, scoped to a single matched request. Only the two
-- people in that match (mentee and mentor) can read or write messages, and
-- only once the request is actually matched or connected.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.match_requests (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create or replace function public.is_in_match_request(target_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.match_requests
    where id = target_request_id
      and status in ('matched', 'connected')
      and (mentee_id = auth.uid() or mentor_id = auth.uid())
  );
$$;

create policy "Matched participants can view messages"
  on public.messages for select
  to authenticated
  using (public.is_in_match_request(request_id));

create policy "Matched participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid() and public.is_in_match_request(request_id)
  );

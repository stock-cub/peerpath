-- Lets a mentor accept (or decline) a request that was sent directly to
-- them, without needing the admin to do it by hand. Admin still handles
-- open "help me get matched" requests, since those have no mentor yet.

create policy "Mentors can update the status of requests sent to them"
  on public.match_requests for update
  to authenticated
  using (auth.uid() = mentor_id)
  with check (auth.uid() = mentor_id);

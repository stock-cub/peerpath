-- Phase 4 (completing it): once a request is matched or connected, each
-- side should be able to see the other person's email. We don't want to
-- expose anyone's email broadly, so this is a security-definer function
-- that only returns an email if the caller is actually part of that
-- specific matched request.

create or replace function public.get_match_contact_email(request_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  req record;
  other_id uuid;
begin
  select * into req from public.match_requests where id = request_id;

  if req is null or req.status not in ('matched', 'connected') then
    return null;
  end if;

  if auth.uid() = req.mentee_id then
    other_id := req.mentor_id;
  elsif auth.uid() = req.mentor_id then
    other_id := req.mentee_id;
  else
    return null;
  end if;

  if other_id is null then
    return null;
  end if;

  return (select email from auth.users where id = other_id);
end;
$$;

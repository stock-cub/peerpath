-- Extend the existing admin-only-fields guard to also cover is_suspended,
-- so a suspended user can't just flip themselves back to active.

create or replace function public.protect_mentor_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.is_mentor_approved = old.is_mentor_approved;
    new.is_suspended = old.is_suspended;
  end if;
  return new;
end;
$$;

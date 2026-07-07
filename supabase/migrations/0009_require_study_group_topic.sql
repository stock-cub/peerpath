-- Study groups must be about a specific course — enforce it at the
-- database level too, not just the form.
alter table public.study_groups
  add constraint study_groups_topic_not_blank check (btrim(topic) <> '');

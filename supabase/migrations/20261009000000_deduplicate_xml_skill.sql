-- Consolidate the legacy XML format skill into the canonical markup-language skill.
-- Keep the old row retired to preserve its published code/ID for historical links.
do $xml_consolidation$
declare
  canonical_id bigint;
  duplicate_id bigint;
begin
  select id into canonical_id from public.skills where code = 'extensible-markup-language';
  select id into duplicate_id from public.skills where code = 'extensible-markup-language-format';

  if canonical_id is null or duplicate_id is null then
    return;
  end if;

  insert into public.skill_category_memberships (skill_id, skill_category_id)
  select canonical_id, skill_category_id
  from public.skill_category_memberships
  where skill_id = duplicate_id
  on conflict do nothing;

  insert into public.job_skills (job_id, skill_id)
  select job_id, canonical_id from public.job_skills where skill_id = duplicate_id
  on conflict do nothing;
  delete from public.job_skills where skill_id = duplicate_id;

  insert into public.job_seeker_skills (job_seeker_id, skill_id)
  select job_seeker_id, canonical_id from public.job_seeker_skills where skill_id = duplicate_id
  on conflict do nothing;
  delete from public.job_seeker_skills where skill_id = duplicate_id;

  -- Retain related skill edges, including their directionality.
  insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
  select canonical_id, related_skill_id, is_bidirectional
  from public.skill_relations
  where skill_id = duplicate_id and related_skill_id <> canonical_id
  on conflict (skill_id, related_skill_id) do update
    set is_bidirectional = public.skill_relations.is_bidirectional or excluded.is_bidirectional;

  insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
  select skill_id, canonical_id, is_bidirectional
  from public.skill_relations
  where related_skill_id = duplicate_id and skill_id <> canonical_id
  on conflict (skill_id, related_skill_id) do update
    set is_bidirectional = public.skill_relations.is_bidirectional or excluded.is_bidirectional;

  delete from public.skill_relations
  where skill_id = duplicate_id or related_skill_id = duplicate_id;

  -- Version row IDs stay unchanged so job version and tech stack FKs remain valid.
  update public.skill_versions set skill_id = canonical_id where skill_id = duplicate_id;

  delete from public.skill_category_memberships where skill_id = duplicate_id;

  update public.skills
  set retired_at = coalesce(retired_at, now())
  where id = duplicate_id;
end;
$xml_consolidation$;

-- Preserve production XML skill ID 17 instead of the intermediate ID 34.
-- This follows 20261009000000, which may already be applied in local databases.
-- The XML version row IDs (45/46) and their existing foreign keys remain unchanged.
do $xml_preserve_original_id$
begin
  -- On a fresh database the authored reference seed will create only ID 17.
  if not exists (select 1 from public.skills where id = 17)
     or not exists (select 1 from public.skills where id = 34) then
    return;
  end if;

  -- Already consolidated in the desired direction.
  if exists (
    select 1 from public.skills
    where id = 17 and code = 'extensible-markup-language'
      and retired_at is null
  ) then
    return;
  end if;

  if not exists (
    select 1 from public.skills
    where id = 17 and code = 'extensible-markup-language-format'
  ) or not exists (
    select 1 from public.skills
    where id = 34 and code = 'extensible-markup-language'
  ) then
    raise exception 'Unexpected XML skill IDs/codes; refusing to rewrite taxonomy';
  end if;

  -- Merge categories, job references and job-seeker references.
  insert into public.skill_category_memberships (skill_id, skill_category_id)
  select 17, skill_category_id
  from public.skill_category_memberships where skill_id = 34
  on conflict do nothing;

  insert into public.job_skills (job_id, skill_id)
  select job_id, 17 from public.job_skills where skill_id = 34
  on conflict do nothing;
  delete from public.job_skills where skill_id = 34;

  insert into public.job_seeker_skills (job_seeker_id, skill_id)
  select job_seeker_id, 17 from public.job_seeker_skills where skill_id = 34
  on conflict do nothing;
  delete from public.job_seeker_skills where skill_id = 34;

  -- Preserve the direction and bidirectionality of each relation.
  insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
  select 17, related_skill_id, is_bidirectional
  from public.skill_relations
  where skill_id = 34 and related_skill_id <> 17
  on conflict (skill_id, related_skill_id) do update
    set is_bidirectional = public.skill_relations.is_bidirectional
      or excluded.is_bidirectional;

  insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
  select skill_id, 17, is_bidirectional
  from public.skill_relations
  where related_skill_id = 34 and skill_id <> 17
  on conflict (skill_id, related_skill_id) do update
    set is_bidirectional = public.skill_relations.is_bidirectional
      or excluded.is_bidirectional;

  delete from public.skill_relations
  where skill_id = 34 or related_skill_id = 34;

  -- Moving the owner preserves version IDs 45/46 and any referencing FKs.
  update public.skill_versions set skill_id = 17 where skill_id = 34;

  delete from public.skill_category_memberships where skill_id = 34;

  -- Swap unique codes without a transient uniqueness violation.
  update public.skills
  set code = 'xml-legacy-id-34-pending-retirement'
  where id = 34;

  update public.skills s17
  set code = 'extensible-markup-language',
      name = 'Extensible Markup Language',
      description = s34.description,
      abbreviation = s34.abbreviation,
      reference = s34.reference,
      notes = null,
      retired_at = null
  from public.skills s34
  where s17.id = 17 and s34.id = 34;

  update public.skills
  set code = 'extensible-markup-language-format',
      name = 'Extensible Markup Language (format)',
      notes = 'Retired duplicate of the canonical XML skill (ID 17).',
      retired_at = coalesce(retired_at, now())
  where id = 34;
end;
$xml_preserve_original_id$;

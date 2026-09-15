alter table public.industries
add column code text,
add column retired_at timestamptz;

alter table public.roles
add column code text,
add column retired_at timestamptz;

alter table public.skill_categories
add column code text,
add column retired_at timestamptz;

alter table public.skills
add column code text,
add column retired_at timestamptz;

alter table public.skill_versions
add column code text,
add column retired_at timestamptz;

update public.industries
set code = lower(trim(both '-' from regexp_replace(regexp_replace(name, '[^A-Za-z0-9]+', '-', 'g'), '-+', '-', 'g')));

update public.roles
set code = lower(trim(both '-' from regexp_replace(regexp_replace(name, '[^A-Za-z0-9]+', '-', 'g'), '-+', '-', 'g')));

update public.skill_categories
set code = lower(trim(both '-' from regexp_replace(regexp_replace(name, '[^A-Za-z0-9]+', '-', 'g'), '-+', '-', 'g')));

update public.skills
set code = lower(trim(both '-' from regexp_replace(regexp_replace(name, '[^A-Za-z0-9]+', '-', 'g'), '-+', '-', 'g')));

update public.skill_versions
set code = lower(trim(both '-' from regexp_replace(regexp_replace(version, '[^A-Za-z0-9]+', '-', 'g'), '-+', '-', 'g')));

alter table public.industries
alter column code set not null,
add constraint industries_code_key unique (code),
add constraint industries_code_format_check
check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.roles
alter column code set not null,
add constraint roles_code_key unique (code),
add constraint roles_code_format_check
check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.skill_categories
alter column code set not null,
add constraint skill_categories_code_key unique (code),
add constraint skill_categories_code_format_check
check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.skills
alter column code set not null,
add constraint skills_code_key unique (code),
add constraint skills_code_format_check
check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.skill_versions
alter column code set not null,
alter column release_date drop not null,
add constraint skill_versions_skill_id_code_key unique (skill_id, code),
add constraint skill_versions_code_format_check
check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
add constraint skill_versions_ordinal_positive_check
check (ordinal > 0);

create table public.skill_category_memberships (
  skill_id bigint not null,
  skill_category_id bigint not null,
  primary key (skill_id, skill_category_id),
  constraint skill_category_memberships_skill_id_fkey
  foreign key (skill_id)
  references public.skills (id)
  on update cascade
  on delete cascade,
  constraint skill_category_memberships_skill_category_id_fkey
  foreign key (skill_category_id)
  references public.skill_categories (id)
  on update cascade
  on delete restrict
);

create index skill_category_memberships_skill_category_id_idx
on public.skill_category_memberships (skill_category_id);

insert into public.skill_category_memberships (skill_id, skill_category_id)
select id, skill_category_id
from public.skills;

alter table public.skill_category_memberships enable row level security;

revoke all on table public.skill_category_memberships
from anon, authenticated, service_role;

grant select on table public.skill_category_memberships to authenticated;
grant all on table public.skill_category_memberships to service_role;

create policy "Skill category memberships are visible to everyone."
on public.skill_category_memberships
for select
to authenticated
using (true);

create function private.set_taxonomy_code()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  source_value text;
begin
  if new.code is null or btrim(new.code) = '' then
    source_value := case
      when tg_table_name = 'skill_versions' then to_jsonb(new) ->> 'version'
      else to_jsonb(new) ->> 'name'
    end;

    new.code := lower(
      trim(
        both '-' from regexp_replace(
          regexp_replace(source_value, '[^A-Za-z0-9]+', '-', 'g'),
          '-+',
          '-',
          'g'
        )
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.set_taxonomy_code()
from public, anon, authenticated, service_role;

create trigger industries_set_taxonomy_code
before insert on public.industries
for each row execute function private.set_taxonomy_code();

create trigger roles_set_taxonomy_code
before insert on public.roles
for each row execute function private.set_taxonomy_code();

create trigger skill_categories_set_taxonomy_code
before insert on public.skill_categories
for each row execute function private.set_taxonomy_code();

create trigger skills_set_taxonomy_code
before insert on public.skills
for each row execute function private.set_taxonomy_code();

create trigger skill_versions_set_taxonomy_code
before insert on public.skill_versions
for each row execute function private.set_taxonomy_code();

create function private.ensure_primary_skill_category_membership()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.skill_category_memberships (skill_id, skill_category_id)
  values (new.id, new.skill_category_id)
  on conflict do nothing;

  return new;
end;
$$;

revoke all on function private.ensure_primary_skill_category_membership()
from public, anon, authenticated, service_role;

create trigger skills_ensure_primary_category_membership
after insert or update of skill_category_id on public.skills
for each row execute function private.ensure_primary_skill_category_membership();

alter table public.companies
drop constraint companies_industry_id_fkey,
add constraint companies_industry_id_fkey
foreign key (industry_id)
references public.industries (id)
on update cascade
on delete restrict;

alter table public.job_roles
drop constraint job_roles_role_id_fkey,
add constraint job_roles_role_id_fkey
foreign key (role_id)
references public.roles (id)
on update cascade
on delete restrict;

alter table public.skill_categories
drop constraint skill_categories_parent_skill_category_id_fkey,
add constraint skill_categories_parent_skill_category_id_fkey
foreign key (parent_skill_category_id)
references public.skill_categories (id)
on update cascade
on delete restrict;

alter table public.skills
drop constraint skills_skill_category_id_fkey,
add constraint skills_skill_category_id_fkey
foreign key (skill_category_id)
references public.skill_categories (id)
on update cascade
on delete restrict;

alter table public.company_tech_stacks
drop constraint tech_stacks_skill_version_id_fkey,
add constraint tech_stacks_skill_version_id_fkey
foreign key (skill_version_id)
references public.skill_versions (id)
on update cascade
on delete restrict;

alter table public.job_skill_versions
drop constraint job_skill_versions_skill_version_id_fkey,
add constraint job_skill_versions_skill_version_id_fkey
foreign key (skill_version_id)
references public.skill_versions (id)
on update cascade
on delete restrict;

alter table public.job_seeker_skills
drop constraint job_seeker_skills_skill_id_fkey,
add constraint job_seeker_skills_skill_id_fkey
foreign key (skill_id)
references public.skills (id)
on update cascade
on delete restrict;

alter table public.job_skills
drop constraint job_skills_skill_id_fkey,
add constraint job_skills_skill_id_fkey
foreign key (skill_id)
references public.skills (id)
on update cascade
on delete restrict;

alter table public.skill_relations
add constraint skill_relations_no_self_relation_check
check (skill_id <> related_skill_id);

comment on column public.skills.skill_category_id is
'Primary/display category for backward-compatible application queries. Additional categories are stored in skill_category_memberships.';

comment on table public.skill_category_memberships is
'All category memberships for a skill. The skills.skill_category_id primary/display category is inserted automatically.';

comment on table public.skill_relations is
'Authored directed skill relationship. Consumers treat the reverse edge as present only when is_bidirectional is true.';

comment on column public.skill_relations.is_bidirectional is
'When true, consumers should treat this relation as applying in both directions without storing a second reverse row.';

comment on column public.skill_versions.release_date is
'Optional exact release date; null when a precise date is unknown or not meaningful.';

comment on column public.skill_versions.ordinal is
'Required positive per-skill ordering value. Higher ordinals represent later versions.';

select setval(
  pg_get_serial_sequence('public.industries', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.industries;

select setval(
  pg_get_serial_sequence('public.roles', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.roles;

select setval(
  pg_get_serial_sequence('public.skill_categories', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skill_categories;

select setval(
  pg_get_serial_sequence('public.skills', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skills;

select setval(
  pg_get_serial_sequence('public.skill_versions', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skill_versions;

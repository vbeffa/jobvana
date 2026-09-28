begin;

create extension if not exists pgtap with schema extensions;

select plan(9);

select is((select count(*)::integer from public.companies), 1005, 'fixture keeps 1005 companies');
select is((select count(*)::integer from public.company_addresses), 2004, 'fixture keeps 2004 company addresses');
select is((select count(*)::integer from public.company_tech_stacks), 1006, 'fixture keeps 1006 company tech-stack versions');
select is((select count(*)::integer from public.jobs), 504, 'fixture keeps 504 jobs');
select is((select count(*)::integer from public.job_roles), 508, 'fixture keeps 508 job roles');
select is((select count(*)::integer from public.job_skills), 551, 'fixture keeps 551 job skills');
select is((select count(*)::integer from public.job_skill_versions), 276, 'fixture keeps 276 job skill versions');
select is((select count(*)::integer from public.job_seekers), 3, 'fixture keeps 3 job seekers');

select is(
  (
    select count(*)::integer
    from public.jobs j
    join public.company_addresses a on a.id = j.company_address_id
    where a.company_id <> j.company_id
  ),
  0,
  'fixture job addresses belong to the same company as their jobs'
);

select * from finish();

rollback;

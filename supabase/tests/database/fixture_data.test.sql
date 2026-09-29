begin;

create extension if not exists pgtap with schema extensions;

select plan(10);

select is((select count(*)::integer from auth.users), 4, 'demo fixture keeps 4 auth users');
select is((select count(*)::integer from public.companies), 2, 'demo fixture keeps 2 companies');
select is((select count(*)::integer from public.company_addresses), 2, 'demo fixture keeps 2 company addresses');
select is((select count(*)::integer from public.company_tech_stacks), 2, 'demo fixture keeps 2 company tech-stack versions');
select is((select count(*)::integer from public.jobs), 4, 'demo fixture keeps 4 jobs');
select is((select count(*)::integer from public.job_roles), 4, 'demo fixture keeps 4 job roles');
select is((select count(*)::integer from public.job_skills), 3, 'demo fixture keeps 3 job skills');
select is((select count(*)::integer from public.job_skill_versions), 3, 'demo fixture keeps 3 job skill versions');
select is((select count(*)::integer from public.job_seekers), 2, 'demo fixture keeps 2 job seekers');

select is(
  (
    select count(*)::integer
    from public.jobs j
    join public.company_addresses a on a.id = j.company_address_id
    where a.company_id <> j.company_id
  ),
  0,
  'demo fixture job addresses belong to the same company as their jobs'
);

select * from finish();

rollback;

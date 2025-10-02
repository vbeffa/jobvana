drop policy "Companies are visible to themselves or to job seekers" on "public"."companies";

drop policy "Job roles are visible to their companies or to job seekers" on "public"."job_roles";

drop policy "Job skills are visible to their companies or to job seekers" on "public"."job_skills";

drop policy "Jobs are visible to their companies or to job seekers" on "public"."jobs";

create policy "Companies are visible to themselves or to job seekers"
on "public"."companies"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'type'::text) = 'job_seeker'::text)));


create policy "Job roles are visible to their companies or to job seekers"
on "public"."job_roles"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) IN ( SELECT companies.user_id
   FROM companies
  WHERE (companies.id IN ( SELECT jobs.company_id
           FROM jobs
          WHERE (jobs.id = job_roles.job_id))))) OR (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'type'::text) = 'job_seeker'::text)));


create policy "Job skills are visible to their companies or to job seekers"
on "public"."job_skills"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) IN ( SELECT companies.user_id
   FROM companies
  WHERE (companies.id IN ( SELECT jobs.company_id
           FROM jobs
          WHERE (jobs.id = job_skills.job_id))))) OR (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'type'::text) = 'job_seeker'::text)));


create policy "Jobs are visible to their companies or to job seekers"
on "public"."jobs"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) IN ( SELECT companies.user_id
   FROM companies
  WHERE (companies.id = jobs.company_id))) OR (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'type'::text) = 'job_seeker'::text)));





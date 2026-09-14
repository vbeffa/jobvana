drop policy "Companies and job seekers can update applications" on public.applications;

drop policy "Companies and job seekers can view applications" on public.applications;

drop policy "Companies are visible to themselves or to job seekers" on public.companies;

drop policy "Companies and job seekers can update rounds" on public.interview_rounds;

drop policy "Job seekers are visible to themselves or to companies" on public.job_seekers;

drop function if exists public.is_company(_user_id uuid);

drop function if exists public.is_job_seeker(_user_id uuid);

set check_function_bodies = off;

create or replace function private.is_company()
returns boolean
language sql
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.companies c
    where c.user_id = (select auth.uid())
  );
$function$;

create or replace function private.is_job_seeker()
returns boolean
language sql
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.job_seekers js
    where js.user_id = (select auth.uid())
  );
$function$;

revoke all on schema private from public, anon, authenticated, service_role;
grant usage on schema private to authenticated;

revoke all on function private.is_company()
from public, anon, authenticated, service_role;
revoke all on function private.is_job_seeker()
from public, anon, authenticated, service_role;

grant execute on function private.is_company() to authenticated;
grant execute on function private.is_job_seeker() to authenticated;

create or replace function public.enforce_application_update()
returns trigger
language plpgsql
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  is_job_seeker boolean;
  is_company boolean;
begin
  -- Fields that should never change after the application is created.
  if new.id is distinct from old.id
     or new.created_at is distinct from old.created_at
     or new.job_id is distinct from old.job_id
     or new.job_seeker_id is distinct from old.job_seeker_id
     or new.reason is distinct from old.reason then
    raise exception 'Application immutable fields cannot be changed';
  end if;

  -- Is the current user the job seeker for this application?
  select exists (
    select 1
    from public.job_seekers js
    where js.id = old.job_seeker_id
      and js.user_id = uid
  )
  into is_job_seeker;

  -- Is the current user the company that owns this application's job?
  select exists (
    select 1
    from public.jobs j
    join public.companies c
      on c.id = j.company_id
    where j.id = old.job_id
      and c.user_id = uid
  )
  into is_company;

  if not is_job_seeker and not is_company then
    raise exception 'User is not authorized to update this application';
  end if;

  -- Allow updates that do not change status, such as updated_at.
  if new.status is not distinct from old.status then
    return new;
  end if;

  -- Job seeker can withdraw a submitted or accepted application.
  if new.status = 'withdrawn' then
    if not is_job_seeker then
      raise exception 'Only the job seeker can withdraw an application';
    end if;

    if old.status not in ('submitted', 'accepted') then
      raise exception 'Invalid application status transition: % -> %',
        old.status, new.status;
    end if;

  -- Company can accept only a submitted application.
  elsif new.status = 'accepted' then
    if not is_company then
      raise exception 'Only the company can accept an application';
    end if;

    if old.status <> 'submitted' then
      raise exception 'Invalid application status transition: % -> %',
        old.status, new.status;
    end if;

  -- Company can decline either before or during the interview process.
  elsif new.status = 'declined' then
    if not is_company then
      raise exception 'Only the company can decline an application';
    end if;

    if old.status not in ('submitted', 'accepted') then
      raise exception 'Invalid application status transition: % -> %',
        old.status, new.status;
    end if;

  -- 'submitted' is created by INSERT, not restored through UPDATE.
  else
    raise exception 'Invalid application status transition: % -> %',
      old.status, new.status;
  end if;

  return new;
end;
$function$;

create or replace function public.enforce_interview_round_update()
returns trigger
language plpgsql
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  is_job_seeker boolean;
  is_company boolean;
begin
  -- Structural fields should never be changed through an UPDATE.
  if new.id is distinct from old.id
     or new.interview_id is distinct from old.interview_id
     or new.round is distinct from old.round
     or new.created_at is distinct from old.created_at then
    raise exception 'Interview round structural fields cannot be changed';
  end if;

  select exists (
    select 1
    from public.interviews i
    join public.applications a
      on a.id = i.application_id
    join public.job_seekers js
      on js.id = a.job_seeker_id
    where i.id = old.interview_id
      and js.user_id = uid
  )
  into is_job_seeker;

  select exists (
    select 1
    from public.interviews i
    join public.applications a
      on a.id = i.application_id
    join public.jobs j
      on j.id = a.job_id
    join public.companies c
      on c.id = j.company_id
    where i.id = old.interview_id
      and c.user_id = uid
  )
  into is_company;

  if is_job_seeker and not is_company then
    if new.company_response is distinct from old.company_response then
      raise exception 'Job seekers cannot change company_response';
    end if;

  elsif is_company and not is_job_seeker then
    if new.job_seeker_response is distinct from old.job_seeker_response then
      raise exception 'Companies cannot change job_seeker_response';
    end if;

  elsif not is_job_seeker and not is_company then
    raise exception 'User is not authorized to update this interview round';
  end if;

  return new;
end;
$function$;


create policy "Companies and job seekers can update applications"
on public.applications
as permissive
for update
to authenticated
using ((((
    select auth.uid() as uid) in (
    select companies.user_id
    from public.companies
    where (companies.id in (
        select jobs.company_id
        from public.jobs
        where (jobs.id = applications.job_id)
    ))
)) or ((select auth.uid() as uid
) in (
    select job_seekers.user_id
    from public.job_seekers
    where (job_seekers.id = applications.job_seeker_id)
))))
with check ((((
    select auth.uid() as uid) in (
    select companies.user_id
    from public.companies
    where (companies.id in (
        select jobs.company_id
        from public.jobs
        where (jobs.id = applications.job_id)
    ))
)) or ((select auth.uid() as uid
) in (
    select job_seekers.user_id
    from public.job_seekers
    where (job_seekers.id = applications.job_seeker_id)
))));


create policy "Companies and job seekers can view applications"
on public.applications
as permissive
for select
to authenticated
using ((((
    select auth.uid() as uid) in (
    select companies.user_id
    from public.companies
    where (companies.id in (
        select jobs.company_id
        from public.jobs
        where (jobs.id = applications.job_id)
    ))
)) or ((select auth.uid() as uid
) in (
    select job_seekers.user_id
    from public.job_seekers
    where (job_seekers.id = applications.job_seeker_id)
))));


create policy "Companies are visible to themselves or to job seekers"
on public.companies
as permissive
for select
to authenticated
using (
    (
        ((select auth.uid() as uid) = user_id)
        or (select private.is_job_seeker() as is_job_seeker)
    )
);


create policy "Companies and job seekers can update rounds"
on public.interview_rounds
as permissive
for update
to authenticated
using ((((
    select auth.uid() as uid) in (
    select job_seekers.user_id
    from public.job_seekers
    where (job_seekers.id in (
        select applications.job_seeker_id
        from public.applications
        where (applications.id in (
            select interviews.application_id
            from public.interviews
            where (interviews.id = interview_rounds.interview_id)
        ))
    ))
)) or ((select auth.uid() as uid
) in (
    select companies.user_id
    from public.companies
    where (companies.id in (
        select jobs.company_id
        from public.jobs
        where (jobs.id in (
            select applications.job_id
            from public.applications
            where (applications.id in (
                select interviews.application_id
                from public.interviews
                where (interviews.id = interview_rounds.interview_id)
            ))
        ))
    ))
))))
with check ((((
    select auth.uid() as uid) in (
    select job_seekers.user_id
    from public.job_seekers
    where (job_seekers.id in (
        select applications.job_seeker_id
        from public.applications
        where (applications.id in (
            select interviews.application_id
            from public.interviews
            where (interviews.id = interview_rounds.interview_id)
        ))
    ))
)) or ((select auth.uid() as uid
) in (
    select companies.user_id
    from public.companies
    where (companies.id in (
        select jobs.company_id
        from public.jobs
        where (jobs.id in (
            select applications.job_id
            from public.applications
            where (applications.id in (
                select interviews.application_id
                from public.interviews
                where (interviews.id = interview_rounds.interview_id)
            ))
        ))
    ))
))));


create policy "Job seekers are visible to themselves or to companies"
on public.job_seekers
as permissive
for select
to authenticated
using (
    (
        ((select auth.uid() as uid) = user_id)
        or (select private.is_company() as is_company)
    )
);


create trigger enforce_application_update before update on public.applications for each row execute function public.enforce_application_update();

create trigger enforce_interview_round_update before update on public.interview_rounds for each row execute function public.enforce_interview_round_update();

create policy "Companies can view app resumes for their jobs 1v70e0n_0"
on storage.objects
as permissive
for select
to authenticated
using (((bucket_id = 'application_resumes'::text) and (exists (
    select 1
    from (
        public.jobs
        inner join public.companies on ((jobs.company_id = companies.id))
    )
    where
        (
            ((jobs.id)::text = (storage.foldername(objects.name))[1])
            and (companies.user_id = auth.uid())
        )
))));


create policy "Job seekers can copy/view their app resumes 1v70e0n_0"
on storage.objects
as permissive
for select
to authenticated
using (((bucket_id = 'application_resumes'::text) and (storage.filename(
    name) = ((auth.uid())::text || '.pdf'::text)) and (exists (
    select 1
    from (
        public.applications
        inner join
            public.job_seekers
            on ((applications.job_seeker_id = job_seekers.id))
    )
    where
        (
            (
                (applications.job_id)::text
                = (storage.foldername(objects.name))[1]
            )
            and (job_seekers.user_id = auth.uid())
        )
))));


create policy "Job seekers can copy/view their app resumes 1v70e0n_1"
on storage.objects
as permissive
for insert
to authenticated
with check (((bucket_id = 'application_resumes'::text) and (storage.filename(
    name) = ((auth.uid())::text || '.pdf'::text)) and (exists (
    select 1
    from (
        public.applications
        inner join
            public.job_seekers
            on ((applications.job_seeker_id = job_seekers.id))
    )
    where
        (
            (
                (applications.job_id)::text
                = (storage.foldername(objects.name))[1]
            )
            and (job_seekers.user_id = auth.uid())
        )
))));


create policy "Job seekers can delete their resumes i5g8va_0"
on storage.objects
as permissive
for delete
to authenticated
using (
    (
        (bucket_id = 'resumes'::text)
        and ((storage.foldername(name))[1] = (auth.uid())::text)
    )
);


create policy "Job seekers can update resumes i5g8va_0"
on storage.objects
as permissive
for update
to authenticated
using (
    (
        (bucket_id = 'resumes'::text)
        and ((storage.foldername(name))[1] = (auth.uid())::text)
    )
)
with check (
    (
        (bucket_id = 'resumes'::text)
        and ((storage.foldername(name))[1] = (auth.uid())::text)
    )
);


create policy "Job seekers can upload resumes i5g8va_0"
on storage.objects
as permissive
for insert
to authenticated
with check (
    (
        (bucket_id = 'resumes'::text)
        and ((storage.foldername(name))[1] = (auth.uid())::text)
    )
);


create policy "List resumes i5g8va_0"
on storage.objects
as permissive
for select
to authenticated
using (
    (
        (bucket_id = 'resumes'::text)
        and ((storage.foldername(name))[1] = (auth.uid())::text)
    )
);

begin;

create extension if not exists pgtap with schema extensions;

select plan(9);

create function pg_temp.registration_insert_succeeds(
  p_user_id uuid,
  p_user_type public.user_type
)
returns boolean
language plpgsql
security invoker
as $$
begin
  insert into public.user_registrations (user_id, user_type)
  values (p_user_id, p_user_type);
  return true;
exception
  when others then
    return false;
end;
$$;

create function pg_temp.registration_update_count(
  p_user_id uuid,
  p_user_type public.user_type
)
returns integer
language plpgsql
security invoker
as $$
declare
  updated_rows integer;
begin
  update public.user_registrations
  set user_type = p_user_type
  where user_id = p_user_id;

  get diagnostics updated_rows = row_count;
  return updated_rows;
exception
  when others then
    return 0;
end;
$$;

insert into auth.users (id, email, raw_user_meta_data)
values (
  '11111111-1111-4111-8111-111111111111',
  'registration-company@test.local',
  '{"type":"company"}'::jsonb
);

select results_eq(
  $$select user_type::text
    from public.user_registrations
    where user_id = '11111111-1111-4111-8111-111111111111'$$,
  array['company'::text],
  'company registration is created by the auth.users trigger'
);

update auth.users
set raw_user_meta_data = '{"type":"job_seeker"}'::jsonb
where id = '11111111-1111-4111-8111-111111111111';

select results_eq(
  $$select user_type::text
    from public.user_registrations
    where user_id = '11111111-1111-4111-8111-111111111111'$$,
  array['company'::text],
  'changing user metadata does not change authoritative registration type'
);

insert into auth.users (id, email, raw_user_meta_data)
values (
  '22222222-2222-4222-8222-222222222222',
  'registration-seeker@test.local',
  '{"type":"job_seeker"}'::jsonb
);

select results_eq(
  $$select user_type::text
    from public.user_registrations
    where user_id = '22222222-2222-4222-8222-222222222222'$$,
  array['job_seeker'::text],
  'job seeker registration is created by the auth.users trigger'
);

select throws_ok(
  $$insert into auth.users (id, email, raw_user_meta_data)
    values (
      '33333333-3333-4333-8333-333333333333',
      'registration-invalid@test.local',
      '{"type":"administrator"}'::jsonb
    )$$,
  'P0001',
  'Invalid or missing Jobvana user type',
  'invalid registration type is rejected by the database'
);

select throws_ok(
  $$insert into auth.users (id, email, raw_user_meta_data)
    values (
      '44444444-4444-4444-8444-444444444444',
      'registration-missing@test.local',
      '{}'::jsonb
    )$$,
  'P0001',
  'Invalid or missing Jobvana user type',
  'missing registration type is rejected by the database'
);

insert into auth.users (id, email, raw_user_meta_data)
values (
  '55555555-5555-4555-8555-555555555555',
  'registration-write-probe@test.local',
  '{"type":"company"}'::jsonb
);

delete from public.user_registrations
where user_id = '55555555-5555-4555-8555-555555555555';

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}',
  true
);

select is(
  pg_temp.registration_insert_succeeds(
    '55555555-5555-4555-8555-555555555555',
    'company'
  ),
  false,
  'authenticated users cannot insert registration state directly'
);

reset role;

delete from public.user_registrations
where user_id = '55555555-5555-4555-8555-555555555555';

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select is(
  pg_temp.registration_update_count(
    '11111111-1111-4111-8111-111111111111',
    'job_seeker'
  ),
  0,
  'authenticated users cannot modify registration state'
);

reset role;
set local role anon;

select set_config(
  'request.jwt.claims',
  '{"role":"anon"}',
  true
);

select is(
  pg_temp.registration_insert_succeeds(
    '55555555-5555-4555-8555-555555555555',
    'company'
  ),
  false,
  'anonymous users cannot insert registration state directly'
);

reset role;

select policies_are(
  'public',
  'user_registrations',
  array['Users can select their user type'],
  'user_registrations has only the authenticated SELECT policy'
);

select * from finish();

rollback;

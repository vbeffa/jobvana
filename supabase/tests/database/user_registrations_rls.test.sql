begin;

create extension if not exists pgtap with schema extensions;

select plan(7);

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

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select throws_ok(
  $$insert into public.user_registrations (user_id, user_type)
    values ('11111111-1111-4111-8111-111111111111', 'company')$$,
  '42501',
  'permission denied for table user_registrations',
  'authenticated users cannot insert registration state directly'
);

select throws_ok(
  $$update public.user_registrations
    set user_type = 'job_seeker'
    where user_id = '11111111-1111-4111-8111-111111111111'$$,
  '42501',
  'permission denied for table user_registrations',
  'authenticated users cannot modify registration state'
);

reset role;
set local role anon;

select set_config(
  'request.jwt.claims',
  '{"role":"anon"}',
  true
);

select throws_ok(
  $$insert into public.user_registrations (user_id, user_type)
    values ('11111111-1111-4111-8111-111111111111', 'company')$$,
  '42501',
  'permission denied for table user_registrations',
  'anonymous users cannot insert registration state directly'
);

reset role;

select * from finish();

rollback;

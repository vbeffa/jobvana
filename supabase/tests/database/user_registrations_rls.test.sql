begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

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

select ok(
  not has_table_privilege(
    'authenticated',
    'public.user_registrations',
    'insert'
  ),
  'authenticated users do not have direct INSERT privilege'
);

select ok(
  not has_table_privilege(
    'authenticated',
    'public.user_registrations',
    'update'
  ),
  'authenticated users do not have direct UPDATE privilege'
);

select ok(
  not has_table_privilege(
    'anon',
    'public.user_registrations',
    'insert'
  ),
  'anonymous users do not have direct INSERT privilege'
);

select policies_are(
  'public',
  'user_registrations',
  array['Users can select their user type'],
  'user_registrations has only the authenticated SELECT policy'
);

select * from finish();

rollback;

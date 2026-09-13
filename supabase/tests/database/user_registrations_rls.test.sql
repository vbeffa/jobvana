begin;

create extension if not exists pgtap with schema extensions;

select plan(4);

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'registration-owner@test.local'),
  ('22222222-2222-4222-8222-222222222222', 'registration-other@test.local'),
  ('33333333-3333-4333-8333-333333333333', 'registration-invalid@test.local');

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.user_registrations (user_id, user_type)
    values ('11111111-1111-4111-8111-111111111111', 'company')$$,
  'authenticated user can create their own registration'
);

select throws_ok(
  $$insert into public.user_registrations (user_id, user_type)
    values ('22222222-2222-4222-8222-222222222222', 'company')$$,
  '42501',
  'new row violates row-level security policy for table "user_registrations"',
  'authenticated user cannot register another user'
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
    values ('33333333-3333-4333-8333-333333333333', 'job_seeker')$$,
  '42501',
  'new row violates row-level security policy for table "user_registrations"',
  'anonymous user cannot create a registration'
);

reset role;
set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}',
  true
);

select throws_ok(
  $$insert into public.user_registrations (user_id, user_type)
    values ('33333333-3333-4333-8333-333333333333', 'administrator')$$,
  '22P02',
  'invalid input value for enum user_type: "administrator"',
  'invalid registration type is rejected'
);

reset role;

select * from finish();

rollback;

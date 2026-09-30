-- GENERATED FILE. DO NOT EDIT.
-- Source: fixture-data/demo/*.json
-- Regenerate with: npm run demo-data:write

grant usage on schema public to postgres, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, authenticated, service_role;

do $jobvana_fixture_data$
begin

create temporary table jobvana_fixture_auth_users (
  fixture_key text primary key,
  id uuid not null unique
) on commit drop;

insert into jobvana_fixture_auth_users (fixture_key, id)
values
  ('jobvana-admin-company', '11111111-1111-4111-8111-111111111111'),
  ('planet-express-admin-company', '22222222-2222-4222-8222-222222222222'),
  ('philip-fry-job-seeker', '33333333-3333-4333-8333-333333333333'),
  ('turanga-leela-job-seeker', '44444444-4444-4444-8444-444444444444'),
  ('new-company-onboarding', '55555555-5555-4555-8555-555555555555'),
  ('new-job-seeker-onboarding', '66666666-6666-4666-8666-666666666666')
;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'admin@jobvana.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"11111111-1111-4111-8111-111111111111","type":"company","email":"admin@jobvana.test","last_name":"Admin","first_name":"Jobvana","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'admin@planet-express.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"22222222-2222-4222-8222-222222222222","type":"company","email":"admin@planet-express.test","last_name":"Admin","first_name":"Planet Express","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'fry@example.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"33333333-3333-4333-8333-333333333333","type":"job_seeker","email":"fry@example.test","last_name":"Fry","first_name":"Philip","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated', 'leela@example.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"44444444-4444-4444-8444-444444444444","type":"job_seeker","email":"leela@example.test","last_name":"Leela","first_name":"Turanga","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-4555-8555-555555555555', 'authenticated', 'authenticated', 'new-company@jobvana.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"55555555-5555-4555-8555-555555555555","type":"company","email":"new-company@jobvana.test","last_name":"Company","first_name":"New","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-4666-8666-666666666666', 'authenticated', 'authenticated', 'new-job-seeker@jobvana.test', extensions.crypt('abcd1234', extensions.gen_salt('bf')), current_timestamp, null, null, '{"provider":"email","providers":["email"]}'::jsonb, '{"sub":"66666666-6666-4666-8666-666666666666","type":"job_seeker","email":"new-job-seeker@jobvana.test","last_name":"Job Seeker","first_name":"New","email_verified":true,"phone_verified":false}'::jsonb, current_timestamp, current_timestamp, '', '', '', '')
;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  extensions.uuid_generate_v4(),
  u.id,
  u.id,
  format('{"sub":"%s","email":"%s"}', u.id::text, u.email)::jsonb,
  'email',
  current_timestamp,
  current_timestamp,
  current_timestamp
from auth.users u
join jobvana_fixture_auth_users f on f.id = u.id;

create temporary table jobvana_fixture_companies (
  fixture_key text primary key,
  id bigint not null unique default nextval(pg_get_serial_sequence('public.companies', 'id')),
  created_at timestamptz not null,
  name text not null,
  num_employees integer not null,
  industry_code text not null,
  description text not null,
  auth_user_key text,
  contact_email text,
  interview_process jsonb
) on commit drop;

insert into jobvana_fixture_companies (fixture_key, created_at, name, num_employees, industry_code, description, auth_user_key, contact_email, interview_process)
values
  ('jobvana', '2026-09-01T12:00:00Z', 'Jobvana', 4, 'b2b-software', 'Demo company for exercising Jobvana company-account and hiring workflows.', 'jobvana-admin-company', 'admin@jobvana.test', null),
  ('planet-express', '2026-09-01T12:00:00Z', 'Planet Express', 12, 'consumer', 'Synthetic interplanetary delivery company used for demo and test data.', 'planet-express-admin-company', 'admin@planet-express.test', null)
;

insert into public.companies (id, created_at, name, num_employees, industry_id, description, user_id, contact_email, interview_process)
select
  c.id, c.created_at, c.name, c.num_employees, i.id, c.description, u.id, c.contact_email, c.interview_process
from jobvana_fixture_companies c
join public.industries i on i.code = c.industry_code
left join jobvana_fixture_auth_users u on u.fixture_key = c.auth_user_key
order by c.id;

create temporary table jobvana_fixture_company_addresses (
  fixture_key text primary key,
  id bigint not null unique default nextval(pg_get_serial_sequence('public.company_addresses', 'id')),
  company_key text not null,
  street text not null,
  city text not null,
  state text not null,
  zip text not null,
  address_type text not null,
  street_2 text,
  phone text,
  location text
) on commit drop;

insert into jobvana_fixture_company_addresses (fixture_key, company_key, street, city, state, zip, address_type, street_2, phone, location)
values
  ('jobvana-hq', 'jobvana', '1 Jobvana Way', 'San Francisco', 'CA', '94105', 'headquarters', null, null, null),
  ('planet-express-hq', 'planet-express', '1 Planet Express Plaza', 'New New York', 'NY', '10001', 'headquarters', null, null, null)
;

insert into public.company_addresses (id, street, city, state, zip, company_id, type, street_2, phone, location)
select
  a.id, a.street, a.city, a.state, a.zip, c.id, a.address_type::public.address_type, a.street_2, a.phone,
  case when a.location is null then null else a.location::gis.geography end
from jobvana_fixture_company_addresses a
join jobvana_fixture_companies c on c.fixture_key = a.company_key
order by a.id;

insert into public.company_tech_stacks (company_id, skill_version_id)
select c.id, sv.id
from (values
  ('jobvana', 'node-js', 'v24'),
  ('jobvana', 'javascript', 'es2025')
) as f(company_key, skill_code, version_code)
join jobvana_fixture_companies c on c.fixture_key = f.company_key
join public.skills sk on sk.code = f.skill_code
join public.skill_versions sv on sv.skill_id = sk.id and sv.code = f.version_code;

create temporary table jobvana_fixture_jobs (
  fixture_key text primary key,
  id bigint not null unique default nextval(pg_get_serial_sequence('public.jobs', 'id')),
  created_at timestamptz not null,
  company_key text not null,
  title text not null,
  job_status text not null,
  description text,
  salary_low bigint not null,
  salary_high bigint not null,
  updated_at timestamptz not null,
  job_type text not null,
  salary_type text not null,
  company_address_key text
) on commit drop;

insert into jobvana_fixture_jobs (fixture_key, created_at, company_key, title, job_status, description, salary_low, salary_high, updated_at, job_type, salary_type, company_address_key)
values
  ('jobvana-full-stack-software-engineer', '2026-09-02T12:00:00Z', 'jobvana', 'Full Stack Software Engineer', 'open', 'Build and maintain the Jobvana application.', 120000, 170000, '2026-09-02T12:00:00Z', 'full_time', 'annual', 'jobvana-hq'),
  ('jobvana-database-developer', '2026-09-02T12:00:00Z', 'jobvana', 'Database Developer', 'draft', 'Develop and optimize relational database features.', 110000, 150000, '2026-09-02T12:00:00Z', 'full_time', 'annual', 'jobvana-hq'),
  ('planet-express-delivery-boy', '2026-09-02T12:00:00Z', 'planet-express', 'Delivery Boy', 'open', 'Deliver packages safely and eventually.', 20, 25, '2026-09-02T12:00:00Z', 'full_time', 'hourly', 'planet-express-hq'),
  ('planet-express-systems-programmer', '2026-09-02T12:00:00Z', 'planet-express', 'Systems Programmer', 'open', 'Maintain the software that keeps Planet Express systems running.', 105000, 145000, '2026-09-02T12:00:00Z', 'full_time', 'annual', 'planet-express-hq')
;

insert into public.jobs (id, created_at, company_id, title, status, description, salary_low, salary_high, updated_at, type, salary_type, company_address_id)
select
  j.id, j.created_at, c.id, j.title, j.job_status::public.job_status, j.description, j.salary_low, j.salary_high, j.updated_at,
  j.job_type::public.job_type, j.salary_type::public.job_salary_type, a.id
from jobvana_fixture_jobs j
join jobvana_fixture_companies c on c.fixture_key = j.company_key
left join jobvana_fixture_company_addresses a on a.fixture_key = j.company_address_key
order by j.id;

insert into public.job_roles (job_id, role_id, percent, role_level)
select j.id, r.id, f.percent, f.role_level
from (values
  ('jobvana-full-stack-software-engineer', 'software-engineer', 100, 3),
  ('jobvana-database-developer', 'database-developer', 100, 2),
  ('planet-express-delivery-boy', 'delivery-boy', 100, 1),
  ('planet-express-systems-programmer', 'systems-programmer', 100, 3)
) as f(job_key, role_code, percent, role_level)
join jobvana_fixture_jobs j on j.fixture_key = f.job_key
join public.roles r on r.code = f.role_code;

insert into public.job_skills (job_id, skill_id)
select j.id, sk.id
from (values
  ('jobvana-full-stack-software-engineer', 'node-js'),
  ('jobvana-full-stack-software-engineer', 'javascript'),
  ('jobvana-database-developer', 'microsoft-sql-server')
) as f(job_key, skill_code)
join jobvana_fixture_jobs j on j.fixture_key = f.job_key
join public.skills sk on sk.code = f.skill_code;

insert into public.job_skill_versions (job_id, skill_version_id)
select j.id, sv.id
from (values
  ('jobvana-full-stack-software-engineer', 'node-js', 'v24'),
  ('jobvana-full-stack-software-engineer', 'javascript', 'es2025'),
  ('jobvana-database-developer', 'microsoft-sql-server', 'sql-server-2022')
) as f(job_key, skill_code, version_code)
join jobvana_fixture_jobs j on j.fixture_key = f.job_key
join public.skills sk on sk.code = f.skill_code
join public.skill_versions sv on sv.skill_id = sk.id and sv.code = f.version_code;

create temporary table jobvana_fixture_job_seekers (
  fixture_key text primary key,
  id bigint not null unique default nextval(pg_get_serial_sequence('public.job_seekers', 'id')),
  created_at timestamptz not null,
  auth_user_key text not null,
  first_name text not null,
  last_name text not null,
  active_resume_id uuid
) on commit drop;

insert into jobvana_fixture_job_seekers (fixture_key, created_at, auth_user_key, first_name, last_name, active_resume_id)
values
  ('job-seeker-philip-fry', '2026-09-03T12:00:00Z', 'philip-fry-job-seeker', 'Philip', 'Fry', null),
  ('job-seeker-turanga-leela', '2026-09-03T12:00:00Z', 'turanga-leela-job-seeker', 'Turanga', 'Leela', null)
;

insert into public.job_seekers (id, created_at, user_id, first_name, last_name, active_resume_id)
select s.id, s.created_at, u.id, s.first_name, s.last_name, s.active_resume_id
from jobvana_fixture_job_seekers s
join jobvana_fixture_auth_users u on u.fixture_key = s.auth_user_key
order by s.id;

end;
$jobvana_fixture_data$;

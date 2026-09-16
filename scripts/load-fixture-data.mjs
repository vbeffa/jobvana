#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'supabase/seed.sql');
const fixturePaths = {
  authUsers: resolve(root, 'fixture-data/auth-users.json'),
  companies: resolve(root, 'fixture-data/companies.json'),
  jobs: resolve(root, 'fixture-data/jobs.json'),
  jobSeekers: resolve(root, 'fixture-data/job-seekers.json')
};
const referencePaths = {
  industries: resolve(root, 'reference-data/industries.json'),
  roles: resolve(root, 'reference-data/roles.json'),
  skills: resolve(root, 'reference-data/skills.json')
};

const FIXTURE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ADDRESS_TYPES = new Set(['headquarters', 'office']);
const JOB_STATUSES = new Set(['open', 'filled', 'closed', 'draft']);
const JOB_TYPES = new Set(['full_time', 'part_time', 'contract', 'internship']);
const SALARY_TYPES = new Set(['annual', 'hourly']);
const USER_TYPES = new Set(['company', 'job_seeker']);

function fail(message){throw new Error(message);}

function isPlainObject(value){return value!==null&&typeof value==="object"&&!Array.isArray(value);}

function assertObject(value,context){if(!isPlainObject(value))fail(`${context} must be an object`);}

function assertArray(value,context){if(!Array.isArray(value))fail(`${context} must be an array`);}

function assertAllowedKeys(value,allowed,context){const extras=Object.keys(value).filter(k=>!allowed.includes(k));if(extras.length)fail(`${context} has unknown field(s): ${extras.join(", ")}`);}

function assertRequiredKeys(value,required,context){const missing=required.filter(k=>!(k in value));if(missing.length)fail(`${context} is missing field(s): ${missing.join(", ")}`);}

function assertString(value,context,{nullable=false,nonempty=false}={}){if(nullable&&value===null)return;if(typeof value!=="string")fail(`${context} must be ${nullable?"a string or null":"a string"}`);if(nonempty&&value.length===0)fail(`${context} must not be empty`);}

function assertInteger(value,context,{min=null}={}){if(!Number.isSafeInteger(value))fail(`${context} must be an integer`);if(min!==null&&value<min)fail(`${context} must be >= ${min}`);}

function assertTimestamp(value,context){assertString(value,context,{nonempty:true});if(Number.isNaN(Date.parse(value)))fail(`${context} must be a parseable timestamp`);}

function assertFixtureKey(value,context){assertString(value,context,{nonempty:true});if(!FIXTURE_KEY_PATTERN.test(value))fail(`${context} must match ${FIXTURE_KEY_PATTERN}`);}

function assertUuid(value,context){assertString(value,context,{nonempty:true});if(!UUID_PATTERN.test(value))fail(`${context} must be a UUID`);}

function assertUnique(values,context){const seen=new Set();for(const value of values){if(seen.has(value))fail(`${context} contains duplicate value: ${value}`);seen.add(value);}}

function assertEnum(value,allowed,context){assertString(value,context,{nonempty:true});if(!allowed.has(value))fail(`${context} has unsupported value: ${value}`);}

function relationKey(skillCode,versionCode){return `${skillCode}\u0000${versionCode}`;}

function validateFixtureData(data,reference){
  for(const [name,value] of Object.entries(data))assertArray(value,name);
  const industryCodes=new Set(reference.industries.map(x=>x.code));
  const roleCodes=new Set(reference.roles.map(x=>x.code));
  const skillsByCode=new Map(reference.skills.map(x=>[x.code,x]));
  const versionKeys=new Set();
  for(const skill of reference.skills)for(const version of skill.versions)versionKeys.add(relationKey(skill.code,version.code));

  for(const [index,user] of data.authUsers.entries()){
    const context=`authUsers[${index}]`;
    assertObject(user,context);assertAllowedKeys(user,["key","id","email","type","firstName","lastName"],context);
    assertRequiredKeys(user,["key","id","email","type","firstName","lastName"],context);
    assertFixtureKey(user.key,`${context}.key`);assertUuid(user.id,`${context}.id`);
    assertString(user.email,`${context}.email`,{nonempty:true});assertEnum(user.type,USER_TYPES,`${context}.type`);
    assertString(user.firstName,`${context}.firstName`,{nonempty:true});assertString(user.lastName,`${context}.lastName`,{nonempty:true});
  }
  assertUnique(data.authUsers.map(x=>x.key),"auth user keys");assertUnique(data.authUsers.map(x=>x.id),"auth user IDs");assertUnique(data.authUsers.map(x=>x.email),"auth user emails");
  const usersByKey=new Map(data.authUsers.map(x=>[x.key,x]));

  const addressOwnerByKey=new Map();
  for(const [index,company] of data.companies.entries()){
    const context=`companies[${index}]`;
    assertObject(company,context);assertAllowedKeys(company,["key","createdAt","name","numEmployees","industryCode","description","authUserKey","contactEmail","interviewProcess","addresses","techStackVersions"],context);
    assertRequiredKeys(company,["key","createdAt","name","numEmployees","industryCode","description","authUserKey","contactEmail","interviewProcess","addresses","techStackVersions"],context);
    assertFixtureKey(company.key,`${context}.key`);assertTimestamp(company.createdAt,`${context}.createdAt`);assertString(company.name,`${context}.name`,{nonempty:true});
    assertInteger(company.numEmployees,`${context}.numEmployees`,{min:0});assertString(company.industryCode,`${context}.industryCode`,{nonempty:true});
    if(!industryCodes.has(company.industryCode))fail(`${context}.industryCode references missing industry ${company.industryCode}`);
    assertString(company.description,`${context}.description`);
    if(company.authUserKey!==null){
      assertFixtureKey(company.authUserKey,`${context}.authUserKey`);
      const user=usersByKey.get(company.authUserKey);if(!user)fail(`${context}.authUserKey references missing auth user ${company.authUserKey}`);
      if(user.type!=="company")fail(`${context}.authUserKey must reference a company auth user`);
    }
    assertString(company.contactEmail,`${context}.contactEmail`,{nullable:true});
    if(company.interviewProcess!==null&&!isPlainObject(company.interviewProcess))fail(`${context}.interviewProcess must be an object or null`);
    assertArray(company.addresses,`${context}.addresses`);
    for(const [addressIndex,address] of company.addresses.entries()){
      const ac=`${context}.addresses[${addressIndex}]`;
      assertObject(address,ac);assertAllowedKeys(address,["key","street","city","state","zip","type","street2","phone","location"],ac);
      assertRequiredKeys(address,["key","street","city","state","zip","type","street2","phone","location"],ac);
      assertFixtureKey(address.key,`${ac}.key`);assertString(address.street,`${ac}.street`,{nonempty:true});assertString(address.city,`${ac}.city`,{nonempty:true});
      assertString(address.state,`${ac}.state`,{nonempty:true});assertString(address.zip,`${ac}.zip`,{nonempty:true});assertEnum(address.type,ADDRESS_TYPES,`${ac}.type`);
      assertString(address.street2,`${ac}.street2`,{nullable:true});assertString(address.phone,`${ac}.phone`,{nullable:true});assertString(address.location,`${ac}.location`,{nullable:true});
      if(addressOwnerByKey.has(address.key))fail(`address keys contains duplicate value: ${address.key}`);
      addressOwnerByKey.set(address.key,company.key);
    }
    assertArray(company.techStackVersions,`${context}.techStackVersions`);const techKeys=[];
    for(const [techIndex,version] of company.techStackVersions.entries()){
      const tc=`${context}.techStackVersions[${techIndex}]`;
      assertObject(version,tc);assertAllowedKeys(version,["skillCode","versionCode"],tc);assertRequiredKeys(version,["skillCode","versionCode"],tc);
      assertString(version.skillCode,`${tc}.skillCode`,{nonempty:true});assertString(version.versionCode,`${tc}.versionCode`,{nonempty:true});
      const key=relationKey(version.skillCode,version.versionCode);if(!versionKeys.has(key))fail(`${tc} references missing skill version ${version.skillCode}/${version.versionCode}`);techKeys.push(key);
    }
    assertUnique(techKeys,`${context}.techStackVersions`);
  }
  assertUnique(data.companies.map(x=>x.key),"company keys");const companiesByKey=new Map(data.companies.map(x=>[x.key,x]));

  for(const [index,job] of data.jobs.entries()){
    const context=`jobs[${index}]`;
    assertObject(job,context);assertAllowedKeys(job,["key","createdAt","companyKey","title","status","description","salaryLow","salaryHigh","updatedAt","type","salaryType","companyAddressKey","roles","skills","skillVersions"],context);
    assertRequiredKeys(job,["key","createdAt","companyKey","title","status","description","salaryLow","salaryHigh","updatedAt","type","salaryType","companyAddressKey","roles","skills","skillVersions"],context);
    assertFixtureKey(job.key,`${context}.key`);assertTimestamp(job.createdAt,`${context}.createdAt`);assertFixtureKey(job.companyKey,`${context}.companyKey`);
    if(!companiesByKey.has(job.companyKey))fail(`${context}.companyKey references missing company ${job.companyKey}`);
    assertString(job.title,`${context}.title`,{nonempty:true});assertEnum(job.status,JOB_STATUSES,`${context}.status`);assertString(job.description,`${context}.description`,{nullable:true});
    assertInteger(job.salaryLow,`${context}.salaryLow`,{min:0});assertInteger(job.salaryHigh,`${context}.salaryHigh`,{min:0});if(job.salaryLow>job.salaryHigh)fail(`${context}.salaryLow must not exceed salaryHigh`);
    assertTimestamp(job.updatedAt,`${context}.updatedAt`);assertEnum(job.type,JOB_TYPES,`${context}.type`);assertEnum(job.salaryType,SALARY_TYPES,`${context}.salaryType`);
    if(job.companyAddressKey!==null){
      assertFixtureKey(job.companyAddressKey,`${context}.companyAddressKey`);const owner=addressOwnerByKey.get(job.companyAddressKey);
      if(!owner)fail(`${context}.companyAddressKey references missing address ${job.companyAddressKey}`);if(owner!==job.companyKey)fail(`${context}.companyAddressKey belongs to ${owner}, not ${job.companyKey}`);
    }
    assertArray(job.roles,`${context}.roles`);const roleRefs=[];
    for(const [roleIndex,role] of job.roles.entries()){
      const rc=`${context}.roles[${roleIndex}]`;assertObject(role,rc);assertAllowedKeys(role,["roleCode","percent","roleLevel"],rc);assertRequiredKeys(role,["roleCode","percent","roleLevel"],rc);
      assertString(role.roleCode,`${rc}.roleCode`,{nonempty:true});if(!roleCodes.has(role.roleCode))fail(`${rc}.roleCode references missing role ${role.roleCode}`);
      assertInteger(role.percent,`${rc}.percent`,{min:0});assertInteger(role.roleLevel,`${rc}.roleLevel`,{min:0});roleRefs.push(role.roleCode);
    }
    assertUnique(roleRefs,`${context}.roles`);
    assertArray(job.skills,`${context}.skills`);for(const [skillIndex,skillCode] of job.skills.entries()){assertString(skillCode,`${context}.skills[${skillIndex}]`,{nonempty:true});if(!skillsByCode.has(skillCode))fail(`${context}.skills[${skillIndex}] references missing skill ${skillCode}`);}assertUnique(job.skills,`${context}.skills`);
    assertArray(job.skillVersions,`${context}.skillVersions`);const jobVersionKeys=[];
    for(const [versionIndex,version] of job.skillVersions.entries()){
      const vc=`${context}.skillVersions[${versionIndex}]`;assertObject(version,vc);assertAllowedKeys(version,["skillCode","versionCode"],vc);assertRequiredKeys(version,["skillCode","versionCode"],vc);
      assertString(version.skillCode,`${vc}.skillCode`,{nonempty:true});assertString(version.versionCode,`${vc}.versionCode`,{nonempty:true});
      const key=relationKey(version.skillCode,version.versionCode);if(!versionKeys.has(key))fail(`${vc} references missing skill version ${version.skillCode}/${version.versionCode}`);jobVersionKeys.push(key);
    }
    assertUnique(jobVersionKeys,`${context}.skillVersions`);
  }
  assertUnique(data.jobs.map(x=>x.key),"job keys");

  for(const [index,seeker] of data.jobSeekers.entries()){
    const context=`jobSeekers[${index}]`;assertObject(seeker,context);assertAllowedKeys(seeker,["key","createdAt","authUserKey","firstName","lastName","activeResumeId"],context);
    assertRequiredKeys(seeker,["key","createdAt","authUserKey","firstName","lastName","activeResumeId"],context);assertFixtureKey(seeker.key,`${context}.key`);assertTimestamp(seeker.createdAt,`${context}.createdAt`);
    assertFixtureKey(seeker.authUserKey,`${context}.authUserKey`);const user=usersByKey.get(seeker.authUserKey);if(!user)fail(`${context}.authUserKey references missing auth user ${seeker.authUserKey}`);if(user.type!=="job_seeker")fail(`${context}.authUserKey must reference a job_seeker auth user`);
    assertString(seeker.firstName,`${context}.firstName`,{nonempty:true});assertString(seeker.lastName,`${context}.lastName`,{nonempty:true});if(seeker.activeResumeId!==null)fail(`${context}.activeResumeId must be null until resume fixtures are modeled`);
  }
  assertUnique(data.jobSeekers.map(x=>x.key),"job seeker keys");assertUnique(data.jobSeekers.map(x=>x.authUserKey),"job seeker auth user references");
}

function sqlLiteral(value){if(value===null||value===undefined)return "null";if(typeof value==="number")return String(value);if(typeof value==="boolean")return value?"true":"false";return `'${String(value).replaceAll("'","''")}'`;}

function sqlJson(value){return value===null?"null":`${sqlLiteral(JSON.stringify(value))}::jsonb`;}

function sqlValues(rows,indent="  "){return rows.map(row=>`${indent}(${row.join(", ")})`).join(",\n");}

function generateSql(data){
  const addresses=data.companies.flatMap(company=>company.addresses.map(address=>({companyKey:company.key,...address})));
  const companyVersions=data.companies.flatMap(company=>company.techStackVersions.map(version=>({companyKey:company.key,...version})));
  const jobRoles=data.jobs.flatMap(job=>job.roles.map(role=>({jobKey:job.key,...role})));
  const jobSkills=data.jobs.flatMap(job=>job.skills.map(skillCode=>({jobKey:job.key,skillCode})));
  const jobVersions=data.jobs.flatMap(job=>job.skillVersions.map(version=>({jobKey:job.key,...version})));
  const s=["-- GENERATED FILE. DO NOT EDIT.","-- Source: fixture-data/*.json","-- Regenerate with: npm run fixture-data:write","","grant usage on schema public to postgres, authenticated, service_role;","","grant all privileges on all tables in schema public to postgres, authenticated, service_role;","grant all privileges on all functions in schema public to postgres, authenticated, service_role;","grant all privileges on all sequences in schema public to postgres, authenticated, service_role;","","alter default privileges in schema public grant all on tables to postgres, authenticated, service_role;","alter default privileges in schema public grant all on functions to postgres, authenticated, service_role;","alter default privileges in schema public grant all on sequences to postgres, authenticated, service_role;","","do $jobvana_fixture_data$","begin","","create temporary table jobvana_fixture_auth_users (","  fixture_key text primary key,","  id uuid not null unique",") on commit drop;","","insert into jobvana_fixture_auth_users (fixture_key, id)","values",sqlValues(data.authUsers.map(u=>[sqlLiteral(u.key),sqlLiteral(u.id)])),";","","insert into auth.users (","  instance_id,","  id,","  aud,","  role,","  email,","  encrypted_password,","  email_confirmed_at,","  recovery_sent_at,","  last_sign_in_at,","  raw_app_meta_data,","  raw_user_meta_data,","  created_at,","  updated_at,","  confirmation_token,","  email_change,","  email_change_token_new,","  recovery_token",")","values",sqlValues(data.authUsers.map(u=>[sqlLiteral("00000000-0000-0000-0000-000000000000"),sqlLiteral(u.id),sqlLiteral("authenticated"),sqlLiteral("authenticated"),sqlLiteral(u.email),"null","current_timestamp","null","null",sqlJson({provider:"email",providers:["email"]}),sqlJson({sub:u.id,type:u.type,email:u.email,last_name:u.lastName,first_name:u.firstName,email_verified:true,phone_verified:false}),"current_timestamp","current_timestamp",sqlLiteral(""),sqlLiteral(""),sqlLiteral(""),sqlLiteral("")])),";","","insert into auth.identities (","  id,","  user_id,","  provider_id,","  identity_data,","  provider,","  last_sign_in_at,","  created_at,","  updated_at",")","select","  extensions.uuid_generate_v4(),","  u.id,","  u.id,","  format('{\"sub\":\"%s\",\"email\":\"%s\"}', u.id::text, u.email)::jsonb,","  'email',","  current_timestamp,","  current_timestamp,","  current_timestamp","from auth.users u","join jobvana_fixture_auth_users f on f.id = u.id;","","create temporary table jobvana_fixture_companies (","  fixture_key text primary key,","  id bigint not null unique default nextval(pg_get_serial_sequence('public.companies', 'id')),","  created_at timestamptz not null,","  name text not null,","  num_employees integer not null,","  industry_code text not null,","  description text not null,","  auth_user_key text,","  contact_email text,","  interview_process jsonb",") on commit drop;","","insert into jobvana_fixture_companies (fixture_key, created_at, name, num_employees, industry_code, description, auth_user_key, contact_email, interview_process)","values",sqlValues(data.companies.map(c=>[sqlLiteral(c.key),sqlLiteral(c.createdAt),sqlLiteral(c.name),sqlLiteral(c.numEmployees),sqlLiteral(c.industryCode),sqlLiteral(c.description),sqlLiteral(c.authUserKey),sqlLiteral(c.contactEmail),sqlJson(c.interviewProcess)])),";","","insert into public.companies (id, created_at, name, num_employees, industry_id, description, user_id, contact_email, interview_process)","select","  c.id, c.created_at, c.name, c.num_employees, i.id, c.description, u.id, c.contact_email, c.interview_process","from jobvana_fixture_companies c","join public.industries i on i.code = c.industry_code","left join jobvana_fixture_auth_users u on u.fixture_key = c.auth_user_key","order by c.id;","","create temporary table jobvana_fixture_company_addresses (","  fixture_key text primary key,","  id bigint not null unique default nextval(pg_get_serial_sequence('public.company_addresses', 'id')),","  company_key text not null,","  street text not null,","  city text not null,","  state text not null,","  zip text not null,","  address_type text not null,","  street_2 text,","  phone text,","  location text",") on commit drop;","","insert into jobvana_fixture_company_addresses (fixture_key, company_key, street, city, state, zip, address_type, street_2, phone, location)","values",sqlValues(addresses.map(a=>[sqlLiteral(a.key),sqlLiteral(a.companyKey),sqlLiteral(a.street),sqlLiteral(a.city),sqlLiteral(a.state),sqlLiteral(a.zip),sqlLiteral(a.type),sqlLiteral(a.street2),sqlLiteral(a.phone),sqlLiteral(a.location)])),";","","insert into public.company_addresses (id, street, city, state, zip, company_id, type, street_2, phone, location)","select","  a.id, a.street, a.city, a.state, a.zip, c.id, a.address_type::public.address_type, a.street_2, a.phone,","  case when a.location is null then null else a.location::gis.geography end","from jobvana_fixture_company_addresses a","join jobvana_fixture_companies c on c.fixture_key = a.company_key","order by a.id;",""];
  if(companyVersions.length)s.push("insert into public.company_tech_stacks (company_id, skill_version_id)","select c.id, sv.id","from (values",sqlValues(companyVersions.map(x=>[sqlLiteral(x.companyKey),sqlLiteral(x.skillCode),sqlLiteral(x.versionCode)])),") as f(company_key, skill_code, version_code)","join jobvana_fixture_companies c on c.fixture_key = f.company_key","join public.skills sk on sk.code = f.skill_code","join public.skill_versions sv on sv.skill_id = sk.id and sv.code = f.version_code;","");
  s.push("create temporary table jobvana_fixture_jobs (","  fixture_key text primary key,","  id bigint not null unique default nextval(pg_get_serial_sequence('public.jobs', 'id')),","  created_at timestamptz not null,","  company_key text not null,","  title text not null,","  job_status text not null,","  description text,","  salary_low bigint not null,","  salary_high bigint not null,","  updated_at timestamptz not null,","  job_type text not null,","  salary_type text not null,","  company_address_key text",") on commit drop;","","insert into jobvana_fixture_jobs (fixture_key, created_at, company_key, title, job_status, description, salary_low, salary_high, updated_at, job_type, salary_type, company_address_key)","values",sqlValues(data.jobs.map(j=>[sqlLiteral(j.key),sqlLiteral(j.createdAt),sqlLiteral(j.companyKey),sqlLiteral(j.title),sqlLiteral(j.status),sqlLiteral(j.description),sqlLiteral(j.salaryLow),sqlLiteral(j.salaryHigh),sqlLiteral(j.updatedAt),sqlLiteral(j.type),sqlLiteral(j.salaryType),sqlLiteral(j.companyAddressKey)])),";","","insert into public.jobs (id, created_at, company_id, title, status, description, salary_low, salary_high, updated_at, type, salary_type, company_address_id)","select","  j.id, j.created_at, c.id, j.title, j.job_status::public.job_status, j.description, j.salary_low, j.salary_high, j.updated_at,","  j.job_type::public.job_type, j.salary_type::public.job_salary_type, a.id","from jobvana_fixture_jobs j","join jobvana_fixture_companies c on c.fixture_key = j.company_key","left join jobvana_fixture_company_addresses a on a.fixture_key = j.company_address_key","order by j.id;","");
  if(jobRoles.length)s.push("insert into public.job_roles (job_id, role_id, percent, role_level)","select j.id, r.id, f.percent, f.role_level","from (values",sqlValues(jobRoles.map(x=>[sqlLiteral(x.jobKey),sqlLiteral(x.roleCode),sqlLiteral(x.percent),sqlLiteral(x.roleLevel)])),") as f(job_key, role_code, percent, role_level)","join jobvana_fixture_jobs j on j.fixture_key = f.job_key","join public.roles r on r.code = f.role_code;","");
  if(jobSkills.length)s.push("insert into public.job_skills (job_id, skill_id)","select j.id, sk.id","from (values",sqlValues(jobSkills.map(x=>[sqlLiteral(x.jobKey),sqlLiteral(x.skillCode)])),") as f(job_key, skill_code)","join jobvana_fixture_jobs j on j.fixture_key = f.job_key","join public.skills sk on sk.code = f.skill_code;","");
  if(jobVersions.length)s.push("insert into public.job_skill_versions (job_id, skill_version_id)","select j.id, sv.id","from (values",sqlValues(jobVersions.map(x=>[sqlLiteral(x.jobKey),sqlLiteral(x.skillCode),sqlLiteral(x.versionCode)])),") as f(job_key, skill_code, version_code)","join jobvana_fixture_jobs j on j.fixture_key = f.job_key","join public.skills sk on sk.code = f.skill_code","join public.skill_versions sv on sv.skill_id = sk.id and sv.code = f.version_code;","");
  s.push("create temporary table jobvana_fixture_job_seekers (","  fixture_key text primary key,","  id bigint not null unique default nextval(pg_get_serial_sequence('public.job_seekers', 'id')),","  created_at timestamptz not null,","  auth_user_key text not null,","  first_name text not null,","  last_name text not null,","  active_resume_id uuid",") on commit drop;","","insert into jobvana_fixture_job_seekers (fixture_key, created_at, auth_user_key, first_name, last_name, active_resume_id)","values",sqlValues(data.jobSeekers.map(x=>[sqlLiteral(x.key),sqlLiteral(x.createdAt),sqlLiteral(x.authUserKey),sqlLiteral(x.firstName),sqlLiteral(x.lastName),sqlLiteral(x.activeResumeId)])),";","","insert into public.job_seekers (id, created_at, user_id, first_name, last_name, active_resume_id)","select s.id, s.created_at, u.id, s.first_name, s.last_name, s.active_resume_id","from jobvana_fixture_job_seekers s","join jobvana_fixture_auth_users u on u.fixture_key = s.auth_user_key","order by s.id;","","end;","$jobvana_fixture_data$;","");
  return s.join("\n");
}

function fixtureCounts(data){return {authUsers:data.authUsers.length,companies:data.companies.length,addresses:data.companies.reduce((n,c)=>n+c.addresses.length,0),companyTechStackVersions:data.companies.reduce((n,c)=>n+c.techStackVersions.length,0),jobs:data.jobs.length,jobRoles:data.jobs.reduce((n,j)=>n+j.roles.length,0),jobSkills:data.jobs.reduce((n,j)=>n+j.skills.length,0),jobSkillVersions:data.jobs.reduce((n,j)=>n+j.skillVersions.length,0),jobSeekers:data.jobSeekers.length};}

async function loadJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadData(paths) {
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, path]) => [key, await loadJson(path)])
  );
  return Object.fromEntries(entries);
}

async function assertGeneratedSqlCurrent(generatedSql) {
  let current;
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    fail('generated fixture SQL is missing; run npm run fixture-data:write');
  }
  if (current !== generatedSql) fail('generated fixture SQL is stale; run npm run fixture-data:write');
}

async function main() {
  const mode = process.argv[2] ?? '--check';
  if (!['--check', '--write'].includes(mode) || process.argv.length > 3) {
    fail('usage: node scripts/load-fixture-data.mjs [--check|--write]');
  }

  const data = await loadData(fixturePaths);
  const reference = await loadData(referencePaths);
  validateFixtureData(data, reference);
  const generatedSql = generateSql(data);

  if (mode === '--write') {
    await writeFile(outputPath, generatedSql, 'utf8');
    console.log(`Wrote ${outputPath}`);
  } else {
    await assertGeneratedSqlCurrent(generatedSql);
  }

  const counts = fixtureCounts(data);
  console.log(
    `Fixture data valid: ${counts.authUsers} auth users, ${counts.companies} companies, ${counts.addresses} addresses, ` +
    `${counts.companyTechStackVersions} company tech-stack versions, ${counts.jobs} jobs, ${counts.jobRoles} job roles, ` +
    `${counts.jobSkills} job skills, ${counts.jobSkillVersions} job skill versions, ${counts.jobSeekers} job seekers.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

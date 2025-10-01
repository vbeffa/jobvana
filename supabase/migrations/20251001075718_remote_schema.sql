alter table "public"."interview_rounds" alter column "round" set data type integer using "round"::integer;

alter table "public"."job_roles" alter column "percent" set data type integer using "percent"::integer;

alter table "public"."job_roles" alter column "role_level" drop default;

alter table "public"."job_roles" alter column "role_level" set data type integer using "role_level"::integer;

alter table "public"."interview_rounds" add constraint "interview_rounds_round_check" CHECK (((round >= 1) AND (round <= 5))) not valid;

alter table "public"."interview_rounds" validate constraint "interview_rounds_round_check";

alter table "public"."job_roles" add constraint "job_roles_percent_check" CHECK (((percent >= 1) AND (percent <= 100))) not valid;

alter table "public"."job_roles" validate constraint "job_roles_percent_check";

alter table "public"."job_roles" add constraint "job_roles_role_level_check" CHECK (((role_level >= 0) AND (role_level <= 4))) not valid;

alter table "public"."job_roles" validate constraint "job_roles_role_level_check";




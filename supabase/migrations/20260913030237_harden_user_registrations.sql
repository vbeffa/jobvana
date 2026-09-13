create schema if not exists private;

create or replace function private.handle_new_jobvana_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_type text := new.raw_user_meta_data ->> 'type';
begin
  if requested_type is null
     or requested_type not in ('company', 'job_seeker') then
    raise exception 'Invalid or missing Jobvana user type';
  end if;

  insert into public.user_registrations (user_id, user_type)
  values (new.id, requested_type::public.user_type);

  return new;
end;
$$;

revoke all on function private.handle_new_jobvana_user() from public;
revoke all on function private.handle_new_jobvana_user() from anon;
revoke all on function private.handle_new_jobvana_user() from authenticated;

drop trigger if exists on_auth_user_created_jobvana_registration
on auth.users;

create trigger on_auth_user_created_jobvana_registration
after insert on auth.users
for each row
execute function private.handle_new_jobvana_user();

drop policy if exists "New users can register"
on public.user_registrations;

revoke all on table public.user_registrations from anon;
revoke all on table public.user_registrations from authenticated;
grant select on table public.user_registrations to authenticated;

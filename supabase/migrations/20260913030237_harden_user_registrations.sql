drop policy if exists "New users can register"
on public.user_registrations;

create policy "New users can register"
on public.user_registrations
as permissive
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

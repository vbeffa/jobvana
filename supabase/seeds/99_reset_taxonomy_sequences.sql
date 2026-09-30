select
    setval(
        pg_get_serial_sequence('public.industries', 'id'),
        coalesce(max(id), 1),
        max(id) is not null
    )
from public.industries;

select
    setval(
        pg_get_serial_sequence('public.roles', 'id'),
        coalesce(max(id), 1),
        max(id) is not null
    )
from public.roles;

select
    setval(
        pg_get_serial_sequence('public.skill_categories', 'id'),
        coalesce(max(id), 1),
        max(id) is not null
    )
from public.skill_categories;

select
    setval(
        pg_get_serial_sequence('public.skills', 'id'),
        coalesce(max(id), 1),
        max(id) is not null
    )
from public.skills;

select
    setval(
        pg_get_serial_sequence('public.skill_versions', 'id'),
        coalesce(max(id), 1),
        max(id) is not null
    )
from public.skill_versions;

-- Synthetic demo and bulk fixture seeds grant broad table privileges when loaded explicitly.
-- Restore least-privilege access for the taxonomy membership table. Explicit fixture
-- workflows re-run this file after loading their fixture SQL.
revoke all on table public.skill_category_memberships
from anon, authenticated, service_role;

grant select on table public.skill_category_memberships to authenticated;
grant all on table public.skill_category_memberships to service_role;

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

-- The legacy seed.sql grants broad table privileges after migrations run.
-- Restore least-privilege access for the taxonomy membership table.
revoke all on table public.skill_category_memberships
from anon, authenticated, service_role;

grant select on table public.skill_category_memberships to authenticated;
grant all on table public.skill_category_memberships to service_role;

-- Issue #45 is a fixture representation change, not an Auth behavior change.
-- Keep the legacy shared fixture password working until #11/#46 explicitly
-- remove or isolate these predictable test identities.
update auth.users
set
    encrypted_password = extensions.crypt(
        'abc123',
        extensions.gen_salt('bf')
    )
where id in (
    'e7345065-0baf-42cc-bbc1-5e663b063bfe',
    '83612c89-7bf4-4553-82ad-c71b6c81a7ca',
    '1bc4ac48-c561-4f6a-bcad-8f5fb5de5f69',
    '3bde49b1-5277-4da7-8851-f322ec1858b3',
    '8ee9ca9b-6b1a-4b85-930e-6ff6c7e8fc9a'
);

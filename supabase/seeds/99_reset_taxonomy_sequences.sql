select setval(
  pg_get_serial_sequence('public.industries', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.industries;

select setval(
  pg_get_serial_sequence('public.roles', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.roles;

select setval(
  pg_get_serial_sequence('public.skill_categories', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skill_categories;

select setval(
  pg_get_serial_sequence('public.skills', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skills;

select setval(
  pg_get_serial_sequence('public.skill_versions', 'id'),
  coalesce(max(id), 1),
  max(id) is not null
)
from public.skill_versions;

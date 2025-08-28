import { createFileRoute } from '@tanstack/react-router';
import SkillVersion from '../skills/SkillVersion';

export const Route = createFileRoute(
  '/jobvana/skill_categories/$id/skills/$skill_id/skill_versions/$skill_version_id'
)({
  loader: ({ params: { id, skill_version_id } }) => ({
    id: parseInt(id),
    skillVersionId: parseInt(skill_version_id)
  }),
  component: SkillVersion
});

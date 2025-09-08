import { createFileRoute } from '@tanstack/react-router';
import SkillVersionRoute from '../skills/SkillVersionRoute';

export const Route = createFileRoute(
  '/jobvana/skill_categories/$id/skills/$skill_id/skill_versions/$skill_version_id'
)({
  loader: ({ params: { id, skill_id, skill_version_id } }) => ({
    id: parseInt(id),
    skillId: parseInt(skill_id),
    skillVersionId: parseInt(skill_version_id)
  }),
  component: SkillVersionRoute
});

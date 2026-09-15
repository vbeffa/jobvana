import { createFileRoute } from '@tanstack/react-router';
import SkillRoute from '../skills/SkillRoute';

export const Route = createFileRoute('/jobvana/skills/$skill_id/')({
  loader: ({ params: { skill_id } }) => ({
    skillId: parseInt(skill_id)
  }),
  component: SkillRoute
});

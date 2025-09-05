import { createFileRoute } from '@tanstack/react-router';
import SkillCategoryRoute from '../skills/SkillCategoryRoute';

export const Route = createFileRoute('/jobvana/skill_categories/$id/')({
  loader: ({ params: { id } }) => ({
    skillCategoryId: parseInt(id)
  }),
  component: SkillCategoryRoute
});

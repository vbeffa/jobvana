import { createFileRoute } from '@tanstack/react-router';
import SkillCategory from '../skills/SkillCategory';

export const Route = createFileRoute('/jobvana/skill_categories/$id/')({
  loader: ({ params: { id } }) => ({
    skillCategoryId: parseInt(id)
  }),
  component: SkillCategory
});

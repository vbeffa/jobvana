import { createFileRoute } from '@tanstack/react-router';
import SkillCategories from '../skill_categories/SkillCategories';

export const Route = createFileRoute('/jobvana/skill_categories/')({
  component: SkillCategories
});

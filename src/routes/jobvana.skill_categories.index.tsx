import { createFileRoute } from '@tanstack/react-router';
import SkillCategories from '../skills/SkillCategories';

export const Route = createFileRoute('/jobvana/skill_categories/')({
  component: SkillCategories
});

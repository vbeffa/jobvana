import { createFileRoute } from '@tanstack/react-router';
import SkillsV2 from '../skills/SkillsV2';

export const Route = createFileRoute('/jobvana/skills_v2/')({
  component: SkillsV2
});

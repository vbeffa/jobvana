import { createFileRoute } from '@tanstack/react-router';
import Skills from '../skills/Skills';

export const Route = createFileRoute('/jobvana/skills/')({
  component: Skills
});

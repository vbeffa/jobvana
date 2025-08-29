import { createFileRoute } from '@tanstack/react-router';
import Roles from '../roles/Roles';

export const Route = createFileRoute('/jobvana/roles/')({
  component: Roles
});

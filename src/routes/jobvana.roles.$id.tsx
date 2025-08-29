import { createFileRoute } from '@tanstack/react-router';
import Role from '../roles/Role';

export const Route = createFileRoute('/jobvana/roles/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Role
});

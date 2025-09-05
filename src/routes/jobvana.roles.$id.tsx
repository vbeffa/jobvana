import { createFileRoute } from '@tanstack/react-router';
import RoleRoute from '../roles/RoleRoute';

export const Route = createFileRoute('/jobvana/roles/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: RoleRoute
});

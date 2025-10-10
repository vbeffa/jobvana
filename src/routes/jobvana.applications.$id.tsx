import { createFileRoute } from '@tanstack/react-router';
import ApplicationRoute from '../applications/ApplicationRoute';

export const Route = createFileRoute('/jobvana/applications/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: ApplicationRoute
});

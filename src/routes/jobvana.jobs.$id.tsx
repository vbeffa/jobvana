import { createFileRoute } from '@tanstack/react-router';
import JobRoute from '../jobs/JobRoute';

export const Route = createFileRoute('/jobvana/jobs/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: JobRoute
});

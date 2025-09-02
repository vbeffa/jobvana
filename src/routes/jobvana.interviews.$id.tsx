import { createFileRoute } from '@tanstack/react-router';
import Interview from '../interviews/Interview';

export const Route = createFileRoute('/jobvana/interviews/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Interview
});

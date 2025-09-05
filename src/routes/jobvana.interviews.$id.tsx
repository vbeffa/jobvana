import { createFileRoute } from '@tanstack/react-router';
import InterviewRoute from '../interviews/InterviewRoute';

export const Route = createFileRoute('/jobvana/interviews/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: InterviewRoute
});

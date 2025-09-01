import { createFileRoute } from '@tanstack/react-router';
import Application from '../applications/Application';

export const Route = createFileRoute('/jobvana/applications/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Application
});

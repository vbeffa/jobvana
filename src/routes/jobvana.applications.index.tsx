import { createFileRoute } from '@tanstack/react-router';
import ApplicationsRoute from '../applications/ApplicationsRoute';

export const Route = createFileRoute('/jobvana/applications/')({
  component: ApplicationsRoute
});

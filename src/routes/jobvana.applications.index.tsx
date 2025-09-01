import { createFileRoute } from '@tanstack/react-router';
import Applications from '../applications/applications';

export const Route = createFileRoute('/jobvana/applications/')({
  component: Applications
});

import { createFileRoute } from '@tanstack/react-router';
import Applications from '../applications/Applications';

export const Route = createFileRoute('/jobvana/applications/')({
  component: Applications
});

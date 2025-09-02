import { createFileRoute } from '@tanstack/react-router';
import Interviews from '../interviews/Interviews';

export const Route = createFileRoute('/jobvana/interviews/')({
  component: Interviews
});

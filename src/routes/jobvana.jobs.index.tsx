import { createFileRoute } from '@tanstack/react-router';
import Jobs from '../jobs/Jobs';

export const Route = createFileRoute('/jobvana/jobs/')({
  component: Jobs
});

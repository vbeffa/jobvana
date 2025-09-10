import { createFileRoute } from '@tanstack/react-router';
import Jobs from '../jobs/Jobs';

export type JobSearch = {
  page: number;
  job_id?: number;
  company: string;
  title: string;
  role_id?: number;
  min_salary: number;
  max_salary: number;
  skill_id?: number;
  created?: string;
};

export const Route = createFileRoute('/jobvana/jobs/')({
  validateSearch: (search: JobSearch): JobSearch => {
    return search;
  },

  component: Jobs
});

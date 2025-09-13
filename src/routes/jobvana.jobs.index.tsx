import { createFileRoute } from '@tanstack/react-router';
import Jobs from '../jobs/Jobs';
import type { CreatedRange } from '../jobs/useJobs';

export type JobSearch = {
  page?: number;
  job_id?: number;
  company?: string;
  title?: string;
  role_id?: number;
  min_salary?: number;
  max_salary?: number;
  skill_id?: number;
  created?: CreatedRange;
};

export const Route = createFileRoute('/jobvana/jobs/')({
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    return {
      page: Number(search.page) || 1,
      job_id: Number(search.job_id) || undefined,
      company: search.company as string,
      title: search.title as string,
      role_id: Number(search.role_id) || undefined,
      min_salary: Number(search.min_salary) || 10000,
      max_salary: Number(search.max_salary) || 200000,
      skill_id: Number(search.skill_id) || undefined,
      created: search.created_range as CreatedRange
    };
  },

  component: Jobs
});

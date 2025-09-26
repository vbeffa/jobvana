import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { JobvanaContext } from '../Context';
import MyJobs from '../jobs/company/MyJobs';
import Jobs from '../jobs/Jobs';
import { MAX_SALARY, MIN_SALARY, type CreatedRange } from '../jobs/useJobs';

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

const userType = getUserType();

export const Route = createFileRoute('/jobvana/jobs/')({
  validateSearch: (search: Record<string, unknown>): JobSearch | undefined => {
    return userType === 'job_seeker'
      ? {
          page: Number(search.page) || 1,
          job_id: Number(search.job_id) || undefined,
          company: search.company as string,
          title: search.title as string,
          role_id: Number(search.role_id) || undefined,
          min_salary: Number(search.min_salary) || MIN_SALARY,
          max_salary: Number(search.max_salary) || MAX_SALARY,
          skill_id: Number(search.skill_id) || undefined,
          created: search.created_range as CreatedRange
        }
      : undefined;
  },

  component: Switcher
});

function Switcher() {
  const userType = getUserType();
  const { company } = useContext(JobvanaContext);

  return userType === 'company' ? (
    company && <MyJobs companyId={company.id} />
  ) : (
    <Jobs />
  );
}

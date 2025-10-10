import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { CompanyContext } from '../Context';
import MyJobs from '../jobs/company/MyJobs';
import Jobs from '../jobs/job_seekers/Jobs';
import {
  MAX_SALARY,
  MIN_SALARY,
  type CreatedRange
} from '../jobs/job_seekers/useJobs';
import type { Job } from '../types';

export type JobSearch = {
  page?: number;
  job_id?: number;
  company?: string;
  job_type?: Job['type'];
  title?: string;
  role_id?: number;
  salary_type?: Job['salary_type'];
  min_salary?: number;
  max_salary?: number;
  skill_ids?: string;
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
          job_type: search.job_type as Job['type'],
          title: search.title as string,
          role_id: Number(search.role_id) || undefined,
          salary_type: search.salary_type as Job['salary_type'],
          min_salary: Number(search.min_salary) || MIN_SALARY,
          max_salary: Number(search.max_salary) || MAX_SALARY,
          skill_ids: search.skill_ids as string,
          created: search.created_range as CreatedRange
        }
      : undefined;
  },

  component: Switcher
});

function Switcher() {
  const userType = getUserType();
  const { company } = useContext(CompanyContext);

  return userType === 'company' ? (
    company && <MyJobs company={company} />
  ) : (
    <Jobs />
  );
}

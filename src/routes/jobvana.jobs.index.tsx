import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import {
  MAX_COMPANY_SIZE,
  MIN_COMPANY_SIZE
} from '../companies/job_seeker/useCompanies';
import { CompanyContext } from '../Context';
import MyJobs from '../jobs/company/MyJobs';
import Jobs from '../jobs/job_seekers/Jobs';
import {
  MAX_SALARY,
  MIN_SALARY,
  type CreatedRange
} from '../jobs/job_seekers/useJobs';
import type { JobSalaryType, JobType } from '../types';

export type JobSearch = {
  page?: number;
  job_id?: number;

  company?: string;
  job_type: JobType | 'any';
  title?: string;
  description?: string;
  min_size?: number;
  max_size?: number;
  industry_id?: number;
  role_id?: number;
  salary_type?: JobSalaryType;
  min_salary?: number;
  max_salary?: number;
  skill_ids?: string;
  created?: CreatedRange;
  show_applied?: boolean;
  hide_saved?: boolean;
};

const userType = getUserType();

export const Route = createFileRoute('/jobvana/jobs/')({
  validateSearch: (search: Record<string, unknown>): JobSearch | undefined => {
    return userType === 'job_seeker'
      ? {
          page: Number(search.page) || 1,
          job_id: Number(search.job_id) || undefined,
          company: search.company as string,
          job_type: search.job_type as JobType,
          title: search.title as string,
          description: search.description as string,
          min_size: Number(search.min_size) || MIN_COMPANY_SIZE,
          max_size: Number(search.max_size) || MAX_COMPANY_SIZE,
          industry_id: Number(search.industry_id) || undefined,
          role_id: Number(search.role_id) || undefined,
          salary_type: search.salary_type as JobSalaryType,
          min_salary: Number(search.min_salary) || MIN_SALARY,
          max_salary: Number(search.max_salary) || MAX_SALARY,
          skill_ids: search.skill_ids as string,
          created: search.created_range as CreatedRange,
          show_applied: Boolean(search.show_applied),
          hide_saved: Boolean(search.hide_saved)
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

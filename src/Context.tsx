import { createContext } from 'react';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './companies/useCompanies';
import { MAX_SALARY, MIN_SALARY, type CreatedRange } from './jobs/useJobs';
import type { Company } from './types';

export type UserType = 'company' | 'job_seeker';

export type JobvanaContextProps = {
  company?: Company;
  setCompany: (company: Company) => void;
  loggedIn?: boolean;
  logout: () => void;
  companiesContext: {
    page: number;
    companyId?: number;
    name?: string;
    minSize: number;
    maxSize: number;
    industryId?: number;
  };
  setCompaniesContext: (
    companiesContext: JobvanaContextProps['companiesContext']
  ) => void;
  jobsContext: {
    page: number;
    jobId?: number;
    company: string;
    title: string;
    roleId?: number;
    minSalary: number;
    maxSalary: number;
    skillId?: number;
    created?: CreatedRange;
  };
  setJobsContext: (jobsContext: JobvanaContextProps['jobsContext']) => void;
};

export const defaultContext: JobvanaContextProps = {
  setCompany: () => {},
  logout: () => {},
  companiesContext: {
    page: 1,
    minSize: MIN_COMPANY_SIZE,
    maxSize: MAX_COMPANY_SIZE
  },
  setCompaniesContext: () => {},
  jobsContext: {
    page: 1,
    company: '',
    title: '',
    minSalary: MIN_SALARY,
    maxSalary: MAX_SALARY
  },
  setJobsContext: () => {}
};

export const JobvanaContext =
  createContext<JobvanaContextProps>(defaultContext);

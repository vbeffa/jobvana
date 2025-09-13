import { createContext } from 'react';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './companies/useCompanies';
import { MAX_SALARY, MIN_SALARY, type CreatedRange } from './jobs/useJobs';

export type JobvanaContextProps = {
  companiesContext: {
    page: number;
    companyId?: number;
    name?: string;
    minSize: number;
    maxSize: number;
    industryId?: number;
  };
  setCompaniesContext: (props: JobvanaContextProps['companiesContext']) => void;
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
  setJobsContext: (props: JobvanaContextProps['jobsContext']) => void;
};

export const defaultContext = {
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

import { createContext } from 'react';
import type { CreatedRange } from './hooks/useJobs';

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
    minSize: 1,
    maxSize: 1000
  },
  setCompaniesContext: () => {},
  jobsContext: {
    page: 1,
    company: '',
    title: '',
    minSalary: 10000,
    maxSalary: 200000
  },
  setJobsContext: () => {}
};

export const JobvanaContext =
  createContext<JobvanaContextProps>(defaultContext);

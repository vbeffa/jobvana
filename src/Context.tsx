import { createContext } from 'react';
import type { CreatedRange } from './hooks/useJobs';

export type JobvanaContextProps = {
  companies: {
    page: number;
    companyId?: number;
    name: string;
    minSize: number;
    maxSize: number;
    industryId?: number;
  };
  jobs: {
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
};

export const JobvanaContext = createContext<JobvanaContextProps>({
  companies: {
    page: 1,
    name: '',
    minSize: 1,
    maxSize: 1000
  },
  jobs: {
    page: 1,
    company: '',
    title: '',
    minSalary: 10000,
    maxSalary: 200000
  }
});

import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './companies/useCompanies';
import { MAX_SALARY, MIN_SALARY, type CreatedRange } from './jobs/useJobs';

export type JobvanaContextProps = {
  authContext: {
    user?: User;
    session?: Session;
    type?: 'company' | 'job_seeker';
  } | null;
  setAuthContext: (authContext: JobvanaContextProps['authContext']) => void;
  isLoggedIn: (authContext: JobvanaContextProps['authContext']) => boolean;
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
  authContext: {},
  setAuthContext: () => {},
  isLoggedIn: (authContext: JobvanaContextProps['authContext']) => {
    return (
      authContext?.session?.expires_at !== undefined &&
      authContext?.session.expires_at * 1000 > Date.now()
    );
  },
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

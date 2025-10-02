import { createContext } from 'react';
import { type SearchFilters as CompanySearchFilters } from './companies/job_seeker/useCompanies';
import { INITIAL_SEARCH_FILTERS as INITIAL_COMPANY_SEARCH_FILTERS } from './companies/utils';
import { type SearchFilters as JobSearchFilters } from './jobs/job_seekers/useJobs';
import { INITIAL_SEARCH_FILTERS as INITIAL_JOB_SEARCH_FILTERS } from './jobs/utils';
import type { Company as DbCompany, JobSeeker } from './types';

export type UserType = 'company' | 'job_seeker';

export type Company = Omit<DbCompany, 'created_at'>;

export type CompanyContextProps = {
  company?: Company | null;
  setCompany: (company: Company) => void;
};

export type JobSeekerContextProps = {
  jobSeeker?: JobSeeker | null;
  setJobSeeker: (jobSeeker: JobSeeker) => void;
  companiesContext: CompanySearchFilters & {
    page: number;
    companyId?: number;
  };
  setCompaniesContext: (
    companiesContext: JobSeekerContextProps['companiesContext']
  ) => void;
  jobsContext: JobSearchFilters & {
    page: number;
    jobId?: number;
  };
  setJobsContext: (jobsContext: JobSeekerContextProps['jobsContext']) => void;
};

export type JobvanaContextProps = {
  currPage: string;
  setCurrPage: (page: string) => void;
  loggedIn?: boolean;
  loggingOut?: boolean;
  logout: () => Promise<void>;
  resetPassword?: boolean;
  setResetPassword: (resetPassword: boolean) => void;
};

export const defaultContext: JobvanaContextProps = {
  currPage: 'home',
  setCurrPage: () => {},
  logout: () => Promise.resolve(),
  setResetPassword: () => {}
};

export const defaultCompanyContext: CompanyContextProps = {
  setCompany: () => {}
};

export const defaultJobSeekerContext: JobSeekerContextProps = {
  setJobSeeker: () => {},
  companiesContext: {
    page: 1,
    ...INITIAL_COMPANY_SEARCH_FILTERS
  },
  setCompaniesContext: () => {},
  jobsContext: {
    page: 1,
    ...INITIAL_JOB_SEARCH_FILTERS
  },
  setJobsContext: () => {}
};

export const JobvanaContext =
  createContext<JobvanaContextProps>(defaultContext);

export const CompanyContext = createContext<CompanyContextProps>(
  defaultCompanyContext
);

export const JobSeekerContext = createContext<JobSeekerContextProps>(
  defaultJobSeekerContext
);

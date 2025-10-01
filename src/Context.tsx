import { createContext } from 'react';
import { type SearchFilters as CompanySearchFilters } from './companies/job_seeker/useCompanies';
import { INITIAL_SEARCH_FILTERS as INITIAL_COMPANY_SEARCH_FILTERS } from './companies/utils';
import { type SearchFilters as JobSearchFilters } from './jobs/job_seekers/useJobs';
import { INITIAL_SEARCH_FILTERS as INITIAL_JOB_SEARCH_FILTERS } from './jobs/utils';
import type { Company as DbCompany } from './types';

export type UserType = 'company' | 'job_seeker';

export type Company = Omit<DbCompany, 'created_at'>;

export type CompanyContextProps = {
  company?: Company | null;
  setCompany: (company: Company) => void;
};

export type JobSeekerContextProps = {
  companiesContext: CompanySearchFilters & {
    page: number;
    companyId?: number;
    // name?: string;
    // minSize: number;
    // maxSize: number;
    // minRounds: number;
    // maxRounds: number;
    // industryId?: number;
  };
  setCompaniesContext: (
    companiesContext: JobSeekerContextProps['companiesContext']
  ) => void;
  jobsContext: JobSearchFilters & {
    page: number;
    jobId?: number;
    // company?: string;
    // jobType?: Job['type'];
    // title?: string;
    // minSize: number;
    // maxSize: number;
    // roleId?: number;
    // salaryType: Job['salary_type'];
    // minSalary: number;
    // maxSalary: number;
    // skillIds?: Array<number>;
    // created?: CreatedRange;
  };
  setJobsContext: (jobsContext: JobSeekerContextProps['jobsContext']) => void;
};

export type JobvanaContextProps = {
  currPage: string;
  setCurrPage: (page: string) => void;
  loggedIn?: boolean;
  loggingOut?: boolean;
  logout: () => Promise<void>;
};

export const defaultContext: JobvanaContextProps = {
  currPage: 'home',
  setCurrPage: () => {},
  logout: () => Promise.resolve()
};

export const defaultCompanyContext: CompanyContextProps = {
  setCompany: () => {}
};

export const defaultJobSeekerContext: JobSeekerContextProps = {
  companiesContext: {
    page: 1,
    // minSize: MIN_COMPANY_SIZE,
    // maxSize: MAX_COMPANY_SIZE,
    // minRounds: 1,
    // maxRounds: 5,
    // industryId: 0
    ...INITIAL_COMPANY_SEARCH_FILTERS
  },
  setCompaniesContext: () => {},
  jobsContext: {
    page: 1,
    // company: '',
    // jobType: 0,
    // title: '',
    // roleId: 0,
    // salaryType: 'annual',
    // minSalary: MIN_SALARY,
    // maxSalary: MAX_SALARY,
    // skillIds: [],
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

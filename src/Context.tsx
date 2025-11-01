import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type SearchFilters as CompanySearchFilters } from './companies/job_seeker/useCompanies';
import { INITIAL_SEARCH_FILTERS as INITIAL_COMPANY_SEARCH_FILTERS } from './companies/utils';
import { type SearchFilters as JobSearchFilters } from './jobs/job_seekers/useJobs';
import { INITIAL_SEARCH_FILTERS as INITIAL_JOB_SEARCH_FILTERS } from './jobs/utils';
import type {
  CurrPage,
  Company as DbCompany,
  JobSeeker as DbJobSeeker
} from './types';

export type UserType = 'company' | 'job_seeker';

export type Company = Omit<DbCompany, 'created_at'>;
export type JobSeeker = Omit<DbJobSeeker, 'created_at'>;

export type JobvanaContextProps = {
  currPage: CurrPage;
  setCurrPage: (page: CurrPage) => void;
  accountNav: 'resumes' | 'skills' | 'profile' | 'account';
  setAccountNav: Dispatch<SetStateAction<JobvanaContextProps['accountNav']>>;
  loggedIn?: boolean;
  loggingOut?: boolean;
  logout: () => Promise<void>;
  resetPassword?: boolean;
  setResetPassword: (resetPassword: boolean) => void;
};

export type CompanyContextProps = {
  company?: Company | null;
  setCompany: (company: Company) => void;
  myCompanyNav: 'overview' | 'locations' | 'interview_process';
  setMyCompanyNav: Dispatch<
    SetStateAction<CompanyContextProps['myCompanyNav']>
  >;
  myJobsNav: {
    page: number;
    jobId?: number;
  };
  setMyJobsNav: Dispatch<SetStateAction<CompanyContextProps['myJobsNav']>>;
  jobApplicationsNav: {
    page: number;
    applicationId?: number;
  };
  setJobApplicationsNav: Dispatch<
    SetStateAction<CompanyContextProps['jobApplicationsNav']>
  >;
};

export type JobSeekerContextProps = {
  jobSeeker?: JobSeeker | null;
  homeNav: 'notifications' | 'saved_searches' | 'my_jobs';
  setHomeNav: Dispatch<SetStateAction<JobSeekerContextProps['homeNav']>>;
  setJobSeeker: (jobSeeker: JobSeeker) => void;
  jobSearchFilters: JobSearchFilters;
  setJobSearchFilters: Dispatch<SetStateAction<JobSearchFilters>>;
  jobNav: {
    page: number;
    jobId?: number;
  };
  setJobNav: Dispatch<SetStateAction<JobSeekerContextProps['jobNav']>>;
  companySearchFilters: CompanySearchFilters;
  setCompanySearchFilters: Dispatch<SetStateAction<CompanySearchFilters>>;
  companyNav: {
    page: number;
    companyId?: number;
  };
  setCompanyNav: Dispatch<SetStateAction<JobSeekerContextProps['companyNav']>>;
  myApplicationsNav: {
    page: number;
    applicationId?: number;
  };
  setMyApplicationsNav: Dispatch<
    SetStateAction<JobSeekerContextProps['myApplicationsNav']>
  >;
};

export const defaultContext: JobvanaContextProps = {
  currPage: 'home',
  setCurrPage: () => {},
  accountNav: 'resumes',
  setAccountNav: () => {},
  logout: () => Promise.resolve(),
  setResetPassword: () => {}
};

export const defaultCompanyContext: CompanyContextProps = {
  setCompany: () => {},
  myCompanyNav: 'overview',
  setMyCompanyNav: () => {},
  myJobsNav: {
    page: 1
  },
  setMyJobsNav: () => {},
  jobApplicationsNav: {
    page: 1
  },
  setJobApplicationsNav: () => {}
};

export const defaultJobSeekerContext: JobSeekerContextProps = {
  setJobSeeker: () => {},
  homeNav: 'notifications',
  setHomeNav: () => {},
  jobSearchFilters: INITIAL_JOB_SEARCH_FILTERS,
  setJobSearchFilters: () => {},
  jobNav: {
    page: 1
  },
  setJobNav: () => {},
  companySearchFilters: INITIAL_COMPANY_SEARCH_FILTERS,
  setCompanySearchFilters: () => {},
  companyNav: {
    page: 1
  },
  setCompanyNav: () => {},
  myApplicationsNav: {
    page: 1
  },
  setMyApplicationsNav: () => {}
};

export const JobvanaContext =
  createContext<JobvanaContextProps>(defaultContext);

export const CompanyContext = createContext<CompanyContextProps>(
  defaultCompanyContext
);

export const JobSeekerContext = createContext<JobSeekerContextProps>(
  defaultJobSeekerContext
);

import { createContext } from 'react';
import {
  MAX_COMPANY_SIZE,
  MIN_COMPANY_SIZE
} from './companies/job_seeker/useCompanies';
import {
  MAX_SALARY,
  MIN_SALARY,
  type CreatedRange
} from './jobs/job_seekers/useJobs';
import type { Company as DbCompany, Job } from './types';

export type UserType = 'company' | 'job_seeker';

export type Company = Omit<DbCompany, 'created_at'>;

export type CompanyContextProps = {
  company?: Company | null;
  setCompany: (company: Company) => void;
};

export type JobSeekerContextProps = {
  companiesContext: {
    page: number;
    companyId?: number;
    name?: string;
    minSize: number;
    maxSize: number;
    minRounds: number;
    maxRounds: number;
    industryId?: number;
  };
  setCompaniesContext: (
    companiesContext: JobSeekerContextProps['companiesContext']
  ) => void;
  jobsContext: {
    page: number;
    jobId?: number;
    company: string;
    title: string;
    roleId?: number;
    salaryType: Job['salary_type'];
    minSalary: number;
    maxSalary: number;
    skillId?: number;
    created?: CreatedRange;
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
    minSize: MIN_COMPANY_SIZE,
    maxSize: MAX_COMPANY_SIZE,
    minRounds: 1,
    maxRounds: 5,
    industryId: 0
  },
  setCompaniesContext: () => {},
  jobsContext: {
    page: 1,
    company: '',
    title: '',
    roleId: 0,
    salaryType: 'annual',
    minSalary: MIN_SALARY,
    maxSalary: MAX_SALARY,
    skillId: 0
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

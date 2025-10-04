import _ from 'lodash';
import {
  MAX_COMPANY_SIZE,
  MIN_COMPANY_SIZE
} from '../companies/job_seeker/useCompanies';
import type { Job } from '../types';
import {
  MAX_HOURLY_RATE,
  MAX_SALARY,
  MIN_HOURLY_RATE,
  MIN_SALARY,
  type CreatedRange,
  type SearchFilters
} from './job_seekers/useJobs';

export const INITIAL_SEARCH_FILTERS: SearchFilters = {
  company: '',
  jobType: 0,
  title: '',
  minSize: MIN_COMPANY_SIZE,
  maxSize: MAX_COMPANY_SIZE,
  industryId: 0,
  roleId: 0,
  salaryType: 'annual',
  minSalary: MIN_SALARY,
  maxSalary: MAX_SALARY,
  created: 'all',
  skillIds: []
};

export const jobTypeToString = (type: Job['type'], capitalize = true) => {
  const jobType = (() => {
    switch (type) {
      case 'full_time':
        return 'full time';
      case 'part_time':
        return 'part time';
      case 'contract':
        return 'contract';
      case 'internship':
        return 'internship';
    }
  })();
  return capitalize ? _.capitalize(jobType) : jobType;
};

export const minJobSalary = (salaryType: Job['salary_type']) =>
  salaryType === 'annual' ? MIN_SALARY : MIN_HOURLY_RATE;

export const maxJobSalary = (salaryType: Job['salary_type']) =>
  salaryType === 'annual' ? MAX_SALARY : MAX_HOURLY_RATE;

export const createdRangeToString = (created: CreatedRange) => {
  switch (created) {
    case 'all':
      return 'Any Time';
    case 'today':
      return 'Today';
    case 'last_three_days':
      return 'Last 3 Days';
    case 'last_week':
      return 'Last 7 Days';
    case 'last_month':
      return 'Last 30 Days';
  }
};

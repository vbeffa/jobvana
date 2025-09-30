import type { Job } from '../types';
import {
  MAX_HOURLY_RATE,
  MAX_SALARY,
  MIN_HOURLY_RATE,
  MIN_SALARY
} from './job_seekers/useJobs';

export const jobTypeToString = (type: Job['type']) => {
  switch (type) {
    case 'full_time':
      return 'Full time';
    case 'part_time':
      return 'Part time';
    case 'contract':
      return 'Contract';
    case 'internship':
      return 'Internship';
  }
};

export const minJobSalary = (salaryType: Job['salary_type']) =>
  salaryType === 'annual' ? MIN_SALARY : MIN_HOURLY_RATE;

export const maxJobSalary = (salaryType: Job['salary_type']) =>
  salaryType === 'annual' ? MAX_SALARY : MAX_HOURLY_RATE;

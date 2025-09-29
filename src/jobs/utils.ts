import { MAX_DESCRIPTION_LENGTH } from '../companies/job_seeker/useCompanies';
import type { Job as DbJob, JobRole } from '../types';
import {
  MAX_SALARY,
  MAX_TITLE_LENGTH,
  MIN_SALARY
} from './job_seekers/useJobs';

export type ToInsert = Omit<DbJob, 'id' | 'created_at'>;
export type ToUpdate = Omit<DbJob, 'created_at'>;

export const isValidJob = (job: Partial<ToInsert>) => {
  return Boolean(
    job.title &&
      job.title.length <= MAX_TITLE_LENGTH &&
      job.description &&
      job.description.length <= MAX_DESCRIPTION_LENGTH &&
      job.salary_low &&
      job.salary_low >= MIN_SALARY &&
      job.salary_high &&
      job.salary_high <= MAX_SALARY
  );
};

export const jobRolesPercentTotal = (jobRoles: Array<JobRole>) => {
  return jobRoles.reduce((total, role) => total + role.percent, 0);
};

export const duplicateJobRoles = (jobRoles: Array<JobRole>) => {
  const validJobRoles = jobRoles.filter(isValidJobRole);
  return (
    new Map(validJobRoles.map((jobRole) => [jobRole.role_id, jobRole.role_id]))
      .size < validJobRoles.length
  );
};

export const isValidJobRole = (jobRole: JobRole) => {
  return (
    jobRole.percent > 0 &&
    jobRole.percent <= 100 &&
    jobRole.role_id > 0 &&
    jobRole.role_level >= 0 &&
    jobRole.role_level < 5
  );
};

export const areValidJobRoles = (jobRoles: Array<JobRole>) => {
  return Boolean(
    jobRoles.length > 0 &&
      jobRolesPercentTotal(jobRoles) === 100 &&
      !duplicateJobRoles(jobRoles) &&
      jobRoles.every(isValidJobRole)
  );
};

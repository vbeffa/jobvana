import { MAX_DESCRIPTION_LENGTH } from '../companies/job_seeker/useCompanies';
import type { Job as DbJob } from '../types';
import { MAX_SALARY, MAX_TITLE_LENGTH, MIN_SALARY } from './useJobs';

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

import type { JobSeeker as DbJobSeeker } from '../types';

export type ToInsert = Omit<DbJobSeeker, 'id' | 'created_at'>;
export type ToUpdate = Pick<
  DbJobSeeker,
  'id' | 'user_id' | 'first_name' | 'last_name'
>;

export const isValidJobSeeker = (jobSeeker: Partial<ToInsert>) => {
  return Boolean(jobSeeker.user_id);
};

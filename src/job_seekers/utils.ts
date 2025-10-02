import supabase from '../db/supabase';
import type { JobSeeker as DbJobSeeker } from '../types';

export type ToInsert = Omit<DbJobSeeker, 'id' | 'created_at'>;
export type ToUpdate = Pick<
  DbJobSeeker,
  'id' | 'user_id' | 'first_name' | 'last_name'
>;

export const findJobSeeker = async (userId: string) => {
  const { data, error } = await supabase
    .from('job_seekers')
    .select(`*`)
    .filter('user_id', 'eq', userId);

  if (error) {
    throw error;
  }

  return data[0] ?? null;
};

export const isValidJobSeeker = (jobSeeker: Partial<ToInsert>) => {
  return Boolean(jobSeeker.user_id);
};

import { useCallback } from 'react';
import type { JobSeeker } from '../Context';
import supabase from '../db/supabase';
import { isValidJobSeeker, type ToUpdate } from './utils';

export type JobSeekerHook = {
  updateJobSeeker: (jobSeeker: JobSeeker) => Promise<JobSeeker>;
};

const useJobSeeker = (): JobSeekerHook => {
  const updateJobSeeker = useCallback(async (jobSeeker: JobSeeker) => {
    if (!isValidJobSeeker(jobSeeker)) {
      throw Error('job seeker not valid');
    }

    const { data, error } = await supabase
      .from('job_seekers')
      .update(jobSeeker as ToUpdate)
      .eq('id', jobSeeker.id)
      .select();

    if (error) {
      throw error;
    } else if (!data[0]) {
      throw Error('No rows updated');
    } else {
      return data[0];
    }
  }, []);

  return {
    updateJobSeeker
  };
};

export default useJobSeeker;

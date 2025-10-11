import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Application } from '../../types';

export type ApplicationForJob = {
  application: Pick<Application, 'created_at'> | undefined;
  isPending: boolean;
  error?: Error;
};

// TODO use in JobDetails
const useApplicationForJob = ({
  jobSeekerId
}: {
  jobSeekerId: number;
}): ApplicationForJob => {
  const queryKey = useMemo(
    () => ['applications', { jobSeekerId }],
    [jobSeekerId]
  );

  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(`created_at`)
        .filter('job_seeker_id', 'eq', jobSeekerId)
        .in('status', ['submitted', 'accepted']);
      // console.log(data);
      return data;
    }
  });

  return {
    application: data?.[0],
    isPending,
    error: error ?? undefined
  };
};

export default useApplicationForJob;

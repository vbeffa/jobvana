import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Application } from '../../types';

export type ApplicationForJob = {
  application: Pick<Application, 'id' | 'created_at'> | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

// TODO use in JobDetails
const useApplicationForJob = ({
  jobSeekerId,
  jobId
}: {
  jobSeekerId: number;
  jobId: number;
}): ApplicationForJob => {
  const queryKey = useMemo(
    () => ['applications', { jobSeekerId, jobId }],
    [jobId, jobSeekerId]
  );

  const { data, isPending, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(`id, created_at`)
        .filter('job_seeker_id', 'eq', jobSeekerId)
        .filter('job_id', 'eq', jobId);
      // .in('status', ['submitted', 'accepted']);
      // console.log(data);
      return data;
    }
  });

  return {
    application: data?.[0],
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useApplicationForJob;

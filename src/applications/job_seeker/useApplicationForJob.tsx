import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Application } from '../../types';

export type ApplicationForJob = {
  application:
    | Pick<Application, 'id' | 'created_at' | 'status'>
    | undefined
    | null;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

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

  const { data, isPending, refetch, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, created_at, status')
        .filter('job_seeker_id', 'eq', jobSeekerId)
        .filter('job_id', 'eq', jobId);
      // .in('status', ['submitted', 'accepted']);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return data[0] ?? null;
    }
  });

  return {
    application: data,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useApplicationForJob;

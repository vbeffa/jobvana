import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';

export type ApplicationsForJob = {
  activeApplications: number | undefined;
  isPending: boolean;
  error?: Error;
};

const useApplicationsForJob = ({
  jobId
}: {
  jobId: number;
}): ApplicationsForJob => {
  const queryKey = useMemo(() => ['applications', { jobId }], [jobId]);

  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(`id`)
        .filter('job_id', 'eq', jobId)
        .in('status', ['submitted', 'accepted']);
      // console.log(data);
      return data;
    }
  });

  return {
    activeApplications: data?.length,
    isPending,
    error: error ?? undefined
  };
};

export default useApplicationsForJob;

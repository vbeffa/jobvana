import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import supabase from '../../db/supabase';

export type JobApplications = {
  total: number | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useJobApplications = ({ jobId }: { jobId: number }): JobApplications => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['applications', { jobId }],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select('count')
        .filter('job_id', 'eq', jobId)
        .in('status', ['submitted', 'accepted']);
      // console.log(data);
      return data;
    }
  });

  return {
    total: data?.[0].count ?? undefined,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useJobApplications;

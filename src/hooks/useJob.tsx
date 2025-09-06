import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Job } from './useJobs';

const useJob = ({ id }: { id: number }) => {
  const {
    isPlaceholderData,
    isPending,
    data: jobData,
    error
  } = useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('jobs')
        .select(
          '*, companies!jobs_company_id_fkey!inner(*), job_roles(*), skills(*), applications(*)'
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { error, data };
    },
    placeholderData: keepPreviousData
  });

  const job: Job | undefined = useMemo(() => {
    if (!jobData?.data?.[0]) {
      return undefined;
    }
    const job = jobData.data[0];
    return {
      ...job,
      company: job.companies,
      requirements: job.job_roles
    };
  }, [jobData?.data]);

  return {
    job,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useJob;

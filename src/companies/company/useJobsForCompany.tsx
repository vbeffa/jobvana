import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Job as DbJob } from '../../types';
import supabase from '../../utils/supabase';

export type Jobs = {
  jobs: Array<DbJob> | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useJobsForCompany = (companyId: number): Jobs => {
  const queryKey = useMemo(
    () => ({
      companyId
    }),
    [companyId]
  );

  const {
    data: jobsData,
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs', queryKey],
    queryFn: async () => {
      const { error, data, count } = await supabase.from('jobs').select('*');
      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<DbJob> | undefined = useMemo(() => {
    return jobsData?.data?.sort(
      (job1, job2) =>
        new Date(job2.updated_at ?? job2.created_at).getTime() -
        new Date(job1.updated_at ?? job1.created_at).getTime()
    );
  }, [jobsData?.data]);

  return {
    jobs,
    error: error ?? undefined,
    refetch
  };
};

export default useJobsForCompany;

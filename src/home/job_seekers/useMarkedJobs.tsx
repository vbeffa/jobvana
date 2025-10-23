import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Job as DbJob, Paging } from '../../types';

export type Job = Pick<DbJob, 'id' | 'title' | 'created_at' | 'company_id'> & {
  companyName: string;
};

export type MarkedJobs = {
  jobs: Array<Job> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  count: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useMarkedJobs = (
  jobSeekerId: number,
  type: 'saved' | 'hidden',
  paging: Paging
): MarkedJobs => {
  const {
    data: jobsData,
    isPending,
    isPlaceholderData,
    error,
    refetch
  } = useQuery({
    queryKey: ['marked_jobs', jobSeekerId, type, paging],
    queryFn: async () => {
      const { page, pageSize } = paging;
      const { data, count, error } = await supabase
        .from(type === 'saved' ? 'saved_jobs' : 'hidden_jobs')
        .select(
          'jobs!inner(id, title, created_at, company_id, companies!inner(name))',
          {
            count: 'exact'
          }
        )
        .filter('job_seeker_id', 'eq', jobSeekerId)
        .range((page - 1) * pageSize, page * pageSize - 1);

      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<Job> | undefined = useMemo(() => {
    return jobsData?.data?.map((jobData) => ({
      id: jobData.jobs.id,
      title: jobData.jobs.title,
      created_at: jobData.jobs.created_at,
      company_id: jobData.jobs.company_id,
      companyName: jobData.jobs.companies.name
    }));
  }, [jobsData?.data]);

  return {
    jobs: jobs,
    isPending,
    isPlaceholderData,
    count: jobsData?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useMarkedJobs;

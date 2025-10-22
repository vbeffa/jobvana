import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Job as DbJob } from '../../types';

export type Job = Pick<DbJob, 'id' | 'title' | 'company_id'> & {
  companyName: string;
};

export type MarkedJobs = {
  jobs: Array<Job> | undefined;
  count: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useMarkedJobs = (
  jobSeekerId: number,
  type: 'saved' | 'hidden'
): MarkedJobs => {
  const {
    data: jobsData,
    error,
    refetch
  } = useQuery({
    queryKey: ['marked_jobs', jobSeekerId, type],
    queryFn: async () => {
      const { error, data, count } = await supabase
        .from(type === 'saved' ? 'saved_jobs' : 'hidden_jobs')
        .select('jobs!inner(id, title, company_id, companies!inner(name))', {
          count: 'exact'
        })
        .filter('job_seeker_id', 'eq', jobSeekerId);
      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { error, data, count };
    }
  });

  const jobs: Array<Job> | undefined = useMemo(() => {
    return jobsData?.data?.map((jobData) => ({
      id: jobData.jobs.id,
      title: jobData.jobs.title,
      company_id: jobData.jobs.company_id,
      companyName: jobData.jobs.companies.name
    }));
  }, [jobsData?.data]);

  return {
    jobs: jobs,
    count: jobsData?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useMarkedJobs;

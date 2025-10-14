import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type { Job as DbJob, JobRole, JobSkill } from '../../types';

export type Job = Omit<DbJob, 'interview_process'> & {
  job_roles: Array<JobRole>;
  job_skills: Array<JobSkill>;
  interview_process: InterviewProcess | null;
};

export type JobH = {
  job: Job | undefined;
  isPlaceholderData: boolean;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useJob = (id: number): JobH => {
  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['jobs', { id }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, job_roles(*), job_skills(*)')
        .filter('id', 'eq', id);
      // console.log(data);

      return { job: data?.[0], error };
    },
    placeholderData: keepPreviousData
  });

  const job: Job | undefined = useMemo(() => {
    if (!data?.job) {
      return undefined;
    }
    const job = data.job;
    return {
      ...job,
      interview_process: job.interview_process as InterviewProcess | null
    };
  }, [data]);

  return {
    job,
    isPlaceholderData,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useJob;

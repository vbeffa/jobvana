import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Job as DbJob, JobRole, JobSkill } from '../../types';

export type Job = DbJob & {
  job_roles: Array<JobRole>; // TODO use similar case in other hook types
  job_skills: Array<JobSkill>;
};

export type Jobs = {
  jobs: Array<Job> | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useJobsForCompany = ({
  companyId,
  jobId
}: {
  companyId: number;
  jobId?: number;
}): Jobs => {
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
      let q = supabase.from('jobs').select('*, job_roles(*), job_skills(*)');
      if (jobId) {
        q = q.filter('id', 'eq', jobId);
      } else {
        q = q.filter('company_id', 'eq', companyId);
      }
      const { error, data } = await q;
      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { error, data };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<Job> | undefined = useMemo(() => {
    return jobsData?.data?.sort(
      (job1, job2) =>
        new Date(job2.updated_at).getTime() -
        new Date(job1.updated_at).getTime()
    );
  }, [jobsData?.data]);

  return {
    jobs,
    error: error ?? undefined,
    refetch
  };
};

export default useJobsForCompany;

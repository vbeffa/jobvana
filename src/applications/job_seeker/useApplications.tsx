import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob,
  JobSeeker as DbJobSeeker,
  Params
} from '../../types';

export type SearchFilters = {
  jobSeekerId: number;
  status: ApplicationStatus | 'all';
};

export type Company = Pick<DbCompany, 'id' | 'name'>;
export type Job = Pick<DbJob, 'id' | 'title'>;
export type JobSeeker = Pick<
  DbJobSeeker,
  'first_name' | 'last_name' | 'user_id'
>;

export type Application = Pick<
  DbApplication,
  'id' | 'job_id' | 'created_at' | 'status' | 'updated_at'
> & {
  job: Job;
  company: Company;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  resumePath: string;
  interview_process: InterviewProcess | null;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  error?: Error;
  total: number | undefined;
  refetch: () => Promise<QueryObserverResult>;
};

export type ApplicationsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useApplications = (params: ApplicationsParams): Applications => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging.page,
      ...params.filters
    }),
    [params.filters, params.paging.page]
  );

  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['applications', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('applications')
        .select(
          `id, job_id, created_at, status, updated_at,
            jobs!inner(
              id,
              title,
              companies!inner(id, name),
              interview_process
            ),
            job_seekers!inner(first_name, last_name, user_id),
            application_resumes!inner(resume_path)`,
          { count: 'exact' }
        )
        .filter('job_seeker_id', 'eq', params.filters.jobSeekerId);

      if (params.filters.status !== 'all') {
        q = q.eq('status', params.filters.status);
      }
      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('updated_at', { ascending: false });

      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { applications: data, error, count };
    },
    placeholderData: keepPreviousData
  });

  const applications: Array<Application> | undefined = useMemo(() => {
    if (!data?.applications) {
      return undefined;
    }

    return data.applications.map((applicationData) => ({
      ..._.omit(applicationData, 'jobs'),
      job: _.pick(applicationData.jobs, 'id', 'title'),
      company: _.pick(applicationData.jobs.companies, 'id', 'name'),
      jobSeeker: applicationData.job_seekers,
      resumePath: applicationData.application_resumes.resume_path,
      interview_process: applicationData.jobs
        .interview_process as InterviewProcess
    }));
  }, [data]);

  return {
    applications,
    isPending,
    isPlaceholderData,
    error: error ?? undefined,
    total: data?.count ?? undefined,
    refetch
  };
};

export default useApplications;

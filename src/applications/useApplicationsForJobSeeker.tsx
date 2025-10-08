import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import type { InterviewProcess } from '../companies/company/utils';
import supabase from '../db/supabase';
import type {
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob
} from '../types';

export type Company = Pick<DbCompany, 'id' | 'name' | 'interview_process'>;
export type Job = Pick<DbJob, 'id' | 'title'>;

export type Application = DbApplication & {
  job: Job;
  company: Company;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
  total: (companyId: number) => Promise<number | undefined>;
  apply: (jobId: number, jobSeekerId: number) => Promise<void>;
};

const useApplicationsForJobSeeker = ({
  jobSeekerId
}: {
  jobSeekerId: number;
}): Applications => {
  const {
    data: applicationsData,
    isPending,
    error,
    refetch
  } = useQuery({
    queryKey: ['applications', jobSeekerId],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `*,
          jobs(
            id,
            title,
            companies!inner(id, name, interview_process)
          )`
        )
        .filter('job_seeker_id', 'eq', jobSeekerId);
      console.log(data);
      return data;
    }
  });

  const applications: Array<Application> | undefined = useMemo(
    () =>
      applicationsData
        ?.sort(
          (application1, application2) =>
            new Date(application1.created_at).getTime() -
            new Date(application2.created_at).getTime()
        )
        .map((applicationData) => ({
          ..._.omit(applicationData, 'jobs'),
          job: _.pick(applicationData.jobs, 'id', 'title'),
          company: {
            ...applicationData.jobs.companies,
            interview_process: applicationData.jobs.companies
              .interview_process as InterviewProcess
            // numApplications: applicationData.jobs.companies.company_applications.
          }
        })),
    [applicationsData]
  );

  const total = useCallback(async (companyId: number) => {
    const { data } = await supabase
      .from('company_applications')
      .select('*')
      .filter('company_id', 'eq', companyId);
    console.log(data);
    return data?.[0].num_applications ?? undefined;
  }, []);

  const apply = async (jobId: number, jobSeekerId: number) => {
    const { data, error } = await supabase.from('applications').insert({
      job_id: jobId,
      job_seeker_id: jobSeekerId,
      status: 'submitted'
    });

    console.log(data, error);
  };

  return {
    applications,
    isPending,
    error: error ?? undefined,
    refetch,
    total,
    apply
  };
};

export default useApplicationsForJobSeeker;

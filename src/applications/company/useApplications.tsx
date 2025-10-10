import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Job as DbJob,
  JobSeeker as DbJobSeeker
} from '../../types';

export type Job = Pick<DbJob, 'id' | 'title'>;
export type JobSeeker = Pick<DbJobSeeker, 'first_name' | 'last_name'>;

export type Application = DbApplication & {
  job: Job;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  resumePath: string;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useApplications = ({
  companyId
}: {
  companyId: number;
}): Applications => {
  const {
    data: applicationsData,
    isPending,
    error,
    refetch
  } = useQuery({
    queryKey: ['applications', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `*,
          jobs(
            id,
            title,
            companies(id)
          ),
          job_seekers!inner(first_name, last_name),
          application_resumes!inner(resume_path)`
        )
        .filter('jobs.companies.id', 'eq', companyId);
      // console.log(data);
      return data;
    }
  });

  const applications: Array<Application> | undefined = useMemo(
    () =>
      applicationsData
        ?.sort(
          (application1, application2) =>
            new Date(application2.created_at).getTime() -
            new Date(application1.created_at).getTime()
        )
        .map((applicationData) => ({
          ..._.omit(applicationData, 'jobs'),
          job: _.pick(applicationData.jobs, 'id', 'title'),
          jobSeeker: applicationData.job_seekers,
          resumePath: applicationData.application_resumes.resume_path
        })),
    [applicationsData]
  );

  return {
    applications,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useApplications;

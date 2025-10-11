import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Job as DbJob,
  JobSeeker as DbJobSeeker
} from '../../types';
// import type { Application } from './useApplications';
// import { fetchApplication, mapper } from './utils';

export type Job = Pick<DbJob, 'id' | 'title'>;
export type JobSeeker = Pick<DbJobSeeker, 'first_name' | 'last_name'>;

export type Application = Pick<
  DbApplication,
  'id' | 'created_at' | 'status' | 'updated_at'
> & {
  job: Job;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  resumePath: string;
  interviewProcess: InterviewProcess | null;
};

export type ApplicationH = {
  application: Application | undefined;
  isPending: boolean;
  error?: Error;
};

const useApplication = ({ id }: { id: number }): ApplicationH => {
  const {
    data: applicationData,
    isPending,
    error
  } = useQuery({
    queryKey: ['applications', { id }],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `id, created_at, status, updated_at,
            jobs(
              id,
              title,
              interview_process
            ),
            job_seekers!inner(first_name, last_name),
            application_resumes!inner(resume_path)`
        )
        .filter('id', 'eq', id);
      // console.log(data);
      return data;
    }
  });

  const application: Application | undefined = useMemo(
    () =>
      applicationData?.map((applicationData) => ({
        ..._.omit(applicationData, 'jobs'),
        job: _.pick(applicationData.jobs, 'id', 'title'),
        jobSeeker: applicationData.job_seekers,
        resumePath: applicationData.application_resumes.resume_path,
        interviewProcess: applicationData.jobs
          .interview_process as InterviewProcess
      }))[0],
    [applicationData]
  );

  return {
    application,
    isPending,
    error: error ?? undefined
  };
};

export default useApplication;

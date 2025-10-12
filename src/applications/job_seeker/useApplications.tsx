import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob,
  JobSeeker as DbJobSeeker
} from '../../types';
import { dateComparator } from '../../utils';
// import { fetchApplications, mapper } from './utils';

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
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
  total: (companyId: number) => Promise<number | undefined>;
  apply: (
    jobId: number,
    jobSeeker: JobSeeker,
    resumeName: string
  ) => Promise<void>;
};

const useApplications = ({
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
    queryKey: ['applications', { jobSeekerId }],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `id, job_id, created_at, status, updated_at,
            jobs!inner(
              id,
              title,
              companies!inner(id, name, company_applications(num_applications)),
              interview_process
            ),
            job_seekers!inner(first_name, last_name, user_id),
            application_resumes!inner(resume_path)`
        )
        .filter('job_seeker_id', 'eq', jobSeekerId);
      // console.log(data);
      return data;
    }
  });

  const applications: Array<Application> | undefined = useMemo(
    () =>
      applicationsData?.sort(dateComparator).map((applicationData) => ({
        ..._.omit(applicationData, 'jobs'),
        job: _.pick(applicationData.jobs, 'id', 'title'),
        company: _.pick(applicationData.jobs.companies, 'id', 'name'),
        jobSeeker: applicationData.job_seekers,
        resumePath: applicationData.application_resumes.resume_path,
        interview_process: applicationData.jobs
          .interview_process as InterviewProcess
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

  const apply = async (
    jobId: number,
    jobSeeker: JobSeeker,
    resumeName: string
  ) => {
    const fromFile = `${jobSeeker.user_id}/${resumeName}`;
    const toFile = `${jobId}/${jobSeeker.user_id}.pdf`;

    // TODO add a transaction for this
    const { data: appData, error: appErr } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        job_seeker_id: jobSeekerId,
        status: 'submitted'
      })
      .select();
    if (appErr) {
      console.log(appErr);
      throw appErr;
    }
    console.log(appData);
    const id = appData[0].id;

    const { error: appEventsErr } = await supabase
      .from('application_events')
      .insert({
        application_id: id,
        user_id: jobSeeker.user_id,
        event: 'submitted'
      });
    if (appEventsErr) {
      console.log(appEventsErr);
      throw appEventsErr;
    }

    const { data: storageData, error: storageErr } = await supabase.storage
      .from('resumes')
      .copy(fromFile, toFile, {
        destinationBucket: 'applications'
      });
    if (storageErr) {
      console.log(storageErr);
      throw storageErr;
    }
    console.log(storageData);

    const { error: appResumesErr } = await supabase
      .from('application_resumes')
      .insert({ application_id: id, resume_path: toFile });
    if (appResumesErr) {
      console.log(appResumesErr);
      throw appResumesErr;
    }
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

export default useApplications;

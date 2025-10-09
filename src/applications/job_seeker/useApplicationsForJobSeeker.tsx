import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import type { JobSeeker } from '../../Context';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob
} from '../../types';

export type Company = Pick<DbCompany, 'id' | 'name' | 'interview_process'>;
export type Job = Pick<DbJob, 'id' | 'title'>;

export type Application = DbApplication & {
  job: Job;
  company: Company;
  status: ApplicationStatus;
  resumePath: string;
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
            companies!inner(id, name, interview_process, company_applications(num_applications))
          ),
          application_resumes!inner(resume_path)`
        )
        .filter('job_seeker_id', 'eq', jobSeekerId);
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
          company: {
            ...applicationData.jobs.companies,
            interview_process: applicationData.jobs.companies
              .interview_process as InterviewProcess
            // numApplications: applicationData.jobs.companies.company_applications.
          },
          resumePath: applicationData.application_resumes.resume_path
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
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        job_seeker_id: jobSeekerId,
        status: 'submitted'
      })
      .select();
    if (error) {
      console.log(error);
      throw error;
    }
    console.log(data);
    const id = data[0].id;

    const { error: error2 } = await supabase
      .from('application_resumes')
      .insert({ application_id: id, resume_path: toFile });
    if (error2) {
      console.log(error2);
      throw error2;
    }

    const { data: data3, error: error3 } = await supabase.storage
      .from('resumes')
      .copy(fromFile, toFile, {
        destinationBucket: 'applications'
      });
    if (error3) {
      console.log(error3);
      throw error3;
    }
    console.log(data3);
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

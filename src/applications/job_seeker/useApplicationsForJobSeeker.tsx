import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import type { JobSeeker } from '../../Context';
import supabase from '../../db/supabase';
import type {
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob
} from '../../types';

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
          )`
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

  const apply = async (
    jobId: number,
    jobSeeker: JobSeeker,
    resumeName: string
  ) => {
    const fromFile = `${jobSeeker.user_id}/${resumeName}`;
    const toFile = `${jobId}/${jobSeeker.user_id}.pdf`;

    const result = await supabase.storage
      .from('resumes')
      .copy(fromFile, toFile, {
        destinationBucket: 'applications'
      });
    if (result.error) {
      console.log(result.error);
      throw result.error;
    }
    console.log(result.data);

    // const result2 = await supabase.storage.from('applications').info(toFile);
    // if (result2.error) {
    //   console.log(result2.error);
    //   throw result2.error;
    // }

    const result3 = await supabase.from('applications').insert({
      job_id: jobId,
      job_seeker_id: jobSeekerId,
      status: 'submitted',
      resume_path: toFile
    });
    if (result3.error) {
      console.log(result3.error);
      throw result3.error;
    }

    console.log(result3.data);
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

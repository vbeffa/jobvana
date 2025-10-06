import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { InterviewProcess } from '../companies/company/utils';
import supabase from '../db/supabase';
import type {
  Application as DbApplication,
  Company as DbCompany,
  Job
} from '../types';

export type Application = DbApplication & {
  job: Job & { applications: Array<DbApplication> };
  company: DbCompany;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
};

const useApplications = ({
  jobSeekerId
}: {
  jobSeekerId: number;
}): Applications => {
  const { isPending, data: applicationsData } = useQuery({
    queryKey: ['applications', jobSeekerId],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select('*, jobs(*, companies!inner(*), applications(*))')
        .filter('job_seeker_id', 'eq', jobSeekerId);
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
          ...applicationData,
          job: applicationData.jobs,
          company: {
            ...applicationData.jobs.companies,
            interview_process: applicationData.jobs.companies
              .interview_process as InterviewProcess
          }
        })),
    [applicationsData]
  );

  return {
    applications,
    isPending
  };
};

export default useApplications;

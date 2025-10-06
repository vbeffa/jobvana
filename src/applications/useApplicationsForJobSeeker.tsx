import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { InterviewProcess } from '../companies/company/utils';
import supabase from '../db/supabase';
import type {
  Application as DbApplication,
  Company as DbCompany,
  Job as DbJob
} from '../types';

export type Company = Pick<DbCompany, 'id' | 'name' | 'interview_process'> & {
  // numApplications: number | null;
};
export type Job = Pick<DbJob, 'id' | 'title'>;

export type Application = DbApplication & {
  job: Job & { applications: Array<Pick<DbApplication, 'status'>> };
  company: Company;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
};

const useApplicationsForJobSeeker = ({
  jobSeekerId
}: {
  jobSeekerId: number;
}): Applications => {
  const { isPending, data: applicationsData } = useQuery({
    queryKey: ['applications', jobSeekerId],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `*,
          jobs(
            id,
            title,
            companies!inner(id, name, interview_process, company_applications!company_id(num_applications)),
            applications(status)
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
          ...applicationData,
          job: applicationData.jobs,
          company: {
            ...applicationData.jobs.companies,
            interview_process: applicationData.jobs.companies
              .interview_process as InterviewProcess
            // numApplications: applicationData.jobs.companies.company_applications.
          }
        })),
    [applicationsData]
  );

  return {
    applications,
    isPending
  };
};

export default useApplicationsForJobSeeker;

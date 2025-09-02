import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';
import type { DbJob } from './useJobs';
import type { DbCompany } from './useCompanies';

export type JobSeeker = Database['public']['Tables']['job_seekers']['Row'] & {
  user: User;
};

export type User = Database['public']['Tables']['users']['Row'];

export type Application =
  Database['public']['Tables']['applications']['Row'] & {
    job: DbJob;
    company: DbCompany;
    jobSeeker: JobSeeker;
  };

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
};

const useApplications = (): Applications => {
  const { isPending, data: applicationsData } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          '*, job_seekers!inner(*, users!inner(*)), jobs!inner(*, companies!inner(*))'
        );
      return data;
    }
  });

  const applications = useMemo(
    () =>
      applicationsData
        ?.sort(
          (application1, application2) =>
            application1.job_seeker_id - application2.job_seeker_id
        )
        .map((applicationData) => ({
          ...applicationData,
          job: applicationData.jobs,
          company: applicationData.jobs.companies,
          jobSeeker: {
            ...applicationData.job_seekers,
            user: applicationData.job_seekers.users
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

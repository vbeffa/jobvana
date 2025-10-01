import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type {
  Application as DbApplication,
  Company as DbCompany,
  Job
} from '../types';

export type Application = DbApplication & {
  job: Job;
  company: DbCompany;
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
        .select('*, jobs(*, companies!inner(*))');
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
          company: applicationData.jobs.companies
        })),
    [applicationsData]
  );

  return {
    applications,
    isPending
  };
};

export default useApplications;

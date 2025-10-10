import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Application } from './useApplications';

export type ApplicationH = {
  applications: Application | undefined;
  isPending: boolean;
  error?: Error;
};

const useApplication = ({ id }: { id: number }) => {
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
          `*,
          jobs(
            id,
            title,
            companies(id)
          ),
          job_seekers!inner(first_name, last_name),
          application_resumes!inner(resume_path)`
        )
        .filter('id', 'eq', id);
      // console.log(data);
      return data;
    }
  });

  const application = useMemo(
    () =>
      applicationData?.map((applicationData) => ({
        ..._.omit(applicationData, 'jobs'),
        job: _.pick(applicationData.jobs, 'id', 'title'),
        jobSeeker: applicationData.job_seekers,
        resumePath: applicationData.application_resumes.resume_path
      }))[0],
    [applicationData]
  );

  return {
    application,
    isPending,
    error
  };
};

export default useApplication;

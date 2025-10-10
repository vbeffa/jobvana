import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
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
            companies!inner(id, name, interview_process, company_applications(num_applications))
          ),
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
        company: {
          ...applicationData.jobs.companies,
          interview_process: applicationData.jobs.companies
            .interview_process as InterviewProcess
          // numApplications: applicationData.jobs.companies.company_applications.
        },
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

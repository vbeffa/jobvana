import _ from 'lodash';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';

const query = supabase.from('applications').select(
  `*,
    jobs(
      id,
      title,
      interview_process,
      companies!inner(id, name, company_applications(num_applications))
    ),
    application_resumes!inner(resume_path)`
);

const fetchApplication = async (id: number) => {
  return query.filter('id', 'eq', id);
};

const fetchApplications = async (jobSeekerId: number) => {
  return query.filter('job_seeker_id', 'eq', jobSeekerId);
};

const mapper = (
  applicationData: NonNullable<Awaited<typeof query>['data']>[0]
) => {
  return {
    ..._.omit(applicationData, 'jobs'),
    job: {
      ..._.pick(applicationData.jobs, 'id', 'title'),
      interview_process: applicationData.jobs
        .interview_process as InterviewProcess
    },
    company: applicationData.jobs.companies,
    resumePath: applicationData.application_resumes.resume_path
  };
};

export { fetchApplication, fetchApplications, mapper };

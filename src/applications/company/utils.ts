import _ from 'lodash';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';

// const query = supabase.from('applications').select(
//   `*,
//     jobs(
//       id,
//       title,
//       companies(id),
//       interview_process
//     ),
//     job_seekers!inner(first_name, last_name),
//     application_resumes!inner(resume_path)`
// );

// const fetchApplication = async (id: number) => {
//   return query.filter('id', 'eq', id);
// };

const fetchApplications = async (
  filters: { id: number } | { companyId: number }
) => {
  let q = supabase.from('applications').select(
    `*,
    jobs(
      id,
      title,
      companies(id),
      interview_process
    ),
    job_seekers!inner(first_name, last_name),
    application_resumes!inner(resume_path)`
  );
  if ('id' in filters) {
    q = q.filter('id', 'eq', filters.id);
  } else if ('companyId' in filters) {
    q = q.filter('jobs.companies.id', 'eq', filters.companyId);
  }
  console.log(q);
  return q;
};

const mapper = (
  applicationData: NonNullable<
    Awaited<ReturnType<typeof fetchApplications>>['data']
  >[0]
) => {
  return {
    ..._.omit(applicationData, 'jobs'),
    job: _.pick(applicationData.jobs, 'id', 'title'),
    jobSeeker: applicationData.job_seekers,
    resumePath: applicationData.application_resumes.resume_path,
    interviewProcess: applicationData.jobs.interview_process as InterviewProcess
  };
};

export { fetchApplications, mapper };

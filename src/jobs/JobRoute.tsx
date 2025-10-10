import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { CompanyContext, JobSeekerContext } from '../Context';
import { Route } from '../routes/jobvana.jobs.$id';
import CompanyJobDetails from './company/JobDetails';
import JobSeekerJobDetails from './job_seekers/JobDetails';
import useJob from './job_seekers/useJob';

const JobRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { jobSeeker } = useContext(JobSeekerContext);
  const { company } = useContext(CompanyContext);
  const { job } = useJob(id);

  // companies can only view their own jobs
  if (userType === 'company' && job?.company.id !== company?.id) {
    return null;
  }

  return (
    <div className="mx-4 flex flex-col gap-2">
      {userType === 'job_seeker' && jobSeeker && (
        <JobSeekerJobDetails id={id} jobSeeker={jobSeeker} />
      )}
      {userType === 'company' && company && job && (
        <CompanyJobDetails company={company} jobId={id} />
      )}
    </div>
  );
};

export default JobRoute;

import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import ResourceContainer from '../containers/ResourceContainer';
import { CompanyContext, JobSeekerContext } from '../Context';
import { Route } from '../routes/jobvana.jobs.$id';
import CompanyJobDetails from './company/JobDetails';
import JobSeekerJobDetails from './job_seekers/JobDetails';

const JobRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { jobSeeker } = useContext(JobSeekerContext);
  const { company } = useContext(CompanyContext);

  return (
    <ResourceContainer>
      {userType === 'job_seeker' && jobSeeker && (
        <JobSeekerJobDetails id={id} jobSeeker={jobSeeker} />
      )}
      {userType === 'company' && company && (
        <CompanyJobDetails company={company} jobId={id} />
      )}
    </ResourceContainer>
  );
};

export default JobRoute;

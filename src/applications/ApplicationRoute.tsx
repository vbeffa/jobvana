import { useContext } from 'react';
import ResourceContainer from '../containers/ResourceContainer';
import { JobvanaContext } from '../Context';
import { Route } from '../routes/jobvana.applications.$id';
import CompanyApplicationDetails from './company/ApplicationDetails';
import JobSeekerApplicationDetails from './job_seeker/ApplicationDetails';

const ApplicationRoute = () => {
  const { id } = Route.useLoaderData();
  const { userType } = useContext(JobvanaContext);

  return (
    <ResourceContainer>
      {userType === 'job_seeker' && <JobSeekerApplicationDetails id={id} />}
      {userType === 'company' && <CompanyApplicationDetails id={id} />}
    </ResourceContainer>
  );
};

export default ApplicationRoute;

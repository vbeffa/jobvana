import { getUserType } from '../auth/utils';
import ResourceContainer from '../containers/ResourceContainer';
import { Route } from '../routes/jobvana.applications.$id';
import CompanyApplicationDetails from './company/ApplicationDetails';
import JobSeekerApplicationDetails from './job_seeker/ApplicationDetails';

const ApplicationRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();

  return (
    <ResourceContainer>
      {userType === 'job_seeker' && <JobSeekerApplicationDetails id={id} />}
      {userType === 'company' && <CompanyApplicationDetails id={id} />}
    </ResourceContainer>
  );
};

export default ApplicationRoute;

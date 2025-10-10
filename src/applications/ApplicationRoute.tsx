import { getUserType } from '../auth/utils';
import { Route } from '../routes/jobvana.applications.$id';
import CompanyApplicationDetails from './company/ApplicationDetails';
import JobSeekerApplicationDetails from './job_seeker/ApplicationDetails';

const ApplicationRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();

  return (
    <>
      {userType === 'job_seeker' && <JobSeekerApplicationDetails id={id} />}
      {userType === 'company' && <CompanyApplicationDetails id={id} />}
    </>
  );
};

export default ApplicationRoute;

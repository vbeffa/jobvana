import { getUserType } from '../auth/utils';
import { Route } from '../routes/jobvana.applications.$id';
import CompanyApplicationDetails from './company/ApplicationDetails';
import JobSeekerApplicationDetails from './job_seeker/ApplicationDetails';

const ApplicationRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();

  return (
    <div className="flex justify-center">
      <div className="border-[0.5px] border-blue-400 rounded-lg overflow-hidden w-[75%]">
        <div className="mt-2 mb-4">
          {userType === 'job_seeker' && <JobSeekerApplicationDetails id={id} />}
          {userType === 'company' && <CompanyApplicationDetails id={id} />}
        </div>
      </div>
    </div>
  );
};

export default ApplicationRoute;

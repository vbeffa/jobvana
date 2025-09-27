import { Route } from '../routes/jobvana.jobs.$id';
import JobDetails from './job_seekers/JobDetails';

const JobRoute = () => {
  const { id } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <JobDetails id={id} />
    </div>
  );
};

export default JobRoute;

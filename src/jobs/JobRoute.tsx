import { Route } from '../routes/jobvana.jobs.$id';
import JobDetails from './JobDetails';

const JobRoute = () => {
  const { id } = Route.useLoaderData();

  return <JobDetails id={id} />;
};

export default JobRoute;

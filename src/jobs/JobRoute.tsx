import { useContext } from 'react';
import { JobSeekerContext } from '../Context';
import { Route } from '../routes/jobvana.jobs.$id';
import JobDetails from './job_seekers/JobDetails';

const JobRoute = () => {
  const { id } = Route.useLoaderData();
  const { jobSeeker } = useContext(JobSeekerContext);

  if (!jobSeeker) {
    return null;
  }

  return (
    <div className="mx-4 flex flex-col gap-2">
      <JobDetails id={id} jobSeeker={jobSeeker} />
    </div>
  );
};

export default JobRoute;

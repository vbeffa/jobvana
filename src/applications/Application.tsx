import useApplication from '../hooks/useApplication';
import JobLink from '../jobs/JobLink';
import { Route } from '../routes/jobvana.applications.$id';

const Application = () => {
  const { id } = Route.useLoaderData();
  const { application } = useApplication({ id });

  if (!application) {
    return null;
  }

  return (
    <>
      <h2>Job</h2>
      <div className="card text-left">
        <JobLink job={application.job} />
      </div>
      <h2>Job Seeker</h2>
      <div className="card text-left">
        {application.jobSeeker.user.first_name}{' '}
        {application.jobSeeker.user.last_name}
      </div>
    </>
  );
};

export default Application;

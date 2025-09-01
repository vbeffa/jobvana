import useApplications from '../hooks/useApplications';
import JobLink from '../jobs/JobLink';
import Loading from '../Loading';
import ApplicationLink from './ApplicationLink';

const Applications = () => {
  const { applications } = useApplications();

  return (
    <>
      <h1>Applications</h1>

      <div className="card text-center justify-center">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[25%]">Job</th>
              <th>Job Seeker</th>
              <th>Application Details</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={applications} colSpan={3} />
            {applications?.map((application) => {
              return (
                <tr key={application.id}>
                  <td>
                    <JobLink job={application.job} />
                  </td>
                  <td>
                    {application.jobSeeker.user.first_name}{' '}
                    {application.jobSeeker.user.last_name}
                  </td>
                  <td>
                    <ApplicationLink application={application} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Applications;

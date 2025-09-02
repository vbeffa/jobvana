import { capitalize } from 'lodash';
import CompanyLink from '../companies/CompanyLink';
import useApplication from '../hooks/useApplication';
import JobLink from '../jobs/JobLink';

const ApplicationDetails = ({ id }: { id: number }) => {
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
      <h2>Company</h2>
      <div className="card text-left">
        <CompanyLink company={application.company} />
      </div>
      <h2>Job Seeker</h2>
      <div className="card text-left">
        {application.jobSeeker.user.first_name}{' '}
        {application.jobSeeker.user.last_name}
      </div>
      <h2>Status</h2>
      <div className="card text-left">
        {capitalize(application.status ?? 'pending')}
      </div>
      {application.status === 'accepted' && (
        <>
          <h2>Interview</h2>
          <div className="card text-left">Link</div>
        </>
      )}
      {application.status === 'rejected' && (
        <>
          <h2>Reason</h2>
          <div className="card text-left">{application.reason}</div>
        </>
      )}
    </>
  );
};

export default ApplicationDetails;

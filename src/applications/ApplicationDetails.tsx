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
      <div>
        <JobLink {...application.job} />
      </div>
      <h2>Company</h2>
      <div>
        <CompanyLink company={application.company} />
      </div>
      <h2>Job Seeker</h2>
      <div>
        {application.jobSeeker.user.first_name}{' '}
        {application.jobSeeker.user.last_name}
      </div>
      <h2>Status</h2>
      <div>{capitalize(application.status ?? 'pending')}</div>
      {application.status === 'accepted' && (
        <>
          <h2>Interview</h2>
          <div>Link</div>
        </>
      )}
      {application.status === 'rejected' && (
        <>
          <h2>Reason</h2>
          <div>{application.reason}</div>
        </>
      )}
    </>
  );
};

export default ApplicationDetails;

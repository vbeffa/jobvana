import { Link } from '@tanstack/react-router';
import type { Application } from '../hooks/useApplications';

const ApplicationLink = ({ application }: { application: Application }) => {
  return (
    <Link
      to="/jobvana/applications/$id"
      params={{ id: application.id.toString() }}
    >
      {application.job.title}
    </Link>
  );
};

export default ApplicationLink;

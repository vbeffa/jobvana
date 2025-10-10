import { Link } from '@tanstack/react-router';

export type ApplicationLinkParams = {
  applicationId: number;
  jobTitle: string;
};

const ApplicationLink = ({
  applicationId,
  jobTitle
}: ApplicationLinkParams) => {
  return (
    <Link
      to="/jobvana/applications/$id"
      params={{ id: applicationId.toString() }}
    >
      {jobTitle}
    </Link>
  );
};

export default ApplicationLink;

import type { ApplicationStatus } from '../../types';

export type ApplicationsListParams = {
  statuses: Array<ApplicationStatus>;
};

const ApplicationsList = ({ statuses }: ApplicationsListParams) => {
  const numSubmitted = statuses.filter(
    (status) => status === 'submitted'
  ).length;
  const numAccepted = statuses.filter((status) => status === 'accepted').length;
  const numDeclined = statuses.filter((status) => status === 'declined').length;
  const numWithdrawn = statuses.filter(
    (status) => status === 'withdrawn'
  ).length;

  return (
    <ul>
      <li>{numSubmitted} submitted</li>
      <li>{numAccepted} accepted</li>
      <li>{numDeclined} declined</li>
      <li>{numWithdrawn} withdrawn</li>
    </ul>
  );
};

export default ApplicationsList;

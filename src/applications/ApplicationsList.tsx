import type { Application } from '../hooks/useApplications';

export type ApplicationsListParams = {
  applications: Array<Pick<Application, 'status'>>;
};

const ApplicationsList = ({ applications }: ApplicationsListParams) => {
  const numPending = applications.filter((app) => app.status === null).length;
  const numAccepted = applications.filter(
    (app) => app.status === 'accepted'
  ).length;
  const numRejected = applications.filter(
    (app) => app.status === 'rejected'
  ).length;

  return (
    <ul>
      <li>{numPending} pending</li>
      <li>{numAccepted} accepted</li>
      <li>{numRejected} rejected</li>
      {/* {applications.map((application) => (
        <li key={application.id}>
          <ApplicationLink
            applicationId={application.id}
            jobTitle={job.title}
          />
        </li>
      ))} */}
    </ul>
  );
};

export default ApplicationsList;

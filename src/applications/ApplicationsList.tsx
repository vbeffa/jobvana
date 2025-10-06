import type { Application } from './useApplications';

export type ApplicationsListParams = {
  applications: Array<Pick<Application, 'status'>>;
};

// TODO this is unused
const ApplicationsList = ({ applications }: ApplicationsListParams) => {
  const numPending = applications.filter((app) => app.status === null).length;
  const numAccepted = applications.filter(
    (app) => app.status === 'accepted'
  ).length;
  const numDeclined = applications.filter(
    (app) => app.status === 'declined'
  ).length;

  return (
    <ul>
      <li>{numPending} pending</li>
      <li>{numAccepted} accepted</li>
      <li>{numDeclined} declined</li>
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

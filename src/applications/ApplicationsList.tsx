import type { Application } from './useApplicationsForJobSeeker';

export type ApplicationsListParams = {
  applications: Array<Pick<Application, 'status'>>;
};

const ApplicationsList = ({ applications }: ApplicationsListParams) => {
  const numSubmitted = applications.filter(
    (app) => app.status === 'submitted'
  ).length;
  const numAccepted = applications.filter(
    (app) => app.status === 'accepted'
  ).length;
  const numDeclined = applications.filter(
    (app) => app.status === 'declined'
  ).length;
  const numWithdrawn = applications.filter(
    (app) => app.status === 'withdrawn'
  ).length;

  return (
    <ul>
      <li>{numSubmitted} submitted</li>
      <li>{numAccepted} accepted</li>
      <li>{numDeclined} declined</li>
      <li>{numWithdrawn} withdrawn</li>
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

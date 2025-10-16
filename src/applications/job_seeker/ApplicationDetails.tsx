import { useContext, useState } from 'react';
import { JobSeekerContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import ApplicationDetailsContainer from '../ApplicationDetailsContainer';
import ApplicationEventsTable from '../ApplicationEventsTable';
import ApplicationResume from '../ApplicationResume';
import InterviewRoundEventsTable from '../InterviewRoundEventsTable';
import InterviewTable from '../InterviewTable';
import Status from '../Status';
import useApplicationEvents from '../useApplicationEvents';
import useInterview from '../useInterview';
import useInterviewRoundEvents from '../useInterviewRoundEvents';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { jobSeeker } = useContext(JobSeekerContext);
  const { application, refetch: refetchApplication } = useApplication({ id });
  const { events: applicationEvents } = useApplicationEvents({
    applicationId: id
  });
  const { interview, refetch: refetchInterview } = useInterview({
    applicationId: id
  });
  const { events: interviewRoundEvents, refetch: refetchInterviewRoundEvents } =
    useInterviewRoundEvents({
      interviewId: interview?.id
    });

  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error>();

  if (!application || !jobSeeker) {
    return null;
  }

  return (
    <ApplicationDetailsContainer>
      {isDownloading ? <Modal type="downloading" /> : null}
      {error ? <JobvanaError error={error} /> : null}
      <h1>Application Details</h1>
      <Section title="Application">
        <div>
          Submitted: {new Date(application.created_at).toLocaleDateString()}
        </div>
        <div className="flex flex-row gap-1">
          Status: <Status {...application} />
        </div>
        <div>
          Job: <JobLink {...application.job} />
        </div>
        <div>
          Job Seeker: {application.jobSeeker.first_name}{' '}
          {application.jobSeeker.last_name}
        </div>
        <div className="flex flex-row gap-1 items-center">
          Resume:
          <ApplicationResume
            resumePath={application.resumePath}
            setIsDownloading={setIsDownloading}
            setError={setError}
          />
        </div>
      </Section>

      <Section title="Interview Rounds">
        {application.interviewProcess && interview ? (
          <div className="flex flex-col gap-2">
            <InterviewTable
              interviewProcess={application.interviewProcess}
              interview={interview}
              userType="job_seeker"
              userId={jobSeeker.user_id}
              onUpdate={() => {
                refetchApplication();
                refetchInterview();
                refetchInterviewRoundEvents();
              }}
            />
            {interviewRoundEvents?.length ? (
              <div>
                <h2>History</h2>
                <InterviewRoundEventsTable
                  events={interviewRoundEvents}
                  userId={jobSeeker.user_id}
                  jobSeeker={application.jobSeeker}
                  company={application.company}
                />
              </div>
            ) : null}
          </div>
        ) : application.status === 'submitted' ? (
          'Pending until the company accepts the application.'
        ) : (
          `Application is ${application.status}`
        )}
      </Section>

      <Section title="Events" isLast={true}>
        {applicationEvents?.length ? (
          <ApplicationEventsTable
            events={applicationEvents}
            jobSeeker={application.jobSeeker}
            company={application.company}
          />
        ) : (
          'No events'
        )}
      </Section>
    </ApplicationDetailsContainer>
  );
};

export default ApplicationDetails;

import { useContext, useState } from 'react';
import { CompanyContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
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
  const { company } = useContext(CompanyContext);
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

  if (!application || !company?.user_id) {
    return null;
  }

  return (
    <div className="mx-4">
      {isDownloading && <Modal type="downloading" />}
      {error && <JobvanaError error={error} />}
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
              userType="company"
              userId={company.user_id}
              onUpdate={() => {
                refetchApplication();
                refetchInterview();
                refetchInterviewRoundEvents();
              }}
            />
            {interviewRoundEvents?.length && (
              <div>
                <h2>History</h2>
                <InterviewRoundEventsTable
                  events={interviewRoundEvents}
                  userId={company.user_id}
                  jobSeeker={application.jobSeeker}
                  company={company}
                />
              </div>
            )}
          </div>
        ) : application.status === 'submitted' ? (
          'Pending until you accept the application.'
        ) : (
          `Application is ${application.status}`
        )}
      </Section>

      <Section title="Application History" isLast={true}>
        {applicationEvents?.length ? (
          <ApplicationEventsTable
            events={applicationEvents}
            jobSeeker={application.jobSeeker}
            company={company}
          />
        ) : (
          'No events'
        )}
      </Section>
    </div>
  );
};

export default ApplicationDetails;

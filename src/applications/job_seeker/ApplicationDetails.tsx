import { useState } from 'react';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import ApplicationResume from '../ApplicationResume';
import Events from '../Events';
import InterviewTable from '../InterviewTable';
import Status from '../Status';
import useEvents from '../useEvents';
import useInterview from '../useInterview';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { application } = useApplication({ id });
  const { events } = useEvents({ applicationId: id });
  const { interview, refetch } = useInterview({ applicationId: id });

  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error>();

  if (!application) {
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

      <Section title="Events">
        {events ? (
          <Events
            events={events}
            jobSeeker={application.jobSeeker}
            company={application.company}
          />
        ) : (
          'No events'
        )}
      </Section>

      <Section title="Interview Rounds" isLast={true}>
        {application.interviewProcess && interview ? (
          <InterviewTable
            interviewProcess={application.interviewProcess}
            interview={interview}
            userType="job_seeker"
            onUpdate={refetch}
          />
        ) : null}
      </Section>
    </div>
  );
};

export default ApplicationDetails;

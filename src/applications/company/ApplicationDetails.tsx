import { useContext } from 'react';
import { CompanyContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import Section from '../../Section';
import Events from '../Events';
import Interview from '../Interview';
import Status from '../Status';
import useEvents from '../useEvents';
import useInterview from '../useInterview';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { company } = useContext(CompanyContext);
  const { application } = useApplication({ id });
  const { events } = useEvents({ applicationId: id });
  const { interview } = useInterview({ applicationId: id });

  if (!application || !company) {
    return null;
  }

  return (
    <div className="mx-4">
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
      </Section>

      <Section title="Events">
        {events ? (
          <Events
            events={events}
            jobSeeker={application.jobSeeker}
            company={company}
          />
        ) : (
          'No events'
        )}
      </Section>

      <Section title="Interview" isLast={true}>
        {application.interviewProcess && interview ? (
          <Interview
            interviewProcess={application.interviewProcess}
            interview={interview}
          />
        ) : null}
      </Section>
    </div>
  );
};

export default ApplicationDetails;

import { useCallback, useContext } from 'react';
import InterviewProcessDisplay from '../../companies/InterviewProcessDisplay';
import { CompanyContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import Section from '../../Section';
import type { ApplicationStatus } from '../../types';
import Status from '../Status';
import useEventsForApplication from '../useEventsForApplication';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { application } = useApplication({ id });
  const { events } = useEventsForApplication({ applicationId: id });
  const { company } = useContext(CompanyContext);

  const eventUser = useCallback(
    (event: ApplicationStatus) => {
      if (!application || !company) {
        return undefined;
      }
      switch (event) {
        case 'submitted':
        case 'withdrawn':
          return `${application.jobSeeker.first_name} ${application.jobSeeker.last_name}`;
        case 'accepted':
        case 'declined':
          return company.name;
      }
    },
    [application, company]
  );

  if (!application) {
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
          <table className="w-fit">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                  <td>
                    <div className="flex justify-center px-2">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="px-2">
                      <Status status={event.event} />
                    </div>
                  </td>
                  <td>
                    <div className="px-2">{eventUser(event.event)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          'No events'
        )}
      </Section>

      <Section title="Interview Rounds" isLast={true}>
        {application.interviewProcess && (
          <div className="border-[0.5px] border-blue-300 rounded-lg mt-2 px-4 py-4">
            <InterviewProcessDisplay
              interviewProcess={application.interviewProcess}
            />
          </div>
        )}
      </Section>
    </div>
  );
};

export default ApplicationDetails;

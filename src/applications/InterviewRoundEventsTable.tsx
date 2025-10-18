import { FaBuilding, FaUser } from 'react-icons/fa6';
import { getUserType } from '../auth/utils';
import Status from './Status';
import type { InterviewRoundEvent } from './useInterviewRoundEvents';
import { type Company, type JobSeeker } from './utils';

const InterviewRoundEventsTable = ({
  events,
  userId,
  jobSeeker,
  company
}: {
  events: Array<InterviewRoundEvent>;
  userId: string;
  jobSeeker: JobSeeker;
  company: Company;
}) => {
  const userType = getUserType();

  const interviewRoundEventUser = (eventUserId: string) => {
    const eventUser =
      eventUserId === userId
        ? userType
        : userType === 'company'
          ? 'job_seeker'
          : 'company';

    return (
      <div className="flex flex-row items-center gap-1">
        {eventUser === 'company' && (
          <>
            <FaBuilding />
            {company.name}
          </>
        )}
        {eventUser === 'job_seeker' && (
          <>
            <FaUser />
            {jobSeeker.first_name} {jobSeeker.last_name}
          </>
        )}
      </div>
    );
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Round</th>
          <th>Date</th>
          <th>Event</th>
          <th>User</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, idx) => (
          <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
            <td>
              <div className="flex justify-center px-2">{event.round}</div>
            </td>
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
              <div className="px-2">
                {interviewRoundEventUser(event.user_id)}
              </div>
            </td>
            <td className="w-[35%]">
              <div className="px-2">TODO</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InterviewRoundEventsTable;

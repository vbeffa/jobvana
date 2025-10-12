import Status from './Status';
import type { ApplicationEvent } from './useEvents';
import { eventUser, type Company, type JobSeeker } from './utils';

const Events = ({
  events,
  jobSeeker,
  company
}: {
  events: Array<ApplicationEvent>;
  jobSeeker: JobSeeker;
  company: Company;
}) => {
  return (
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
              <div className="px-2">
                {eventUser(event.event, jobSeeker, company)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Events;

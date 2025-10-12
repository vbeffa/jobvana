import {
  roundTypeToString,
  type InterviewProcess
} from '../companies/company/utils';
import InterviewProcessLocation from '../companies/InterviewProcessLocation';
import type { Interview } from './useInterview';

const Status = ({
  interviewProcess,
  interview
}: {
  interviewProcess: InterviewProcess;
  interview: Interview;
}) => {
  return (
    <table className="w-fit">
      <thead>
        <tr>
          <th>Round</th>
          <th>Type</th>
          <th>Location</th>
          <th>Duration</th>
          <th>Job Seeker Response</th>
          <th>Company Response</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {interviewProcess.rounds.map((round, idx) => {
          const intRound = interview.rounds[idx];
          return (
            <tr
              key={idx}
              className={`${idx % 2 === 1 ? 'bg-gray-200' : ''} ${
                idx >= interview.rounds.length ? 'text-gray-400' : ''
              }`}
            >
              <td>
                <div className="flex justify-center px-2">{idx + 1}</div>
              </td>
              <td>
                <div className="px-2">{roundTypeToString(round.type)}</div>
              </td>
              <td>
                <div className="px-2">
                  <InterviewProcessLocation {...round} />
                </div>
              </td>
              <td>
                <div className="px-2">
                  {round.duration} {round.durationUnit}
                  {round.duration > 1 ? 's' : ''}
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                  {intRound ? (intRound.job_seeker_response ?? 'Pending') : '-'}
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                  {intRound ? (intRound.company_response ?? 'Pending') : '-'}
                </div>
              </td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Status;

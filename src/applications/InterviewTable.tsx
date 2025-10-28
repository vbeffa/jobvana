import { useCallback, useState } from 'react';
import { FaCheck, FaX } from 'react-icons/fa6';
import {
  roundTypeToString,
  type InterviewProcess
} from '../companies/company/utils';
import InterviewProcessLocation from '../companies/InterviewProcessLocation';
import type { UserType } from '../Context';
import JobvanaError from '../JobvanaError';
import Modal from '../Modal';
import Status from './Status';
import type { Interview } from './useInterview';
import { updateRound } from './utils';

const InterviewTable = ({
  interviewProcess,
  interview,
  userType,
  userId,
  onUpdate
}: {
  interviewProcess: InterviewProcess;
  interview: Interview;
  userType: UserType;
  userId: string;
  onUpdate: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false); // TODO move to ApplicationDetails
  const [error, setError] = useState<Error>();

  const accept = useCallback(
    async (round: number) => {
      if (
        !confirm('Are you sure you want to continue the interview process?')
      ) {
        return;
      }

      setIsUpdating(true);
      try {
        const [roundCompleted, allRoundsCompleted] = await updateRound({
          applicationId: interview.application_id,
          interviewId: interview.id,
          round,
          numRounds: interviewProcess.rounds.length,
          status: 'accepted',
          userType,
          userId
        });
        onUpdate();
        if (allRoundsCompleted) {
          alert('Interview process complete!');
        } else if (roundCompleted) {
          alert('Round completed; on to the next round!');
        } else {
          alert('Interview round marked as accepted.');
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [
      interview.application_id,
      interview.id,
      interviewProcess.rounds.length,
      onUpdate,
      userId,
      userType
    ]
  );

  const decline = useCallback(
    async (round: number) => {
      if (
        !confirm(
          'Are you sure you want to decline this round? The application will also be marked as declined.'
        )
      ) {
        return;
      }

      setIsUpdating(true);
      try {
        await updateRound({
          applicationId: interview.application_id,
          interviewId: interview.id,
          round,
          numRounds: interviewProcess.rounds.length,
          status: 'declined',
          userType,
          userId
        });
        // TODO refresh the applications list as well
        onUpdate();
        alert('Interview round and application marked as declined.');
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [
      interview.application_id,
      interview.id,
      interviewProcess.rounds.length,
      onUpdate,
      userId,
      userType
    ]
  );

  return (
    <>
      <div className="relative top-10">
        {isUpdating && <Modal type="updating" />}
        {error && <JobvanaError error={error} />}
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th>Round</th>
            <th>Type</th>
            <th>Location</th>
            <th>Duration</th>
            <th>{userType === 'company' ? 'Job Seeker' : 'My'} Response</th>
            <th>{userType === 'company' ? 'My' : 'Company'} Response</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviewProcess.rounds.map((round, idx) => {
            const interviewRound =
              idx > interview.rounds.length ? undefined : interview.rounds[idx];
            const disabled = idx >= interview.rounds.length;
            const jobSeekerResponse = interviewRound ? (
              <Status status={interviewRound.job_seeker_response} />
            ) : (
              '-'
            );
            const companyResponse = interviewRound ? (
              <Status status={interviewRound.company_response} />
            ) : (
              '-'
            );
            const hasActions =
              interviewRound &&
              ((userType === 'company' &&
                interviewRound.company_response === 'pending') ||
                (userType === 'job_seeker' &&
                  interviewRound.job_seeker_response === 'pending'));

            return (
              <tr
                key={idx}
                className={`${idx % 2 === 1 ? 'bg-gray-200' : ''} ${disabled ? 'text-gray-400' : ''}`}
              >
                <td>
                  <div className="flex justify-center px-2">{idx + 1}</div>
                </td>
                <td>
                  <div className="px-2">{roundTypeToString(round.type)}</div>
                </td>
                <td>
                  <div className="px-2">
                    <InterviewProcessLocation {...round} disabled={disabled} />
                  </div>
                </td>
                <td>
                  <div className="px-2">
                    {round.duration} {round.durationUnit}
                    {round.duration > 1 ? 's' : ''}
                  </div>
                </td>
                <td>
                  <div
                    className={`flex ${userType === 'company' ? 'justify-center' : 'px-2'}`}
                  >
                    {jobSeekerResponse}
                  </div>
                </td>
                <td>
                  <div
                    className={`flex ${userType === 'company' ? 'px-2' : 'justify-center'}`}
                  >
                    {companyResponse}
                  </div>
                </td>
                <td className="content-center">
                  <div className="flex justify-center">
                    {hasActions ? (
                      <div className="flex flex-row gap-1 text-blue-400 ">
                        <div
                          className="cursor-pointer"
                          onClick={() => accept(interviewRound.round)}
                        >
                          <FaCheck />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => decline(interviewRound.round)}
                        >
                          <FaX />
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default InterviewTable;

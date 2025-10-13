import { useCallback, useState } from 'react';
import { FaCheck, FaX } from 'react-icons/fa6';
import {
  roundTypeToString,
  type InterviewProcess
} from '../companies/company/utils';
import InterviewProcessLocation from '../companies/InterviewProcessLocation';
import type { UserType } from '../Context';
import supabase from '../db/supabase';
import JobvanaError from '../JobvanaError';
import Modal from '../Modal';
import type { InterviewRoundStatus } from '../types';
import Status from './Status';
import type { Interview } from './useInterview';

const InterviewTable = ({
  interviewProcess,
  interview,
  userType,
  onUpdate
}: {
  interviewProcess: InterviewProcess;
  interview: Interview;
  userType: UserType;
  onUpdate: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error>();

  const updateRound = useCallback(
    async (
      interviewId: number,
      round: number,
      status: InterviewRoundStatus
    ) => {
      const { data, error } = await supabase
        .from('interview_rounds')
        .update(
          userType === 'company'
            ? { company_response: status }
            : { job_seeker_response: status }
        )
        .filter('interview_id', 'eq', interviewId)
        .filter('round', 'eq', round)
        .select();

      if (error) {
        console.log(error);
        throw error;
      }
      const interviewRound = data[0];
      if (
        interviewRound.company_response === 'accepted' &&
        interviewRound.job_seeker_response === 'accepted' &&
        interviewRound.round < interviewProcess.rounds.length
      ) {
        const { error: interviewRoundsErr } = await supabase
          .from('interview_rounds')
          .insert({
            interview_id: interview.id,
            round: interviewRound.round + 1
          });
        if (interviewRoundsErr) {
          console.log(interviewRoundsErr);
          throw interviewRoundsErr;
        }
      }
    },
    [interview.id, interviewProcess.rounds.length, userType]
  );

  const accept = useCallback(
    async (round: number) => {
      if (
        !confirm('Are you sure you want to continue the interview process?')
      ) {
        return;
      }

      setIsUpdating(true);
      try {
        await updateRound(interview.id, round, 'accepted');
        onUpdate();
        alert('Interview round marked as accepted.');
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [interview.id, onUpdate, updateRound]
  );

  const decline = useCallback(
    async (round: number) => {
      if (
        !confirm(
          'Are you sure you want to withdraw from the interview process?'
        )
      ) {
        return;
      }

      try {
        await updateRound(interview.id, round, 'declined');
        onUpdate();
        alert('Interview round marked as declined.');
      } catch (err) {
        setError(err as Error);
      }
    },
    [interview.id, onUpdate, updateRound]
  );

  return (
    <>
      {isUpdating && <Modal type="updating" />}
      {error && <JobvanaError error={error} />}
      <table className="w-fit">
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

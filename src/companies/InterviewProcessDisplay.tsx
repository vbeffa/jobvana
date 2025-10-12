import { FaTriangleExclamation } from 'react-icons/fa6';
import Hr from '../Hr';
import { type InterviewProcess, roundTypeToString } from './company/utils';
import InterviewProcessLocation from './InterviewProcessLocation';

const InterviewProcessDisplay = ({
  interviewProcess,
  activeApplicationCount
}: {
  interviewProcess: InterviewProcess;
  activeApplicationCount?: number;
}) => {
  return (
    <>
      <div className="border-[0.5px] border-blue-300 rounded-lg w-full p-2 flex flex-col gap-2">
        <div className="grid grid-cols-[20%_30%_20%_20%] gap-2">
          <div className="flex justify-center">Round</div>
          <div>Type</div>
          <div>Location</div>
          <div>Duration</div>
        </div>
        <div className="-mx-2 border-b-[0.5px] border-blue-300" />
        {interviewProcess.rounds.length === 0 && (
          <div className="flex justify-center gap-1">
            <div className="text-yellow-400 content-center">
              <FaTriangleExclamation />
            </div>
            Please edit your process and add some rounds
          </div>
        )}
        {interviewProcess.rounds.map((round, idx) => {
          return (
            <div key={idx} className="grid grid-cols-[20%_30%_20%_20%] gap-2">
              <div className="flex justify-center">{idx + 1}</div>
              <div>{roundTypeToString(round.type)}</div>
              <InterviewProcessLocation {...round} />
              <div className="pl-1">
                {round.duration} {round.durationUnit}
                {round.duration !== 1 && 's'}
              </div>
            </div>
          );
        })}
      </div>
      <Hr />
      <div>
        Pipeline size: {interviewProcess.pipeline_size} job seeker
        {interviewProcess.pipeline_size !== 1 && 's'}
      </div>
      {activeApplicationCount !== undefined && (
        <div>
          Current Pipeline: {activeApplicationCount} active application
          {activeApplicationCount !== 1 && 's'} out of{' '}
          {interviewProcess.pipeline_size}
        </div>
      )}
    </>
  );
};

export default InterviewProcessDisplay;

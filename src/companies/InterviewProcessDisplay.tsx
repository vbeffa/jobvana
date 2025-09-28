import { capitalize } from 'lodash';
import { FaTriangleExclamation } from 'react-icons/fa6';
import Hr from '../Hr';
import { type InterviewProcess, formatType } from './company/utils';

const InterviewProcessDisplay = ({
  interviewProcess
}: {
  interviewProcess: InterviewProcess;
}) => {
  return (
    <>
      <div className="border-[0.5px] border-blue-300 rounded-lg w-[600px] p-2 flex flex-col gap-2">
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
              <div>{formatType(round.type)}</div>
              <div className="pl-1">{capitalize(round.location)}</div>
              <div className="pl-1">
                {round.duration} {round.durationUnit}
                {round.duration !== 1 && 's'}
              </div>
            </div>
          );
        })}
      </div>
      <Hr />
      Pipeline: {interviewProcess.pipeline_size} job seeker
      {interviewProcess.pipeline_size !== 1 ? 's' : ''}
    </>
  );
};

export default InterviewProcessDisplay;

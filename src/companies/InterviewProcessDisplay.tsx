import { capitalize } from 'lodash';
import { type InterviewProcess, formatType } from './company/utils';

const InterviewProcessDisplay = ({
  interviewProcess
}: {
  interviewProcess: InterviewProcess;
}) => {
  return (
    <>
      <div className="grid grid-cols-[20%_40%_20%_20%] gap-2">
        <div className="flex justify-center">Round</div>
        <div>Type</div>
        <div>Location</div>
        <div>Duration</div>
      </div>
      <div className="-mx-2 border-b-[0.5px] border-blue-300" />
      {interviewProcess.rounds.map((round, idx) => {
        return (
          <div key={idx} className="grid grid-cols-[20%_40%_20%_20%] gap-2">
            <div className="flex justify-center">{idx + 1}</div>
            <div>{formatType(round.type)}</div>
            <div>{capitalize(round.location)}</div>
            <div>
              {round.duration} {round.durationUnit}
              {round.duration !== 1 && 's'}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default InterviewProcessDisplay;

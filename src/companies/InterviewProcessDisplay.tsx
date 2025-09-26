import { capitalize } from 'lodash';
import { type InterviewProcess, formatType } from './company/utils';

const InterviewProcessDisplay = ({
  interviewProcess
}: {
  interviewProcess: InterviewProcess;
}) => {
  return interviewProcess.rounds.map((round, idx) => {
    return (
      <div key={idx} className="grid grid-cols-[10%_18%_10%_10%] gap-2">
        <div>Round {idx + 1}</div>
        <div>{formatType(round.type)}</div>
        <div>{capitalize(round.location)}</div>
        <div>
          {round.duration} {round.durationUnit}
          {round.duration !== 1 && 's'}
        </div>
      </div>
    );
  });
};

export default InterviewProcessDisplay;

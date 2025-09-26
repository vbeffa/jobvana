import _ from 'lodash';
import InterviewRoundEdit from './InterviewRoundEdit';
import type { InterviewProcess } from './utils';

const InterviewProcessEdit = ({
  interviewProcess,
  setInterviewProcess
}: {
  interviewProcess: InterviewProcess;
  setInterviewProcess: React.Dispatch<React.SetStateAction<InterviewProcess>>;
}) => {
  return interviewProcess.rounds.map((round, idx) => {
    return (
      <div key={idx} className="grid grid-cols-[10%_20%_15%_17%_12%] gap-2">
        <div className="content-center">Round {idx + 1}</div>
        <InterviewRoundEdit
          round={round}
          idx={idx}
          onChange={(round) => {
            setInterviewProcess((process) => {
              const updatedProcess = _.cloneDeep(process);
              updatedProcess.rounds[idx] = round;
              return updatedProcess;
            });
          }}
        />
      </div>
    );
  });
};

export default InterviewProcessEdit;

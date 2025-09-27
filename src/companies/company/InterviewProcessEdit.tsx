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
  return (
    <>
      <div className="grid grid-cols-[10%_20%_15%_17%_12%] gap-2">
        <div className="col-start-2 flex justify-center">Type</div>
        <div className="flex justify-center">Location</div>
        <div className="col-span-2 flex justify-center">Duration</div>
      </div>
      {interviewProcess.rounds.map((round, idx) => {
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
      })}
      <div className="grid grid-cols-[10%_20%_15%_17%_12%] gap-2">
        <div className="col-start-2 col-span-4 text-sm">
          Notes:
          <br />
          <ul>
            <li>Max 5 rounds</li>
            <li>Type "Take Home" requires Location "Offline"</li>
            <li>Duration type "hour(s)" has increment 0.25, max 12</li>
            <li>Duration type "day(s)" has max 30</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default InterviewProcessEdit;

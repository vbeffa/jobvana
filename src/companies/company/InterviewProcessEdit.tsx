import _ from 'lodash';
import { FaPlus, FaTrash } from 'react-icons/fa6';
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
          <div
            key={idx}
            className="relative grid grid-cols-[10%_20%_15%_17%_12%] gap-2"
          >
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
            {interviewProcess.rounds.length > 1 && (
              <div
                className="absolute text-gray-400 top-2 right-41 cursor-pointer"
                onClick={() => {
                  setInterviewProcess((process) => {
                    const updatedProcess = _.cloneDeep(process);
                    updatedProcess.rounds.splice(idx, 1);
                    return updatedProcess;
                  });
                }}
              >
                <FaTrash />
              </div>
            )}
          </div>
        );
      })}
      <div className="grid grid-cols-[10%_20%_15%_17%_12%] gap-2">
        {interviewProcess.rounds.length < 5 && (
          <div
            className="col-start-2 col-span-4 text-gray-400 mb-2 cursor-pointer"
            onClick={() => {
              setInterviewProcess((process) => {
                const updatedProcess = _.cloneDeep(process);
                updatedProcess.rounds.push({
                  type: 'recruiter',
                  location: 'phone',
                  duration: 1,
                  durationUnit: 'hour'
                });
                return updatedProcess;
              });
            }}
          >
            <FaPlus />
          </div>
        )}
        <div className="col-start-2 col-span-4 text-sm">
          Notes:
          <br />
          <ul>
            <li>Max 5 rounds</li>
            <li>
              Type "Take Home" requires Location "Offline" and Duration Unit
              "Days"
            </li>
            <li>Duration Unit "Hours" has increment 0.25, max 12</li>
            <li>Duration Unit "Days" has max 30</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default InterviewProcessEdit;

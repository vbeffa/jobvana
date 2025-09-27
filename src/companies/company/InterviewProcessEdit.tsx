import _ from 'lodash';
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from 'react-icons/fa6';
import InterviewRoundEdit from './InterviewRoundEdit';
import type { InterviewProcess } from './utils';

const InterviewProcessEdit = ({
  interviewProcess,
  setInterviewProcess
}: {
  interviewProcess: InterviewProcess;
  setInterviewProcess: React.Dispatch<React.SetStateAction<InterviewProcess>>;
}) => {
  const { rounds } = interviewProcess;

  return (
    <>
      <div className="grid grid-cols-[8%_20%_20%_20%_19%] gap-2">
        <div className="flex justify-center">
          Round<span className="text-xs align-super">1</span>
        </div>
        <div className="flex justify-center">
          Type<span className="text-xs align-super">2</span>
        </div>
        <div className="flex justify-center">Location</div>
        <div className="col-span-2 flex justify-center">
          Duration<span className="text-xs align-super">3,4</span>
        </div>
      </div>
      <div className="-mx-2 mb-1 border-b-[0.5px] border-blue-300" />
      {rounds.map((round, idx) => {
        return (
          <div
            key={idx}
            className="relative grid grid-cols-[8%_25%_20%_20%_19%] gap-2"
          >
            <div className="content-center flex justify-center">{idx + 1}</div>
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
            {rounds.length > 1 && (
              <>
                <div
                  className="absolute text-gray-400 top-2 right-0 cursor-pointer"
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
                {idx < rounds.length - 1 && (
                  <div
                    className="absolute text-gray-400 top-2 right-4.5 cursor-pointer"
                    onClick={() => {
                      setInterviewProcess((process) => {
                        const updatedProcess = _.cloneDeep(process);
                        const tmp = _.cloneDeep(updatedProcess.rounds[idx]);
                        const tmp2 = _.cloneDeep(
                          updatedProcess.rounds[idx + 1]
                        );
                        updatedProcess.rounds[idx] = tmp2;
                        updatedProcess.rounds[idx + 1] = tmp;
                        return updatedProcess;
                      });
                    }}
                  >
                    <FaArrowDown />
                  </div>
                )}
                {idx > 0 && (
                  <div
                    className="absolute text-gray-400 top-2 right-8.5 cursor-pointer"
                    onClick={() => {
                      setInterviewProcess((process) => {
                        const updatedProcess = _.cloneDeep(process);
                        const tmp = _.cloneDeep(updatedProcess.rounds[idx]);
                        const tmp2 = _.cloneDeep(
                          updatedProcess.rounds[idx - 1]
                        );
                        updatedProcess.rounds[idx] = tmp2;
                        updatedProcess.rounds[idx - 1] = tmp;
                        return updatedProcess;
                      });
                    }}
                  >
                    <FaArrowUp />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
      <div className="grid grid-cols-[8%_20%_20%_20%_19%] gap-2">
        {rounds.length < 5 && (
          <div
            className="col-start-2 col-span-4 text-gray-400 pt-1 mb-1 cursor-pointer"
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
          <div className="flex flex-col">
            <div>1. Max 5 rounds</div>
            <div>
              2. Type "Take Home" requires Location "Offline" and Duration Unit
              "Days"
            </div>
            <div>3. Duration Unit "Hours" has increment 0.25, max 12</div>
            <div>4. Duration Unit "Days" has max 30</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewProcessEdit;

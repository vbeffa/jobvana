import { useState } from 'react';
import SummaryCard from '../SummaryCard';
import InterviewDetails from './InterviewDetails';
import useInterviews from './useInterviews';

const Interviews = () => {
  const { interviews } = useInterviews();
  const [interviewId, setInterviewId] = useState<number | null>(null);

  return (
    <>
      <h1>Interviews</h1>
      <div className="flex flex-row gap-x-2">
        <div className="w-[20%]">
          {interviews?.map((interview, idx) => (
            <SummaryCard
              key={interview.id}
              selected={interviewId === interview.id}
              onClick={() => setInterviewId(interview.id)}
              title={interview.application_id.toString()}
              // text={interview.status ?? ''}
              borderBottom={idx < interviews.length - 1}
            />
          ))}
        </div>
        <div className="w-[80%]">
          {interviewId && <InterviewDetails id={interviewId} />}
        </div>
      </div>
    </>
  );
};

export default Interviews;

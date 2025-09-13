import { useState } from 'react';
import SummaryCard from '../SummaryCard';
import ApplicationDetails from './ApplicationDetails';
import useApplications from './useApplications';

const Applications = () => {
  const { applications } = useApplications();
  const [applicationId, setApplicationId] = useState<number | null>(null);

  return (
    <>
      <h1>Applications</h1>
      <div className="flex flex-row gap-x-2">
        <div className="w-[20%]">
          {applications?.map((application, idx) => (
            <SummaryCard
              key={application.id}
              selected={applicationId === application.id}
              onClick={() => setApplicationId(application.id)}
              title={application.job.title}
              text={`${application.jobSeeker.user.first_name} ${application.jobSeeker.user.last_name}`}
              borderBottom={idx < applications.length - 1}
            />
          ))}
        </div>
        <div className="w-[80%]">
          {applicationId && <ApplicationDetails id={applicationId} />}
        </div>
      </div>
    </>
  );
};

export default Applications;

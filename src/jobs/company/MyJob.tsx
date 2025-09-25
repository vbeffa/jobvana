import MyJobMain from './MyJobMain';
import MyJobRoles from './MyJobRoles';
import type { Job } from './useJobsForCompany';

export type MyCompanyJobProps = {
  job: Job;
  onUpdate: () => void;
};

const MyJob = ({ job, onUpdate }: MyCompanyJobProps) => {
  return (
    <>
      <MyJobMain job={job} onUpdate={onUpdate} />
      <hr className="col-span-2 my-4 border-gray-400 shadow" />
      <MyJobRoles job={job} onUpdate={onUpdate} />
    </>
  );
};

export default MyJob;

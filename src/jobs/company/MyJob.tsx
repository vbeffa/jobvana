import MyJobMain from './MyJobMain';
import MyJobRoles from './MyJobRoles';
import type { Edit } from './MyJobs';
import MyJobSkills from './MyJobSkills';
import type { Job } from './useJobsForCompany';

export type MyJobProps = {
  job: Job;
  onUpdate: () => void;
  edit: Edit;
  setEdit: (edit: Edit) => void;
};

const MyJob = ({ job, onUpdate, edit, setEdit }: MyJobProps) => {
  return (
    <>
      <MyJobMain job={job} onUpdate={onUpdate} edit={edit} setEdit={setEdit} />
      <hr className="col-span-2 my-4 border-gray-400 shadow" />
      <MyJobRoles job={job} onUpdate={onUpdate} edit={edit} setEdit={setEdit} />
      <hr className="col-span-2 my-4 border-gray-400 shadow" />
      <MyJobSkills job={job} onUpdate={onUpdate} />
    </>
  );
};

export default MyJob;

import MyJobMain from './MyJobMain';
import MyJobRoles from './MyJobRoles';
import type { Edit } from './MyJobs';
import MyJobSkills from './MyJobSkills';
import type { Job } from './useJobsForCompany';

export type MyJobProps = {
  job: Job;
  onStartUpdate: () => void;
  onFinishUpdate: () => void;
  edit: Edit;
  setEdit: (edit: Edit) => void;
};

const MyJob = ({
  job,
  onStartUpdate,
  onFinishUpdate,
  edit,
  setEdit
}: MyJobProps) => {
  return (
    <>
      <MyJobMain
        job={job}
        onStartUpdate={onStartUpdate}
        onFinishUpdate={onFinishUpdate}
        edit={edit}
        setEdit={setEdit}
      />
      <hr className="col-span-2 my-4 border-gray-400 shadow" />
      <MyJobRoles
        job={job}
        onStartUpdate={onStartUpdate}
        onFinishUpdate={onFinishUpdate}
        edit={edit}
        setEdit={setEdit}
      />
      <hr className="col-span-2 my-4 border-gray-400 shadow" />
      <MyJobSkills
        job={job}
        onStartUpdate={onStartUpdate}
        onFinishUpdate={onFinishUpdate}
        edit={edit}
        setEdit={setEdit}
      />
    </>
  );
};

export default MyJob;

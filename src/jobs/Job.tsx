import useJob from "../hooks/useJob";
import useSkills from "../hooks/useSkills";
import JobSkills from "../jobs/JobSkills";
import Salary from "./Salary";

const Job = ({
  id,
  gotoSkill,
  gotoSkillVersion
}: {
  id: number;
  gotoSkill: (skillId: number) => void;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  const { job } = useJob({ id });
  const { skills } = useSkills();

  if (!job) {
    return null;
  }

  return (
    <>
      <h1>
        {job.company?.name} - {job.title}
      </h1>
      <h2>Description</h2>
      <div className="card text-left">{job.description}</div>
      <h2>Created</h2>
      <div className="card text-left">
        {new Date(job.created_at).toDateString()}
      </div>
      <h2>Status</h2>
      <div className="card text-left">{job.status}</div>
      <h2>Salary</h2>
      <div className="card text-left">
        <Salary job={job} />
      </div>

      <h2>Skills</h2>
      <div className="card text-left">
        <JobSkills
          job={job}
          skills={skills}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      </div>
    </>
  );
};

export default Job;

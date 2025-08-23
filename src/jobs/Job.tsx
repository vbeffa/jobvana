import Salary from "./Salary";
import useCompanies from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import useSkills from "../hooks/useSkills";
import JobSkills from "../jobs/JobSkills";

const Job = ({
  id,
  gotoSkill,
  gotoSkillVersion
}: {
  id: number;
  gotoSkill: (skillId: number) => void;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  const companies = useCompanies();
  const jobs = useJobs();
  const job = jobs.job(id);
  const skills = useSkills();

  if (!job) {
    return null;
  }

  return (
    <>
      <h1>
        {companies.company(job.company_id)?.name} - {job.title}
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

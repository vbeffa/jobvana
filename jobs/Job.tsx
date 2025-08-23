import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";
import useJobs from "../src/hooks/useJobs";
import useSkills from "../src/hooks/useSkills";
import JobSkills from "./JobSkills";
import Salary from "./Salary";

const Job = ({ id }: { id: number }) => {
  const companies = useCompanies();
  const jobs = useJobs();
  const job = jobs.job(id);
  const skills = useSkills();

  if (!job) {
    return (
      <div>
        <Header currPage="job" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="job" />
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
        <JobSkills job={job} skills={skills} />
      </div>
    </>
  );
};

export default Job;

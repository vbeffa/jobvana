import CompanyLink from "../companies/CompanyLink";
import useJob from "../hooks/useJob";
import JobSkills from "../jobs/JobSkills";
import { Route } from "../routes/jobvana.jobs.$id";
import Salary from "./Salary";

const Job = () => {
  const { id } = Route.useLoaderData();
  const { job } = useJob({ id });

  if (!job) {
    return null;
  }

  return (
    <>
      <h1>{job.title}</h1>
      <h2>Company</h2>
      <div className="card text-left">
        {job.company && <CompanyLink company={job.company} />}
      </div>
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
        <JobSkills job={job} />
      </div>
    </>
  );
};

export default Job;

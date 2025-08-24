import useCompanies from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import JobLink from "../jobs/JobLink";

const Company = ({
  id,
  gotoJob
}: {
  id: number;
  gotoJob: (jobId: number) => void;
}) => {
  const companies = useCompanies();
  const jobs = useJobs();
  const company = companies.company(id);

  if (!company || !jobs) {
    return null;
  }

  return (
    <>
      <h1>{company.name}</h1>
      <h2>Size</h2>
      <div className="card text-left">{company.num_employees}</div>
      <h2>Jobs</h2>
      <div className="card text-left">
        <ul className="list-inside list-disc">
          {jobs.forCompany(id)?.map((job) => (
            <li key={job.id}>
              <JobLink job={job} gotoJob={gotoJob} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Company;

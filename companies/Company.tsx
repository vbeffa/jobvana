import JobLink from "../jobs/JobLink";
import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";
import useJobs from "../src/hooks/useJobs";

const Company = ({ id }: { id: number }) => {
  const companies = useCompanies();
  const jobs = useJobs();
  const company = companies.company(id);

  if (!company) {
    return (
      <div>
        <Header currPage="company" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="company" />
      <h1>{company.name}</h1>
      <h2>Size</h2>
      <div className="card text-left">{company.num_employees}</div>
      <h2>Jobs</h2>
      <div className="card text-left">
        <ul className="list-inside list-disc">
          {jobs.forCompany(id).map((job) => (
            <li key={job.id}>
              <JobLink job={job} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Company;

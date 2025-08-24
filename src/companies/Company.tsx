import useCompany from "../hooks/useCompany";
import useJobs from "../hooks/useJobs";
import JobsForCompany from "../jobs/JobsForCompany";
import { Route } from "../routes/jobvana.companies.$id";

const Company = () => {
  const { id } = Route.useLoaderData();
  const jobs = useJobs();
  const { company } = useCompany({ id });

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
        <JobsForCompany company={company} />
      </div>
    </>
  );
};

export default Company;

import { Link } from "@tanstack/react-router";
import useCompany from "../hooks/useCompany";
import useJobs from "../hooks/useJobs";
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
        <ul className="list-inside list-disc">
          {jobs.forCompany(id)?.map((job) => (
            <li key={job.id}>
              <Link to="/jobvana/jobs/$id" params={{ id: job.id.toString() }}>
                {job.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Company;

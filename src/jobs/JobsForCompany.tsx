import type { Company } from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import JobLink from "./JobLink";

const JobsForCompany = ({ company }: { company: Company }) => {
  const { forCompany } = useJobs();

  return (
    <ul className="list-inside list-disc">
      {forCompany(company.id)?.map((job) => (
        <li key={job.id}>
          <JobLink job={job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsForCompany;

import type { Company } from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import JobLink from "./JobLink";

const JobsForCompany = ({ company }: { company: Company }) => {
  const { jobsForCompany } = useJobs();

  return (
    <ul className="list-inside list-disc">
      {jobsForCompany(company.id)?.map((job) => (
        <li key={job.id}>
          <JobLink job={job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsForCompany;

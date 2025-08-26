import type { Company } from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import JobLink from "./JobLink";

const JobsForCompany = ({ company }: { company: Company }) => {
  const { jobsForCompany } = useJobs({ companyId: company.id });

  return (
    <ul className="list-inside list-disc">
      {jobsForCompany?.map((job) => (
        <li key={job.id}>
          <JobLink job={job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsForCompany;

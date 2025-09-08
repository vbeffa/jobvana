import Error from '../Error';
import type { Company } from '../hooks/useCompanies';
import useJobs from '../hooks/useJobs';
import JobsList from './JobsList';

const JobsForCompany = ({ company }: { company: Company }) => {
  // TODO fix this is paged, not correct if company has more than 10 jobs
  const { jobs, error } = useJobs({
    paging: { page: 1, pageSize: 10 },
    filters: { companyId: company.id }
  });

  if (error) {
    return <Error error={error} />;
  }

  if (!jobs) {
    return null;
  }
  return <JobsList jobs={jobs} />;
};

export default JobsForCompany;

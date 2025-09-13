import Error from '../Error';
import JobsList from './JobsList';
import useJobs from './useJobs';

const JobsForCompany = ({ id }: { id: number }) => {
  // TODO fix this is paged, not correct if company has more than 10 jobs
  const { jobs, error } = useJobs({
    paging: { page: 1, pageSize: 10 },
    filters: { companyId: id }
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

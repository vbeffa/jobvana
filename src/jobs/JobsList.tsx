import type { Job as DbJob } from '../hooks/useJobs';
import JobLink from './JobLink';

const JobsList = ({ jobs }: { jobs: Array<DbJob> }) => {
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <JobLink {...job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsList;

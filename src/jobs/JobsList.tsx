import type { Job } from '../hooks/useJobs';
import JobLink from './JobLink';

const JobsList = ({ jobs }: { jobs: Array<Job> }) => {
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <JobLink job={job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsList;

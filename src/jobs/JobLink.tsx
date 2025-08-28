import { Link } from '@tanstack/react-router';
import { type Job } from '../hooks/useJobs';

const JobLink = ({ job }: { job: Job }) => {
  return (
    <Link to="/jobvana/jobs/$id" params={{ id: job.id.toString() }}>
      {job.title}
    </Link>
  );
};

export default JobLink;

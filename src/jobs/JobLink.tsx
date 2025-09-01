import { Link } from '@tanstack/react-router';
import { type DbJob } from '../hooks/useJobs';

const JobLink = ({ job }: { job: DbJob }) => {
  return (
    <Link to="/jobvana/jobs/$id" params={{ id: job.id.toString() }}>
      {job.title}
    </Link>
  );
};

export default JobLink;

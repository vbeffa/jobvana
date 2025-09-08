import { Link } from '@tanstack/react-router';
import type { Job } from '../hooks/types';

export type JobLinkProps = Pick<Job, 'id' | 'title'>;

const JobLink = ({ id, title }: JobLinkProps) => {
  return (
    <Link to="/jobvana/jobs/$id" params={{ id: id.toString() }}>
      {title}
    </Link>
  );
};

export default JobLink;

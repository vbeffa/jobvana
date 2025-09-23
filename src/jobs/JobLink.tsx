import { Link } from '@tanstack/react-router';
import type { CompanyJob } from '../companies/job_seeker/useCompany';

export type JobLinkProps = CompanyJob;

const JobLink = ({ id, title }: CompanyJob) => {
  return (
    <Link to="/jobvana/jobs/$id" params={{ id: id.toString() }}>
      {title}
    </Link>
  );
};

export default JobLink;

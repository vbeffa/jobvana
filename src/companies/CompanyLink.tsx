import { Link } from '@tanstack/react-router';
import type { Company } from '../types';

export type CompanyLinkProps = Pick<Company, 'id' | 'name'>;

const CompanyLink = ({ id, name }: CompanyLinkProps) => {
  return (
    <Link to="/jobvana/companies/$id" params={{ id: id.toString() }}>
      {name}
    </Link>
  );
};

export default CompanyLink;

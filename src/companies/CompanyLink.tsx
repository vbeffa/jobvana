import { Link } from '@tanstack/react-router';
import type { Company } from '../hooks/types';

const CompanyLink = ({ company }: { company: Company }) => {
  return (
    <Link to="/jobvana/companies/$id" params={{ id: company.id.toString() }}>
      {company.name}
    </Link>
  );
};

export default CompanyLink;

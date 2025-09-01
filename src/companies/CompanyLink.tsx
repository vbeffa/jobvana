import { Link } from '@tanstack/react-router';
import type { DbCompany } from '../hooks/useCompanies';

const CompanyLink = ({ company }: { company: DbCompany }) => {
  return (
    <Link to="/jobvana/companies/$id" params={{ id: company.id.toString() }}>
      {company.name}
    </Link>
  );
};

export default CompanyLink;

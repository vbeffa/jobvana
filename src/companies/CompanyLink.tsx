import { Link } from "@tanstack/react-router";
import type { Company } from "../hooks/useCompanies";

const CompanyLink = ({ company }: { company: Company }) => {
  return (
    <Link to="/jobvana/companies/$id" params={{ id: company.id.toString() }}>
      {company.name}
    </Link>
  );
};

export default CompanyLink;

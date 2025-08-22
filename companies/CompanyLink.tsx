import "../src/App.css";
import type { Company } from "../src/hooks/useCompanies";

function CompanyLink({ company }: { company: Company }) {
  return <a href={`/jobvana/companies/?id=${company.id}`}>{company.name}</a>;
}

export default CompanyLink;

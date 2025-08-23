import type { Company } from "../hooks/useCompanies";
import Link from "../Link";

const CompanyLink = ({
  company,
  gotoCompany
}: {
  company: Company;
  gotoCompany: (companyId: number) => void;
}) => {
  return <Link text={company.name} onClick={() => gotoCompany(company.id)} />;
};

export default CompanyLink;

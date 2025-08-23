import { useMemo, useState } from "react";
import useCompanies from "../hooks/useCompanies";
import Loading from "../Loading";
import CompanyLink from "./CompanyLink";

const Skills = ({
  gotoCompany
}: {
  gotoCompany: (companyId: number) => void;
}) => {
  const [companyFilter, setCompanyFilter] = useState<string>();

  const companies = useCompanies();

  const filteredCompanies = useMemo(() => {
    return companies.all.filter((company) => {
      if (companyFilter) {
        return company.name
          .toLocaleLowerCase()
          .includes(companyFilter.toLocaleLowerCase());
      }
      return true;
    });
  }, [companies.all, companyFilter]);

  return (
    <>
      <h1>Companies</h1>
      <div className="card text-center justify-center">
        <table className="w-full">
          <thead>
            <tr>
              <td colSpan={1} className="text-left pb-2">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by company"
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th className="p-1 border">Name</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitFor={companies.all} colSpan={1} />
            {filteredCompanies.map((company) => {
              return (
                <tr key={company.id}>
                  <td className="p-1 border text-left align-top">
                    <CompanyLink company={company} gotoCompany={gotoCompany} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Skills;

import { useMemo, useState } from "react";
import Filter from "../Filter";
import useCompanies from "../hooks/useCompanies";
import Loading from "../Loading";
import CompanyLink from "./CompanyLink";

type SortCol = "company" | "num_employees";
type SortDir = "up" | "down";

const Companies = () => {
  const [sortCol, setSortCol] = useState<SortCol>("company");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [companyFilter, setCompanyFilter] = useState<string>();

  const companies = useCompanies();

  const filteredCompanies = useMemo(() => {
    return companies.companies
      ?.filter((company) => {
        if (companyFilter) {
          return company.name
            .toLocaleLowerCase()
            .includes(companyFilter.toLocaleLowerCase());
        }
        return true;
      })
      .sort((company1, company2) => {
        if (sortCol === "company") {
          return sortDir === "up"
            ? company1!.name.localeCompare(company2!.name)
            : company2!.name.localeCompare(company1!.name);
        }
        return sortDir === "down"
          ? company2.num_employees - company1.num_employees
          : company1.num_employees - company2.num_employees;
      });
  }, [companies.companies, companyFilter, sortCol, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === "up" ? "down" : "up") : "up";
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  return (
    <>
      <h1>Companies</h1>
      <div className="card text-center justify-center">
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-left">
                <div className="w-[25%]">
                  <Filter
                    id="company_filter"
                    placeholder="Filter by company"
                    value={companyFilter}
                    onChange={setCompanyFilter}
                    onClear={() => setCompanyFilter("")}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="h-1" colSpan={2} />
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer w-[90%]"
                onClick={() => setSort("company")}
              >
                Name {sortCol === "company" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("num_employees")}
              >
                Size{" "}
                {sortCol === "num_employees" && (sortDir === "up" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={companies.companies} colSpan={1} />
            {filteredCompanies?.map((company) => {
              return (
                <tr key={company.id}>
                  <td className="p-1 border text-left align-top">
                    <CompanyLink company={company} />
                  </td>
                  <td className="p-1 border text-center align-top">
                    {company.num_employees}
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

export default Companies;

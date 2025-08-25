import { useMemo, useState } from "react";
import CompanyLink from "../companies/CompanyLink";
import useCompanies from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import useSkills from "../hooks/useSkills";
import Loading from "../Loading";
import JobLink from "./JobLink";
import JobSkills from "./JobSkills";
import Salary from "./Salary";
import SalarySelect from "./SalarySelect";
import Filter from "../Filter";

type SortCol = "company" | "title" | "created" | "min_salary" | "max_salary";
type SortDir = "up" | "down";

const Jobs = () => {
  const [sortCol, setSortCol] = useState<SortCol>("created");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [companyFilter, setCompanyFilter] = useState<string>();
  const [jobTitleFilter, setJobTitleFilter] = useState<string>();
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>();
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<number>();

  const { findCompany } = useCompanies();
  const { jobs } = useJobs();
  const { skills } = useSkills();

  const filteredJobs = useMemo(() => {
    return jobs
      ?.filter((job) => {
        let pass = true;
        if (companyFilter) {
          const company = findCompany(job.company_id);
          pass &&=
            company !== undefined &&
            company?.name
              .toLocaleLowerCase()
              .includes(companyFilter.toLocaleLowerCase());
        }
        if (jobTitleFilter) {
          pass &&= job.title
            .toLocaleLowerCase()
            .includes(jobTitleFilter.toLocaleLowerCase());
        }
        if (minSalaryFilter) {
          pass &&= job.salaryLow >= minSalaryFilter;
        }
        if (maxSalaryFilter) {
          pass &&= job.salaryHigh <= maxSalaryFilter;
        }
        return pass;
      })
      .sort((job1, job2) => {
        if (sortCol === "company") {
          const company1 = findCompany(job1.company_id);
          const company2 = findCompany(job2.company_id);
          return sortDir === "up"
            ? company1!.name.localeCompare(company2!.name)
            : company2!.name.localeCompare(company1!.name);
        }
        if (sortCol === "title") {
          return sortDir === "up"
            ? job1.title.localeCompare(job2.title)
            : job2.title.localeCompare(job1.title);
        }
        return sortDir === "down"
          ? new Date(job2.created_at).getTime() -
              new Date(job1.created_at).getTime()
          : new Date(job1.created_at).getTime() -
              new Date(job2.created_at).getTime();
      });
  }, [
    companyFilter,
    findCompany,
    jobTitleFilter,
    jobs,
    maxSalaryFilter,
    minSalaryFilter,
    sortCol,
    sortDir
  ]);

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

  if (!jobs || !filteredJobs || !skills) {
    return null;
  }

  return (
    <>
      <h1>Jobs</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <td>
                <Filter
                  id="company_filter"
                  placeholder="Filter by company"
                  value={companyFilter}
                  onChange={setCompanyFilter}
                  onClear={() => setCompanyFilter("")}
                />
              </td>
              <td>
                <Filter
                  id="job_title_filter"
                  placeholder="Filter by job title"
                  value={jobTitleFilter}
                  onChange={setJobTitleFilter}
                  onClear={() => setJobTitleFilter("")}
                />
              </td>
              <td colSpan={2} />
              <td className="flex flex-row w-full gap-x-1">
                <SalarySelect
                  id="min_salary"
                  title="Min salary"
                  value={minSalaryFilter}
                  onChange={(minSalary) => {
                    setMinSalaryFilter(minSalary);
                    if (maxSalaryFilter && minSalary > maxSalaryFilter) {
                      setMaxSalaryFilter(minSalary);
                    }
                  }}
                />
                <div className="flex pt-1">-</div>
                <SalarySelect
                  id="max_salary"
                  title="Max salary"
                  value={maxSalaryFilter}
                  onChange={(maxSalary) => {
                    setMaxSalaryFilter(maxSalary);
                    if (minSalaryFilter && maxSalary < minSalaryFilter) {
                      setMinSalaryFilter(maxSalary);
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="h-1" colSpan={6} />
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer w-[20%]"
                onClick={() => setSort("company")}
              >
                Company{" "}
                {sortCol === "company" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer w-[20%]"
                onClick={() => setSort("title")}
              >
                Title {sortCol === "title" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer w-[15%]"
                onClick={() => setSort("created")}
              >
                Created{" "}
                {sortCol === "created" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th className="p-1 border w-[5%]">Status</th>
              <th className="p-1 border w-[20%]">Salary</th>
              <th className="p-1 border w-[20%]">Skills</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={jobs} colSpan={6} />
            {filteredJobs.map((job) => {
              const company = findCompany(job.company_id);
              return (
                <tr key={job.id}>
                  <td className="p-1 border text-left align-top">
                    {company && <CompanyLink company={company} />}
                  </td>
                  <td className="p-1 border text-left align-top">
                    <JobLink job={job} />
                  </td>
                  <td className="p-1 border text-left align-top">
                    {new Date(job.created_at).toDateString()}
                  </td>
                  <td className="p-1 border text-left align-top">
                    {job.status}
                  </td>
                  <td className="p-1 border text-left align-top">
                    <Salary job={job} />
                  </td>
                  <td className="p-1 border text-left">
                    <JobSkills job={job} />
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

export default Jobs;

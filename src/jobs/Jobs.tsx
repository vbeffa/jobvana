import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import useCompanies from "../hooks/useCompanies";
import useJobs from "../hooks/useJobs";
import useSkills from "../hooks/useSkills";
import Loading from "../Loading";
import JobSkills from "./JobSkills";
import Salary from "./Salary";

type SortCol = "company" | "title" | "created";
type SortDir = "up" | "down";

const Jobs = () => {
  const [sortCol, setSortCol] = useState<SortCol>("created");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [companyFilter, setCompanyFilter] = useState<string>();
  const [jobTitleFilter, setJobTitleFilter] = useState<string>();

  const { findCompany } = useCompanies();
  const { jobs } = useJobs();
  const { skills } = useSkills();

  const filteredJobs = useMemo(() => {
    return jobs
      ?.filter((job) => {
        let pass = true;
        if (companyFilter) {
          const company = findCompany(job.company_id);
          pass =
            company !== undefined &&
            company?.name
              .toLocaleLowerCase()
              .includes(companyFilter.toLocaleLowerCase());
        }
        if (jobTitleFilter) {
          pass = job.title
            .toLocaleLowerCase()
            .includes(jobTitleFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((job1, job2) => {
        if (sortCol === "company") {
          const company1 = findCompany(job1.company_id);
          const company2 = findCompany(job2.company_id);
          return sortDir === "down"
            ? company1!.name.localeCompare(company2!.name)
            : company2!.name.localeCompare(company1!.name);
        }
        if (sortCol === "title") {
          return sortDir === "down"
            ? job1.title.localeCompare(job2.title)
            : job2.title.localeCompare(job1.title);
        }
        return sortDir === "down"
          ? new Date(job2.created_at).getTime() -
              new Date(job1.created_at).getTime()
          : new Date(job1.created_at).getTime() -
              new Date(job2.created_at).getTime();
      });
  }, [companyFilter, findCompany, jobTitleFilter, jobs, sortCol, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === "up" ? "down" : "up") : "down";
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
              <td className="text-left pb-2 w-[20%]">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by company"
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                  }}
                />
              </td>
              <td className="text-left pb-2  w-[20%]">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by job title"
                  onChange={(e) => {
                    setJobTitleFilter(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("company")}
              >
                Company{" "}
                {sortCol === "company" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("title")}
              >
                Title {sortCol === "title" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("created")}
              >
                Created{" "}
                {sortCol === "created" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th className="p-1 border">Status</th>
              <th className="p-1 border">Salary</th>
              <th className="p-1 border">Skills</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={jobs} colSpan={6} />
            {filteredJobs.map((job) => {
              const company = findCompany(job.company_id);
              return (
                <tr key={job.id}>
                  <td className="p-1 border text-left align-top">
                    {company && (
                      <Link
                        to="/companies/$id"
                        params={{ id: company.id.toString() }}
                      >
                        {company.name}
                      </Link>
                    )}
                  </td>
                  <td className="p-1 border text-left align-top">
                    <Link to="/jobs/$id" params={{ id: job.id.toString() }}>
                      {job.title}
                    </Link>
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
                    <JobSkills job={job} skills={skills} />
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

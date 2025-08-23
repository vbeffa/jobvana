import { useMemo, useState } from "react";
import CompanyLink from "../companies/CompanyLink";
import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";
import useJobs from "../src/hooks/useJobs";
import useSkills from "../src/hooks/useSkills";
import JobSkills from "./JobSkills";
import Salary from "./Salary";

const Jobs = () => {
  const companies = useCompanies();
  const jobs = useJobs();
  const skills = useSkills();
  const [companyFilter, setCompanyFilter] = useState<string>();
  const [jobTitleFilter, setJobTitleFilter] = useState<string>();

  const filteredJobs = useMemo(() => {
    return jobs.all.filter((job) => {
      let pass = true;
      if (companyFilter) {
        const company = companies.company(job.company_id);
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
    });
  }, [companies, companyFilter, jobTitleFilter, jobs.all]);

  if (jobs.all.length === 0) {
    return (
      <div>
        <Header currPage="jobs" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="jobs" />
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
              <th className="p-1 border">Company</th>
              <th className="p-1 border">Title</th>
              <th className="p-1 border">Created</th>
              <th className="p-1 border">Status</th>
              <th className="p-1 border">Salary</th>
              <th className="p-1 border">Skills</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => {
              const company = companies.company(job.company_id);
              return (
                <tr key={job.id}>
                  <td className="p-1 border text-left align-top">
                    {company && <CompanyLink company={company} />}
                  </td>
                  <td className="p-1 border text-left align-top">
                    <a href={`/jobvana/jobs/?id=${job.id}`}>{job.title}</a>
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

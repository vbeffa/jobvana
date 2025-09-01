import { useMemo, useState } from 'react';
import CompanyLink from '../companies/CompanyLink';
import type { Job } from '../hooks/useJobs';
import JobLink from './JobLink';
import JobSkills from './JobSkills';
import Salary from './Salary';

type SortCol =
  | 'company'
  | 'title'
  | 'role'
  | 'created'
  | 'min_salary'
  | 'max_salary';
type SortDir = 'up' | 'down';

const JobsTable = ({ jobs }: { jobs?: Array<Job> }) => {
  const [sortCol, setSortCol] = useState<SortCol>('created');
  const [sortDir, setSortDir] = useState<SortDir>('down');

  const sortedJobs = useMemo(() => {
    return jobs?.sort((job1, job2) => {
      if (sortCol === 'company') {
        const company1 = job1.company;
        const company2 = job2.company;
        return sortDir === 'up'
          ? company1!.name.localeCompare(company2!.name)
          : company2!.name.localeCompare(company1!.name);
      }
      if (sortCol === 'title') {
        return sortDir === 'up'
          ? job1.title.localeCompare(job2.title)
          : job2.title.localeCompare(job1.title);
      }
      if (sortCol === 'min_salary') {
        return sortDir === 'up'
          ? job1.salary_low - job2.salary_low
          : job2.salary_low - job1.salary_low;
      }
      if (sortCol === 'max_salary') {
        return sortDir === 'up'
          ? job1.salary_high - job2.salary_high
          : job2.salary_high - job1.salary_high;
      }
      // created
      const createdAt1 = new Date(job1.created_at).getTime();
      const createdAt2 = new Date(job2.created_at).getTime();
      return sortDir === 'down'
        ? createdAt2 - createdAt1
        : createdAt1 - createdAt2;
    });
  }, [jobs, sortCol, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol
        ? sortDir === 'up'
          ? 'down'
          : 'up'
        : newSortCol === 'created'
          ? 'down'
          : 'up';
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  if (!sortedJobs) {
    return null;
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th
            className="cursor-pointer w-[20%]"
            onClick={() => setSort('company')}
          >
            Company {sortCol === 'company' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th
            className="cursor-pointer w-[20%]"
            onClick={() => setSort('title')}
          >
            Title {sortCol === 'title' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th
            className="cursor-pointer w-[10%]"
            onClick={() => setSort('role')}
          >
            Role {sortCol === 'role' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="cursor-pointer w-[5%]">Level</th>
          <th
            className="cursor-pointer w-[10%]"
            onClick={() => setSort('created')}
          >
            Posted {sortCol === 'created' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="w-[15%]">
            <div className="flex flex-row items-center w-full gap-2">
              <div>Salary</div>
              <div
                className="cursor-pointer"
                onClick={() => setSort('min_salary')}
              >
                ${sortCol === 'min_salary' && (sortDir === 'up' ? '↑' : '↓')}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setSort('max_salary')}
              >
                $$${sortCol === 'max_salary' && (sortDir === 'up' ? '↑' : '↓')}
              </div>
            </div>
          </th>
          <th className="w-[20%]">Skills</th>
        </tr>
      </thead>
      <tbody>
        {/* {<Loading waitingFor={jobs} colSpan={6} />} */}
        {sortedJobs.length === 0 && (
          <tr key={0}>
            <td className="text-center" colSpan={7}>
              No jobs found
            </td>
          </tr>
        )}
        {sortedJobs.map((job) => {
          const company = job.company;
          const roleLevel = (() => {
            switch (job.role_level) {
              case 1:
                return 'Junior';
              case 2:
                return 'Mid';
              case 3:
                return 'Senior';
              case 4:
                return 'Staff';
            }
          })();
          return (
            <tr key={job.id}>
              <td>{company && <CompanyLink company={company} />}</td>
              <td>
                <JobLink job={job} />
              </td>
              <td>{job.role?.name}</td>
              <td>{roleLevel}</td>
              <td>{new Date(job.created_at).toLocaleDateString()}</td>
              <td>
                <Salary job={job} />
              </td>
              <td>
                <JobSkills job={job} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default JobsTable;

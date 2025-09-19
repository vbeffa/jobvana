import Filter from '../Filter';
import CreatedSelect from './CreatedSelect';
import RoleSelect from './RoleSelect';
import SalarySelect from './SalarySelect';
import SkillSelect from './SkillSelect';
import type { SearchFilters } from './useJobs';

const JobFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2">
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-[25%_75%] w-[20rem] gap-y-2">
          <Filter
            id="company_filter"
            label="Name"
            placeholder="Filter by company"
            value={filters.company}
            onChange={(company) => {
              setFilters({ ...filters, company });
            }}
            onClear={() => setFilters({ ...filters, company: '' })}
          />
          <Filter
            id="job_title_filter"
            label="Title"
            placeholder="Filter by job title"
            value={filters.title}
            onChange={(title) => {
              setFilters({ ...filters, title });
            }}
            onClear={() => setFilters({ ...filters, title: '' })}
          />
          <label htmlFor="role" className="content-center">
            Role:
          </label>
          <RoleSelect
            id="role"
            roleId={filters.roleId}
            onChange={(roleId) => {
              if (!roleId) {
                setFilters({ ...filters, roleId: undefined });
              } else {
                setFilters({ ...filters, roleId });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-[35%_65%] w-[24rem] gap-y-2">
          <label htmlFor="min_salary" className="content-center">
            Salary Range:
          </label>
          <div className="flex flex-row gap-x-2">
            <SalarySelect
              id="min_salary"
              value={filters.minSalary}
              onChange={(minSalary) => {
                const newFilters = {
                  ...filters,
                  minSalary,
                  maxSalary:
                    filters.maxSalary && minSalary > filters.maxSalary
                      ? minSalary
                      : filters.maxSalary
                };
                setFilters(newFilters);
              }}
            />
            <label htmlFor="max_salary" className="content-center">
              -
            </label>
            <SalarySelect
              id="max_salary"
              value={filters.maxSalary}
              onChange={(maxSalary) => {
                const newFilters = {
                  ...filters,
                  maxSalary,
                  minSalary:
                    filters.minSalary && maxSalary < filters.minSalary
                      ? maxSalary
                      : filters.minSalary
                };
                setFilters(newFilters);
              }}
            />
          </div>
          <label htmlFor="skill" className="content-center">
            Skill:
          </label>
          <SkillSelect
            id="skill"
            skillId={filters.skillId}
            onChange={(skillId) => {
              if (skillId === 0) {
                setFilters({ ...filters, skillId: undefined });
              } else {
                setFilters({ ...filters, skillId });
              }
            }}
          />
          <label htmlFor="created" className="content-center">
            Posted:
          </label>
          <CreatedSelect
            id="created"
            value={filters.created}
            onChange={(created) => {
              if (created === 'all') {
                setFilters({ ...filters, created: undefined });
              } else {
                setFilters({ ...filters, created });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters;

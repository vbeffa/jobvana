import Filter from '../../inputs/Filter';
import JobTypeSelect from '../company/JobTypeSelect';
import SalaryTypeSelect from '../company/SalaryTypeSelect';
import RoleSelect from '../RoleSelect';
import { maxJobSalary, minJobSalary } from '../utils';
import CreatedSelect from './CreatedSelect';
import SalaryRangeSelect from './SalaryRangeSelect';
import SkillSelect from './SkillSelect';
import type { SearchFilters } from './useJobs';

const JobFilters = ({
  filters,
  onChange
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2">
      <div className="grid grid-cols-[30%_35%_35%] gap-x-2">
        <div className="grid grid-cols-[25%_75%] w-full gap-y-2">
          <Filter
            id="company_filter"
            label="Name"
            placeholder="Filter by company"
            value={filters.company}
            onChange={(company) => {
              onChange({ ...filters, company });
            }}
            onClear={() => onChange({ ...filters, company: '' })}
          />
          <Filter
            id="job_title_filter"
            label="Title"
            placeholder="Filter by job title"
            value={filters.title}
            onChange={(title) => {
              onChange({ ...filters, title });
            }}
            onClear={() => onChange({ ...filters, title: '' })}
          />
          <label htmlFor="role" className="content-center">
            Role:
          </label>
          <RoleSelect
            id="role"
            roleId={filters.roleId}
            onChange={(roleId) => {
              if (!roleId) {
                onChange({ ...filters, roleId: undefined });
              } else {
                onChange({ ...filters, roleId });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-[30%_70%] w-full gap-y-2">
          <label htmlFor="salary_type" className="content-center">
            Salary Type:
          </label>
          <SalaryTypeSelect
            value={filters.salaryType}
            width="w-28"
            onChange={(salaryType) => {
              const newFilters = {
                ...filters,
                salaryType,
                minSalary: minJobSalary(salaryType),
                maxSalary: maxJobSalary(salaryType)
              };
              onChange(newFilters);
            }}
          />
          <SalaryRangeSelect
            type={filters.salaryType}
            low={filters.minSalary}
            high={filters.maxSalary}
            onChangeLow={(minSalary) => {
              const newFilters = {
                ...filters,
                minSalary,
                maxSalary:
                  filters.maxSalary && minSalary > filters.maxSalary
                    ? minSalary
                    : filters.maxSalary
              };
              onChange(newFilters);
            }}
            onChangeHigh={(maxSalary) => {
              const newFilters = {
                ...filters,
                maxSalary,
                minSalary:
                  filters.minSalary && maxSalary < filters.minSalary
                    ? maxSalary
                    : filters.minSalary
              };
              onChange(newFilters);
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
                onChange({ ...filters, created: undefined });
              } else {
                onChange({ ...filters, created });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-[25%_75%] gap-y-2">
          <label htmlFor="job_type" className="content-center">
            Job Type:
          </label>
          <JobTypeSelect
            value={filters.jobType}
            showAny={true}
            onChange={(jobType) => {
              onChange({ ...filters, jobType });
            }}
          />
          <label htmlFor="skills" className="content-center">
            Skills:
          </label>
          <SkillSelect
            id="skills"
            skillIds={filters.skillIds}
            onChange={(skillId) => {
              if (skillId === 0) {
                onChange({ ...filters, skillIds: undefined });
              } else {
                onChange({ ...filters, skillIds: [skillId] });
              }
            }}
          />
          <div className="row-span-4 col-span-2"></div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;

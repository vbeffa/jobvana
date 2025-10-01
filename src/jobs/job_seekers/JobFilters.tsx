import IndustrySelect from '../../companies/IndustrySelect';
import CompanySizeFilters from '../../companies/job_seeker/CompanySizeFilters';
import Filter from '../../inputs/Filter';
import Label from '../../inputs/Label';
import JobTypeSelect from '../company/JobTypeSelect';
import SalaryTypeSelect from '../company/SalaryTypeSelect';
import RoleSelect from '../RoleSelect';
import SkillsSelect from '../SkillsSelect';
import { maxJobSalary, minJobSalary } from '../utils';
import CreatedSelect from './CreatedSelect';
import SalaryRangeSelect from './SalaryRangeSelect';
import type { SearchFilters } from './useJobs';

const JobFilters = ({
  filters,
  onChange
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2 w-full">
      <div className="flex flex-row gap-x-4">
        <div className="grid grid-cols-[37%_63%] w-86 gap-y-2">
          <Label htmlFor="company_filter" label="Company Name" />
          <Filter
            id="company_filter"
            width="w-54"
            placeholder="Filter by company"
            value={filters.company}
            onChange={(company) => {
              onChange({ ...filters, company });
            }}
            onClear={() => onChange({ ...filters, company: '' })}
          />
          <Label htmlFor="min_size" label="Company Size" />
          <CompanySizeFilters
            low={filters.minSize}
            high={filters.maxSize}
            width="w-24"
            onChangeLow={(size) => {
              if (!size) {
                return;
              }
              onChange({
                ...filters,
                minSize: size,
                maxSize: size > filters.maxSize ? size : filters.maxSize
              });
            }}
            onChangeHigh={(size) => {
              if (!size) {
                return;
              }
              onChange({
                ...filters,
                maxSize: size,
                minSize: size < filters.minSize ? size : filters.minSize
              });
            }}
          />
          <Label htmlFor="industry" label="Industry" />
          <IndustrySelect
            industryId={filters.industryId}
            width="w-54"
            showAny={true}
            onChange={(industryId) => {
              onChange({ ...filters, industryId });
            }}
          />
        </div>
        <div className="grid grid-cols-[29%_71%] w-68 gap-y-2">
          <Label htmlFor="job_title_filter" label="Job Title" />
          <Filter
            id="job_title_filter"
            width="w-48"
            placeholder="Filter by job title"
            value={filters.title}
            onChange={(title) => {
              onChange({ ...filters, title });
            }}
            onClear={() => onChange({ ...filters, title: '' })}
          />
          <Label htmlFor="role" label="Role" />
          <RoleSelect
            id="role"
            roleId={filters.roleId}
            width="w-48"
            onChange={(roleId) => {
              if (!roleId) {
                onChange({ ...filters, roleId: undefined });
              } else {
                onChange({ ...filters, roleId });
              }
            }}
          />
          <Label htmlFor="job_type" label="Job Type" />
          <JobTypeSelect
            value={filters.jobType}
            width="w-48"
            showAny={true}
            onChange={(jobType) => {
              onChange({ ...filters, jobType });
            }}
          />
        </div>
        <div className="grid grid-cols-[30%_70%] w-fit gap-y-2">
          <Label htmlFor="salary_type" label="Salary Type" />
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
          <Label htmlFor="min_salary" label="Salary Range" />
          <SalaryRangeSelect
            type={filters.salaryType}
            low={filters.minSalary}
            high={filters.maxSalary}
            width="w-29"
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
          <Label htmlFor="created" label="Posted" />
          <CreatedSelect
            id="created"
            value={filters.created}
            width="w-28"
            onChange={(created) => {
              if (created === 'all') {
                onChange({ ...filters, created: undefined });
              } else {
                onChange({ ...filters, created });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-1 w-84 gap-y-2">
          <SkillsSelect
            selectedSkillIds={filters.skillIds ?? []}
            width="w-full"
            outerHeight="h-22.5"
            innerHeight="max-h-21.5"
            onChange={(skillIds) => {
              onChange({ ...filters, skillIds: skillIds });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters;

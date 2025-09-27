import Filter from '../../inputs/Filter';
import RoleSelect from '../RoleSelect';
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
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-[25%_75%] w-[20rem] gap-y-2">
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
        <div className="grid grid-cols-[25%_65%] w-[24rem] gap-y-2">
          <SalaryRangeSelect
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
          <label htmlFor="skill" className="content-center">
            Skill:
          </label>
          <SkillSelect
            id="skill"
            skillId={filters.skillId}
            onChange={(skillId) => {
              if (skillId === 0) {
                onChange({ ...filters, skillId: undefined });
              } else {
                onChange({ ...filters, skillId });
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
                onChange({ ...filters, created: undefined });
              } else {
                onChange({ ...filters, created });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters;

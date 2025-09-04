import Filter from '../Filter';
import type { SearchFilters } from '../hooks/useJobs';
import CreatedSelect from './CreatedSelect';
import RoleSelect from './RoleSelect';
import SalarySelect from './SalarySelect';
import SkillSelect from './SkillSelect';

const JobFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}) => {
  return (
    <div className="border-[0.05rem] rounded-lg grid grid-cols-2">
      <div className="grid grid-cols-3 gap-2 p-2">
        <div>Company:</div>
        <div className="col-span-2">
          <Filter
            id="company_filter"
            placeholder="Filter by company"
            value={filters.company}
            onChange={(company) => {
              setFilters((filters) => ({ ...filters, company }));
            }}
            onClear={() =>
              setFilters((filters) => ({ ...filters, company: '' }))
            }
          />
        </div>
        <div>Title:</div>
        <div className="col-span-2">
          <Filter
            id="job_title_filter"
            placeholder="Filter by job title"
            value={filters.title}
            onChange={(title) => {
              setFilters((filters) => ({ ...filters, title }));
            }}
            onClear={() => setFilters((filters) => ({ ...filters, title: '' }))}
          />
        </div>
        <div>Role:</div>
        <div className="col-span-2 flex flex-row gap-x-2">
          <RoleSelect
            id="role"
            roleId={filters.roleId}
            onChange={(roleId) => {
              if (!roleId) {
                setFilters((filters) => ({ ...filters, roleId: undefined }));
              } else {
                setFilters((filters) => ({ ...filters, roleId }));
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2">
        <div>Salary Range:</div>
        <div className="col-span-2 flex flex-row gap-x-2">
          <SalarySelect
            id="min_salary"
            type="min"
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
          <div className="flex pt-1">-</div>
          <SalarySelect
            id="max_salary"
            type="max"
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
        <div>Skill:</div>
        <div className="col-span-2 flex flex-row gap-x-2">
          <SkillSelect
            id="role"
            skillId={filters.skillId}
            onChange={(skillId) => {
              if (skillId === 0) {
                setFilters((filters) => ({ ...filters, skillId: undefined }));
              } else {
                setFilters((filters) => ({ ...filters, skillId }));
              }
            }}
          />
        </div>
        <div>Created:</div>
        <div className="col-span-2 flex flex-row gap-x-2">
          <CreatedSelect
            id="role"
            value={filters.created}
            onChange={(created) => {
              if (created === 'all') {
                setFilters((filters) => ({ ...filters, created: undefined }));
              } else {
                setFilters((filters) => ({ ...filters, created }));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters;

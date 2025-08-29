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
    <div className="border-[0.05rem] rounded-lg grid grid-cols-3 gap-2 p-2">
      <div>Company:</div>
      <div className="col-span-2">
        <Filter
          id="company_filter"
          placeholder="Filter by company"
          value={filters.company}
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, company: val }));
          }}
          onClear={() => setFilters((filters) => ({ ...filters, company: '' }))}
        />
      </div>
      <div>Title:</div>
      <div className="col-span-2">
        <Filter
          id="job_title_filter"
          placeholder="Filter by job title"
          value={filters.title}
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, title: val }));
          }}
          onClear={() => setFilters((filters) => ({ ...filters, title: '' }))}
        />
      </div>
      <div>Role:</div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <RoleSelect
          id="role"
          roleId={filters.roleId}
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, roleId: val }));
          }}
        />
      </div>
      <div>Salary Range:</div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <SalarySelect
          id="min_salary"
          title="Min"
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
          title="Max"
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
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, skillId: val }));
          }}
        />
      </div>
      <div>Created:</div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <CreatedSelect
          id="role"
          value={filters.created}
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, created: val }));
          }}
        />
      </div>
    </div>
  );
};

export default JobFilters;

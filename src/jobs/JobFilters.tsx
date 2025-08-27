import Filter from "../Filter";
import SalarySelect from "./SalarySelect";

const JobFilters = ({
  company: company,
  onCompanyChange,
  title,
  onTitleChange,
  minSalary,
  onMinSalarySelect,
  maxSalary,
  onMaxSalarySelect,
  onSearch
}: {
  company?: string;
  onCompanyChange: (company: string) => void;
  title?: string;
  onTitleChange: (title: string) => void;
  minSalary?: number;
  onMinSalarySelect: (minSalary: number) => void;
  maxSalary?: number;
  onMaxSalarySelect: (maxSalary: number) => void;
  onSearch: () => void;
}) => {
  return (
    <div className="border-[0.05rem] rounded-lg grid grid-cols-3 gap-2 p-2">
      <div>Company: </div>
      <div className="col-span-2">
        <Filter
          id="company_filter"
          placeholder="Filter by company"
          value={company}
          onChange={onCompanyChange}
          onClear={() => onCompanyChange("")}
        />
      </div>
      <div>Job Title: </div>
      <div className="col-span-2">
        <Filter
          id="job_title_filter"
          placeholder="Filter by job title"
          value={title}
          onChange={onTitleChange}
          onClear={() => onTitleChange("")}
        />
      </div>
      <div>Salary Range: </div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <SalarySelect
          id="min_salary"
          title="Min"
          value={minSalary}
          onChange={(minSalary) => {
            onMinSalarySelect(minSalary);
            if (maxSalary && minSalary > maxSalary) {
              onMaxSalarySelect(minSalary);
            }
          }}
        />
        <div className="flex pt-1">-</div>
        <SalarySelect
          id="max_salary"
          title="Max"
          value={maxSalary}
          onChange={(maxSalary) => {
            onMaxSalarySelect(maxSalary);
            if (minSalary && maxSalary < minSalary) {
              onMinSalarySelect(maxSalary);
            }
          }}
        />
      </div>
      <div className="col-span-3 text-center py-2">
        <input
          type="button"
          className="border-[0.05rem] px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-300"
          value="Search"
          onClick={onSearch}
        />
      </div>
    </div>
  );
};

export default JobFilters;

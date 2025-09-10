import Filter from '../Filter';
import type { SearchFilters } from '../hooks/useCompanies';
import IndustrySelect from './IndustrySelect';

const CompanyFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="border-[0.05rem] rounded-lg grid grid-cols-3 gap-2 p-2">
      <div>Name:</div>
      <div className="col-span-2">
        <Filter
          id="company_filter"
          placeholder="Filter by company"
          value={filters.name}
          onChange={(name) => {
            setFilters({ ...filters, name });
          }}
          onClear={() => setFilters({ ...filters, name: '' })}
        />
      </div>
      <div>Size:</div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <input
          type="number"
          step={1}
          min={1}
          max={1000}
          className="border h-8 pr-1 text-center
                     border-gray-500 rounded-lg"
          value={filters.minSize}
          onChange={(e) => {
            let minSize = parseInt(e.target.value);
            if (isNaN(minSize) || minSize < 1) {
              minSize = 1;
            }
            setFilters({ ...filters, minSize });
          }}
        />
        <div className="flex pt-1">-</div>
        <input
          type="number"
          step={1}
          min={1}
          max={1000}
          className="border h-8 pr-1 text-center
                     border-gray-500 rounded-lg"
          value={filters.maxSize}
          onChange={(e) => {
            let maxSize = parseInt(e.target.value);
            if (isNaN(maxSize) || maxSize > 1000) {
              maxSize = 1000;
            }
            setFilters({ ...filters, maxSize });
          }}
        />
      </div>
      <div>Industry:</div>
      <div className="col-span-2">
        <IndustrySelect
          id="industry"
          industryId={filters.industryId}
          onChange={(industryId) => {
            setFilters({ ...filters, industryId });
          }}
        />
      </div>
    </div>
  );
};

export default CompanyFilters;

import Filter from '../Filter';
import IndustrySelect from './IndustrySelect';
import {
  MAX_COMPANY_SIZE,
  MIN_COMPANY_SIZE,
  type SearchFilters
} from './useCompanies';

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
          id="min_size"
          type="number"
          step={1}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          className="border h-8 pr-1 text-center
                     border-gray-500 rounded-lg"
          value={filters.minSize}
          onChange={(e) => {
            let minSize = parseInt(e.target.value);
            if (isNaN(minSize) || minSize < MIN_COMPANY_SIZE) {
              minSize = MIN_COMPANY_SIZE;
            }
            setFilters({ ...filters, minSize });
          }}
        />
        <div className="flex pt-1">-</div>
        <input
          id="max_size"
          type="number"
          step={1}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          className="border h-8 pr-1 text-center
                     border-gray-500 rounded-lg"
          value={filters.maxSize}
          onChange={(e) => {
            let maxSize = parseInt(e.target.value);
            if (isNaN(maxSize) || maxSize > MAX_COMPANY_SIZE) {
              maxSize = MAX_COMPANY_SIZE;
            }
            setFilters({ ...filters, maxSize });
          }}
        />
      </div>
      <div>Industry:</div>
      <div className="col-span-2">
        <IndustrySelect
          elementId="industry"
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

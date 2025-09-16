import Filter from '../Filter';
import IndustrySelect from './IndustrySelect';
import SizeInput from './SizeInput';
import { type SearchFilters } from './useCompanies';

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
        <SizeInput
          id="min_size"
          size={filters.minSize}
          onChange={(size: number) => {
            setFilters({ ...filters, minSize: size });
          }}
        />
        <div className="flex pt-1">-</div>
        <SizeInput
          id="max_size"
          size={filters.maxSize}
          onChange={(size: number) => {
            setFilters({ ...filters, maxSize: size });
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

import Filter from '../Filter';
import type { SearchFilters } from '../hooks/useCompanies';

const CompanyFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}) => {
  return (
    <div className="border-[0.05rem] rounded-lg grid grid-cols-3 gap-2 p-2">
      <div>Name:</div>
      <div className="col-span-2">
        <Filter
          id="company_filter"
          placeholder="Filter by company"
          value={filters.name}
          onChange={(val) => {
            setFilters((filters) => ({ ...filters, name: val }));
          }}
          onClear={() => setFilters((filters) => ({ ...filters, name: '' }))}
        />
      </div>
    </div>
  );
};

export default CompanyFilters;

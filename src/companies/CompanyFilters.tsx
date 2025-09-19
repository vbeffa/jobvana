import Filter from '../Filter';
import IndustrySelect from './IndustrySelect';
import NumberInput from './NumberInput';
import { type SearchFilters } from './useCompanies';

const CompanyFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: (value: React.SetStateAction<SearchFilters>) => void;
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
        <NumberInput
          id="min_size"
          size={filters.minSize ?? 0}
          onChange={(size) => {
            setFilters({ ...filters, minSize: size ?? undefined });
          }}
        />
        <div className="flex pt-1">-</div>
        <NumberInput
          id="max_size"
          size={filters.maxSize ?? 0}
          onChange={(size) => {
            setFilters({ ...filters, maxSize: size ?? undefined });
          }}
        />
      </div>
      <div>Industry:</div>
      <div className="col-span-2">
        <IndustrySelect
          industryId={filters.industryId}
          handleUpdate={setFilters}
        />
      </div>
    </div>
  );
};

export default CompanyFilters;

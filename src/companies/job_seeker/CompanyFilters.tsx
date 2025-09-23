import Filter from '../../inputs/Filter';
import CompanySize from '../company/CompanySize';
import IndustrySelect from '../IndustrySelect';
import { type SearchFilters } from './useCompanies';

const CompanyFilters = ({
  filters,
  onChange
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2 w-[24rem]">
      <div className="grid grid-cols-[25%_75%] w-[20rem] gap-y-2">
        <Filter
          id="company_filter"
          label="Name"
          placeholder="Filter by company"
          value={filters.name}
          onChange={(name) => {
            onChange({ ...filters, name });
          }}
          onClear={() => onChange({ ...filters, name: '' })}
        />
        <label htmlFor="min_size" className="content-center">
          Size:
        </label>
        <div className="flex flex-row gap-x-2">
          <CompanySize
            id="min_size"
            size={filters.minSize}
            onChange={(size) => {
              onChange({ ...filters, minSize: size ?? undefined });
            }}
          />
          <label htmlFor="max_size" className="content-center">
            -
          </label>
          <CompanySize
            id="max_size"
            size={filters.maxSize}
            onChange={(size) => {
              onChange({ ...filters, maxSize: size ?? undefined });
            }}
          />
        </div>
        <IndustrySelect
          industryId={filters.industryId}
          onChange={(industryId) => {
            onChange({ ...filters, industryId });
          }}
        />
      </div>
    </div>
  );
};

export default CompanyFilters;

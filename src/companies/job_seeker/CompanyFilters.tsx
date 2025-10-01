import Filter from '../../inputs/Filter';
import Label from '../../inputs/Label';
import IndustrySelect from '../IndustrySelect';
import CompanyInterviewRoundsFilters from './CompanyInterviewRoundsFilters';
import CompanySizeFilters from './CompanySizeFilters';
import { type SearchFilters } from './useCompanies';

const CompanyFilters = ({
  filters,
  onChange
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2">
      <div className="flex flex-row gap-x-4">
        <div className="grid grid-cols-[37%63%] w-86 gap-y-2">
          <Label htmlFor="company_filter" label="Company Name" />
          <Filter
            id="company_filter"
            width="w-54"
            placeholder="Filter by company"
            value={filters.name}
            onChange={(name) => {
              onChange({ ...filters, name });
            }}
            onClear={() => onChange({ ...filters, name: '' })}
          />
          <Label htmlFor="min_size" label="Company Size" />
          <CompanySizeFilters
            low={filters.minSize}
            high={filters.maxSize}
            width="w-24"
            onChangeLow={(size) => {
              if (!size) {
                return;
              }
              onChange({
                ...filters,
                minSize: size,
                maxSize: size > filters.maxSize ? size : filters.maxSize
              });
            }}
            onChangeHigh={(size) => {
              if (!size) {
                return;
              }
              onChange({
                ...filters,
                maxSize: size,
                minSize: size < filters.minSize ? size : filters.minSize
              });
            }}
          />
          <Label htmlFor="industry" label="Industry" />
          <IndustrySelect
            industryId={filters.industryId}
            width="w-54"
            showAny={true}
            onChange={(industryId) => {
              onChange({ ...filters, industryId });
            }}
          />
        </div>
        <div className="grid grid-cols-[25%_65%] w-86 gap-y-2">
          <CompanyInterviewRoundsFilters
            low={filters.minRounds}
            high={filters.maxRounds}
            onChangeLow={(rounds) => {
              if (!rounds) {
                return;
              }
              onChange({
                ...filters,
                minRounds: rounds,
                maxRounds:
                  rounds > filters.maxRounds ? rounds : filters.maxRounds
              });
            }}
            onChangeHigh={(rounds) => {
              if (!rounds) {
                return;
              }
              onChange({
                ...filters,
                maxRounds: rounds,
                minRounds:
                  rounds < filters.maxRounds ? rounds : filters.minRounds
              });
            }}
          />
          <div className="col-span-2 row-span-10" />
        </div>
      </div>
    </div>
  );
};

export default CompanyFilters;

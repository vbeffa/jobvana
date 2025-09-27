import Filter from '../../inputs/Filter';
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
      <div className="grid grid-cols-2">
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
          <CompanySizeFilters
            low={filters.minSize}
            high={filters.maxSize}
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
                maxSize: size ?? undefined,
                minSize: size < filters.minSize ? size : filters.minSize
              });
            }}
          />
          <IndustrySelect
            industryId={filters.industryId}
            onChange={(industryId) => {
              onChange({ ...filters, industryId });
            }}
          />
        </div>
        <div className="grid grid-cols-[25%_65%] w-[24rem] gap-y-2">
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
                maxRounds: rounds ?? undefined,
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

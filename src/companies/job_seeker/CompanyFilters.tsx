import _ from 'lodash';
import { useMemo, useState } from 'react';
import FiltersSelectContainer from '../../containers/FiltersSelectContainer';
import Button from '../../controls/Button';
import Filter from '../../inputs/Filter';
import Label from '../../inputs/Label';
import IndustrySelect from '../IndustrySelect';
import CompanyInterviewRoundsFilters from './CompanyInterviewRoundsFilters';
import CompanySizeFilters from './CompanySizeFilters';
import { type SearchFilters } from './useCompanies';

const CompanyFilters = ({
  filters,
  setShowFilters,
  onChange
}: {
  filters: SearchFilters;
  setShowFilters: (showFilters: boolean) => void;
  onChange: (filters: SearchFilters) => void;
}) => {
  const [newFilters, setNewFilters] = useState<SearchFilters>(filters);

  const isDirty = useMemo(
    () => !_.isEqual(filters, newFilters),
    [filters, newFilters]
  );

  return (
    <FiltersSelectContainer>
      <div className="p-2">
        <div className="flex flex-row gap-x-4">
          <div className="grid grid-cols-[37%63%] w-86 gap-y-2">
            <Label htmlFor="company_filter" label="Company Name" />
            <Filter
              id="company_filter"
              width="w-54"
              placeholder="Filter by company"
              value={newFilters.name}
              onChange={(name) => {
                setNewFilters({ ...newFilters, name });
              }}
              onClear={() => setNewFilters({ ...newFilters, name: '' })}
            />
            <Label htmlFor="min_size" label="Company Size" />
            <CompanySizeFilters
              low={newFilters.minSize}
              high={newFilters.maxSize}
              width="w-24"
              onChangeLow={(size) => {
                if (!size) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  minSize: size,
                  maxSize: size > newFilters.maxSize ? size : newFilters.maxSize
                });
              }}
              onChangeHigh={(size) => {
                if (!size) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  maxSize: size,
                  minSize: size < newFilters.minSize ? size : newFilters.minSize
                });
              }}
            />
            <Label htmlFor="industry" label="Industry" />
            <IndustrySelect
              industryId={newFilters.industryId}
              width="w-54"
              showAny={true}
              onChange={(industryId) => {
                setNewFilters({ ...newFilters, industryId });
              }}
            />
          </div>
          <div className="grid grid-cols-[25%_65%] w-86 gap-y-2">
            <CompanyInterviewRoundsFilters
              low={newFilters.minRounds}
              high={newFilters.maxRounds}
              onChangeLow={(rounds) => {
                if (!rounds) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  minRounds: rounds,
                  maxRounds:
                    rounds > newFilters.maxRounds
                      ? rounds
                      : newFilters.maxRounds
                });
              }}
              onChangeHigh={(rounds) => {
                if (!rounds) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  maxRounds: rounds,
                  minRounds:
                    rounds < newFilters.maxRounds
                      ? rounds
                      : newFilters.minRounds
                });
              }}
            />
            <div className="col-span-2 row-span-10" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-row gap-2">
        <Button
          label="Cancel"
          onClick={() => {
            setShowFilters(false);
          }}
        />
        <Button
          label="Apply"
          disabled={!isDirty}
          onClick={() => {
            onChange(newFilters);
            setShowFilters(false);
          }}
        />
      </div>
    </FiltersSelectContainer>
  );
};

export default CompanyFilters;

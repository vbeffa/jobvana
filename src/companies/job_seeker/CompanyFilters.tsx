import _ from 'lodash';
import { useMemo, useState } from 'react';
import FiltersSelectContainer from '../../containers/FiltersSelectContainer';
import Button from '../../controls/Button';
import Filter from '../../inputs/Filter';
import Label from '../../inputs/Label';
import IndustrySelect from '../IndustrySelect';
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
          <div className="grid grid-cols-[37%_63%] w-[480px] gap-y-2">
            <Label htmlFor="company_filter" label="Company Name" />
            <Filter
              id="company_filter"
              width="w-full"
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
              width="w-full"
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
              width="w-full"
              showAny={true}
              onChange={(industryId) => {
                setNewFilters({ ...newFilters, industryId });
              }}
            />
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

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import useIndustries from '../../companies/useIndustries';
import PillContainer from '../../containers/PillContainer';
import { INITIAL_SEARCH_FILTERS } from '../utils';
import type { SearchFilters } from './useCompanies';

const ActiveFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
}) => {
  const { findIndustry } = useIndustries();

  const industry = useMemo(
    () => (filters.industryId ? findIndustry(filters.industryId) : undefined),
    [filters.industryId, findIndustry]
  );

  console.log(filters);

  return (
    <div className="flex flex-row gap-2 w-full whitespace-nowrap overflow-auto">
      {filters.name && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Company Name:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                company: INITIAL_SEARCH_FILTERS.name
              }));
            }}
          >
            {filters.name}
          </PillContainer>
        </div>
      )}
      {(filters.minSize > INITIAL_SEARCH_FILTERS.minSize ||
        filters.maxSize < INITIAL_SEARCH_FILTERS.maxSize) && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Size:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                minSize: INITIAL_SEARCH_FILTERS.minSize,
                maxSize: INITIAL_SEARCH_FILTERS.maxSize
              }));
            }}
          >{`${filters.minSize} - ${filters.maxSize}`}</PillContainer>
        </div>
      )}
      {industry && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Industry:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                industryId: INITIAL_SEARCH_FILTERS.industryId
              }));
            }}
          >
            {industry.name}
          </PillContainer>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;

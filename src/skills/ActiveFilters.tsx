import { useMemo, type Dispatch, type SetStateAction } from 'react';
import PillContainer from '../containers/PillContainer';
import useSkillCategories from '../skill_categories/useSkillCategories';
import type { SearchFilters } from './useSkills';
import { INITIAL_SEARCH_FILTERS } from './utils';

const ActiveFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
}) => {
  const { findSkillCategory } = useSkillCategories();

  const skillCategory = useMemo(
    () =>
      filters.skillCategoryId
        ? findSkillCategory(filters.skillCategoryId)
        : undefined,
    [filters.skillCategoryId, findSkillCategory]
  );

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
      {skillCategory && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Industry:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                skillCategoryId: INITIAL_SEARCH_FILTERS.skillCategoryId
              }));
            }}
          >
            {skillCategory.name}
          </PillContainer>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;

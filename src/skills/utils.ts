import type { Skill } from '../types';
import type { SearchFilters } from './useSkills';

export const INITIAL_SEARCH_FILTERS: SearchFilters = {
  name: '',
  skillCategoryId: 0
};

export const skillSorter = (skill1: Skill, skill2: Skill) => {
  return (skill1.abbreviation ?? skill1.name).localeCompare(
    skill2.abbreviation ?? skill2.name
  );
};

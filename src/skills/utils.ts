import type { Skill } from '../types';

export const skillSorter = (skill1: Skill, skill2: Skill) => {
  return (skill1.abbreviation ?? skill1.name).localeCompare(
    skill2.abbreviation ?? skill2.name
  );
};

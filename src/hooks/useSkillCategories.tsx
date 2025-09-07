import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { SkillCategory } from './types';

export type SkillCategories = {
  skillCategories: Array<SkillCategory> | undefined;
  rootCategories: Array<SkillCategory> | undefined;
  findSkillCategory: (id: number) => SkillCategory | undefined;
  findChildSkillCategories: (
    parentSkillCategory: SkillCategory
  ) => Array<SkillCategory> | undefined;
};

const useSkillCategories = (): SkillCategories => {
  const { data: skillCategoriesData } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: async () => {
      const { data } = await supabase.from('skill_categories').select();
      return data;
    }
  });

  const skillCategories: Array<SkillCategory> | undefined = useMemo(() => {
    if (!skillCategoriesData) {
      return undefined;
    }
    const skillCategories: Array<SkillCategory> = skillCategoriesData
      .map((skillCategory) => ({
        ...skillCategory,
        childCategories: [] // set to empty array to satisfy type checker
      }))
      .sort((skillCategory1, skillCategory2) =>
        skillCategory1.name.localeCompare(skillCategory2.name)
      );
    // now that skillCategories is hydrated, can correctly set childCategories
    skillCategories.forEach((skillCategory) => {
      skillCategory.childCategories = skillCategories.filter(
        (category) => category.parent_skill_category_id === skillCategory.id
      );
    });
    return skillCategories;
  }, [skillCategoriesData]);

  return {
    skillCategories,
    rootCategories: skillCategories?.filter(
      (category) => category.parent_skill_category_id === null
    ),
    findSkillCategory: (id: number) =>
      skillCategories?.find((skillCategory) => skillCategory.id === id),

    findChildSkillCategories: (parentSkillCategory: SkillCategory) =>
      skillCategories?.filter(
        (skillCategory) =>
          skillCategory.parent_skill_category_id === parentSkillCategory.id
      )
  };
};

export default useSkillCategories;

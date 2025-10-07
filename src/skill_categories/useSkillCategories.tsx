import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { SkillCategory as DbSkillCategory } from '../types';

export type SkillCategory = DbSkillCategory & {
  childCategories: Array<SkillCategory>;
};

export type SkillCategories = {
  skillCategories: Array<SkillCategory> | undefined;
  error?: Error;
  isPending: boolean;

  rootCategories: Array<SkillCategory> | undefined;
  findSkillCategory: (id: number) => SkillCategory | undefined;

  findChildSkillCategories: (
    parentSkillCategory: SkillCategory
  ) => Array<SkillCategory> | undefined;
};

// skill categories are few - no paging needed
const useSkillCategories = (): SkillCategories => {
  const { data, error, isPending } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skill_categories').select();
      return { skillCategories: data, error };
    }
  });

  const skillCategories: Array<SkillCategory> | undefined = useMemo(() => {
    if (!data?.skillCategories) {
      return undefined;
    }

    const skillCategories: Array<SkillCategory> = data.skillCategories
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
  }, [data]);

  return {
    skillCategories,
    error: error ?? undefined,
    isPending,

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

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { Params } from '../types';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type SkillSummary = {
  id: number;
  name: string;
  skillCategories: Array<string>;
};

export type Skills = {
  skills: Array<SkillSummary> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  skillsCount: number | undefined;
  findSkill: (id: number) => SkillSummary | undefined;
};

export type SkillsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useSkills = (params: SkillsParams): Skills => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging.page,
      ...params.filters
    }),
    [params.filters, params.paging.page]
  );

  const { isPending, isPlaceholderData, data, error } = useQuery({
    queryKey: ['skills', queryKey],
    queryFn: async () => {
      const { filters } = params;
      let q = filters.skillCategoryId
        ? supabase
            .from('skills')
            .select(
              'id, name, skill_category_memberships!inner(skill_category_id, skill_categories(name))',
              { count: 'exact' }
            )
        : supabase
            .from('skills')
            .select(
              'id, name, skill_category_memberships(skill_category_id, skill_categories(name))',
              { count: 'exact' }
            );
      if (filters.name) {
        q = q.ilike('name', `%${filters.name}%`);
      }
      if (filters.skillCategoryId) {
        q = q.filter(
          'skill_category_memberships.skill_category_id',
          'eq',
          filters.skillCategoryId
        );
      }
      const { data, count, error } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');

      if (error) {
        console.log(error);
        throw error;
      }

      return { skills: data, count };
    }
  });

  const skills = useMemo(() => {
    if (!data?.skills) {
      return undefined;
    }

    return data.skills
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        skillCategories: skill.skill_category_memberships
          .map((membership) => membership.skill_categories.name)
          .sort((name1, name2) => name1.localeCompare(name2))
      }))
      .sort((skill1, skill2) => skill1.name.localeCompare(skill2.name));
  }, [data]);

  const skillsCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    skills,
    error: error ?? undefined,
    isPending,
    isPlaceholderData,
    skillsCount,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id)
  };
};

export default useSkills;

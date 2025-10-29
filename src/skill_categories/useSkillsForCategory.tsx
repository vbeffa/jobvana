import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { Params, Skill } from '../types';

export type SearchFilters = {
  name?: string;
};

export type SkillsForCategory = {
  skills: Array<Skill> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  skillsCount: number | undefined;
};

export type SkillsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useSkillsForCategory = ({
  skillCategoryId,
  countOnly,
  params
}: {
  skillCategoryId: number;
  countOnly?: boolean;
  params: SkillsParams;
}): SkillsForCategory => {
  const queryKey: QueryKey = useMemo(
    () => ({
      categoryId: skillCategoryId,
      page: params.paging.page,
      ...params.filters
    }),
    [skillCategoryId, params.filters, params.paging.page]
  );

  const {
    isPending,
    isPlaceholderData,
    data: skillsData,
    error
  } = useQuery({
    queryKey: ['skillsForCategory', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('skills')
        .select('*', {
          count: 'exact',
          head: countOnly
        })
        .filter('skill_category_id', 'eq', skillCategoryId);
      const { filters } = params;
      if (filters.name) {
        q = q.ilike('name', `%${filters.name}%`);
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

      // console.log(data);
      return { data, count };
    }
  });

  const skills = useMemo(() => {
    if (!skillsData?.data) {
      return undefined;
    }
    const skills: Array<Skill> = skillsData.data.sort((skill1, skill2) => {
      if (skill1.skill_category_id === skill2.skill_category_id) {
        return skill1.name.localeCompare(skill2.name);
      }

      return skill1.skill_category_id - skill2.skill_category_id;
    });
    return skills;
  }, [skillsData]);

  const skillsCount = useMemo(
    () => skillsData?.count ?? undefined,
    [skillsData?.count]
  );

  return {
    skills,
    error: error ?? undefined,
    isPending,
    isPlaceholderData,
    skillsCount
  };
};

export default useSkillsForCategory;

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
        .select('*, skill_category_memberships!inner(skill_category_id)', {
          count: 'exact',
          head: countOnly
        })
        .filter(
          'skill_category_memberships.skill_category_id',
          'eq',
          skillCategoryId
        );
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

      return { data, count };
    }
  });

  const skills = useMemo(() => {
    if (!skillsData?.data) {
      return undefined;
    }

    return skillsData.data
      .map(({ skill_category_memberships: _memberships, ...skill }) => skill)
      .sort((skill1, skill2) => skill1.name.localeCompare(skill2.name));
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

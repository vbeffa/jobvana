import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Params } from '../types';
import supabase from '../utils/supabase';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type SkillSummary = {
  id: number;
  name: string;
  skillCategory: string;
};

export type Skills = {
  skills: Array<SkillSummary> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  skillsCount: number | undefined;
  findSkill: (id: number) => SkillSummary | undefined;

  // findSiblingSkills: (skill: SkillSummary) => Array<SkillSummary> | undefined;
};

export type SkillsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useSkills = (params: SkillsParams): Skills => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );

  const { isPending, isPlaceholderData, data, error } = useQuery({
    queryKey: ['skills', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('skills')
        .select('id, name, skill_categories!inner(name)', {
          count: 'exact'
        });
      const { filters } = params;
      if (filters?.name) {
        q = q.ilike('name', `%${filters.name}%`);
      }
      if (filters?.skillCategoryId) {
        q = q.filter('skill_category_id', 'eq', filters.skillCategoryId);
      }
      const { data, error, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');
      // console.log(data);
      return { skills: data, error, count };
    }
  });

  const skills = useMemo(() => {
    if (!data?.skills) {
      return undefined;
    }

    return data.skills
      .map((skill) => ({
        ...skill,
        skillCategory: skill.skill_categories.name
      }))
      .sort((skill1, skill2) => {
        return skill1.name.localeCompare(skill2.name);
      });
  }, [data?.skills]);

  const skillsCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    skills,
    error: error ?? undefined,
    isPending,
    isPlaceholderData,
    skillsCount,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id)

    // TODO fix - skills are paginated
    // findSiblingSkills: (skill: SkillSummary) =>
    //   skills?.filter(
    //     (s) =>
    //       s.skill_category_id === skill.skill_category_id && s.id !== skill.id
    //   )
  };
};

export default useSkills;

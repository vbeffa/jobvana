import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type {
  Skill as DbSkill,
  Params,
  SkillCategory,
  SkillVersion
} from './types';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type Skill = DbSkill & {
  category: SkillCategory;
  versions: Array<SkillVersion>;
  relatedSkills: Array<DbSkill>;
};

export type Skills = {
  skills: Array<Skill> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  skillsCount: number | undefined;
  findSkill: (id: number) => Skill | undefined;

  findSkills: (skillCategoryId: number) => Array<Skill> | undefined;
  findSiblingSkills: (skill: Skill) => Array<Skill> | undefined;
};

export type SkillsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useSkills = (
  params: SkillsParams = { paging: { page: 1, pageSize: 10 } }
): Skills => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );

  const {
    isPending,
    isPlaceholderData,
    data: skillsData,
    error
  } = useQuery({
    queryKey: ['skills', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('skills')
        .select(
          '*, skill_categories(*), skill_versions(*), skill_relations!skill_id(*, skills!related_skill_id(*))',
          {
            count: 'exact'
          }
        );
      const { filters } = params;
      console.log(filters);
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
      console.log(data);
      return { data, error, count };
    }
  });

  const skills = useMemo(() => {
    if (!skillsData?.data) {
      return undefined;
    }
    const skills: Array<Skill> = skillsData.data
      .map((skill) => ({
        ...skill,
        category: skill.skill_categories,
        versions: skill.skill_versions,
        relatedSkills: skill.skill_relations.map((sr) => sr.skills)
      }))
      .sort((skill1, skill2) => {
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
    skillsCount,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id),

    // TODO fix - skills are paginated
    findSkills: (skillCategoryId: number) =>
      skills?.filter((skill) => skill.skill_category_id === skillCategoryId),
    // TODO fix - skills are paginated
    findSiblingSkills: (skill: Skill) =>
      skills?.filter(
        (s) =>
          s.skill_category_id === skill.skill_category_id && s.id !== skill.id
      )
  };
};

export default useSkills;

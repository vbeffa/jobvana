import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type {
  Skill as DbSkill,
  SkillCategory as DbSkillCategory,
  SkillVersion as DbSkillVersion
} from '../types';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type FullSkill = Skill & {
  categories: Array<SkillCategory>;
  versions: Array<SkillVersion>;
  relatedSkills: Array<RelatedSkill>;
};

export type Skill = Omit<DbSkill, 'id'>;
export type SkillCategory = Pick<DbSkillCategory, 'id' | 'name'>;
export type SkillVersion = Pick<
  DbSkillVersion,
  'id' | 'ordinal' | 'skill_id' | 'version'
>;
export type RelatedSkill = Pick<
  DbSkill,
  'id' | 'name' | 'abbreviation'
>;

export type SkillH = {
  skill: FullSkill | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useSkill = (id: number): SkillH => {
  const {
    isPending,
    isPlaceholderData,
    data: skillData,
    error
  } = useQuery({
    queryKey: ['skills', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(
          `name, abbreviation, code, description, notes, reference, retired_at,
          skill_category_memberships(skill_categories(id, name)),
          skill_versions(id, ordinal, skill_id, version),
          skill_relations!skill_id(skills!related_skill_id(id, name, abbreviation))`
        )
        .filter('id', 'eq', id);

      if (error) {
        console.log(error);
        throw error;
      }

      return { data, error };
    }
  });

  const skill = useMemo(() => {
    if (!skillData?.data) {
      return undefined;
    }
    const skill = skillData.data[0];
    return {
      ...skill,
      categories: skill.skill_category_memberships.map(
        (membership) => membership.skill_categories
      ),
      versions: skill.skill_versions,
      relatedSkills: skill.skill_relations.map((sr) => sr.skills)
    };
  }, [skillData]);

  return {
    skill,
    error: error ?? undefined,
    isPending,
    isPlaceholderData
  };
};

export default useSkill;

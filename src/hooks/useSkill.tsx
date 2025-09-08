import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type {
  Skill as DbSkill,
  SkillCategory as DbSkillCategory,
  SkillVersion as DbSkillVersion
} from './types';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type SkillCategory = Pick<DbSkillCategory, 'id' | 'name'>;

export type SkillVersion = Pick<
  DbSkillVersion,
  'id' | 'ordinal' | 'skill_id' | 'version'
>;

export type RelatedSkill = Pick<
  DbSkill,
  'id' | 'skill_category_id' | 'name' | 'abbreviation'
>;

export type Skill = Omit<DbSkill, 'id'> & {
  category: SkillCategory;
  versions: Array<SkillVersion>;
  relatedSkills: Array<RelatedSkill>;
};

export type SkillH = {
  skill: Skill | undefined;
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
          `name, abbreviation, description, notes, reference, skill_category_id,
          skill_categories(id, name),
          skill_versions(id, ordinal, skill_id, version),
          skill_relations!skill_id(skills!related_skill_id(id, skill_category_id, name, abbreviation))`
        )
        .filter('id', 'eq', id);

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
      category: skill.skill_categories,
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

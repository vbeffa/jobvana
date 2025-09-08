import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Skill as DbSkill } from './types';

export type SearchFilters = {
  name?: string;
  skillCategoryId?: number;
};

export type SkillH = {
  skill: DbSkill | undefined;
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
          '*, skill_categories(*), skill_versions(*), skill_relations!skill_id(*, skills!related_skill_id(*))'
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

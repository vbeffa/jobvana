import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type SkillV2 = Database['public']['Tables']['skills_v2']['Row'];

export type SkillsV2 = {
  skills: Array<SkillV2> | undefined;
  isPending: boolean;
  findSkill: (id: number) => SkillV2 | undefined;
};

const useSkillsV2 = (): SkillsV2 => {
  const { isPending, data: skillsData } = useQuery({
    queryKey: ['skills_v2'],
    queryFn: async () => {
      const { data } = await supabase.from('skills_v2').select();
      return data;
    }
  });

  const skills = useMemo(() => {
    if (!skillsData) {
      return undefined;
    }
    return skillsData;
  }, [skillsData]);

  return {
    skills,
    isPending,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id)
  };
};

export default useSkillsV2;

import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';
import type { Skill } from './types';

export type SkillsLite = {
  skills: Array<Skill> | undefined;
  isPending: boolean;
  findSkill: (skillId: number) => Skill | undefined;
};

const useSkillsLite = (): SkillsLite => {
  const { isPending, data: skillsData } = useQuery({
    queryKey: ['skillsLite'],
    queryFn: async () => {
      const { data } = await supabase.from('skills').select().order('name');
      return data;
    }
  });

  return {
    skills: skillsData ?? undefined,
    isPending,
    findSkill: (skillId: number) =>
      skillsData?.find((skillData) => skillData.id === skillId)
  };
};

export default useSkillsLite;

import { useQuery } from '@tanstack/react-query';
import supabase from '../db/supabase';
import type { Skill } from '../types';

export type SkillsLite = {
  skills: Array<Skill> | undefined;
  isPending: boolean;
  findSkill: (skillId: number) => Skill | undefined;
};

const useSkillsLite = (): SkillsLite => {
  const { isPending, data: skillsData } = useQuery({
    queryKey: ['skillsLite'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select()
        .order('name');

      if (error) {
        console.log(error);
        throw error;
      }

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

import { useQuery } from '@tanstack/react-query';
import supabase from '../utils/supabase';
import type { SkillVersion } from './types';

export type SkillVersionsLite = {
  skillVersions: Array<SkillVersion> | undefined;
  isPending: boolean;
  findSkillVersion: (skillVersionId: number) => SkillVersion | undefined;
};

const useSkillVersionsLite = (): SkillVersionsLite => {
  const { isPending, data: skillVersionsData } = useQuery({
    queryKey: ['skillVersionsLite'],
    queryFn: async () => {
      const { data } = await supabase
        .from('skill_versions')
        .select()
        .order('skill_id,version');
      return data;
    }
  });

  return {
    skillVersions: skillVersionsData ?? undefined,
    isPending,
    findSkillVersion: (skillVersionId: number) =>
      skillVersionsData?.find(
        (skillVersionData) => skillVersionData.id === skillVersionId
      )
  };
};

export default useSkillVersionsLite;

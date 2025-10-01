import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';

const useSkillVersion = ({ id }: { id: number }) => {
  const {
    isPlaceholderData,
    isPending,
    data: skillVersionData,
    error
  } = useQuery({
    queryKey: ['skillVersion', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('skill_versions')
        .select('*')
        .filter('id', 'eq', id);
      // console.log(data);
      return { error, data };
    }
  });

  const skillVersion = useMemo(
    () => skillVersionData?.data?.[0],
    [skillVersionData?.data]
  );

  return {
    skillVersion,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useSkillVersion;

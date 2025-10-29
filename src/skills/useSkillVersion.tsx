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
      const { data, error } = await supabase
        .from('skill_versions')
        .select('*')
        .filter('id', 'eq', id);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { data };
    }
  });

  const skillVersion = useMemo(
    () => skillVersionData?.data[0],
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

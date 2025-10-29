import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { Skill } from '../types';

export type Skills = {
  skills: Array<Skill> | undefined;
  count: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useSkillsForJobSeeker = (jobSeekerId: number): Skills => {
  const queryKey = useMemo(
    () => ({
      jobSeekerId
    }),
    [jobSeekerId]
  );

  const {
    data: skillsData,
    error,
    refetch
  } = useQuery({
    queryKey: ['job_seeker_skills', queryKey],
    queryFn: async () => {
      const { data, count, error } = await supabase
        .from('job_seeker_skills')
        .select('*, skills(*)', { count: 'exact' })
        .filter('job_seeker_id', 'eq', jobSeekerId);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { error, data, count };
    }
  });

  const skills: Array<Skill> | undefined = useMemo(() => {
    return skillsData?.data.map((skillData) => skillData.skills);
  }, [skillsData?.data]);

  return {
    skills,
    count: skillsData?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useSkillsForJobSeeker;

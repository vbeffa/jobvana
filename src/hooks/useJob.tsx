import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type {
  Application,
  Company,
  Job as DbJob,
  Skill as DbSkill,
  JobRole
} from './types';

export type Skill = Pick<
  DbSkill,
  'id' | 'skill_category_id' | 'name' | 'abbreviation'
>;

export type Requirement = Pick<JobRole, 'role_id' | 'percent' | 'role_level'>;

export type Job = DbJob & {
  company: Pick<Company, 'id' | 'name'>;
  requirements: Array<Requirement>;
  skills: Array<Skill>;
  applications: Array<Pick<Application, 'status'>> | undefined;
};

const useJob = ({ id }: { id: number }) => {
  const {
    isPlaceholderData,
    isPending,
    data: jobData,
    error
  } = useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('jobs')
        .select(
          `*,
          companies!inner(id, name),
          job_roles!inner(role_id, percent, role_level),
          skills!inner(id, name, skill_category_id, abbreviation),
          applications!inner(status)`
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { error, data };
    },
    placeholderData: keepPreviousData
  });

  const job: Job | undefined = useMemo(() => {
    if (!jobData?.data?.[0]) {
      return undefined;
    }
    const job = jobData.data[0];
    return {
      ...job,
      company: job.companies,
      requirements: job.job_roles
    };
  }, [jobData?.data]);

  return {
    job,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useJob;

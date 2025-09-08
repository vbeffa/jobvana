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

export type FullJob = Job & {
  company: Pick<Company, 'id' | 'name'>;
  requirements: Array<Requirement>;
  skills: Array<Skill>;
  applications: Array<Pick<Application, 'status'>> | undefined;
};

export type Job = Omit<DbJob, 'id' | 'company_id' | 'status'>;
export type Skill = Pick<
  DbSkill,
  'id' | 'skill_category_id' | 'name' | 'abbreviation'
>;
export type Requirement = Pick<JobRole, 'role_id' | 'percent' | 'role_level'>;

export type JobH = {
  job: FullJob | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useJob = (id: number): JobH => {
  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(
          `created_at, description, salary_low, salary_high, title,
          companies!inner(id, name),
          job_roles!inner(role_id, percent, role_level),
          skills!inner(id, name, skill_category_id, abbreviation),
          applications!inner(status)`
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { job: data?.[0], error };
    },
    placeholderData: keepPreviousData
  });

  const job: FullJob | undefined = useMemo(() => {
    if (!data?.job) {
      return undefined;
    }
    const job = data.job;
    return {
      ...job,
      company: job.companies,
      requirements: job.job_roles
    };
  }, [data?.job]);

  return {
    job,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useJob;

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { SkillVersion } from '../../companies/job_seeker/useCompany';
import type {
  Application,
  Company,
  Job as DbJob,
  JobRole as DbJobRole,
  Skill as DbSkill
} from '../../types';
import supabase from '../../utils/supabase';

export type FullJob = Job & {
  company: Pick<Company, 'id' | 'name'> & { techStack: Array<SkillVersion> };
  jobRoles: Array<JobRole>;
  skills: Array<Skill>;
  applications: Array<Pick<Application, 'status'>> | undefined;
};

export type Job = Omit<DbJob, 'id' | 'company_id' | 'status'>;
export type Skill = Pick<
  DbSkill,
  'id' | 'skill_category_id' | 'name' | 'abbreviation'
>;
export type JobRole = Pick<DbJobRole, 'role_id' | 'percent' | 'role_level'>;

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
          `created_at, updated_at, type, description, salary_type, salary_low, salary_high, title,
          companies!inner(id, name, company_tech_stacks(skill_versions(id, skill_id, version, ordinal))),
          job_roles(role_id, percent, role_level),
          skills(id, name, skill_category_id, abbreviation),
          applications(status)`
        )
        .filter('id', 'eq', id);

      // console.log(data);
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
      company: {
        id: job.companies.id,
        name: job.companies.name,
        techStack: job.companies.company_tech_stacks.map(
          (techStack) => techStack.skill_versions
        )
      },
      jobRoles: job.job_roles
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

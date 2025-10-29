import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type {
  Application,
  Company,
  CompanyAddress,
  Job as DbJob,
  JobRole as DbJobRole,
  Skill as DbSkill
} from '../../types';

export type FullJob = Job & {
  company: Pick<Company, 'id' | 'name' | 'user_id'> & {
    // techStack: Array<SkillVersion>;
    interviewProcess: InterviewProcess | null;
    // totalApplications: number; // total across all job seekers for all jobs for this company to verify pipeline limit
  };
  address: CompanyAddress | null;
  jobRoles: Array<JobRole>;
  skills: Array<Skill>;
  applicationStatuses: Array<Application['status']>;
  activeApplicationCount: number;
  isSaved: boolean;
};

export type Job = Pick<
  DbJob,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'type'
  | 'title'
  | 'description'
  | 'salary_type'
  | 'salary_low'
  | 'salary_high'
> & {
  interviewProcess: InterviewProcess | null;
};
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
  refetch: () => Promise<QueryObserverResult>;
};

const useJob = (id: number): JobH => {
  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(
          `id, created_at, updated_at, type, title, description, salary_type, salary_low, salary_high, interview_process,
          company_addresses(*),
          companies!inner(id, name, interview_process, user_id),
          job_roles(role_id, percent, role_level),
          skills(id, name, skill_category_id, abbreviation),
          applications(status),
          saved_jobs(*)`
        )
        .filter('id', 'eq', id);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { job: data[0] };
    },
    placeholderData: keepPreviousData
  });

  const job: FullJob | undefined = useMemo(() => {
    if (!data?.job) {
      return undefined;
    }
    const job = data.job;
    return {
      ..._.pick(
        job,
        'id',
        'created_at',
        'updated_at',
        'type',
        'title',
        'description',
        'salary_type',
        'salary_low',
        'salary_high',
        'skills'
      ),
      company: {
        id: job.companies.id,
        name: job.companies.name,
        user_id: job.companies.user_id,
        interviewProcess: job.companies
          .interview_process as InterviewProcess | null
      },
      address: job.company_addresses,
      jobRoles: job.job_roles,
      applicationStatuses: data.job.applications.map((app) => app.status),
      interviewProcess: job.interview_process as InterviewProcess,
      activeApplicationCount: data.job.applications.filter((app) =>
        ['submitted', 'accepted'].includes(app.status)
      ).length,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      isSaved: Boolean(job.saved_jobs?.[0])
    };
  }, [data]);

  return {
    job,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    refetch
  };
};

export default useJob;

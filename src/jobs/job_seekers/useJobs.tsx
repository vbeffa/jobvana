import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type {
  Application as DbApplication,
  JobSalaryType,
  JobType,
  Params
} from '../../types';

export const MAX_TITLE_LENGTH = 100;
export const MIN_SALARY = 10000;
export const MAX_SALARY = 200000;
export const MIN_HOURLY_RATE = 20;
export const MAX_HOURLY_RATE = 200;

export type CreatedRange =
  | 'all'
  | 'today'
  | 'last_three_days'
  | 'last_week'
  | 'last_month';

export type SearchFilters = {
  company?: string;
  // companyId?: number;
  jobType: JobType | 'any';
  title?: string;
  description?: string;
  minSize: number;
  maxSize: number;
  industryId?: number;
  roleId?: number;
  salaryType: JobSalaryType;
  minSalary: number;
  maxSalary: number;
  skillIds?: Array<number>;
  created: CreatedRange;
  hideApplied: boolean;
};

export type Application = Pick<DbApplication, 'created_at'>;

export type JobSummary = {
  id: number;
  title: string;
  companyName: string;
  updated_at: string;
  minSalary: number;
  maxSalary: number;
  application?: Application;
  isSaved: boolean;
};

export type Jobs = {
  jobs: Array<JobSummary> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  openJobCount: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

export type JobsParams = Params<SearchFilters>;

// type QueryKey = {
//   params: JobsParams;
// };

const useJobs = (params: JobsParams): Jobs => {
  // const queryKey: JobsParams = useMemo(() => params, [params]);
  // console.log(queryKey);

  const {
    paging: { page, pageSize },
    filters
  } = params;

  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      let q = supabase
        .from('jobs')
        .select(
          `id, title, updated_at, salary_low, salary_high,
          companies!inner(name),
          job_roles!inner(roles!inner()), job_skills!inner(skills!inner(id)),
          applications(created_at),
          hidden_jobs(),
          saved_jobs(*)`,
          { count: 'exact' }
        )
        .is('hidden_jobs', null)
        // .filter('hidden_jobs.job_seeker_id', 'eq', jobSeekerId)
        .filter('status', 'eq', 'open')
        .filter('salary_type', 'eq', filters.salaryType);

      if (filters.company) {
        q = q.ilike('companies.name', `%${filters.company}%`);
      }
      if (filters.jobType !== 'any') {
        q = q.filter('type', 'eq', filters.jobType);
      }
      // if (filters.companyId) {
      //   q = q.filter('companies.id', 'eq', filters.companyId);
      // }
      if (filters.title) {
        q = q.ilike('title', `%${filters.title}%`);
      }
      if (filters.description) {
        q = q.ilike('description', `%${filters.description}%`);
      }
      if (filters.minSize) {
        q = q.filter('companies.num_employees', 'gte', filters.minSize);
      }
      if (filters.maxSize) {
        q = q.filter('companies.num_employees', 'lte', filters.maxSize);
      }
      if (filters.industryId) {
        q = q.filter('companies.industry_id', 'eq', filters.industryId);
      }
      if (filters.roleId && filters.roleId > 0) {
        q = q.filter('job_roles.role_id', 'eq', filters.roleId);
      }
      if (filters.minSalary) {
        q = q.filter('salary_low', 'gte', filters.minSalary);
      }
      if (filters.maxSalary) {
        q = q.filter('salary_high', 'lte', filters.maxSalary);
      }
      if (filters.created !== 'all') {
        const createdAfter = (() => {
          switch (filters.created) {
            case 'today':
              return dayjs().startOf('day').toDate();
            case 'last_three_days':
              return dayjs().subtract(3, 'days').startOf('day').toDate();
            case 'last_week':
              return dayjs().subtract(7, 'days').startOf('day').toDate();
            case 'last_month':
              return dayjs().subtract(1, 'month').startOf('day').toDate();
          }
        })().toISOString();
        q = q.filter('created_at', 'gte', createdAfter);
      }
      if (filters.hideApplied) {
        q = q.is('applications', null);
      }
      if (filters.skillIds && filters.skillIds.length > 0) {
        q = q.in('job_skills.skill_id', filters.skillIds);
      }

      const { error, data, count } = await q
        .order('updated_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { jobs: data, error, count };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<JobSummary> | undefined = useMemo(() => {
    if (!data?.jobs) {
      return undefined;
    }

    return data.jobs.map((jobData) => {
      const jobSummary: JobSummary = {
        ..._.pick(jobData, 'id', 'title', 'updated_at'),
        companyName: jobData.companies.name,
        minSalary: jobData.salary_low,
        maxSalary: jobData.salary_high,
        application: jobData.applications[0],
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        isSaved: Boolean(jobData.saved_jobs?.[0])
      };

      return jobSummary;
    });
  }, [data]);

  const openJobCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    jobs,
    isPending,
    isPlaceholderData,
    openJobCount,
    error: error ?? undefined,
    refetch
  };
};

export default useJobs;

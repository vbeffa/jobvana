import { keepPreviousData, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import type { Params } from '../types';
import supabase from '../utils/supabase';

export const MIN_SALARY = 10000;
export const MAX_SALARY = 200000;

export type CreatedRange =
  | 'all'
  | 'today'
  | 'last_three_days'
  | 'last_week'
  | 'last_month';

export type SearchFilters = {
  company?: string;
  companyId?: number;
  title?: string;
  roleId?: number;
  minSalary: number;
  maxSalary: number;
  skillId?: number;
  created?: CreatedRange;
};

export type JobSummary = {
  id: number;
  title: string;
  companyName: string;
};

export type Jobs = {
  jobs: Array<JobSummary> | undefined;
  error?: Error;
  isPlaceholderData: boolean;
  isPending: boolean;
  openJobCount: number | undefined;
};

export type JobsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useJobs = (params: JobsParams): Jobs => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      // company: '',
      // title: '',
      minSalary: MIN_SALARY,
      maxSalary: MAX_SALARY,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );
  // console.log(queryKey);

  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['jobs', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('jobs')
        .select(
          // 'id, title, companies!inner(name), job_roles!inner(roles!inner()), skills!inner()',
          'id, title, companies!inner(name), job_roles!inner(roles!inner()), job_skills!inner(skills!inner())',
          {
            count: 'exact'
          }
        )
        .filter('status', 'eq', 'open');

      const { filters } = params;
      if (filters?.company) {
        q = q.ilike('companies.name', `%${filters.company}%`);
      }
      if (filters?.companyId) {
        q = q.filter('companies.id', 'eq', filters.companyId);
      }
      if (filters?.title) {
        q = q.ilike('title', `%${filters.title}%`);
      }
      if (filters?.roleId && filters.roleId > 0) {
        q = q.filter('job_roles.role_id', 'eq', filters.roleId);
      }
      if (filters?.minSalary) {
        q = q.filter('salary_low', 'gte', filters.minSalary);
      }
      if (filters?.maxSalary) {
        q = q.filter('salary_high', 'lte', filters.maxSalary);
      }
      if (filters?.skillId) {
        q = q.eq('job_skills.skill_id', filters.skillId);
      }
      if (filters?.created && filters.created !== 'all') {
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

      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('created_at', { ascending: false });
      // .overrideTypes<Array<{ companies: Company }>>();
      console.log(data);
      if (error) {
        console.log(JSON.stringify(error));
      }
      return { jobs: data, error, count };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<JobSummary> | undefined = useMemo(() => {
    if (!data?.jobs) {
      return undefined;
    }

    return data.jobs.map((job) => {
      return {
        ...job,
        companyName: job.companies.name
      };
    });
  }, [data?.jobs]);

  const openJobCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    jobs,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    openJobCount
  };
};

export default useJobs;

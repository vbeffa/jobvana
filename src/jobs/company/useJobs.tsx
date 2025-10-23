import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { JobStatus, Params } from '../../types';

export type SearchFilters = {
  companyId: number;
  status: JobStatus | 'all';
};

export type JobSummary = {
  id: number;
  title: string;
  status: JobStatus;
  updated_at: string;
  minSalary: number;
  maxSalary: number;
};

export type Jobs = {
  jobs: Array<JobSummary> | undefined;
  isPlaceholderData: boolean;
  isPending: boolean;
  error?: Error;
  total: number | undefined;
  refetch: () => Promise<QueryObserverResult>;
};

export type JobsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useJobs = (params: JobsParams): Jobs => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging.page,
      ...params.filters
    }),
    [params.filters, params.paging.page]
  );

  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['jobs', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('jobs')
        .select('id, title, status, updated_at, salary_low, salary_high', {
          count: 'exact'
        })
        .filter('company_id', 'eq', params.filters.companyId);

      const { filters } = params;
      if (filters.status !== 'all') {
        q = q.filter('status', 'eq', filters.status);
      }

      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('updated_at', { ascending: false });

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
    return data.jobs.map((jobData) => ({
      ..._.pick(jobData, 'id', 'title', 'status', 'updated_at'),
      minSalary: jobData.salary_low,
      maxSalary: jobData.salary_high
    }));
  }, [data]);

  return {
    jobs,
    isPlaceholderData,
    isPending,
    error: error ?? undefined,
    total: data?.count ?? undefined,
    refetch
  };
};

export default useJobs;

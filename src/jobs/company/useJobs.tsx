import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { Params } from '../../types';

export type JobSummary = {
  id: number;
  title: string;
  updated_at: string;
};

export type Jobs = {
  jobs: Array<JobSummary> | undefined;
  isPlaceholderData: boolean;
  isPending: boolean;
  error?: Error;
  total: number | undefined;
  refetch: () => Promise<QueryObserverResult>;
};

export type JobsParams = Params<{ companyId: number }>;

type QueryKey = {
  page: number;
} & { companyId: number };

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
      const { data, error, count } = await supabase
        .from('jobs')
        .select('id, title, updated_at', { count: 'exact' })
        .filter('company_id', 'eq', params.filters.companyId)
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
      ...jobData
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

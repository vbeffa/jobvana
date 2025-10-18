import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { ApplicationStatus, Params } from '../../types';

export type SearchFilters = {
  status: ApplicationStatus | 'all';
};

export type ApplicationSummary = {
  id: number;
  jobTitle: string;
  companyName: string;
  lastUpdated: string;
  status: ApplicationStatus;
};

export type Applications = {
  applications: Array<ApplicationSummary> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  total: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

export type ApplicationsParams = Params<SearchFilters>;

// type QueryKey = {
//   jobSeekerId: number;
//   params: ApplicationsParams;
// };

const useApplications = (
  jobSeekerId: number,
  params: ApplicationsParams
): Applications => {
  // const queryKey: QueryKey = useMemo(
  //   () => ({
  //     jobSeekerId,
  //     params
  //   }),
  //   [jobSeekerId, params]
  // );
  // console.log(queryKey);

  const {
    paging: { page, pageSize },
    filters
  } = params;

  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['applications', jobSeekerId, params],
    queryFn: async () => {
      let q = supabase
        .from('applications')
        .select(
          `id, created_at, status, updated_at,
            jobs!inner(title, companies!inner(name))`,
          { count: 'exact' }
        )
        .filter('job_seeker_id', 'eq', jobSeekerId);

      if (filters.status !== 'all') {
        q = q.eq('status', filters.status);
      }
      const { error, data, count } = await q
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('updated_at', { ascending: false });

      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { applications: data, error, count };
    },
    placeholderData: keepPreviousData
  });

  const applications: Array<ApplicationSummary> | undefined = useMemo(() => {
    if (!data?.applications) {
      return undefined;
    }

    return data.applications.map((applicationData) => ({
      ..._.pick(applicationData, 'id', 'status'),
      jobTitle: applicationData.jobs.title,
      companyName: applicationData.jobs.companies.name,
      lastUpdated: applicationData.updated_at ?? applicationData.created_at
    }));
  }, [data]);

  return {
    applications,
    isPending,
    isPlaceholderData,
    total: data?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useApplications;

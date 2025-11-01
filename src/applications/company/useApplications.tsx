import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  jobSeekerName: string;
  applied: string;
  status: ApplicationStatus;
  lastUpdated: string;
};

export type Applications = {
  applications: Array<ApplicationSummary> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  total: number | undefined;
  error?: Error;
};

export type ApplicationsParams = Params<SearchFilters>;

const useApplications = (
  companyId: number,
  params: ApplicationsParams
): Applications => {
  const {
    paging: { page, pageSize },
    filters
  } = params;

  const { data, isPending, isPlaceholderData, error } = useQuery({
    queryKey: ['applications', companyId, params],
    queryFn: async () => {
      let q = supabase
        .from('applications')
        .select(
          `id, created_at, status, updated_at,
          jobs!inner(title, companies!inner(id)),
          job_seekers!inner(first_name, last_name)`,
          { count: 'exact' }
        )
        .filter('jobs.companies.id', 'eq', companyId);

      if (filters.status !== 'all') {
        q = q.eq('status', filters.status);
      }

      const { data, count, error } = await q
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('updated_at', { ascending: false });

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { applications: data, count };
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
      jobSeekerName: `${applicationData.job_seekers.first_name} ${applicationData.job_seekers.last_name}`,
      applied: applicationData.created_at,
      lastUpdated: applicationData.updated_at ?? applicationData.created_at
    }));
  }, [data]);

  return {
    applications,
    isPending,
    isPlaceholderData,
    total: data?.count ?? undefined,
    error: error ?? undefined
  };
};

export default useApplications;

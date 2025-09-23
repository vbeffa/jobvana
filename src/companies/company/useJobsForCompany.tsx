import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Job as DbJob } from '../../types';
import supabase from '../../utils/supabase';

export type Jobs = {
  jobs: Array<DbJob> | undefined;
  error?: Error;
  isPlaceholderData: boolean;
  isPending: boolean;
  openJobCount: number | undefined;
};

const useJobsForCompany = (companyId: number): Jobs => {
  const queryKey = useMemo(
    () => ({
      companyId
    }),
    [companyId]
  );

  const {
    isPlaceholderData,
    isPending,
    error,
    data: jobsData
  } = useQuery({
    queryKey: ['jobs', queryKey],
    queryFn: async () => {
      const { error, data, count } = await supabase.from('jobs').select('*', {
        count: 'exact'
      });
      // console.log(data);
      if (error) {
        console.log(JSON.stringify(error));
      }
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const openJobCount = useMemo(
    () => jobsData?.count ?? undefined,
    [jobsData?.count]
  );

  return {
    jobs: jobsData?.data ?? undefined,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    openJobCount
  };
};

export default useJobsForCompany;

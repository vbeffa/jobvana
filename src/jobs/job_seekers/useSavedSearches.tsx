import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { JobSeekerSavedSearch as DbSavedSearch } from '../../types';
import type { SearchFilters } from './useJobs';

export type SavedSearch = Pick<DbSavedSearch, 'id' | 'created_at' | 'name'> & {
  searchFilters: SearchFilters;
};

export type SavedSearches = {
  savedSearches: Array<SavedSearch> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  count: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useSavedSearches = (jobSeekerId: number): SavedSearches => {
  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['job_seeker_saved_searches', { jobSeekerId }],
    queryFn: async () => {
      const { data, count, error } = await supabase
        .from('job_seeker_saved_searches')
        .select('id, created_at, name, search_filters', {
          count: 'exact'
        })
        .filter('job_seeker_id', 'eq', jobSeekerId);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { savedSearches: data, count };
    },
    placeholderData: keepPreviousData
  });

  const savedSearches = useMemo(() => {
    return data?.savedSearches.map((savedSearch) => ({
      ..._.pick(savedSearch, 'id', 'created_at', 'name'),
      searchFilters: savedSearch.search_filters as SearchFilters
    }));
  }, [data?.savedSearches]);

  return {
    savedSearches,
    isPending,
    isPlaceholderData,
    count: data?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useSavedSearches;

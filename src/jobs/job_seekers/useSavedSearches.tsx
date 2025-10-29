import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import supabase from '../../db/supabase';
import type { JobSeekerSavedSearch } from '../../types';

export type SavedSearches = {
  savedSearches: Array<JobSeekerSavedSearch> | undefined;
  isPlaceholderData: boolean;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useSavedSearches = (jobSeekerId: number): SavedSearches => {
  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['job_seeker_saved_searches', { jobSeekerId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_seeker_saved_searches')
        .select('*')
        .filter('job_seeker_id', 'eq', jobSeekerId);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { savedSearches: data };
    },
    placeholderData: keepPreviousData
  });

  return {
    savedSearches: data?.savedSearches ?? undefined,
    isPlaceholderData,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useSavedSearches;

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type Industry = Database['public']['Tables']['industries']['Row'];

export type Industries = {
  industries: Array<Industry> | undefined;
  isPending: boolean;
};

const useIndustries = (): Industries => {
  const { isPending, data: industriesData } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data } = await supabase.from('industries').select();
      return data;
    }
  });

  const industries = useMemo(
    () =>
      industriesData?.sort((industry1, industry2) =>
        industry1.name.localeCompare(industry2.name)
      ),
    [industriesData]
  );

  return {
    industries: industries,
    isPending
  };
};

export default useIndustries;

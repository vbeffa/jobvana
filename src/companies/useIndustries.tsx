import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { Industry } from '../types';

export type Industries = {
  industries: Array<Industry> | undefined;
  isPending: boolean;
  findIndustry: (industryId: number) => Industry | undefined;
};

const useIndustries = (): Industries => {
  const { isPending, data: industriesData } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('industries').select();

      if (error) {
        console.log(error);
        throw error;
      }

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
    industries,
    isPending,
    findIndustry: (industryId: number) =>
      industries?.find((industry) => industry.id === industryId)
  };
};

export default useIndustries;

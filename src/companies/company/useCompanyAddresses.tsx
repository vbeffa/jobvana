import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { CompanyAddress } from '../../types';
import { addressComparator } from '../../utils';

export type CompanyAddresses = {
  addresses: Array<CompanyAddress> | undefined;
  count?: number;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useCompanyAddresses = (companyId: number): CompanyAddresses => {
  const {
    data: addressesData,
    error,
    refetch
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, count, error } = await supabase
        .from('company_addresses')
        .select('*', { count: 'exact' })
        .filter('company_id', 'eq', companyId);

      if (error) {
        console.log(error);
        throw error;
      }

      return { data, count };
    }
  });

  const addresses = useMemo(
    () => addressesData?.data.sort(addressComparator),
    [addressesData]
  );

  return {
    addresses: addresses,
    count: addressesData?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useCompanyAddresses;

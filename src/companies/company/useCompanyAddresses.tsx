import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { CompanyAddress } from '../../types';
import supabase from '../../utils/supabase';

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
      const { data, error, count } = await supabase
        .from('company_addresses')
        .select('*', { count: 'exact' })
        .filter('company_id', 'eq', companyId);
      return { data, error, count };
    }
  });

  const addresses = useMemo(
    () =>
      addressesData?.data?.sort((address1, address2) =>
        address1.zip.localeCompare(address2.zip)
      ),
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

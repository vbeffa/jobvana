import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { CompanyAddress } from '../types';
import supabase from '../utils/supabase';

export type CompanyAddresses = {
  addresses: Array<CompanyAddress> | undefined;
  isPending: boolean;
};

const useCompanyAddresses = (companyId: number): CompanyAddresses => {
  const { isPending, data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_addresses')
        .select()
        .filter('company_id', 'eq', companyId);
      return data;
    }
  });

  const addresses = useMemo(
    () =>
      addressesData?.sort((address1, address2) =>
        address1.zip.localeCompare(address2.zip)
      ),
    [addressesData]
  );

  return {
    addresses: addresses,
    isPending
  };
};

export default useCompanyAddresses;

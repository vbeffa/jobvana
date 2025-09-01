import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';
import type { Company } from './useCompanies';

export type TechStack = Database['public']['Tables']['tech_stacks']['Row'];

export type FullCompany = Company & {
  techStack: Array<TechStack>;
};

const useCompany = ({ id }: { id: number }) => {
  const {
    isPlaceholderData,
    isPending,
    data: companyData,
    error
  } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('companies')
        .select(
          `*, company_addresses(*), industries(*), tech_stacks(*), skill_versions(*)`
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { error, data };
    },
    placeholderData: keepPreviousData
  });

  const company: FullCompany | undefined = useMemo(() => {
    if (!companyData?.data?.[0]) {
      return undefined;
    }
    const company = companyData.data[0];
    return {
      ...company,
      addresses: company.company_addresses,
      industry: company.industries,
      techStack: company.tech_stacks
    };
  }, [companyData?.data]);

  return {
    company,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useCompany;

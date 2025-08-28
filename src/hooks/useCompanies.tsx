import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type Company = Database['public']['Tables']['companies']['Row'];

export type Companies = {
  companies: Array<Company> | undefined;
  findCompany: (id: number) => Company | undefined;
};

const useCompanies = (): Companies => {
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await supabase.from('companies').select();
      return data;
    }
  });

  const companies = useMemo(
    () =>
      companiesData?.sort((company1, company2) =>
        company1.name.localeCompare(company2.name)
      ),
    [companiesData]
  );

  return {
    companies: companies,
    findCompany: (id: number) => {
      return companies?.find((company) => company.id === id);
    }
  };
};

export default useCompanies;

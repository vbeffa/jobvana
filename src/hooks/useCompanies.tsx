import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type SearchFilters = {
  name?: string;
};

export type Company = Database['public']['Tables']['companies']['Row'];

export type Companies = {
  companies: Array<Company> | undefined;
  error?: string;
  isPlaceholderData: boolean;
  isPending: boolean;
  companyCount: number | undefined;

  findCompany: (id: number) => Company | undefined;
};

export type CompaniesParams = {
  paging: {
    page: number;
    pageSize: number;
  };
  filters?: SearchFilters;
};

type QueryKey = {
  page: number;
} & SearchFilters;

const useCompanies = (
  params: CompaniesParams = { paging: { page: 1, pageSize: 50 } }
): Companies => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );

  const {
    isPlaceholderData,
    isPending,
    data: companiesData
  } = useQuery({
    queryKey: ['companies', queryKey],
    queryFn: async () => {
      let q = supabase.from('companies').select('*', { count: 'exact' });
      const { filters } = params;
      if (filters?.name) {
        q = q.ilike('name', `%${filters.name}%`);
      }

      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const companies = useMemo(() => {
    if (!companiesData?.data) {
      return undefined;
    }

    return companiesData.data;
  }, [companiesData]);

  const companyCount = useMemo(
    () => companiesData?.count ?? undefined,
    [companiesData?.count]
  );

  return {
    companies,
    error: companiesData?.error?.message,
    isPlaceholderData,
    isPending,
    companyCount,

    findCompany: (id: number) => {
      return companies?.find((company) => company.id === id);
    }
  };
};

export default useCompanies;

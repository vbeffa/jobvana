import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { CompanyAddress, Params } from './types';

export type SearchFilters = {
  name?: string;
  minSize?: number;
  maxSize?: number;
  industryId?: number;
};

export type CompanySummary = {
  id: number;
  name: string;
  industryName: string;
  headquarters: Pick<CompanyAddress, 'type' | 'city' | 'state'> | undefined;
};

export type Companies = {
  companies: Array<CompanySummary> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  companyCount: number | undefined;
};

export type CompaniesParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useCompanies = (params: CompaniesParams): Companies => {
  console.log('params', params);
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );
  console.log('queryKey', queryKey);

  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['companies', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('companies')
        .select(
          `id, name,
          company_addresses(type, city, state),
          industries!inner(name)`,
          {
            count: 'exact'
          }
        )
        .filter('company_addresses.type', 'eq', 'headquarters');
      const { filters } = params;
      if (filters?.name) {
        q = q.ilike('name', `%${filters.name}%`);
      }
      if (filters?.minSize) {
        q = q.gte('num_employees', filters.minSize);
      }
      if (filters?.maxSize) {
        q = q.lte('num_employees', filters.maxSize);
      }
      if (filters?.industryId) {
        q = q.filter('industry_id', 'eq', filters.industryId);
      }

      const { data, error, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');

      console.log(data);
      return { companies: data, error, count };
    },
    placeholderData: keepPreviousData
  });

  const companies: Array<CompanySummary> | undefined = useMemo(() => {
    if (!data?.companies) {
      return undefined;
    }

    return data?.companies.map((companyData) => ({
      ...companyData,
      headquarters: companyData.company_addresses[0],
      industryName: companyData.industries.name
    }));
  }, [data?.companies]);

  const companyCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    companies,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    companyCount
  };
};

export default useCompanies;

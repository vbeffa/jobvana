import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type { CompanyAddress, Params } from '../../types';

export const MAX_NAME_LENGTH = 100;
export const MIN_COMPANY_SIZE = 1;
export const MAX_COMPANY_SIZE = 1000;
export const MIN_EMAIL_LENGTH = 6;
export const MAX_EMAIL_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export type SearchFilters = {
  name?: string;
  minSize: number;
  maxSize: number;
  minRounds: number;
  maxRounds: number;
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
  isPending: boolean;
  isPlaceholderData: boolean;
  companyCount: number | undefined;
  error?: Error;
};

export type CompaniesParams = Params<SearchFilters>;

// type QueryKey = {
//   page: number;
// } & SearchFilters;

const useCompanies = (params: CompaniesParams): Companies => {
  // const queryKey: CompaniesParams = useMemo(() => params, [params]);
  // console.log(queryKey);

  const {
    paging: { page, pageSize },
    filters
  } = params;

  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['companies', params],
    queryFn: async () => {
      let q = supabase
        .from('companies')
        .select(
          `id, name,
          company_addresses(type, city, state),
          industries!inner(name)`,
          { count: 'exact' }
        )
        .filter('company_addresses.type', 'eq', 'headquarters');
      if (filters.name) {
        q = q.ilike('name', `%${filters.name}%`);
      }
      q = q.gte('num_employees', filters.minSize);
      q = q.lte('num_employees', filters.maxSize);
      if (filters.industryId && filters.industryId > 0) {
        q = q.filter('industry_id', 'eq', filters.industryId);
      }

      const { data, count, error } = await q
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('name');

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { companies: data, count };
    },
    placeholderData: keepPreviousData
  });

  const companies: Array<CompanySummary> | undefined = useMemo(() => {
    if (!data?.companies) {
      return undefined;
    }

    return data.companies.map((companyData) => ({
      ...companyData,
      headquarters: companyData.company_addresses[0],
      industryName: companyData.industries.name
    }));
  }, [data]);

  const companyCount = useMemo(() => data?.count ?? undefined, [data?.count]);

  return {
    companies,
    isPending,
    isPlaceholderData,
    companyCount,
    error: error ?? undefined
  };
};

export default useCompanies;

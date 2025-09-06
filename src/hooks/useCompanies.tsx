import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type {
  CompanyAddress,
  Company as DbCompany,
  Industry,
  Params
} from './types';

export type SearchFilters = {
  name?: string;
  minSize?: number;
  maxSize?: number;
  industryId?: number;
};

export type Company = DbCompany & {
  addresses: Array<CompanyAddress>;
  industry: Industry;
};

export type Companies = {
  companies: Array<Company> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  companyCount: number | undefined;

  findCompany: (id: number) => Company | undefined;
};

export type CompaniesParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

const useCompanies = (
  params: CompaniesParams = { paging: { page: 1, pageSize: 10 } }
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
    data: companiesData,
    error
  } = useQuery({
    queryKey: ['companies', queryKey],
    queryFn: async () => {
      let q = supabase
        .from('companies')
        .select(`*, company_addresses(*), industries(*)`, {
          count: 'exact'
        });
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

      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');

      console.log(data);
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const companies = useMemo(() => {
    if (!companiesData?.data) {
      return undefined;
    }

    return companiesData.data.map((companyData) => ({
      ...companyData,
      addresses: companyData.company_addresses,
      industry: companyData.industries
    }));
  }, [companiesData]);

  const companyCount = useMemo(
    () => companiesData?.count ?? undefined,
    [companiesData?.count]
  );

  return {
    companies,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    companyCount,

    findCompany: (id: number) => {
      return companies?.find((company) => company.id === id);
    }
  };
};

export default useCompanies;

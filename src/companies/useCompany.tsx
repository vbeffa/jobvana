import {
  keepPreviousData,
  useMutation,
  useQuery,
  type UseMutationResult
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type {
  Company as DbCompany,
  CompanyAddress as DbCompanyAddress,
  Industry as DbIndustry,
  Job as DbJob,
  SkillVersion as DbSkillVersion
} from '../types';
import supabase from '../utils/supabase';

export type CompanyJob = Pick<DbJob, 'id' | 'title'>;

export type FullCompany = Company & {
  industry: DbIndustry;
  addresses: Array<CompanyAddress>;
  techStack: Array<SkillVersion>;
  jobs: Array<CompanyJob>;
};

export type Company = Omit<DbCompany, 'created_at' | 'industry_id'>;
export type CompanyAddress = Omit<DbCompanyAddress, 'company_id'>;
export type SkillVersion = Pick<
  DbSkillVersion,
  'id' | 'skill_id' | 'version' | 'ordinal'
>;

export type CompanyH = {
  company: FullCompany | undefined;
  update: UseMutationResult<unknown, Error, FullCompany>;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useCompany = (id: number): CompanyH => {
  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(
          `id, name, description, num_employees,
          industries(id, name),
          company_addresses(id, city, street, zip, state, type),
          company_tech_stacks(skill_versions(id, skill_id, version, ordinal)),
          jobs(id, title)`
        )
        .filter('id', 'eq', id)
        .filter('jobs.status', 'eq', 'open');

      // console.log(data);
      return { company: data?.[0], error };
    },
    placeholderData: keepPreviousData
  });

  const mutation = useMutation({
    mutationFn: async (company: FullCompany) => {
      console.log(company);
      const { error } = await supabase
        .from('companies')
        .update({
          num_employees: company.num_employees,
          description: company.description
        })
        .filter('id', 'eq', company.id);
      console.log(error);
      await refetch();
      return { error };
    }
  });

  const company: FullCompany | undefined = useMemo(() => {
    if (!data?.company) {
      return undefined;
    }
    const company = data.company;
    return {
      ...company,
      addresses: company.company_addresses,
      industry: company.industries,
      techStack: company.company_tech_stacks.map(
        (techStackRow) => techStackRow.skill_versions
      )
    };
  }, [data?.company]);

  return {
    company,
    update: mutation,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useCompany;

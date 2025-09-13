import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type {
  Company as DbCompany,
  CompanyAddress as DbCompanyAddress,
  SkillVersion as DbSkillVersion
} from '../types';
import supabase from '../utils/supabase';

export type FullCompany = Company & {
  industryName: string;
  addresses: Array<CompanyAddress>;
  techStack: Array<SkillVersion>;
};

export type Company = Omit<DbCompany, 'created_at' | 'industry_id'>;
export type CompanyAddress = Omit<DbCompanyAddress, 'company_id'>;
export type SkillVersion = Pick<DbSkillVersion, 'id' | 'skill_id' | 'version'>;

export type CompanyH = {
  company: FullCompany | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useCompany = (id: number): CompanyH => {
  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(
          `id, name, description, num_employees,
          industries(name),
          company_addresses(id, city, street, zip, state, type),
          company_tech_stacks(skill_versions(id, skill_id, version))`
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { company: data?.[0], error };
    },
    placeholderData: keepPreviousData
  });

  const company: FullCompany | undefined = useMemo(() => {
    if (!data?.company) {
      return undefined;
    }
    const company = data.company;
    return {
      ...company,
      addresses: company.company_addresses,
      industryName: company.industries.name,
      techStack: company.company_tech_stacks.map(
        (techStackRow) => techStackRow.skill_versions
      )
    };
  }, [data?.company]);

  return {
    company,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useCompany;

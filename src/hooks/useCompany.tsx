import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type {
  Company as DbCompany,
  CompanyAddress as DbCompanyAddress,
  SkillVersion as DbSkillVersion
} from './types';

export type CompanyAddress = Omit<DbCompanyAddress, 'company_id'>;
export type SkillVersion = Pick<DbSkillVersion, 'id' | 'skill_id' | 'version'>;

export type Company = Omit<DbCompany, 'created_at' | 'industry_id'> & {
  industryName: string;
  addresses: Array<CompanyAddress>;
  techStack: Array<SkillVersion>;
};

const useCompany = (id: number) => {
  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(
          `*,
          industries(name),
          company_addresses(id, city, street, zip, state, type),
          tech_stacks(skill_versions(id, skill_id, version))`
        )
        .filter('id', 'eq', id);

      console.log(data);
      return { company: data?.[0], error };
    },
    placeholderData: keepPreviousData
  });

  const company: Company | undefined = useMemo(() => {
    if (!data?.company) {
      return undefined;
    }
    const company = data.company;
    return {
      ...company,
      addresses: company.company_addresses,
      industryName: company.industries.name,
      techStack: company.tech_stacks.map(
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

import type { PostgrestError } from '@supabase/supabase-js';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  type QueryObserverResult,
  type RefetchOptions,
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
  company: FullCompany | null;
  update: UseMutationResult<
    { data: Partial<DbCompany>[] | null; error: PostgrestError | null },
    Error,
    Partial<DbCompany>,
    unknown
  >;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useCompany = (id?: number): CompanyH => {
  const { data, isPlaceholderData, isPending, error, refetch } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      if (!id) {
        return { data: null, error: null };
      }
      const { data, error } = await supabase
        .from('companies')
        .select(
          `id, name, description, num_employees, user_id,
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

  const mutation: UseMutationResult<
    { data: Partial<DbCompany>[] | null; error: PostgrestError | null },
    Error,
    Partial<DbCompany>,
    unknown
  > = useMutation({
    mutationFn: async (editCompany: Partial<DbCompany>) => {
      console.log(editCompany);

      let q = supabase.from('companies').upsert(editCompany as DbCompany, {
        ignoreDuplicates: false,
        onConflict: 'user_id'
      });
      if (editCompany.id) {
        q = q.filter('id', 'eq', editCompany.id);
      }
      const { data, error } = await q.select();
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
      return { data, error };
    }
  });

  const company: FullCompany | null = useMemo(() => {
    if (!data?.company) {
      return null;
    }
    const company = data.company;
    return {
      // ...company,
      // ..._.pick(company, [
      //   'id',
      //   'name',
      //   'industry_id',
      //   'description',
      //   'num_employees',
      //   'user_id'
      // ]),
      id: company.id,
      name: company.name,
      description: company.description,
      num_employees: company.num_employees,
      user_id: company.user_id,
      jobs: company.jobs,
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
    refetch,
    error: error ?? undefined,
    isPlaceholderData,
    isPending
  };
};

export default useCompany;

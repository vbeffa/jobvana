import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type {
  Company as DbCompany,
  CompanyAddress as DbCompanyAddress,
  Industry as DbIndustry,
  Job as DbJob,
  SkillVersion as DbSkillVersion
} from '../../types';
import type { InterviewProcess } from '../company/utils';

export type CompanyJob = Pick<DbJob, 'id' | 'title'>;

export type FullCompany = Company & {
  industry: DbIndustry;
  addresses: Array<CompanyAddress>;
  // techStack: Array<SkillVersion>;
  jobs: Array<CompanyJob>;
  // totalApplications: number; // total across all job seekers for all jobs for this company to verify pipeline limit
};

export type Company = Omit<DbCompany, 'created_at'>;
export type CompanyAddress = Omit<DbCompanyAddress, 'company_id'>;
export type SkillVersion = Pick<
  DbSkillVersion,
  'id' | 'skill_id' | 'version' | 'ordinal'
>;

export type CompanyH = {
  company: FullCompany | null;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
};

const useCompany = (id?: number): CompanyH => {
  const { data, isPlaceholderData, isPending, error } = useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      if (!id) {
        return { data: null, error: null };
      }
      const { data, error } = await supabase
        .from('companies')
        .select(
          `id, name, description, industry_id, num_employees, user_id, contact_email, interview_process,
          industries(id, name),
          company_addresses(*),
          jobs(id, title)`
        )
        .filter('id', 'eq', id)
        .filter('jobs.status', 'eq', 'open');

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { company: data[0], error };
    },
    placeholderData: keepPreviousData
  });

  const company: FullCompany | null = useMemo(() => {
    if (!data?.company) {
      return null;
    }
    const company = data.company;
    return {
      id: company.id,
      name: company.name,
      description: company.description,
      industry_id: company.industry_id,
      num_employees: company.num_employees,
      user_id: company.user_id,
      contact_email: company.contact_email,
      interview_process: company.interview_process as InterviewProcess | null,
      jobs: company.jobs,
      addresses: company.company_addresses,
      industry: company.industries
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

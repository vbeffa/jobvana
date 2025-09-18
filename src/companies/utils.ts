import type { Company as DbCompany } from '../types';
import supabase from '../utils/supabase';
import type { CompanyAddress, FullCompany } from './useCompany';

export const isHeadquarters = (address: CompanyAddress) =>
  address.type === 'headquarters';

export const findHeadquarters = (company: FullCompany) =>
  company.addresses.find((addr) => addr.type === 'headquarters');

export const findCompany = async (userId: string) => {
  const { data, error } = await supabase
    .from('companies')
    .select(`*`)
    .filter('user_id', 'eq', userId);

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
};

export const companyFields = (
  company: FullCompany
): Omit<DbCompany, 'created_at'> => ({
  id: company.id,
  name: company.name,
  description: company.description,
  industry_id: company.industry.id,
  num_employees: company.num_employees,
  user_id: company.user_id
});

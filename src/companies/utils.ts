import type { Company as DbCompany } from '../types';
import supabase from '../utils/supabase';
import {
  MAX_COMPANY_SIZE,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COMPANY_SIZE
} from './job_seeker/useCompanies';
import type { CompanyAddress, FullCompany } from './job_seeker/useCompany';

export type ToInsert = Omit<DbCompany, 'id' | 'created_at'>;
export type ToUpdate = Omit<DbCompany, 'created_at'>;

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

export const isValidCompany = (company: Partial<ToInsert>) => {
  return Boolean(
    company.name &&
      company.name.length <= MAX_NAME_LENGTH &&
      company.num_employees &&
      company.num_employees >= MIN_COMPANY_SIZE &&
      company.num_employees <= MAX_COMPANY_SIZE &&
      company.industry_id &&
      company.industry_id > 0 &&
      company.description &&
      company.description.length <= MAX_DESCRIPTION_LENGTH &&
      company.user_id
  );
};

export const isValidAddress = (address: Partial<CompanyAddress>) => {
  return Boolean(
    address.street && address.city && address.state && address.zip
  );
};

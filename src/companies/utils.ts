import type { Company as DbCompany } from '../types';
import supabase from '../utils/supabase';
import type { InterviewProcess, InterviewRound } from './company/utils';
import {
  MAX_COMPANY_SIZE,
  MAX_DESCRIPTION_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COMPANY_SIZE
} from './job_seeker/useCompanies';
import type { CompanyAddress, FullCompany } from './job_seeker/useCompany';

export type ToInsert = Omit<DbCompany, 'id' | 'created_at'>;
export type ToUpdate = Pick<
  DbCompany,
  | 'id'
  | 'contact_email'
  | 'description'
  | 'industry_id'
  | 'name'
  | 'num_employees'
>;
export type ToDisplay = Pick<
  DbCompany,
  'contact_email' | 'description' | 'industry_id' | 'name' | 'num_employees'
>;

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

  return data[0] ?? null;
};

export const companyFields = (
  company: FullCompany
): Omit<DbCompany, 'created_at'> => ({
  id: company.id,
  name: company.name,
  description: company.description,
  industry_id: company.industry.id,
  num_employees: company.num_employees,
  user_id: company.user_id,
  contact_email: company.contact_email,
  interview_process: company.interview_process
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
      company.contact_email &&
      company.contact_email.length <= MAX_EMAIL_LENGTH &&
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

export const isValidInterviewProcess = (process: InterviewProcess) => {
  return (
    process.rounds.length > 0 &&
    process.rounds.length <= 5 &&
    process.rounds.every(isValidInterviewRound)
  );
};

export const isValidInterviewRound = (round: InterviewRound) => {
  const { type, location, duration, durationUnit } = round;
  if (type === 'take_home' && location !== 'offline') {
    return false;
  }
  if (durationUnit === 'minute' && (duration < 1 || duration > 60)) {
    return false;
  }
  if (durationUnit === 'hour' && (duration < 0.25 || duration > 12)) {
    return false;
  }
  if (durationUnit === 'day' && (duration < 1 || duration > 30)) {
    return false;
  }

  return true;
};

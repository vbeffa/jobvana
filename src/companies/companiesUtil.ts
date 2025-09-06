import type { CompanyAddress } from '../hooks/types';
import type { Company } from '../hooks/useCompanies';

export const isHeadquarters = (address: CompanyAddress) =>
  address.type === 'headquarters';

export const findHeadquarters = (company: Company) =>
  company.addresses.find((addr) => addr.type === 'headquarters');

import type { Company, CompanyAddress } from '../hooks/useCompany';

export const isHeadquarters = (address: CompanyAddress) =>
  address.type === 'headquarters';

export const findHeadquarters = (company: Company) =>
  company.addresses.find((addr) => addr.type === 'headquarters');

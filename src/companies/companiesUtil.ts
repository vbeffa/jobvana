import type { CompanyAddress, FullCompany } from '../hooks/useCompany';

export const isHeadquarters = (address: CompanyAddress) =>
  address.type === 'headquarters';

export const findHeadquarters = (company: FullCompany) =>
  company.addresses.find((addr) => addr.type === 'headquarters');

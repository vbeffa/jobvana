import { createFileRoute } from '@tanstack/react-router';
import Companies from '../companies/Companies';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from '../companies/useCompanies';

export type CompanySearch = {
  page?: number;
  company_id?: number;
  name?: string;
  min_size?: number;
  max_size?: number;
  industry_id?: number;
};

export const Route = createFileRoute('/jobvana/companies/')({
  validateSearch: (search: Record<string, unknown>): CompanySearch => {
    return {
      page: Number(search.page) || 1,
      company_id: Number(search.company_id) || undefined,
      name: search.name as string,
      min_size: Number(search.min_size) || MIN_COMPANY_SIZE,
      max_size: Number(search.max_size) || MAX_COMPANY_SIZE,
      industry_id: Number(search.industry_id) || undefined
    };
  },
  component: Companies
});

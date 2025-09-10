import { createFileRoute } from '@tanstack/react-router';
import Companies from '../companies/Companies';

export type CompanySearch = {
  page: number;
  company_id?: number;
  name?: string;
  min_size?: number;
  max_size?: number;
  industry_id?: number;
};

export const Route = createFileRoute('/jobvana/companies/')({
  validateSearch: (search: CompanySearch): CompanySearch => {
    return search;
  },
  component: Companies
});

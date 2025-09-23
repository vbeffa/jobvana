import { createFileRoute, redirect } from '@tanstack/react-router';
import { getUserType } from '../auth/utils';
import CompaniesRoute from '../companies/CompaniesRoute';
import {
  MAX_COMPANY_SIZE,
  MIN_COMPANY_SIZE
} from '../companies/job_seeker/useCompanies';

export type CompanySearch = {
  page?: number;
  company_id?: number;
  name?: string;
  min_size?: number;
  max_size?: number;
  industry_id?: number;
};

export const Route = createFileRoute('/jobvana/companies/')({
  validateSearch: (
    search: Record<string, unknown>
  ): CompanySearch | undefined => {
    const userType = getUserType();
    return userType === 'job_seeker'
      ? {
          page: Number(search.page) || 1,
          company_id: Number(search.company_id) || undefined,
          name: search.name as string,
          min_size: Number(search.min_size) || MIN_COMPANY_SIZE,
          max_size: Number(search.max_size) || MAX_COMPANY_SIZE,
          industry_id: Number(search.industry_id) || undefined
        }
      : undefined;
  },
  beforeLoad: () => {
    const userType = getUserType();
    if (userType === 'company') {
      redirect({
        to: '/jobvana',
        throw: true
      });
    }
  },
  component: CompaniesRoute
});

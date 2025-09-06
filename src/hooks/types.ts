import type { SearchFilters as CompanySearchFilters } from './useCompanies';
import type { SearchFilters as JobSearchFilters } from './useJobs';

export type Params<SF extends CompanySearchFilters | JobSearchFilters> = {
  paging: {
    page: number;
    pageSize: number;
  };
  filters?: SF;
};

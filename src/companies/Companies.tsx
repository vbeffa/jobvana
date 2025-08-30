import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import useCompanies, { type SearchFilters } from '../hooks/useCompanies';
import PageNav from '../PageNav';
import CompaniesTable from './CompaniesTable';
import CompanyFilters from './CompanyFilters';

const Companies = () => {
  const [page, setPage] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: ''
  });
  const [debouncedName] = useDebounce(
    searchFilters.name,
    searchFilters.name ? 1000 : 0
  );

  const filters: SearchFilters = useMemo(
    () => ({
      name: debouncedName
    }),
    [debouncedName]
  );

  const { companies, error, isPlaceholderData, isPending, companyCount } =
    useCompanies({
      paging: { page, pageSize: 50 },
      filters
    });

  return (
    <>
      <h1>Companies</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="px-[2em] pb-4 text-left flex">
        <CompanyFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </div>
      <div className="px-[2em]">
        <PageNav
          page={page}
          total={companyCount}
          onSetPage={setPage}
          isLoading={isPlaceholderData || isPending}
        />
      </div>
      <div className="card">
        <CompaniesTable companies={companies} />
      </div>
    </>
  );
};

export default Companies;

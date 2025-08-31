import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import useCompanies, { type SearchFilters } from '../hooks/useCompanies';
import PageNav from '../PageNav';
import CompaniesTable from './CompaniesTable';
import CompanyFilters from './CompanyFilters';

const Companies = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncedPage] = useDebounce(page, 500);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    minSize: 1,
    maxSize: 1000
  });
  const [debouncedName] = useDebounce(
    searchFilters.name,
    searchFilters.name ? 1000 : 0
  );
  const [debouncedMinSize] = useDebounce(
    searchFilters.minSize,
    searchFilters.minSize ? 500 : 0
  );
  const [debouncedMaxSize] = useDebounce(
    searchFilters.maxSize,
    searchFilters.maxSize ? 500 : 0
  );

  const filters: SearchFilters = useMemo(() => {
    let minSize = debouncedMinSize;
    if ((debouncedMinSize ?? 1) > (debouncedMaxSize ?? 1000)) {
      setSearchFilters((filters) => ({
        ...filters,
        minSize: debouncedMaxSize
      }));
      minSize = debouncedMaxSize;
    }
    return {
      ...searchFilters,
      name: debouncedName,
      minSize,
      maxSize: debouncedMaxSize
    };
  }, [debouncedMaxSize, debouncedMinSize, debouncedName, searchFilters]);

  const { companies, error, isPlaceholderData, isPending, companyCount } =
    useCompanies({
      paging: { page: debouncedPage, pageSize: 50 },
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

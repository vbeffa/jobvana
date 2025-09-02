import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useCompanies, { type SearchFilters } from '../hooks/useCompanies';
import PageNav from '../PageNav';
import SummaryCard from '../SummaryCard';
import CompanyDetails from './CompanyDetails';
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
  const [companyId, setCompanyId] = useState<number | null>(null);

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
      paging: { page: debouncedPage, pageSize: 10 },
      filters
    });

  useEffect(() => {
    if (companies?.[0]) {
      setCompanyId(companies[0].id);
    }
  }, [companies]);

  return (
    <>
      <h1>Companies</h1>
      {error && <Error error={error} />}
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
          pageSize={10}
          total={companyCount}
          onSetPage={(page) => {
            setPage(page);
            // setCompanyId(null);
          }}
          isLoading={isPlaceholderData || isPending}
        />
      </div>
      <div className="card text-left flex flex-row gap-x-2">
        <div className="w-[20%]">
          {companies?.map((company) => (
            <SummaryCard
              key={company.id}
              selected={companyId === company.id}
              onClick={() => setCompanyId(company.id)}
              title={company.name}
              text={company.industry.name}
            />
          ))}
        </div>
        <div className="w-[80%]">
          {companyId && <CompanyDetails id={companyId} />}
        </div>
      </div>
    </>
  );
};

export default Companies;

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useCompanies, { type SearchFilters } from '../hooks/useCompanies';
import PageNav from '../PageNav';
import SummaryCard from '../SummaryCard';
import { findHeadquarters } from './companiesUtil';
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
    <div className="mx-4">
      {error && <Error error={error} />}
      <div className="my-4 flex justify-center">
        <CompanyFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </div>
      {/* <div className="flex justify-center">
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
      </div> */}
      <div className="flex justify-center">
        <div className="border-y-[0.5px] border-y-blue-300 w-[75%] min-w-[1100px] flex flex-row">
          <div className="border-l-[0.5px] border-l-blue-300 w-[20%]">
            <div className="flex justify-center">
              <PageNav
                page={page}
                pageSize={10}
                total={companyCount}
                onSetPage={setPage}
                isLoading={isPlaceholderData || isPending}
                type="companies"
              />
            </div>
            <div className="h-[calc(100dvh-300px)] overflow-y-auto">
              {companies?.map((company) => {
                const hq = findHeadquarters(company);

                return (
                  <SummaryCard
                    key={company.id}
                    selected={companyId === company.id}
                    onClick={() => setCompanyId(company.id)}
                    title={company.name}
                    text={
                      <>
                        <div>{company.industry.name}</div>
                        {hq && (
                          <div>
                            {hq.city}, {hq.state}
                          </div>
                        )}
                      </>
                    }
                  />
                );
              })}
            </div>
          </div>
          <div className="border-x-[0.5px] border-x-blue-300 px-4 pt-4 w-[80%] h-[calc(100vh-238px)] overflow-y-auto">
            {companyId && <CompanyDetails id={companyId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useCompanies, {
  type CompaniesParams,
  type SearchFilters
} from '../hooks/useCompanies';
import PageNav from '../PageNav';
import SummaryCard from '../SummaryCard';
import { findHeadquarters } from './companiesUtil';
import CompanyDetails from './CompanyDetails';
import CompanyFilters from './CompanyFilters';

const Companies = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
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

  const paging: CompaniesParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { companies, error, isPlaceholderData, isPending, companyCount } =
    useCompanies({ paging, filters });

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
      <div className="flex justify-center">
        <div className="border-[0.5px] border-blue-300 rounded-lg overflow-hidden w-[75%] min-w-[1100px] flex flex-row">
          <div className="border-r-[0.5px] border-r-blue-300 w-[20%]">
            <div className="border-b-[0.5px] border-b-blue-300 flex justify-center">
              <PageNav
                page={page}
                pageSize={10}
                total={companyCount}
                onSetPage={(page, debounce) => {
                  setPage(page);
                  setDebouncePage(debounce);
                }}
                isLoading={isPlaceholderData || isPending}
                type="companies"
              />
            </div>
            <div className="h-[calc(100dvh-300px)] overflow-y-auto">
              {companies?.map((company, idx) => {
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
                          <div className="text-gray-500">
                            {hq.city}, {hq.state}
                          </div>
                        )}
                      </>
                    }
                    borderBottom={idx < companies.length - 1}
                  />
                );
              })}
            </div>
          </div>
          <div className="px-4 pt-4 w-[80%] h-[calc(100vh-238px)] overflow-y-auto">
            {companyId && <CompanyDetails id={companyId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;

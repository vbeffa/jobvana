import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import FiltersContainer from '../FiltersContainer';
import useCompanies, {
  type CompaniesParams,
  type SearchFilters
} from '../hooks/useCompanies';
import PageNav from '../PageNav';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import { Route } from '../routes/jobvana.companies.index';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import CompanyDetails from './CompanyDetails';
import CompanyFilters from './CompanyFilters';

const Companies = () => {
  const navigate = Route.useNavigate();
  // const search = Route.useSearch();
  const context = useContext(JobvanaContext).companies;

  const [page, setPage] = useState<number>(context.page);
  const [debouncePage, setDebouncePage] = useState(false); // debounce when typing in a new page number
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    minSize: 1,
    maxSize: 1000
  });
  const [debouncedName] = useDebounce(
    searchFilters.name,
    searchFilters.name ? 500 : 0
  );
  const [companyId, setCompanyId] = useState<number | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      name: debouncedName
    }),
    [debouncedName, searchFilters]
  );

  const paging: CompaniesParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { companies, error, isPending, isPlaceholderData, companyCount } =
    useCompanies({ paging, filters });

  useEffect(() => {
    setPage(context.page);
  }, [context.page]);

  useEffect(() => {
    setSearchFilters(
      _.pick(context, ['name', 'minSize', 'maxSize', 'industryId'])
    );
  }, [context]);

  useEffect(() => {
    if (context.companyId) {
      setCompanyId(context.companyId);
    } else {
      setCompanyId(companies?.[0]?.id ?? null);
    }
  }, [companies, context.companyId]);

  useEffect(() => {
    navigate({
      search: {
        page: debouncedPage,
        company_id: companyId ?? undefined,
        name: debouncedName,
        industry_id: filters.industryId,
        min_size: filters.minSize,
        max_size: filters.maxSize
      }
    });
  }, [
    companyId,
    debouncedName,
    debouncedPage,
    filters.industryId,
    filters.maxSize,
    filters.minSize,
    navigate
  ]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <FiltersContainer>
        <CompanyFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setCompanyId(null);
            setSearchFilters(filters);
            Object.assign(context, filters);
            context.page = 1;
            context.companyId = undefined;
          }}
        />
      </FiltersContainer>
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
            pageSize={10}
            total={companyCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setCompanyId(null);
              setDebouncePage(debounce);
              context.page = page;
              context.companyId = undefined;
            }}
            isLoading={isPlaceholderData || isPending}
            type="companies"
          />
          <SummaryCardsContainer>
            {companies?.map((company, idx) => {
              const hq = company.headquarters;
              return (
                <SummaryCard
                  key={company.id}
                  selected={companyId === company.id}
                  onClick={() => {
                    setCompanyId(company.id);
                    context.companyId = company.id;
                  }}
                  title={company.name}
                  text={
                    <>
                      <div>{company.industryName}</div>
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
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          {companyId ? <CompanyDetails id={companyId} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Companies;

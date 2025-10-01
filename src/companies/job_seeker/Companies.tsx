import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../../Context';
import Error from '../../Error';
import PageNav from '../../PageNav';
import { Route } from '../../routes/jobvana.companies.index';
import SummaryCard from '../../SummaryCard';
import { INITIAL_SEARCH_FILTERS } from '../utils';
import CompanyDetails from './CompanyDetails';
import CompanyFilters from './CompanyFilters';
import useCompanies, {
  type CompaniesParams,
  type SearchFilters
} from './useCompanies';

const Companies = () => {
  const navigate = Route.useNavigate();
  const { companiesContext: context, setCompaniesContext: setContext } =
    useContext(JobSeekerContext);

  const [page, setPage] = useState<number>(context.page);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(
    INITIAL_SEARCH_FILTERS
  );
  const [debouncedName] = useDebounce(
    searchFilters.name,
    searchFilters.name ? 500 : 0
  );
  const [debouncedMinSize] = useDebounce(searchFilters.minSize, 500);
  const [debouncedMaxSize] = useDebounce(searchFilters.maxSize, 500);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      name: debouncedName,
      minSize: debouncedMinSize,
      maxSize: debouncedMaxSize
    }),
    [debouncedMaxSize, debouncedMinSize, debouncedName, searchFilters]
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
    setSearchFilters({
      ..._.pick(context, [
        'minSize',
        'maxSize',
        'minRounds',
        'maxRounds',
        'industryId'
      ]),
      name: context.name ?? ''
    });
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
        name: debouncedName || undefined,
        industry_id: filters.industryId,
        min_size: debouncedMinSize,
        max_size: debouncedMaxSize
      }
    });
  }, [
    companyId,
    debouncedMaxSize,
    debouncedMinSize,
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
      <FiltersContainer
        reset={() => {
          setPage(1);
          setCompanyId(null);
          setSearchFilters(INITIAL_SEARCH_FILTERS);
          setContext({
            ...context,
            ...INITIAL_SEARCH_FILTERS,
            page: 1,
            companyId: undefined
          });
        }}
        resetDisabled={_.isEqual(filters, INITIAL_SEARCH_FILTERS)}
      >
        <CompanyFilters
          filters={searchFilters}
          onChange={(filters) => {
            setPage(1);
            setCompanyId(null);
            setSearchFilters(filters);
            setContext({
              ...context,
              ...filters,
              page: 1,
              companyId: undefined
            });
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
              setContext({
                ...context,
                page,
                companyId: undefined
              });
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
                    setContext({
                      ...context,
                      companyId: company.id
                    });
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

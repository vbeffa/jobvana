import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import FiltersDisplay from '../../containers/FiltersDisplay';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../../Context';
import JobvanaError from '../../JobvanaError';
import PageNav from '../../PageNav';
import { Route } from '../../routes/jobvana.companies.index';
import SummaryCard from '../../SummaryCard';
import { INITIAL_SEARCH_FILTERS } from '../utils';
import ActiveFilters from './ActiveFilters';
import CompanyDetails from './CompanyDetails';
import CompanyFilters from './CompanyFilters';
import useCompanies, {
  type CompaniesParams,
  type SearchFilters
} from './useCompanies';

const Companies = () => {
  const navigate = Route.useNavigate();
  const {
    // companiesContext: context,
    // setCompaniesContext: setContext,
    companySearchFilters,
    setCompanySearchFilters,
    companyNav,
    setCompanyNav
  } = useContext(JobSeekerContext);

  const [page, setPage] = useState<number>(companyNav.page);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(
    INITIAL_SEARCH_FILTERS
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  const paging: CompaniesParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { companies, isPending, isPlaceholderData, companyCount, error } =
    useCompanies({ paging, filters: searchFilters });

  useEffect(() => {
    setPage(companyNav.page);
  }, [companyNav.page]);

  useEffect(() => {
    setSearchFilters(companySearchFilters);
  }, [companySearchFilters]);

  useEffect(() => {
    if (
      companyNav.companyId &&
      companies?.find((company) => company.id === companyNav.companyId)
    ) {
      setSelectedCompanyId(companyNav.companyId);
    } else {
      setSelectedCompanyId(companies?.[0]?.id ?? null);
    }
  }, [companies, companyNav.companyId]);

  useEffect(() => {
    navigate({
      search: {
        page: debouncedPage,
        company_id: selectedCompanyId ?? undefined,
        name: searchFilters.name || undefined,
        industry_id: searchFilters.industryId,
        min_size: searchFilters.minSize,
        max_size: searchFilters.maxSize
      }
    });
  }, [
    selectedCompanyId,
    debouncedPage,
    navigate,
    searchFilters.industryId,
    searchFilters.maxSize,
    searchFilters.minSize,
    searchFilters.name
  ]);

  return (
    <>
      {error && (
        <JobvanaError prefix="Error loading companies!" error={error} />
      )}
      <FiltersDisplay
        activeFilters={
          <ActiveFilters
            filters={searchFilters}
            setFilters={setSearchFilters}
          />
        }
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        reset={() => {
          setPage(1);
          setSelectedCompanyId(null);
          setSearchFilters(INITIAL_SEARCH_FILTERS);
          setCompanySearchFilters(INITIAL_SEARCH_FILTERS);
          setCompanyNav({
            page: 1,
            companyId: undefined
          });
        }}
        resetDisabled={_.isEqual(searchFilters, INITIAL_SEARCH_FILTERS)}
      />
      {showFilters && (
        <CompanyFilters
          filters={searchFilters}
          setShowFilters={setShowFilters}
          onChange={(filters) => {
            setPage(1);
            setSelectedCompanyId(null);
            setSearchFilters(filters);
            setCompanySearchFilters(filters);
            setCompanyNav({
              page: 1,
              companyId: undefined
            });
          }}
        />
      )}
      <ResourcesContainer bannerType="filters">
        <ResourceListContainer>
          <PageNav
            page={page}
            total={companyCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setSelectedCompanyId(null);
              setDebouncePage(debounce);
              setCompanyNav({
                page,
                companyId: undefined
              });
            }}
            isLoading={isPlaceholderData || isPending}
            type="companies"
          />
          <SummaryCardsContainer bannerType="filters">
            {companies?.map((company, idx) => {
              const hq = company.headquarters;
              return (
                <SummaryCard
                  key={company.id}
                  selected={selectedCompanyId === company.id}
                  onClick={() => {
                    setSelectedCompanyId(company.id);
                    // context.companyId = company.id;
                    setCompanyNav({
                      ...companyNav,
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
          {selectedCompanyId ? (
            <CompanyDetails id={selectedCompanyId} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Companies;

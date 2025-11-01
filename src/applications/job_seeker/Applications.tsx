import { useContext, useEffect, useMemo, useState } from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../../Context';
import JobvanaError from '../../JobvanaError';
import PageNav from '../../PageNav';
import SummaryCard from '../../SummaryCard';
import { formatDate } from '../../utils';
import Status from '../Status';
import StatusSelect from '../StatusSelect';
import ApplicationDetails from './ApplicationDetails';
import useApplications, {
  type ApplicationsParams,
  type SearchFilters
} from './useApplications';

const Applications = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const { myApplicationsNav: nav, setMyApplicationsNav: setNav } =
    useContext(JobSeekerContext);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(nav.page, debouncePage ? 500 : 0);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    status: 'all'
  });

  const paging: ApplicationsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );
  const { applications, isPending, isPlaceholderData, total, error } =
    useApplications(jobSeekerId, { paging, filters: searchFilters });

  useEffect(() => {
    if (!applications?.length) {
      setNav({
        page: 1
      });
    } else if (
      !nav.applicationId ||
      !applications.find((app) => app.id === nav.applicationId)
    ) {
      setNav((nav) => ({
        ...nav,
        applicationId: applications[0].id
      }));
    }
  }, [nav.applicationId, applications, setNav]);

  return (
    <>
      {error && (
        <JobvanaError prefix="Error loading applications!" error={error} />
      )}
      <FiltersContainer>
        <div className="flex items-center justify-end w-full p-2">
          <StatusSelect
            status={searchFilters.status}
            onChange={(status) => {
              setSearchFilters({
                ...searchFilters,
                status
              });
            }}
          />
        </div>
      </FiltersContainer>
      <ResourcesContainer bannerType="filters">
        <ResourceListContainer>
          <PageNav
            page={nav.page}
            total={total}
            onSetPage={(page, debounce) => {
              setNav({
                page
              });
              setDebouncePage(debounce);
            }}
            isLoading={isPending || isPlaceholderData}
            type="applications"
          />
          <SummaryCardsContainer bannerType="filters">
            {applications?.map((application, idx) => {
              return (
                <SummaryCard
                  key={application.id}
                  selected={nav.applicationId === application.id}
                  onClick={() => {
                    setNav((nav) => ({
                      ...nav,
                      applicationId: application.id
                    }));
                  }}
                  title={application.jobTitle}
                  text={
                    <>
                      <div className="flex flex-row gap-1 items-center">
                        <FaBuilding />
                        {application.companyName}
                      </div>
                      <div className="flex justify-between pr-1">
                        <Status {...application} />
                        {formatDate(new Date(application.lastUpdated))}
                      </div>
                    </>
                  }
                  borderBottom={idx < applications.length - 1}
                />
              );
            })}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          {nav.applicationId ? (
            <ApplicationDetails id={nav.applicationId} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Applications;

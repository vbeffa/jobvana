import { useContext, useEffect, useMemo, useState } from 'react';
import { FaPerson } from 'react-icons/fa6';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { CompanyContext } from '../../Context';
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

const Applications = ({ companyId }: { companyId: number }) => {
  const { jobApplicationsNav, setJobApplicationsNav } =
    useContext(CompanyContext);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(
    jobApplicationsNav.page,
    debouncePage ? 500 : 0
  );

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    status: 'all'
  });

  const paging: ApplicationsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );
  const { applications, isPending, isPlaceholderData, total, error } =
    useApplications(companyId, { paging, filters: searchFilters });

  useEffect(() => {
    if (!applications?.length) {
      setJobApplicationsNav({
        page: 1
      });
    } else if (
      !jobApplicationsNav.applicationId ||
      !applications.find((app) => app.id === jobApplicationsNav.applicationId)
    ) {
      setJobApplicationsNav((jobApplicationsNav) => ({
        ...jobApplicationsNav,
        applicationId: applications[0].id
      }));
    }
  }, [jobApplicationsNav.applicationId, applications, setJobApplicationsNav]);

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
            page={jobApplicationsNav.page}
            total={total}
            onSetPage={(page, debounce) => {
              setJobApplicationsNav({
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
                  selected={jobApplicationsNav.applicationId === application.id}
                  onClick={() => {
                    setJobApplicationsNav((jobApplicationsNav) => ({
                      ...jobApplicationsNav,
                      applicationId: application.id
                    }));
                  }}
                  title={application.jobTitle}
                  text={
                    <>
                      <div className="flex flex-row gap-1 items-center">
                        <FaPerson />
                        {application.jobSeekerName}
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
          {jobApplicationsNav.applicationId ? (
            <ApplicationDetails id={jobApplicationsNav.applicationId} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Applications;

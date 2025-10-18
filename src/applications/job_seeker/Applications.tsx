import { useEffect, useMemo, useState } from 'react';
import { FaBuilding } from 'react-icons/fa6';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
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
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const paging: ApplicationsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    status: 'all'
  });
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const { applications, isPending, isPlaceholderData, total, error } =
    useApplications(jobSeekerId, { paging, filters: searchFilters });

  useEffect(() => {
    if (!applications?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApplicationId(null);
    } else if (
      !applicationId ||
      !applications.find((app) => app.id === applicationId)
    ) {
      setApplicationId(applications[0].id);
    }
  }, [applicationId, applications]);

  return (
    <>
      {error && (
        <JobvanaError prefix="Error loading applications!" error={error} />
      )}
      <FiltersContainer>
        <div className="flex flex-row gap-2 items-center justify-end w-full p-2">
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
      <ResourcesContainer hasFilters={true}>
        <ResourceListContainer>
          <PageNav
            page={page}
            total={total}
            onSetPage={(page, debounce) => {
              setPage(page);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="applications"
          />
          <SummaryCardsContainer hasFilters={true}>
            {applications?.map((application, idx) => {
              return (
                <SummaryCard
                  key={application.id}
                  selected={applicationId === application.id}
                  onClick={() => {
                    setApplicationId(application.id);
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
        <ResourceDetailsContainer>
          {applicationId ? (
            <ApplicationDetails id={applicationId} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Applications;

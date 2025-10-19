import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import type { Company } from '../../Context';
import Button from '../../controls/Button';
import JobvanaError from '../../JobvanaError';
import PageNav from '../../PageNav';
import SummaryCard from '../../SummaryCard';
import { formatCurrency, formatDate } from '../../utils';
import JobDetails from './JobDetails';
import StatusSelect from './StatusSelect';
import useJobs, { type JobsParams, type SearchFilters } from './useJobs';

const MyJobs = ({ company }: { company: Company }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);

  const initialSearchFilters: SearchFilters = {
    companyId: company.id,
    status: 'all'
  };
  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(initialSearchFilters);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, isPlaceholderData, isPending, total, error, refetch } = useJobs(
    {
      paging,
      filters: searchFilters
    }
  );

  useEffect(() => {
    if (isAddingNew) {
      return;
    }
    if (!jobs?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedJobId(null);
    } else if (
      !selectedJobId ||
      !jobs.find((job) => job.id === selectedJobId)
    ) {
      setSelectedJobId(jobs[0].id);
    }
  }, [isAddingNew, jobs, selectedJobId]);

  const noInterviewProcess = useMemo(
    () => !company.interview_process?.rounds.length,
    [company.interview_process?.rounds.length]
  );

  return (
    <>
      {error && <JobvanaError error={error} />}
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
            page={page}
            disabled={isAddingNew}
            total={total}
            onSetPage={(page, debounce) => {
              setPage(page);
              setSelectedJobId(null);
              setDebouncePage(debounce);
            }}
            isLoading={isPending || isPlaceholderData}
            type="jobs"
          />
          <SummaryCardsContainer bannerType="filters">
            {jobs
              ?.map((job, idx) => (
                <SummaryCard
                  key={idx}
                  selected={selectedJobId === job.id}
                  disabled={isAddingNew}
                  onClick={() => {
                    setSelectedJobId(job.id);
                  }}
                  title={job.title}
                  text={
                    <>
                      <div className="flex justify-between pr-1">
                        <span>
                          Last updated {formatDate(new Date(job.updated_at))}
                        </span>
                      </div>
                      <div>
                        {formatCurrency(job.minSalary)} -{' '}
                        {formatCurrency(job.maxSalary)}
                      </div>
                    </>
                  }
                  borderBottom={true}
                />
              ))
              .concat(
                isAddingNew ? (
                  []
                ) : (
                  <div key={jobs.length} className="pt-4 flex justify-center">
                    <div className="flex flex-col justify-center gap-2">
                      <div className="w-full pb-4 flex justify-center">
                        <Button
                          label="New"
                          disabled={noInterviewProcess}
                          onClick={() => {
                            setIsAddingNew(true);
                            setSelectedJobId(0);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          <>
            {selectedJobId !== null ? (
              <JobDetails
                jobId={selectedJobId}
                company={company}
                isNew={isAddingNew}
                onFinishUpdate={async () => {
                  setIsAddingNew(false);
                  await refetch();
                  setPage(1);
                  setSelectedJobId(null);
                }}
                onCancelNewJob={() => {
                  setIsAddingNew(false);
                }}
              />
            ) : (
              noInterviewProcess && (
                <div className="text-gray-400 flex justify-center pt-4">
                  Please define your interview process before adding jobs.
                </div>
              )
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyJobs;

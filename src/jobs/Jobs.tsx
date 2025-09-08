import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import FiltersContainer from '../FiltersContainer';
import useJobs, { type JobsParams, type SearchFilters } from '../hooks/useJobs';
import PageNav from '../PageNav';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';

const Jobs = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    company: '',
    title: ''
  });
  const [debouncedCompany] = useDebounce(
    searchFilters.company,
    searchFilters.company ? 500 : 0
  );
  const [debouncedTitle] = useDebounce(
    searchFilters.title,
    searchFilters.title ? 500 : 0
  );
  const [jobId, setJobId] = useState<number | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      company: debouncedCompany,
      title: debouncedTitle
    }),
    [debouncedCompany, debouncedTitle, searchFilters]
  );

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, error, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging,
    filters
  });

  useEffect(() => {
    setJobId(jobs?.[0].id ?? null);
  }, [jobs]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <FiltersContainer>
        <JobFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </FiltersContainer>
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
            pageSize={10}
            total={openJobCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="jobs"
          />
          <SummaryCardsContainer>
            {jobs?.map((job, idx) => (
              <SummaryCard
                key={job.id}
                selected={jobId === job.id}
                onClick={() => setJobId(job.id)}
                title={job.title}
                text={
                  <>
                    <div>{job.companyName}</div>
                  </>
                }
                borderBottom={idx < jobs.length - 1}
              />
            ))}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          {jobId ? <JobDetails id={jobId} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Jobs;

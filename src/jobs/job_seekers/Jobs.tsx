import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../../containers/FiltersContainer';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../../Context';
import JobvanaError from '../../JobvanaError';
import PageNav from '../../PageNav';
import { Route } from '../../routes/jobvana.jobs.index';
import SummaryCard from '../../SummaryCard';
import { formatCurrency, formatDate } from '../../utils';
import { INITIAL_SEARCH_FILTERS } from '../utils';
import ActiveFilters from './ActiveFilters';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';
import useJobs, { type JobsParams, type SearchFilters } from './useJobs';

const Jobs = () => {
  const navigate = Route.useNavigate();
  const {
    // jobsContext: context,
    // setJobsContext: setContext,
    jobSearchFilters,
    setJobSearchFilters,
    jobNav,
    setJobNav,
    jobSeeker
  } = useContext(JobSeekerContext);

  const [page, setPage] = useState<number>(jobNav.page);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(
    INITIAL_SEARCH_FILTERS
  );
  const [jobId, setJobId] = useState<number | null>(null);

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, error, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging,
    filters: searchFilters
  });

  useEffect(() => {
    setPage(jobNav.page);
  }, [jobNav.page]);

  useEffect(() => {
    setSearchFilters(jobSearchFilters);
  }, [jobSearchFilters]);

  useEffect(() => {
    if (jobNav.jobId && jobs?.find((job) => job.id === jobNav.jobId)) {
      setJobId(jobNav.jobId);
    } else {
      setJobId(jobs?.[0]?.id ?? null);
    }
  }, [jobNav.jobId, jobs]);

  useEffect(() => {
    navigate({
      search: {
        page: debouncedPage,
        job_id: jobId ?? undefined,
        company: searchFilters.company || undefined,
        job_type: searchFilters.jobType || undefined,
        title: searchFilters.title || undefined,
        role_id: searchFilters.roleId,
        min_salary: searchFilters.minSalary,
        max_salary: searchFilters.maxSalary,
        skill_ids: `[${searchFilters.skillIds?.toString()}]`,
        created: searchFilters.created
      }
    });
  }, [
    debouncedPage,
    jobId,
    navigate,
    searchFilters.company,
    searchFilters.created,
    searchFilters.jobType,
    searchFilters.maxSalary,
    searchFilters.minSalary,
    searchFilters.roleId,
    searchFilters.skillIds,
    searchFilters.title
  ]);

  return (
    <div className="mx-0">
      {error && <JobvanaError error={error} />}
      <FiltersContainer
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
          setJobId(null);
          setSearchFilters(INITIAL_SEARCH_FILTERS);
          setJobSearchFilters(INITIAL_SEARCH_FILTERS);
          setJobNav({
            page: 1,
            jobId: undefined
          });
        }}
        resetDisabled={_.isEqual(searchFilters, INITIAL_SEARCH_FILTERS)}
      />
      {showFilters && (
        <JobFilters
          filters={searchFilters}
          setShowFilters={setShowFilters}
          onChange={(filters) => {
            setPage(1);
            setJobId(null);
            setSearchFilters(filters);
            setJobSearchFilters(filters);
            setJobNav({
              page: 1,
              jobId: undefined
            });
          }}
        />
      )}
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
            total={openJobCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setJobId(null);
              setDebouncePage(debounce);
              setJobNav({
                page,
                jobId: undefined
              });
            }}
            isLoading={isPlaceholderData || isPending}
            type="jobs"
          />
          <SummaryCardsContainer>
            {jobs?.map((job, idx) => (
              <SummaryCard
                key={job.id}
                selected={jobId === job.id}
                onClick={() => {
                  setJobId(job.id);
                  setJobNav({
                    ...jobNav,
                    jobId: job.id
                  });
                }}
                title={job.title}
                text={
                  <>
                    <div className="flex justify-between pr-1">
                      <span className="truncate">{job.companyName}</span>
                      <span>{formatDate(new Date(job.updated_at))}</span>
                    </div>
                    <div>
                      {formatCurrency(job.minSalary)} -{' '}
                      {formatCurrency(job.maxSalary)}
                    </div>
                  </>
                }
                borderBottom={idx < jobs.length - 1}
              />
            ))}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          {jobId && jobSeeker ? (
            <JobDetails id={jobId} jobSeeker={jobSeeker} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Jobs;

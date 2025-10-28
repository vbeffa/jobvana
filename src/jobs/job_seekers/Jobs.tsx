import _ from 'lodash';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FaBuilding, FaFloppyDisk, FaPaperPlane } from 'react-icons/fa6';
import { useDebounce } from 'use-debounce';
import FiltersDisplay from '../../containers/FiltersDisplay';
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
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, isPending, isPlaceholderData, openJobCount, error, refetch } =
    useJobs({
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
      setSelectedJobId(jobNav.jobId);
    } else {
      setSelectedJobId(jobs?.[0]?.id ?? null);
    }
  }, [jobNav.jobId, jobs]);

  useEffect(() => {
    navigate({
      search: {
        page: debouncedPage,
        job_id: selectedJobId ?? undefined,
        company: searchFilters.company || undefined,
        job_type: searchFilters.jobType,
        title: searchFilters.title || undefined,
        description: searchFilters.description || undefined,
        min_size: searchFilters.minSize || undefined,
        max_size: searchFilters.maxSize || undefined,
        industry_id: searchFilters.industryId || undefined,
        role_id: searchFilters.roleId,
        min_salary: searchFilters.minSalary,
        max_salary: searchFilters.maxSalary,
        skill_ids: `[${searchFilters.skillIds?.toString()}]`,
        created: searchFilters.created,
        show_applied: searchFilters.showApplied,
        hide_saved: searchFilters.hideSaved
      }
    });
  }, [debouncedPage, selectedJobId, navigate, searchFilters]);

  const onUpdateJob = useCallback(
    (action: 'hide' | 'save' | 'unsave') => {
      if (!openJobCount) {
        return;
      }
      const decrementPage =
        openJobCount % paging.pageSize === 1 &&
        page === Math.ceil(openJobCount / paging.pageSize);
      switch (action) {
        case 'hide': {
          if (decrementPage) {
            setPage(page - 1);
            setJobNav({
              page: page - 1,
              jobId: undefined
            });
          }
          break;
        }
        case 'save':
          if (searchFilters.hideSaved && decrementPage) {
            setPage(page - 1);
            setJobNav({
              page: page - 1,
              jobId: undefined
            });
          }
      }
      refetch();
    },
    [
      openJobCount,
      page,
      paging.pageSize,
      refetch,
      searchFilters.hideSaved,
      setJobNav
    ]
  );

  return (
    <>
      <div className="relative top-15">
        {error && <JobvanaError prefix="Error loading jobs" error={error} />}
      </div>
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
          setSelectedJobId(null);
          setSearchFilters(INITIAL_SEARCH_FILTERS);
          setJobSearchFilters(INITIAL_SEARCH_FILTERS);
          setJobNav({
            page: 1,
            jobId: undefined
          });
        }}
        resetDisabled={_.isEqual(searchFilters, INITIAL_SEARCH_FILTERS)}
      />
      {showFilters && jobSeeker && (
        <JobFilters
          filters={searchFilters}
          setShowFilters={setShowFilters}
          jobSeekerId={jobSeeker.id}
          onChange={(filters) => {
            setPage(1);
            setSelectedJobId(null);
            setSearchFilters(filters);
            setJobSearchFilters(filters);
            setJobNav({
              page: 1,
              jobId: undefined
            });
          }}
        />
      )}
      <ResourcesContainer bannerType="filters">
        <ResourceListContainer>
          <PageNav
            page={page}
            total={openJobCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setSelectedJobId(null);
              setDebouncePage(debounce);
              setJobNav({
                page,
                jobId: undefined
              });
            }}
            isLoading={isPending || isPlaceholderData}
            type="jobs"
          />
          <SummaryCardsContainer bannerType="filters">
            {jobs?.map((job, idx) => {
              return (
                <SummaryCard
                  key={job.id}
                  selected={selectedJobId === job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setJobNav({
                      ...jobNav,
                      jobId: job.id
                    });
                  }}
                  title={job.title}
                  text={
                    <>
                      <div className="flex justify-between items-center pr-1">
                        <div className="flex flex-row gap-1 items-center truncate pr-1">
                          <FaBuilding />
                          <div className="truncate">{job.companyName}</div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          {job.application && (
                            <>
                              <FaPaperPlane />
                              {formatDate(new Date(job.application.created_at))}
                            </>
                          )}
                          {!job.application &&
                            formatDate(new Date(job.updated_at))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pr-1">
                        <div>
                          {formatCurrency(job.minSalary)} -{' '}
                          {formatCurrency(job.maxSalary)}
                        </div>
                        <div>{job.isSaved && <FaFloppyDisk />}</div>
                      </div>
                    </>
                  }
                  borderBottom={idx < jobs.length - 1}
                />
              );
            })}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          {selectedJobId && jobSeeker ? (
            <JobDetails
              id={selectedJobId}
              jobSeeker={jobSeeker}
              onUpdateJob={onUpdateJob}
            />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Jobs;

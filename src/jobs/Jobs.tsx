import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import FiltersContainer from '../FiltersContainer';
import PageNav from '../PageNav';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import { Route } from '../routes/jobvana.jobs.index';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';
import useJobs, {
  MAX_SALARY,
  MIN_SALARY,
  type JobsParams,
  type SearchFilters
} from './useJobs';

const Jobs = () => {
  const navigate = Route.useNavigate();
  const { jobsContext: context, setJobsContext: setContext } =
    useContext(JobvanaContext);

  const [page, setPage] = useState<number>(context.page);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    company: '',
    title: '',
    minSalary: MIN_SALARY,
    maxSalary: MAX_SALARY
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
    setPage(context.page);
  }, [context.page]);

  useEffect(() => {
    setSearchFilters({
      ..._.pick(context, [
        'roleId',
        'minSalary',
        'maxSalary',
        'skillId',
        'created'
      ]),
      company: context.company ?? '',
      title: context.title ?? ''
    });
  }, [context]);

  useEffect(() => {
    if (context.jobId) {
      setJobId(context.jobId);
    } else {
      setJobId(jobs?.[0]?.id ?? null);
    }
  }, [context.jobId, jobs]);

  useEffect(() => {
    navigate({
      search: {
        page: debouncedPage,
        job_id: jobId ?? undefined,
        company: debouncedCompany || undefined,
        title: debouncedTitle || undefined,
        role_id: filters.roleId,
        min_salary: filters.minSalary,
        max_salary: filters.maxSalary,
        skill_id: filters.skillId,
        created: filters.created
      }
    });
  }, [
    debouncedCompany,
    debouncedPage,
    debouncedTitle,
    filters.created,
    filters.maxSalary,
    filters.minSalary,
    filters.roleId,
    filters.skillId,
    jobId,
    navigate
  ]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <FiltersContainer>
        <JobFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setJobId(null);
            setSearchFilters(filters);
            setContext({
              ...context,
              ...filters,
              page: 1,
              jobId: undefined
            });
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
              setJobId(null);
              setDebouncePage(debounce);
              setContext({
                ...context,
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
                  setContext({
                    ...context,
                    jobId: job.id
                  });
                }}
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
